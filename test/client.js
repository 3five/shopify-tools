import {PrivateSession} from '../src/session'
import Client from '../src/client'

describe('ShopifyApiClient', ()=> {
  let client = null;
  let session = null;

  before(()=> {
    session = new PrivateSession({
      apiKey: process.env.SHOPIFY_API_KEY,
      password: process.env.SHOPIFY_PASSWORD,
      secret: process.env.SHOPIFY_SECRET,
      shop: process.env.SHOPIFY_SHOP
    })
    client = new Client({session})
  })

  it('should throw if no session is passed in', ()=> {
    expect(()=> new Client()).to.throw(Error)
    expect(()=> new Client({session})).not.to.throw
  })

  it('should accept a session', ()=> {
    expect(client.session).to.be.an.instanceof(PrivateSession)
  })

  it('should have general request methods', ()=> {
    expect(client.get).to.be.a('function')
    expect(client.post).to.be.a('function')
    expect(client.put).to.be.a('function')
    expect(client.del).to.be.a('function')
  })

  describe('generic get request', ()=> {
    it('should return a promise', ()=> {
      let req = client.get('/shop')
      expect(req).to.be.a.promise
    })

    it('should produce a clean response', async ()=> {
      let req = await client.get('/shop')
      expect(req).to.have.property('shop')
      expect(req.shop).to.include.keys('id', 'shop_owner')
    })

    it('should return a nice error object', async()=> {
      return client.get('/shop/nonexistent')
        .then(()=> { throw Error('Should not be called' )})
        .catch((err)=> {
          console.log(err)
          expect(err).not.to.be.instanceof(Error)
          expect(err.originalError).to.be.instanceof(Error)
          expect(err).to.include.keys('messages', 'error', 'originalError', 'status')
          expect(err.messages).to.include('Not Found')
        })
    })
  })

  describe('#post', ()=> {

  })

})