import inflection from 'inflection'

export default class Resource {

  constructor(opts) {
    this.resourceName = opts.resourceName;
    this.client = opts.client;
    this.resourcePrefix = opts.resourcePrefix || '';

    // (hack) Define this prop after the 
    // extending constructor is done
    process.nextTick(()=> {
      this.resourceSingularName = 
        opts.resourceSingularName || inflection.singularize(this.resourceName)
    })
  }

  getAll(opts) {
    // reflect on resource prefix to determine which resourceId we should check for
    // in support of metafields
    let resource = `${ this.resourceName }`;
    return this.client.get(resource, { params: opts })
      .then(extractResource(resource))
  }

  get(id, opts) {
    let resource = this.resourceName;
    let payload = { params: opts };
    

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

    return this.client.get(resource, payload)
      .then(extractResource(this.resourceSingularName))
  }

  count(opts) {
    let resource = `${this.resourceName}/count`;
    let payload = { params: opts };
    return this.client.get(resource)
      .then(extractResource('count'))
  }

  create(data, opts) {
    let resource = this.resourceName;
    let payload = { 
      data: { [this.resourceSingularName]: data }, 
      params: opts 
    };
    return this.client.post(resource, payload)
      .then(extractResource(this.resourceSingularName))
  }

  update(id, data, opts) {
    let resource = `${this.resourceName}/${id}`;
    let payload = { 
      data: { [this.resourceSingularName]: data }, 
      params: opts 
    }
    return this.client.put(resource, payload)
      .then(extractResource(this.resourceSingularName))
  }

  remove(id, opts) {
    let resource = `${this.resourceName}/${id}`;
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
