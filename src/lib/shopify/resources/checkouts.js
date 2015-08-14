import Resource from './base'
import { NotImplementedError }  from '../errors'

export default class CheckoutResource extends Resource {
  resourceName = 'checkouts'

  get() {
    throw new NotImplementedError()
  }

  update() {
    throw new NotImplementedError()
  }

  create() {
    throw new NotImplementedError()
  }

  remove() {
    throw new NotImplementedError()
  }
}