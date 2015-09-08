import { Router } from 'express'
import { EventEmitter } from 'events'
import path from 'path'
import Resources from './resources'
import { every } from 'lodash'

export default class WebhookRouter extends EventEmitter {

  constructor(opts) {
    super()

    if (!opts.session) {
      throw new Error('Must provide a Shopify session.')
    }

    this.routerPrefix = opts.routerPrefix || '/'
    this.router = Router();
    this.session = opts.session;
    this.topics = [].concat(opts.topics);
    this.resources = new Resources({ session: this.session });
    this.registerEndpoints();
  }

  registerEndpoints() {
    this.router.post('/webhooks/*', (req, res)=> {

    })
  }

  buildEndpointUrl(topic) {
    return url.format({
      protocol: 'https',
      host: this.session.host,
      pathname: path.join(opts.routerPrefix, 'webhooks', topic)
    })
  }

  async installed() {
    let webhooks = await this.resources.Webhooks.getAll()
    return every(webhooks, (hook)=> {
      return
    })
  }

  install() {
    let calls = []

    for (let topic of this.topics) {
      let payload = {
        topic,
        format: 'json',
        address: this.buildEndpointUrl()
      }
      calls.push(this.resources.Webhooks.create(payload))
    }

    return Promise.all(calls);
  }

  async uninstall() {

  }

}