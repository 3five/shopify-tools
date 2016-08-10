import Client from './client'
import * as resources   from './resources/index'

export default class ShopifyResources {

  defaults = {}

  constructor(options) {
    let opts = Object.assign({}, this.defaults, options);
    if (!opts.session && !opts.client) {
      throw new Error('Must provide a client or session.')
    }

    this.client = !opts.client
      ? new Client({ session: opts.session })
      : opts.client

    this.buildResources();
  }

  buildResources() {
    Object.keys(resources).forEach((r)=> {
      let opts = { client: this.client };
      let Resource = resources[r];
      this[r] = new Resource(opts);
    })
  }
}
