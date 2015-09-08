import Resource from './base'

export default class ShopResource extends Resource {
  singular = true
  resourceName = 'shop'

  load() {
    return this.findOne();
  }
}
