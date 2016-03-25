import { Router } from 'express'
import EventEmitter from 'events'
import { verifyWebhooks } from './verify'

export default class WebhookRouter extends EventEmitter {
  constructor({ session }) {
    super()

    this.session = session
    this.router = Router()

    this.router.use(verifyWebhooks({ session }))
    this.router.post('/*', this.handler.bind(this))
  }

  handler(req, res) {
    const shop = req.headers['x-shopify-shop-domain']
    const topic = req.headers['x-shopify-topic']
    this.emit(topic, {
      topic,
      shop,
      data: req.body
    })
    res.sendStatus(200)
  }

  callback() {
    return this.router;
  }
}