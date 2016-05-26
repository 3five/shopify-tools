import Resource from './base'

export default class ProductResource extends Resource {
  resourceName = 'products'
  subResources = [
    'metafields',
    'images',
    'variants'
  ]
}
