/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 * @author John Hurliman <jhurliman@cull.tv>
 * @private
 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param {String|Number} interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 */

export default class Bucket {

  constructor(bucketSize = 1, tokensPerInterval = 1, interval) {
    this.lastDrip = +new Date()
    this.content = bucketSize
    this.bucketSize = bucketSize
    this.tokensPerInterval = tokensPerInterval

    if (typeof interval === 'string') {
      switch (interval) {
        case 'sec': case 'second':
        this.interval = 1000; break;
        case 'min': case 'minute':
        this.interval = 1000 * 60; break;
        case 'hr': case 'hour':
        this.interval = 1000 * 60 * 60; break;
        case 'day':
          this.interval = 1000 * 60 * 60 * 24; break;
      }
    } else {
      this.interval = interval;
    }
  }

  /**
   * Add any new tokens to the bucket since the last drip.
   * @returns {Boolean} True if new tokens were added, otherwise false.
   */
  drip() {
    if (!this.tokensPerInterval) {
      this.content = this.bucketSize;
      return;
    }

    var now = +new Date();
    var deltaMS = Math.max(now - this.lastDrip, 0);
    this.lastDrip = now;

    var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
    this.content = Math.min(this.content + dripAmount, this.bucketSize);
  }

  /**
   * Remove the requested number of tokens and fire the given callback. If the
   * bucket (and any parent buckets) contains enough tokens this will happen
   * immediately. Otherwise, the removal and callback will happen when enough
   * tokens become available.
   * @param {Number} count The number of tokens to remove.
   * @returns {Boolean} True if transaction has been accepted, false otherwise
   */
  request(count) {

    // Is this an infinite size bucket?
    if (!this.bucketSize) {
      return true
    }

    // Make sure the bucket can hold the requested number of tokens
    if (count > this.bucketSize) {
      return false
    }

    // Drip new tokens into this bucket
    this.drip()

    // If we don't have enough tokens in this bucket, do nothing
    if (count > this.content) {
      return false
    }

    // Remove the requested tokens from this bucket
    this.content -= count
    return true
  }
}

