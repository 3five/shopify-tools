
export class NotImplementedError extends Error {
  name = 'NotImplementedError'
  message = 'Not implemented in this lib or Shopify.'
  stack = (new Error()).stack;
}

export class ArgumentError extends Error {
  name = 'ArgumentError'
  message = 'Called with illegal arguments'
  stack = (new Error()).stack;
}