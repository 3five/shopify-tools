import crypto from 'crypto'
import path from 'path'
import url from 'url'
import ShopifyClient from './client'
import ShopifyResources from './resources'
import { OAuthSession } from './session'
import {
  merge,
  union,
  startsWith,
  omit,
  reduce,
  chain
} from 'lodash'

const noop = function() {}

const defaults = {
  resources: true,
  anonymousInstall: false,
  autoInstall: true,
  applicationBase: '/',
  applicationInstall: '/install',
  applicationInstallCallback: '/install/callback',
  routes: {
    unauthorized: '/unauthorized',
    didInstall: '/'
  },
  webhooksBase: '/api/webhooks',
  webhooks: ['app/uninstalled'],
  willInstall: noop,
  willUninstall: noop,
  didInstall: noop
}

export default class ShopifyAuthMiddleware {

  constructor(opts) {
    this.opts = merge({}, defaults, opts);
    // Merge doesn't merge arrays :P
    if (opts.webhooks) {
      this.opts.webhooks = union(defaults.webhooks, opts.webhooks)
    }
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
    let session = null
    let verified = false;

    if (installing || installingCallback || withinApp) {

      if (installing && o.anonymousInstall) {
        verified = true;
      }

      if (!verified) {
        verified = this.verifyRequest(req.query);
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
      o.applicationInstallCallback,
      { noSuffix: true }
    )

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
      if (tenant.nonce === state) {
        return client.getAccessToken(code).then(({ access_token })=> {
          o.didInstall(shop, code, access_token, ()=> {
            res.redirect(this.buildAppUrl(shop) + o.routes.didInstall)
          })
        })
      }
      res.sendStatus(401)
    })
  }

  buildAppUrl(shop) {
    return url.format({
      protocol: 'https',
      host: shop,
      pathname: `/admin/apps/${this.opts.listingHandle || this.opts.apiKey}`
    })
  }

  verifyRequest(query) {
    const { hmac } = query;
    const hash = crypto.createHmac('sha256', this.opts.secret);
    const message = chain(query)
      .omit(['hmac', 'signature'])
      .keys()
      .sortBy() //alphabetical
      .reduce((msg, key)=> {
        if (msg.length) msg += '&'
        msg += key + '=' + query[key]
                             .replace(/\%/g, '%25')
                             .replace(/\=/g, '%3D')
                             .replace(/\&/g, '%26')
        return msg;
      }, '')
      .value()

    hash.update(message);

    return (hmac === hash.digest('hex'));
  }
}
