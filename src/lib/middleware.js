import crypto from 'crypto'
import path from 'path'
import url from 'url'
import EventEmitter from 'events'
import ShopifyClient from './client'
import ShopifyResources from './resources'
import { OAuthSession } from './session'
import {
  merge,
  union,
  startsWith,
  omit,
  reduce,
  chain,
  map
} from 'lodash'

const noop = function() {}

const defaults = {
  resources: true,
  anonymousInstall: false,
  autoInstall: true,
  anonymousWebhooks: true,
  applicationBase: '/',
  applicationInstall: '/install',
  applicationInstallCallback: '/install/callback',
  routes: {
    didInstall: '/'
  },
  webhooksBase: '/api/webhooks',
  webhooks: ['app/uninstalled'],
  scripts: [],
  scriptsBase: '/',
  willInstall: noop,
  willUninstall: noop,
  didInstall: noop,
  didUninstall: noop
}

export default class ShopifyAuthMiddleware extends EventEmitter {

  constructor(opts) {
    super()
    this.opts = merge({}, defaults, opts);

    // Merge doesn't merge arrays :P
    if (opts.webhooks) {
      this.opts.webhooks = union(defaults.webhooks, opts.webhooks)
      this.opts.scripts = union(defaults.scripts, opts.scripts)
    }

    this.on('app/uninstalled', this.opts.didUninstall.bind(this));
  }

  callback() {
    return this.handler.bind(this)
  }

  handler(req, res, next) {
    const o = this.opts
    const pUrl = req._parsedUrl
    const { shop } = req.query
    const installing = startsWith(pUrl.pathname, o.applicationInstall)
    const installingCallback = startsWith(pUrl.pathname, o.applicationInstallCallback)
    const withinApp = startsWith(pUrl.pathname, o.applicationBase)
    const webhook = startsWith(pUrl.pathname, o.webhooksBase)
    let session = null
    let verified = false;

    if (installing || installingCallback || withinApp || webhook) {

      if (installing && o.anonymousInstall) {
        verified = true;
      }

      if (webhook) {
        verified = this.verifyWebhookRequest(req)
        const shop = req.headers['x-shopify-shop-domain']
        const topic = req.headers['x-shopify-topic']
        if (verified || o.anonymousWebhooks) {
          if (req.query) { req.query = {} }
          req.query.shop = shop;
          o.willAuthenticate(req, res, (tenant)=> {
            this.emit(topic, tenant || { shop }, req.body)
          })
          return res.sendStatus(201);
        }
        return res.sendStatus(401)
      }

      if (!verified) {
        verified = this.verifyRequest(req);
      }

      if (!verified) {
        return res.sendStatus(401)
      }

      session = new OAuthSession({
        host: o.host,
        apiKey: o.apiKey,
        secret: o.secret,
        shop: shop,
        scopes: o.scopes
      })

      res.locals.client = new ShopifyClient({ session })

      if (o.resources) {
        res.locals.resources = new ShopifyResources({ client: res.locals.client })
      }

      if (installingCallback) {
        return this.installCallback(req, res, next);
      }

      if (installing) {
        return this.install(req, res, next)
      }

      return o.willAuthenticate(req, res, (tenant)=> {
        if (!tenant || !tenant.access_token) {
          if (o.autoInstall) {
            return res.redirect(o.applicationInstall + pUrl.search);
          }
          return next();
        }

        session.update({
          access_token: tenant.access_token
        })

        next();
      })
    }

    next();
  }

  install(req, res, next) {
    const o = this.opts
    const { client } = res.locals
    const { shop } = req.query
    const { uri, nonce } = client.buildInstallUrl(
                              o.applicationInstallCallback, { noSuffix: true })

    if (uri) {
      return o.willInstall(shop, nonce, (installed)=> {
        if (installed === false) {
          o.routes.error ? res.redirect(o.routes.error) : res.sendStatus(500)
        } else {
          res.redirect(uri)
        }
      })
    }

    next()
  }

  installCallback(req, res, next) {
    const o = this.opts
    const { client } = res.locals
    const { shop, code, state } = req.query
    o.willAuthenticate(req, res, (tenant)=> {
      if (tenant.nonce !== state) {
        return res.sendStatus(401)
      }
      return client.getAccessToken(code)
        .then(({ access_token })=> {
          o.didInstall(shop, code, access_token, ()=> {
            res.redirect(this.buildAppUrl(shop) + o.routes.didInstall)
          })
        })
        .then(this.postInstall.bind(this, res, shop))
    })
  }

  postInstall(res, shop) {
    const o = this.opts
    const { client } = res.locals

    const webhooks = map(o.webhooks, (val, key)=> {
      let topic = Array.isArray(o.webhooks) ? val : key;
      let opts = Array.isArray(o.webhooks) ? {} : val;
      let address = this.buildHostUrl(shop, `${o.webhooksBase}/${topic}`)
      let payload = merge({}, opts, { topic, address })
      return client.post('webhooks', { data: { webhook: payload }})
    })

    const scripts = map(o.scripts, (script)=> {
      let src = this.buildHostUrl(shop, o.scriptsBase + script)
      let event = 'onload'
      let payload = { src, event }
      return client.post('script_tags', { data: { script_tag: payload }})
    })

    const calls = [].concat(webhooks, scripts)

    return Promise.all(calls)
  }

  buildAppUrl(shop) {
    const handle = this.opts.listingHandle || this.opts.apiKey
    return url.format({
      protocol: 'https',
      host: shop,
      pathname: `/admin/apps/${handle}`
    })
  }

  buildHostUrl(shop, pathname) {
    return url.format({
      protocol: 'https',
      host: process.env.APP_HOST,
      pathname,
    })
  }

  verifyWebhookRequest(req) {
    const hmac = req.headers['x-shopify-hmac-sha256'];
    const hash = crypto.createHmac('sha256', this.opts.secret)
    if (!req.rawBody) {
      console.warn(
        `Please install the \`bodyParserVerify\` function provided for webhook verification.`)
    }
    hash.update(req.rawBody || '')
    return (hmac === hash.digest('base64'))
  }

  verifyRequest(req) {
    const { hmac } = req.query;
    const hash = crypto.createHmac('sha256', this.opts.secret);
    const message = chain(req.query)
      .omit(['hmac', 'signature'])
      .keys()
      .sortBy() //alphabetical
      .reduce((msg, key)=> {
        if (msg.length) msg += '&'
        msg += key + '=' + req.query[key]
                             .replace(/\%/g, '%25')
                             .replace(/\=/g, '%3D')
                             .replace(/\&/g, '%26')
        return msg;
      }, '')
      .value()

    hash.update(message);

    return (hmac === hash.digest('hex'));
  }

  bodyParserVerify(req, res, buf, encoding) {
    req.rawBody = buf.toString();
  }
}
