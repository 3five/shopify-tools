
export class PrivateSession {
  constructor(opts) {
    this.host = opts.host;
    this.key = opts.apiKey;
    this.password = opts.password;
  }
}

export class OAuthSession {
  constructor(opts) {
    this.host = opts.host;
    this.client_id = opts.apiKey;
    this.client_secret = opts.secret;
    this.code = opts.code;
    this.access_token = opts.access_token;
  }

  update(opts) {
    Object.assign(this, opts);
  }
}
