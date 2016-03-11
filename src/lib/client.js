import url              from 'url'
import uuid             from 'uuid'
import agent            from 'superagent'
import { OAuthSession } from './session'

export default class ShopifyClient {

  methods = ['get', 'post', 'put', 'del']

  oauth = false

  defaults = {
    resources: true
  }

  constructor(options) {
    let opts = Object.assign({}, this.defaults, options)

    if (!opts.session) {
      throw new Error('Must provide a `Session`.')
    }

    if (opts.session instanceof OAuthSession) {
      this.oauth = true;
    }

    this.session = opts.session;

    for(let method of this.methods) {
      this[method] = this.genericMethod.bind(this, method)
    }
  }

  genericMethod(method, resource, opts) {
    let request = this.buildRequest(method, resource, opts);
    return this.makeRequest(request);
  }

  buildInstallUrl(redirectUri) {
    let nonce = uuid.v4()
    let uri = url.format({
      protocol: 'https',
      host: this.session.shop,
      pathname: '/admin/oauth/authorize',
      query: {
        client_id: this.session.apiKey,
        scope: this.session.scopes.join(','),
        redirect_uri: url.format({
          protocol: 'https',
          host: this.session.host,
          pathname: redirectUri
        }),
        state: nonce
      }
    })
    return { uri, nonce }
  }

  buildUrl(resource, opts) {
    let noSuffix = opts && opts.noSuffix;
    let pathname = `/admin/${resource}${noSuffix ? '' : '.json'}`
    let reqUrlFormat = {
      protocol: 'https',
      host: this.session.shop,
      pathname: pathname
    };

    if (!this.oauth) {
      reqUrlFormat.auth = `${this.session.apiKey}:${this.session.secret}`;
    }

    return url.format(reqUrlFormat);
  }

  buildRequest(method, resource, opts) {
    let request = agent[method.toLowerCase()](this.buildUrl(resource));

    if (opts && opts.params) {
      request.query(opts.params)
    }

    if (opts && opts.data) {
      request.send(opts.data)
    }

    if (this.oauth) {
      if (this.session.access_token) {
        request.set('X-Shopify-Access-Token', this.session.access_token);
      } else {
        throw new Error('Cannot make requests without `access_token`');
      }
    }

    return request
  }

  getAccessToken(code) {
    let url = this.buildUrl('oauth/access_token');
    let request = agent.post(url)
    request.query({
      client_id: this.session.apiKey,
      client_secret: this.session.secret,
      code: code
    })
    return this.makeRequest(request)
      .then((resp)=> {
        this.session.update(resp)
        return resp;
      })
  }

  makeRequest(request) {
    return new Promise((resolve, reject)=> {
      request.end((err, res)=> {
        if (err) {
          err.response = res;
          reject(err);
        } else {
          resolve(res.body);
        }
      });
    })
  }

}
