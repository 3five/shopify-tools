require('babel-polyfill')
var Shopify = require('./lib')
var { ShopifyResources, ShopifyPrivateSession } = Shopify
var _ = require('lodash')

var session = new ShopifyPrivateSession({
  host: 'localhost:3000', // your app's hostname
  shop: 'nomiddleman-2.myshopify.com',
  apiKey: '12ab00d88f89169228517b27a59d8fa4',
  secret: 'a678ec450b4c208808ca686ff57718c9',
  password: 'a678ec450b4c208808ca686ff57718c9'
})

let resources = new ShopifyResources({ session })

resources.client.get('/products/count').then(results => {
	console.log(results)
})

resources.Products.findAll({complete: true}).then(results => {
	results = results.map(r => r.toObject())
	console.log(results.length)
	let ids =  _.pluck(results, 'id')
	console.log('total ids', ids.length)
	console.log(ids.slice(0, 10))
	console.log('unique ids', _.uniq(ids).length)
}).catch(err => {
	console.log(err)
})