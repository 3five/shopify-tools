# Shopify Tools

## TODO
Repo:
- More Complete Docs

Features
- OAuth
- Collection-specific methods
- Collection-specific parameter validation
- Parent/Child relationships
- Instance methods

Collections
- Article
- Asset
- CustomerAddress
- Policy
- Product
- Province
- Refund
- Transaction

## Basic Usage

```
// lib/services/shopify.js

import {
  ShopifyResources, 
  ShopifyPrivateSession 
} from 'shopify-tools'

const session = new ShopifyPrivateSession({
  host: process.env.SHOPIFY_HOST,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PASS,
  sharedSecret: process.env.SHOPIFY_API_SECRET,
})

let opts = { session };
const repo = new ShopifyResources(opts);

export default repo;
```

```
// controller.js

import Shopify from './lib/services/shopify.js'

let query = { limit: 250, page: 1 };
Shopify.Products.getAll(query).then((products)=> {
  // [...]
})

Shopify.CustomCollections.create({
  handle: 'foobar',
  ...
}).then((created)=> {
  
})

```

