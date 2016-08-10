import Resource from './base'
import { ArgumentError }  from '../errors'

export default class CommentsResource extends Resource {
  resourceName = 'comments'

  getAll(opts = {}) {
    if (!opts.article_id || !opts.blog_id) {
      throw new ArgumentError()
    }
    return super.getAll(opts);
  }
}