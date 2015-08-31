import Resource from './base'

export default class ArticleResource extends Resource {
  resourceName = 'articles'
  subResources = [
    'comments'
  ]
}
