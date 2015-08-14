import url              from 'url'
import agent            from 'superagent'
import crypto           from 'crypto'
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

  buildUrl(resource) {
    let pathname = `/admin/${resource}.json`
    let reqUrlFormat = { 
      protocol: 'https', 
      host: this.session.host,
      pathname: pathname
    };

    if (!this.oauth) {
      reqUrlFormat.auth = `${this.session.key}:${this.session.password}`;
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

  makeRequest(request) {
    return new Promise((resolve, reject)=> {
      request.end((err, res)=> {
        let verified = false;
        if (err) {
          reject(res.body || err);
        } else {
          verified = this.verifyResponse(res)
          if (verified) {
            resolve(res.body);
          } else {
            reject('Shopify response is not authentic.');
          }
        }
      });
    })
  }

  verifyResponse(res) {
    if (!this.oauth) {
      return true;
    }

    return false;
  }

}
