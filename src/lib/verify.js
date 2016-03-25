import { chain } from 'lodash'
import crypto from 'crypto'

export function verifyWebhooks({ session }) {
  return (req, res, next)=> {
    if (!validWebhook(session, req)) {
      return res.sendStatus(401)
    }
    next()
  }
}

export function verifyRequest({ session }) {
  return (req, res, next)=> {
    if (!validRequest(session, req)) {
      return res.sendStatus(401)
    }
    next()
  }
}

export function bodyParserHelper(req, res, buf, encoding) {
  req.rawBody = buf.toString(encoding)
}

function validWebhook(session, req) {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const hash = crypto.createHmac('sha256', session.secret)
  console.log(req.rawBody)
  if (!req.rawBody) {
    console.log('Webhooks will not be verified until the `bodyParserShopifyHelper` fn is installed...')
    return true
  }
  hash.update(req.rawBody)
  return (hmac === hash.digest('base64'))
}

function validRequest(session, req) {
  const { hmac } = req.query
  const hash = crypto.createHmac('sha256', session.secret)

  const message = chain(req.query)
    .omit(['hmac', 'signature'])
    .keys()
    .sortBy() // alphabetical
    .reduce((msg, key)=> {
      if (msg.length) msg += '&'
      msg += key + '=' + req.query[key]
          .replace(/\%/g, '%25')
          .replace(/\=/g, '%3D')
          .replace(/\&/g, '%26')
      return msg;
    }, '')
    .value()

  hash.update(message)

  return (hmac === hash.digest('hex'))
}