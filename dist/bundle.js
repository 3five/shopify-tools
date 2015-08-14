(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _client = __webpack_require__(1);

	var _client2 = _interopRequireDefault(_client);

	exports.ShopifyClient = _client2['default'];

	var _resources = __webpack_require__(6);

	var _resources2 = _interopRequireDefault(_resources);

	exports.ShopifyResources = _resources2['default'];

	var _session = __webpack_require__(5);

	Object.defineProperty(exports, 'ShopifyOAuthSession', {
	  enumerable: true,
	  get: function get() {
	    return _session.OAuthSession;
	  }
	});
	Object.defineProperty(exports, 'ShopifyPrivateSession', {
	  enumerable: true,
	  get: function get() {
	    return _session.PrivateSession;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _url = __webpack_require__(2);

	var _url2 = _interopRequireDefault(_url);

	var _superagent = __webpack_require__(3);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _crypto = __webpack_require__(4);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _session = __webpack_require__(5);

	var ShopifyClient = (function () {
	  function ShopifyClient(options) {
	    _classCallCheck(this, ShopifyClient);

	    this.methods = ['get', 'post', 'put', 'del'];
	    this.oauth = false;
	    this.defaults = {
	      resources: true
	    };

	    var opts = Object.assign({}, this.defaults, options);

	    if (!opts.session) {
	      throw new Error('Must provide a `Session`.');
	    }

	    if (opts.session instanceof _session.OAuthSession) {
	      this.oauth = true;
	    }

	    this.session = opts.session;

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = this.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var method = _step.value;

	        this[method] = this.genericMethod.bind(this, method);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }

	  _createClass(ShopifyClient, [{
	    key: 'genericMethod',
	    value: function genericMethod(method, resource, opts) {
	      var request = this.buildRequest(method, resource, opts);
	      return this.makeRequest(request);
	    }
	  }, {
	    key: 'buildUrl',
	    value: function buildUrl(resource) {
	      var pathname = '/admin/' + resource + '.json';
	      var reqUrlFormat = {
	        protocol: 'https',
	        host: this.session.host,
	        pathname: pathname
	      };

	      if (!this.oauth) {
	        reqUrlFormat.auth = this.session.key + ':' + this.session.password;
	      }

	      return _url2['default'].format(reqUrlFormat);
	    }
	  }, {
	    key: 'buildRequest',
	    value: function buildRequest(method, resource, opts) {
	      var request = _superagent2['default'][method.toLowerCase()](this.buildUrl(resource));

	      if (opts && opts.params) {
	        request.query(opts.params);
	      }

	      if (opts && opts.data) {
	        request.send(opts.data);
	      }

	      if (this.oauth) {
	        if (this.session.access_token) {
	          request.set('X-Shopify-Access-Token', this.session.access_token);
	        } else {
	          throw new Error('Cannot make requests without `access_token`');
	        }
	      }

	      return request;
	    }
	  }, {
	    key: 'makeRequest',
	    value: function makeRequest(request) {
	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        request.end(function (err, res) {
	          var verified = false;
	          if (err) {
	            reject(res.body || err);
	          } else {
	            verified = _this.verifyResponse(res);
	            if (verified) {
	              resolve(res.body);
	            } else {
	              reject('Shopify response is not authentic.');
	            }
	          }
	        });
	      });
	    }
	  }, {
	    key: 'verifyResponse',
	    value: function verifyResponse(res) {
	      if (!this.oauth) {
	        return true;
	      }

	      return false;
	    }
	  }]);

	  return ShopifyClient;
	})();

	exports['default'] = ShopifyClient;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("superagent");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PrivateSession = function PrivateSession(opts) {
	  _classCallCheck(this, PrivateSession);

	  this.host = opts.host;
	  this.key = opts.apiKey;
	  this.password = opts.password;
	};

	exports.PrivateSession = PrivateSession;

	var OAuthSession = (function () {
	  function OAuthSession(opts) {
	    _classCallCheck(this, OAuthSession);

	    this.host = opts.host;
	    this.client_id = opts.apiKey;
	    this.client_secret = opts.secret;
	    this.code = opts.code;
	    this.access_token = opts.access_token;
	  }

	  _createClass(OAuthSession, [{
	    key: "update",
	    value: function update(opts) {
	      Object.assign(this, opts);
	    }
	  }]);

	  return OAuthSession;
	})();

	exports.OAuthSession = OAuthSession;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _client = __webpack_require__(1);

	var _client2 = _interopRequireDefault(_client);

	var _resourcesIndex = __webpack_require__(7);

	var resources = _interopRequireWildcard(_resourcesIndex);

	var ShopifyResources = (function () {
	  function ShopifyResources(options) {
	    _classCallCheck(this, ShopifyResources);

	    this.defaults = {};

	    var opts = Object.assign({}, this.defaults, options);
	    if (!opts.session && !opts.client) {
	      throw new Error('Must provide a client or session.');
	    }

	    this.client = !opts.client ? new _client2['default']({ session: opts.session }) : opts.client;

	    this.buildResources();
	  }

	  _createClass(ShopifyResources, [{
	    key: 'buildResources',
	    value: function buildResources() {
	      var _this = this;

	      Object.keys(resources).forEach(function (r) {
	        var opts = { client: _this.client };
	        var Resource = resources[r];
	        _this[r] = new Resource(opts);
	        // if (this[r].metafields) {
	        //   opts.resourcePrefix = `${this[r].resourceName}/`
	        //   this[r].Metafields = new resources.Metafields()
	        // }
	      });
	    }
	  }]);

	  return ShopifyResources;
	})();

	exports['default'] = ShopifyResources;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _applicationCharges = __webpack_require__(8);

	var _applicationCharges2 = _interopRequireDefault(_applicationCharges);

	exports.ApplicationCharges = _applicationCharges2['default'];

	var _blogs = __webpack_require__(11);

	var _blogs2 = _interopRequireDefault(_blogs);

	exports.Blogs = _blogs2['default'];

	var _carrierServices = __webpack_require__(12);

	var _carrierServices2 = _interopRequireDefault(_carrierServices);

	exports.CarrierServices = _carrierServices2['default'];

	var _checkouts = __webpack_require__(13);

	var _checkouts2 = _interopRequireDefault(_checkouts);

	exports.Checkouts = _checkouts2['default'];

	var _collects = __webpack_require__(15);

	var _collects2 = _interopRequireDefault(_collects);

	exports.Collects = _collects2['default'];

	var _comments = __webpack_require__(16);

	var _comments2 = _interopRequireDefault(_comments);

	exports.Comments = _comments2['default'];

	var _countries = __webpack_require__(17);

	var _countries2 = _interopRequireDefault(_countries);

	exports.Countries = _countries2['default'];

	var _customCollections = __webpack_require__(18);

	var _customCollections2 = _interopRequireDefault(_customCollections);

	exports.CustomCollections = _customCollections2['default'];

	var _customerSavedSearches = __webpack_require__(19);

	var _customerSavedSearches2 = _interopRequireDefault(_customerSavedSearches);

	exports.CustomerSavedSearches = _customerSavedSearches2['default'];

	var _customers = __webpack_require__(20);

	var _customers2 = _interopRequireDefault(_customers);

	exports.Customers = _customers2['default'];

	var _discounts = __webpack_require__(21);

	var _discounts2 = _interopRequireDefault(_discounts);

	exports.Discounts = _discounts2['default'];

	var _events = __webpack_require__(22);

	var _events2 = _interopRequireDefault(_events);

	exports.Events = _events2['default'];

	var _fulfillmentServices = __webpack_require__(23);

	var _fulfillmentServices2 = _interopRequireDefault(_fulfillmentServices);

	exports.FulfillmentServices = _fulfillmentServices2['default'];

	var _giftCards = __webpack_require__(24);

	var _giftCards2 = _interopRequireDefault(_giftCards);

	exports.GiftCards = _giftCards2['default'];

	var _locations = __webpack_require__(25);

	var _locations2 = _interopRequireDefault(_locations);

	exports.Locations = _locations2['default'];

	var _metafields = __webpack_require__(26);

	var _metafields2 = _interopRequireDefault(_metafields);

	exports.Metafields = _metafields2['default'];

	var _orderRisks = __webpack_require__(27);

	var _orderRisks2 = _interopRequireDefault(_orderRisks);

	exports.OrderRisks = _orderRisks2['default'];

	var _orders = __webpack_require__(28);

	var _orders2 = _interopRequireDefault(_orders);

	exports.Orders = _orders2['default'];

	var _pages = __webpack_require__(29);

	var _pages2 = _interopRequireDefault(_pages);

	exports.Pages = _pages2['default'];

	var _policies = __webpack_require__(30);

	var _policies2 = _interopRequireDefault(_policies);

	exports.Policies = _policies2['default'];

	var _products = __webpack_require__(31);

	var _products2 = _interopRequireDefault(_products);

	exports.Products = _products2['default'];

	var _recurringApplicationCharges = __webpack_require__(32);

	var _recurringApplicationCharges2 = _interopRequireDefault(_recurringApplicationCharges);

	exports.RecurringApplicationCharges = _recurringApplicationCharges2['default'];

	var _redirects = __webpack_require__(33);

	var _redirects2 = _interopRequireDefault(_redirects);

	exports.Redirects = _redirects2['default'];

	var _shop = __webpack_require__(34);

	var _shop2 = _interopRequireDefault(_shop);

	exports.Shop = _shop2['default'];

	var _smartCollections = __webpack_require__(35);

	var _smartCollections2 = _interopRequireDefault(_smartCollections);

	exports.SmartCollections = _smartCollections2['default'];

	var _themes = __webpack_require__(36);

	var _themes2 = _interopRequireDefault(_themes);

	exports.Themes = _themes2['default'];

	var _users = __webpack_require__(37);

	var _users2 = _interopRequireDefault(_users);

	exports.Users = _users2['default'];

	var _webhooks = __webpack_require__(38);

	var _webhooks2 = _interopRequireDefault(_webhooks);

	exports.Webhooks = _webhooks2['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var ApplicationChargesResource = (function (_Resource) {
	  _inherits(ApplicationChargesResource, _Resource);

	  function ApplicationChargesResource() {
	    _classCallCheck(this, ApplicationChargesResource);

	    _get(Object.getPrototypeOf(ApplicationChargesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'application_charges';
	  }

	  return ApplicationChargesResource;
	})(_base2['default']);

	exports['default'] = ApplicationChargesResource;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _inflection = __webpack_require__(10);

	var _inflection2 = _interopRequireDefault(_inflection);

	var Resource = (function () {
	  function Resource(opts) {
	    var _this = this;

	    _classCallCheck(this, Resource);

	    this.resourceName = opts.resourceName;
	    this.client = opts.client;
	    this.resourcePrefix = opts.resourcePrefix || '';

	    // (hack) Define this prop after the
	    // extending constructor is done
	    process.nextTick(function () {
	      _this.resourceSingularName = opts.resourceSingularName || _inflection2['default'].singularize(_this.resourceName);
	    });
	  }

	  _createClass(Resource, [{
	    key: 'getAll',
	    value: function getAll(opts) {
	      // reflect on resource prefix to determine which resourceId we should check for
	      // in support of metafields
	      var resource = '' + this.resourceName;
	      return this.client.get(resource, { params: opts }).then(extractResource(resource));
	    }
	  }, {
	    key: 'get',
	    value: function get(id, opts) {
	      var resource = this.resourceName;
	      var payload = { params: opts };

	      if (this.singular && typeof id !== 'number') {
	        opts = id;
	        id = null;
	      } else if (typeof id !== 'number') {
	        throw new ArgumentError();
	      }

	      if (id) {
	        resource += '/' + id;
	      }

	      return this.client.get(resource, payload).then(extractResource(this.resourceSingularName));
	    }
	  }, {
	    key: 'count',
	    value: function count(opts) {
	      var resource = this.resourceName + '/count';
	      var payload = { params: opts };
	      return this.client.get(resource).then(extractResource('count'));
	    }
	  }, {
	    key: 'create',
	    value: function create(data, opts) {
	      var resource = this.resourceName;
	      var payload = {
	        data: _defineProperty({}, this.resourceSingularName, data),
	        params: opts
	      };
	      return this.client.post(resource, payload).then(extractResource(this.resourceSingularName));
	    }
	  }, {
	    key: 'update',
	    value: function update(id, data, opts) {
	      var resource = this.resourceName + '/' + id;
	      var payload = {
	        data: _defineProperty({}, this.resourceSingularName, data),
	        params: opts
	      };
	      return this.client.put(resource, payload).then(extractResource(this.resourceSingularName));
	    }
	  }, {
	    key: 'remove',
	    value: function remove(id, opts) {
	      var resource = this.resourceName + '/' + id;
	      var payload = { params: opts };
	      return this.client.del(resource, payload).then(function () {
	        return { deleted: true };
	      });
	    }
	  }]);

	  return Resource;
	})();

	exports['default'] = Resource;

	function extractResource(resource) {
	  return function (data) {
	    return data[resource];
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("inflection");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var BlogResource = (function (_Resource) {
	  _inherits(BlogResource, _Resource);

	  function BlogResource() {
	    _classCallCheck(this, BlogResource);

	    _get(Object.getPrototypeOf(BlogResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'blogs';
	  }

	  return BlogResource;
	})(_base2['default']);

	exports['default'] = BlogResource;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CarrierServicesResource = (function (_Resource) {
	  _inherits(CarrierServicesResource, _Resource);

	  function CarrierServicesResource() {
	    _classCallCheck(this, CarrierServicesResource);

	    _get(Object.getPrototypeOf(CarrierServicesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'carrier_services';
	  }

	  return CarrierServicesResource;
	})(_base2['default']);

	exports['default'] = CarrierServicesResource;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var _errors = __webpack_require__(14);

	var CheckoutResource = (function (_Resource) {
	  _inherits(CheckoutResource, _Resource);

	  function CheckoutResource() {
	    _classCallCheck(this, CheckoutResource);

	    _get(Object.getPrototypeOf(CheckoutResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'checkouts';
	  }

	  _createClass(CheckoutResource, [{
	    key: 'get',
	    value: function get() {
	      throw new _errors.NotImplementedError();
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      throw new _errors.NotImplementedError();
	    }
	  }, {
	    key: 'create',
	    value: function create() {
	      throw new _errors.NotImplementedError();
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      throw new _errors.NotImplementedError();
	    }
	  }]);

	  return CheckoutResource;
	})(_base2['default']);

	exports['default'] = CheckoutResource;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NotImplementedError = (function (_Error) {
	  _inherits(NotImplementedError, _Error);

	  function NotImplementedError() {
	    _classCallCheck(this, NotImplementedError);

	    _get(Object.getPrototypeOf(NotImplementedError.prototype), 'constructor', this).apply(this, arguments);

	    this.name = 'NotImplementedError';
	    this.message = 'Not implemented in this lib or Shopify.';
	    this.stack = new Error().stack;
	  }

	  return NotImplementedError;
	})(Error);

	exports.NotImplementedError = NotImplementedError;

	var ArgumentError = (function (_Error2) {
	  _inherits(ArgumentError, _Error2);

	  function ArgumentError() {
	    _classCallCheck(this, ArgumentError);

	    _get(Object.getPrototypeOf(ArgumentError.prototype), 'constructor', this).apply(this, arguments);

	    this.name = 'ArgumentError';
	    this.message = 'Called with illegal arguments';
	    this.stack = new Error().stack;
	  }

	  return ArgumentError;
	})(Error);

	exports.ArgumentError = ArgumentError;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CollectsResource = (function (_Resource) {
	  _inherits(CollectsResource, _Resource);

	  function CollectsResource() {
	    _classCallCheck(this, CollectsResource);

	    _get(Object.getPrototypeOf(CollectsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'collects';
	  }

	  return CollectsResource;
	})(_base2['default']);

	exports['default'] = CollectsResource;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var _errors = __webpack_require__(14);

	var CommentsResource = (function (_Resource) {
	  _inherits(CommentsResource, _Resource);

	  function CommentsResource() {
	    _classCallCheck(this, CommentsResource);

	    _get(Object.getPrototypeOf(CommentsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'comments';
	  }

	  _createClass(CommentsResource, [{
	    key: 'getAll',
	    value: function getAll() {
	      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      if (!opts.article_id || !opts.blog_id) {
	        throw new _errors.ArgumentError();
	      }
	      return _get(Object.getPrototypeOf(CommentsResource.prototype), 'getAll', this).call(this, opts);
	    }
	  }]);

	  return CommentsResource;
	})(_base2['default']);

	exports['default'] = CommentsResource;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CountriesResource = (function (_Resource) {
	  _inherits(CountriesResource, _Resource);

	  function CountriesResource() {
	    _classCallCheck(this, CountriesResource);

	    _get(Object.getPrototypeOf(CountriesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'countries';
	  }

	  return CountriesResource;
	})(_base2['default']);

	exports['default'] = CountriesResource;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CustomCollectionsResource = (function (_Resource) {
	  _inherits(CustomCollectionsResource, _Resource);

	  function CustomCollectionsResource() {
	    _classCallCheck(this, CustomCollectionsResource);

	    _get(Object.getPrototypeOf(CustomCollectionsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'custom_collections';
	    this.metafields = true;
	  }

	  return CustomCollectionsResource;
	})(_base2['default']);

	exports['default'] = CustomCollectionsResource;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CustomerSavedSearchesResource = (function (_Resource) {
	  _inherits(CustomerSavedSearchesResource, _Resource);

	  function CustomerSavedSearchesResource() {
	    _classCallCheck(this, CustomerSavedSearchesResource);

	    _get(Object.getPrototypeOf(CustomerSavedSearchesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'customer_saved_searches';
	  }

	  return CustomerSavedSearchesResource;
	})(_base2['default']);

	exports['default'] = CustomerSavedSearchesResource;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var CustomersResource = (function (_Resource) {
	  _inherits(CustomersResource, _Resource);

	  function CustomersResource() {
	    _classCallCheck(this, CustomersResource);

	    _get(Object.getPrototypeOf(CustomersResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'customers';
	  }

	  return CustomersResource;
	})(_base2['default']);

	exports['default'] = CustomersResource;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var DiscountsResource = (function (_Resource) {
	  _inherits(DiscountsResource, _Resource);

	  function DiscountsResource() {
	    _classCallCheck(this, DiscountsResource);

	    _get(Object.getPrototypeOf(DiscountsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'discounts';
	  }

	  return DiscountsResource;
	})(_base2['default']);

	exports['default'] = DiscountsResource;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var EventsResource = (function (_Resource) {
	  _inherits(EventsResource, _Resource);

	  function EventsResource() {
	    _classCallCheck(this, EventsResource);

	    _get(Object.getPrototypeOf(EventsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'events';
	  }

	  return EventsResource;
	})(_base2['default']);

	exports['default'] = EventsResource;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var FulfillmentServicesResource = (function (_Resource) {
	  _inherits(FulfillmentServicesResource, _Resource);

	  function FulfillmentServicesResource() {
	    _classCallCheck(this, FulfillmentServicesResource);

	    _get(Object.getPrototypeOf(FulfillmentServicesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'fulfillment_services';
	  }

	  return FulfillmentServicesResource;
	})(_base2['default']);

	exports['default'] = FulfillmentServicesResource;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var GiftCardsResource = (function (_Resource) {
	  _inherits(GiftCardsResource, _Resource);

	  function GiftCardsResource() {
	    _classCallCheck(this, GiftCardsResource);

	    _get(Object.getPrototypeOf(GiftCardsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'gift_cards';
	  }

	  return GiftCardsResource;
	})(_base2['default']);

	exports['default'] = GiftCardsResource;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var LocationsResource = (function (_Resource) {
	  _inherits(LocationsResource, _Resource);

	  function LocationsResource() {
	    _classCallCheck(this, LocationsResource);

	    _get(Object.getPrototypeOf(LocationsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'locations';
	  }

	  return LocationsResource;
	})(_base2['default']);

	exports['default'] = LocationsResource;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var MetafieldsResource = (function (_Resource) {
	  _inherits(MetafieldsResource, _Resource);

	  function MetafieldsResource() {
	    _classCallCheck(this, MetafieldsResource);

	    _get(Object.getPrototypeOf(MetafieldsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'metafields';
	  }

	  return MetafieldsResource;
	})(_base2['default']);

	exports['default'] = MetafieldsResource;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var OrderRisksResource = (function (_Resource) {
	  _inherits(OrderRisksResource, _Resource);

	  function OrderRisksResource() {
	    _classCallCheck(this, OrderRisksResource);

	    _get(Object.getPrototypeOf(OrderRisksResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'order_risks';
	  }

	  return OrderRisksResource;
	})(_base2['default']);

	exports['default'] = OrderRisksResource;
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var OrdersResource = (function (_Resource) {
	  _inherits(OrdersResource, _Resource);

	  function OrdersResource() {
	    _classCallCheck(this, OrdersResource);

	    _get(Object.getPrototypeOf(OrdersResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'orders';
	  }

	  return OrdersResource;
	})(_base2['default']);

	exports['default'] = OrdersResource;
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var PagesResource = (function (_Resource) {
	  _inherits(PagesResource, _Resource);

	  function PagesResource() {
	    _classCallCheck(this, PagesResource);

	    _get(Object.getPrototypeOf(PagesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'pages';
	  }

	  return PagesResource;
	})(_base2['default']);

	exports['default'] = PagesResource;
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var PoliciesResource = (function (_Resource) {
	  _inherits(PoliciesResource, _Resource);

	  function PoliciesResource() {
	    _classCallCheck(this, PoliciesResource);

	    _get(Object.getPrototypeOf(PoliciesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'policies';
	  }

	  return PoliciesResource;
	})(_base2['default']);

	exports['default'] = PoliciesResource;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var ProductResource = (function (_Resource) {
	  _inherits(ProductResource, _Resource);

	  function ProductResource() {
	    _classCallCheck(this, ProductResource);

	    _get(Object.getPrototypeOf(ProductResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'products';
	  }

	  return ProductResource;
	})(_base2['default']);

	exports['default'] = ProductResource;
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var RecurringApplicationChargesResource = (function (_Resource) {
	  _inherits(RecurringApplicationChargesResource, _Resource);

	  function RecurringApplicationChargesResource() {
	    _classCallCheck(this, RecurringApplicationChargesResource);

	    _get(Object.getPrototypeOf(RecurringApplicationChargesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'recurring_application_charges';
	  }

	  return RecurringApplicationChargesResource;
	})(_base2['default']);

	exports['default'] = RecurringApplicationChargesResource;
	module.exports = exports['default'];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var RedirectsResource = (function (_Resource) {
	  _inherits(RedirectsResource, _Resource);

	  function RedirectsResource() {
	    _classCallCheck(this, RedirectsResource);

	    _get(Object.getPrototypeOf(RedirectsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'redirects';
	  }

	  return RedirectsResource;
	})(_base2['default']);

	exports['default'] = RedirectsResource;
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var ShopResource = (function (_Resource) {
	  _inherits(ShopResource, _Resource);

	  function ShopResource() {
	    _classCallCheck(this, ShopResource);

	    _get(Object.getPrototypeOf(ShopResource.prototype), 'constructor', this).apply(this, arguments);

	    this.singular = true;
	    this.resourceName = 'shop';
	  }

	  return ShopResource;
	})(_base2['default']);

	exports['default'] = ShopResource;
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var SmartCollectionsResource = (function (_Resource) {
	  _inherits(SmartCollectionsResource, _Resource);

	  function SmartCollectionsResource() {
	    _classCallCheck(this, SmartCollectionsResource);

	    _get(Object.getPrototypeOf(SmartCollectionsResource.prototype), 'constructor', this).apply(this, arguments);

	    this.metafields = true;
	    this.resourceName = 'smart_collections';
	  }

	  return SmartCollectionsResource;
	})(_base2['default']);

	exports['default'] = SmartCollectionsResource;
	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var ThemesResource = (function (_Resource) {
	  _inherits(ThemesResource, _Resource);

	  function ThemesResource() {
	    _classCallCheck(this, ThemesResource);

	    _get(Object.getPrototypeOf(ThemesResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'themes';
	  }

	  return ThemesResource;
	})(_base2['default']);

	exports['default'] = ThemesResource;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var UsersResource = (function (_Resource) {
	  _inherits(UsersResource, _Resource);

	  function UsersResource() {
	    _classCallCheck(this, UsersResource);

	    _get(Object.getPrototypeOf(UsersResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'users';
	  }

	  return UsersResource;
	})(_base2['default']);

	exports['default'] = UsersResource;
	module.exports = exports['default'];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _base = __webpack_require__(9);

	var _base2 = _interopRequireDefault(_base);

	var WebhooksResource = (function (_Resource) {
	  _inherits(WebhooksResource, _Resource);

	  function WebhooksResource() {
	    _classCallCheck(this, WebhooksResource);

	    _get(Object.getPrototypeOf(WebhooksResource.prototype), 'constructor', this).apply(this, arguments);

	    this.resourceName = 'webhooks';
	  }

	  return WebhooksResource;
	})(_base2['default']);

	exports['default'] = WebhooksResource;
	module.exports = exports['default'];

/***/ }
/******/ ])));