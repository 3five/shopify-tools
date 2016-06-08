import inflection from 'inflection'
import Instance from './instance'
import {
  map,
  isArray,
  extend,
  merge,
  find,
  capitalize,
  camelcase,
  kebabcase
} from 'lodash'

const COLLECTION_LIMIT = 250;

export default class Resource {

  constructor(opts) {
    this.opts = opts;
    this.resourceName = opts.resourceName;
    this.client = opts.client;
    this.resourcePrefix = opts.resourcePrefix || null;
    this.resourceSuffix = opts.resourceSuffix || null;

    // (hack) Define this prop after the
    // extending constructor is done
    process.nextTick(()=> {
      this.resourceSingularName =
        opts.resourceSingularName || inflection.singularize(this.resourceName)
    })
  }

  _wrapInstances(opts) {
    return (data)=> {
      if (!opts || !opts.bare) {
        if (isArray(data)) {
          return map(data, resource => this.build(resource))
        } else {
          return this.build(data)
        }
      }
      return data;
    }
  }

  _getUrl() {
    let resource = ''
    if (this.resourcePrefix) resource += this.resourcePrefix + '/'
    resource += this.resourceName
    if (this.resourceSuffix) resource += '/' + this.resourceSuffix
    return resource;
  }

  build(id, data) {
    if (!data && typeof id !== 'number') {
      data = id;
    }

    if (typeof id === 'number') {
      data = data || (data = {});
      data.id = id;
    }

    let parent = merge(Object.create(Object.getPrototypeOf(this)), this)

    if (!this.singular) {
      parent.resourceSuffix = data.id;
    }

    return new Instance(data, parent);
  }

  count(opts) {
    let resource = `${this._getUrl()}/count`;
    let payload = { params: opts };
    return this.client.get(resource, payload)
      .then(extractResource('count'))
  }

  create(data, opts) {
    let resource = this._getUrl();
    let payload = {
      data: { [this.resourceSingularName]: data },
      params: opts
    };
    return this.client.post(resource, payload)
      .then(extractResource(this.resourceSingularName))
      .then(this._wrapInstances(opts))
  }

  find(cb) {
    return this.findAll({ complete: true }).then((resources)=> {
      return find(resources, cb);
    })
  }

  findAll(opts) {
    let resource = this._getUrl();

    if (opts && opts.complete) {
      delete opts.complete
      return this.count(opts).then((count)=> {
        let nCalls = Math.ceil(count / COLLECTION_LIMIT)
        let calls = [];
        for (let i = 1; i <= nCalls; i++) {
          let cOpts = extend({}, opts, { limit: 250, page: i })
          calls.push(this.findAll(cOpts))
        }
        return Promise.all(calls).then((results)=> {
          return [].concat(...results)
        })
      })
    }

    return this.client.get(resource, { params: opts })
      .then(extractResource(this.resourceName))
      .then(this._wrapInstances(opts))
  }

  findOne(id, opts) {
    let resource = this._getUrl();

    if (this.singular && typeof id !== 'number') {
      opts = id;
      id = null;
    }

    else if (typeof id !== 'number') {
      throw new ArgumentError()
    }

    if (id) {
      resource += `/${id}`;
    }

    let payload = { params: opts };

    return this.client.get(resource, payload)
      .then(extractResource(this.resourceSingularName))
      .then(this._wrapInstances(opts))
  }

  update(id, data, opts) {
    let resource = `${this._getUrl()}`;

    if (id && !this.resouceSuffix) {
      resource += `/${id}`
    }

    let payload = {
      data: { [this.resourceSingularName]: data },
      params: opts
    }
    return this.client.put(resource, payload)
      .then(extractResource(this.resourceSingularName))
      .then(this._wrapInstances(opts))
  }

  remove(id, opts) {
    let resource = `${this._getUrl()}`;

    if (id && !this.resouceSuffix) {
      resource += `/${id}`
    }

    let payload = { params: opts };
    return this.client.del(resource, payload)
      .then(()=> {
        return { deleted: true }
      })
  }

}

function extractResource(resource) {
  return function(data) {
    return data[resource];
  }
}
