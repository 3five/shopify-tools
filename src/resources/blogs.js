import Resource from './base'

export default class BlogResource extends Resource {
  resourceName = 'blogs'
  subResources = [
    'articles'
  ]
}
