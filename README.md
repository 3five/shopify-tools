# Shopify Tools
A set of tools for making Shopify apps. Under the hood includes a basic API client,
and higher-level ORM-like resources. It also includes an authentication middleware
which abstracts all of the OAuth installation implementation.

Works for OAuth and Private apps except the auth middleware (OAuth only).

## TODO
Finish sub collections / collection-specific methods
- Article
- Asset
- CustomerAddress
- Policy
- Product Variant
- Province
- Refund
- Transaction

## Basic Usage
If using the middleware, there is no need for instantiating the sessions or client/resources
because those are done for you on each request.

See below for private app usage, the same follows for OAuth apps except you need to either update or create a new session for each store.

### Middleware

**`lib/shopify.js`**
```
import { ShopifyAuthMiddleware } from 'shopify-tools'
import db from '../db'
const { Tenant } = db.models;

export default new ShopifyAuthMiddleware({
  listingHandle: 'kitchen-sink',          // The handle for Shopify app listing (optional)
  host: process.env.APP_HOST,             // The app's hostname
  apiKey: process.env.SHOPIFY_API_KEY,    // The API key for your OAuth application
  secret: process.env.SHOPIFY_API_SECRET, // The Shared Secret for your OAuth application
  scopes: process.env.SHOPIFY_API_SCOPES.split(','),  // Permissions for your app
  autoInstall: true,  // Any requests that aren't authorized are redirected to the install url
  applicationBase: '/admin',                          // Base url for your embedded application
  applicationInstall: '/install',                     // Url for initiating OAuth
  applicationInstallCallback: '/install/callback',    // Callback url for OAuth
  anonymousInstall: false,  // Allow installation requests from any url
                            // Defaults to only verified requests from Shopify app store.

  anonymousWebhooks: false,      // Turn this off to perform authentication for webhooks.
  webhooksBase: '/api/webhooks', // Base url for automatically created webhooks.
  webhooks: [
    'products/create',
    'products/update',
    'orders/create',
    'orders/fulfilled'
  ],

  scripts: [                // List of host-rooted assets to install automatically,
    '/assets/js/storefront.js' // absolute urls not supported at this point
  ],

  // (Required) Must return an object with the shape
  // { access_token: 'xxx' }
  willAuthenticate(req, res, next) {
    let { shop } = req.query;
    Tenant.findOne({ shop }).then(next)
  },

  // (Required) Must create a Tenant record and
  // save their nonce code
  willInstall(shop, nonce, next) {
    let tenant = new Tenant({ shop, nonce })
    tenant.save().then(next)
  },

  // (Required) Your chance to save the access_token for the app.
  // Must persist this to make future API requests.
  didInstall(shop, code, access_token, next) {
    Tenant.update({ shop }, { code, access_token }).then(next)
  },

  // Called when the user uninstalls an app
  didUninstall(shop) {
    // destroy any sub records
    Tenant.remove({ shop }).exec();
  }
})
```

**`app.js`**
```
import shopify from './lib/shopify'
let app = express()
...
// Install this to enable webhook verification
app.use(bodyParser.json({
  verify: shopify.bodyParserVerify
}))

// Before your routes
app.use(shopify.callback());

// Anywhere in your application, maybe a static class
shopify.on('products/update', (context, payload)=> {
    // context === returned from options.willAuthenticate
    // Imaginary Sequelize collection
    ProductsRepo.updateFromShopify({
        where: { tenant: context.id, shopify_id: payload.id }
    }, payload);
})

// if resources enabled (with ES7 async/await)
app.get('/admin', async (req, res)=> {
  let { Products, Orders } = res.locals.resources;

  let products = await Products.findAll();
  res.render('dashboard', { products })
})

// lower level, promise example
app.get('/admin/products/:id', (req, res) {
  let { client } = res.locals;
  client.get(`products/${req.params.id}`).then((resp)=> {
    res.render('product', { product: resp.product });
  })
})

// Outside of the app base.
app.get('/other', (req, res)=> {
  // res.locals.client === undefined
})
```

### Client/Resources
```
import { ShopifyResources, ShopifyPrivateSession } from 'shopify-tools'

let session = new ShopifyPrivateSession({
  host: 'localhost:3000', // your app's hostname
  shop: 'kitchen-sink.myshopify.com',
  apiKey: 'xxxx',
  secret: 'xxxx',
});

let resources = new ShopifyResources({ session });
resources.Products.findOne(123124, { fields: 'handle,title' }).then((product) => {
    // product.get('title') === 'foo'
    // product.toJSON() === { id: 123124, title: 'foo', handle: 'foo' }
});
```

## API
### Sessions
`constructor`

**ShopifyPrivateSession(options)**

`options`
```
{
  host: 'localhost:3000', // your app's hostname
  shop: 'kitchen-sink.myshopify.com',
  apiKey: 'xxxx',
  secret: 'xxxx',
}
```



**`new ShopifyOAuthSession(options)`**

`options`
```
{
  host: 'my-app.ngrok.io', // The app must be served over https, use a proxy like ngrok
  apiKey: 'xxxx',
  secret: 'xxxx',
  shop: 'kitchen-sink.myshopify.com'
  access_token: '$shop_access_token',
  scopes: ['read_themes', 'write_products']
}
```

### API Client
**`new ShopifyClient(options)`**

`options`
```
{
  session: ShopifyOAuthSession|ShopifyPrivateSession
}
```

### .. More Docs Soon!
