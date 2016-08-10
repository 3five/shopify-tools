import * as resources from './index'
import { merge, capitalize, camelCase } from 'lodash'

export default class Instance {
  constructor(data, parent) {
    this.attrs = data;
    this.parent = parent;
    this.client = parent.client;
    this._buildSubResources();
  }

  _getProperName(resource) {
    return capitalize(camelCase(resource))
  }

  _buildSubResources() {
    if (this.parent.subResources && !this.isNew()) {
      for (let resource of this.parent.subResources) {
        this[this._getProperName(resource)] = this._buildResource(resource)
      }
    }
  }

  _buildResource(resource) {
    let Resource = resources[this._getProperName(resource)];
    let opts = this.parent.opts;
    opts.resourcePrefix = `${this.parent.resourceName}/${this.get('id')}`
    return new Resource(opts);
  }

  _mergeAttrs(resource) {
    this.attrs = merge(this.attrs, resource)
    return this;
  }

  get(key) {
    return this.attrs[key] || undefined
  }

  set(key, value) {
    return this.attrs[key] = value
  }

  reload() {
    return this.load();
  }

  load() {
    let id = !this.parent.singular ? this.get('id') : null;
    return this.parent.findOne(id, { bare: true })
      .then(this._mergeAttrs.bind(this))
  }

  isNew() {
    return !this.get('id')
  }

  save() {
    if (this.isNew()) {
      return this.parent.create(this.attrs, { bare: true })
        .then(this._mergeAttrs.bind(this))
    } else {
      return this.parent.update(null, this.attrs, { bare: true })
        .then(this._mergeAttrs.bind(this))
    }
  }

  remove() {
    return this.parent.remove(this.get('id'));
  }

  toObject() {
    return this.attrs;
  }

  toJSON() {
    return this.toObject();
  }
}
