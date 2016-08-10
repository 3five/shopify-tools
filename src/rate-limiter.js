import async from 'async'
import Bucket from './bucket'

/**
 * @private
 */
export default class RateLimiter {

  static BURST_RATE = 40;
  static FILL_RATE = 2;

  constructor() {
    this.bucket = new Bucket(RateLimiter.BURST_RATE, RateLimiter.FILL_RATE, 'second')
    this.queue = async.priorityQueue(this.worker.bind(this), RateLimiter.BURST_RATE)
  }
  
  push(...args) {
    return this.queue.push(...args)
  }

  worker(req, callback) {
    RateLimiter.request(1, req, this.bucket, (err, res)=> {
      let conc = Math.floor(this.bucket.content)
      this.queue.concurrency = conc >= 1 ? conc : 1
      callback(err, res)
    })
  }

  /**
   * Recursive fn for requesting a token as soon as it's available
   * @param n
   * @param req
   * @param bucket
   * @param cb
   * @returns {*}
   */
  static request(n, req, bucket, cb) {
    if (bucket.request(n)) {
      req.end(cb)
      return
    }
    setTimeout(()=> {
      RateLimiter.request(n, req, bucket, cb)
    }, 20)
  }
}
