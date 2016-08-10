import {
  PrivateSession,
  OAuthSession
} from '../src/session'

describe('PrivateSession', x => {
  let session = null
  
  beforeEach(()=> {
    session = new PrivateSession({
      host: '123',
      apiKey: 'abc',
      password: 'def',
      secret: 'xyz',
      shop: 'myshop.myshopify.com'
    })
  })

  it('should have the required properties', ()=> {
    expect(session.host).to.be.equal('123')
    expect(session.apiKey).to.be.equal('abc')
    expect(session.password).to.be.equal('def')
    expect(session.secret).to.be.equal('xyz')
    expect(session.shop).to.be.equal('myshop.myshopify.com')
  })

  it('should have be able to update itself', ()=> {
    expect(session.host).to.be.equal('123')
    session.update({host: 'test'})
    expect(session.host).to.be.equal('test')
  })
})

describe('OAuthSession', x => {
  let session = null
  
  beforeEach(()=> {
    session = new OAuthSession({
      host: '123',
      apiKey: 'abc',
      secret: 'xyz',
      shop: 'myshop.myshopify.com',
      scopes: ['test']
    })
  })

  it('should have the required properties', ()=> {
    expect(session.host).to.be.equal('123')
    expect(session.apiKey).to.be.equal('abc')
    expect(session.scopes).to.be.an('array')
    expect(session.scopes).to.include('test')
    expect(session.secret).to.be.equal('xyz')
    expect(session.shop).to.be.equal('myshop.myshopify.com')
  })

  it('should have be able to update itself', ()=> {
    expect(session.access_token).to.be.undefined
    session.update({access_token: 'test'})
    expect(session.access_token).to.be.equal('test')
  })
})

