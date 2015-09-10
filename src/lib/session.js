import { merge } from 'lodash'

export class PrivateSession {
  constructor(opts) {
    this.host = opts.host;
    this.apiKey = opts.apiKey;
    this.secret = opts.secret;
    this.shop = opts.shop;
  }

  update(opts) {
    merge(this, opts);
  }
}

export class OAuthSession {
  constructor(opts) {
    this.host = opts.host;
    this.apiKey = opts.apiKey;
    this.secret = opts.secret;
    this.shop = opts.shop;
    this.access_token = opts.access_token;
    this.scopes = opts.scopes;
  }

  update(opts) {
    merge(this, opts);
  }
}
