(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _inflection = __webpack_require__(45);

	var _inflection2 = _interopRequireDefault(_inflection);

	var _instance = __webpack_require__(27);

	var _instance2 = _interopRequireDefault(_instance);

	var _lodash = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var COLLECTION_LIMIT = 250;

	var Resource = function () {
	  function Resource(opts) {
	    var _this = this;

	    _classCallCheck(this, Resource);

	    this.opts = opts;
	    this.resourceName = opts.resourceName;
	    this.client = opts.client;
	    this.resourcePrefix = opts.resourcePrefix || null;
	    this.resourceSuffix = opts.resourceSuffix || null;

	    // (hack) Define this prop after the
	    // extending constructor is done
	    process.nextTick(function () {
	      _this.resourceSingularName = opts.resourceSingularName || _inflection2.default.singularize(_this.resourceName);
	    });
	  }

	  _createClass(Resource, [{
	    key: '_wrapInstances',
	    value: function _wrapInstances(opts) {
	      var _this2 = this;

	      return function (data) {
	        if (!opts || !opts.bare) {
	          if ((0, _lodash.isArray)(data)) {
	            return (0, _lodash.map)(data, function (resource) {
	              return _this2.build(resource);
	            });
	          } else {
	            return _this2.build(data);
	          }
	        }
	        return data;
	      };
	    }
	  }, {
	    key: '_getUrl',
	    value: function _getUrl() {
	      var resource = '';
	      if (this.resourcePrefix) resource += this.resourcePrefix + '/';
	      resource += this.resourceName;
	      if (this.resourceSuffix) resource += '/' + this.resourceSuffix;
	      return resource;
	    }
	  }, {
	    key: 'build',
	    value: function build(id, data) {
	      if (!data && typeof id !== 'number') {
	        data = id;
	      }

	      if (typeof id === 'number') {
	        data = data || (data = {});
	        data.id = id;
	      }

	      var parent = (0, _lodash.merge)(Object.create(Object.getPrototypeOf(this)), this);

	      if (!this.singular) {
	        parent.resourceSuffix = data.id;
	      }

	      return new _instance2.default(data, parent);
	    }
	  }, {
	    key: 'count',
	    value: function count(opts) {
	      var resource = this._getUrl() + '/count';
	      var payload = { params: opts };
	      return this.client.get(resource, payload).then(extractResource('count'));
	    }
	  }, {
	    key: 'create',
	    value: function create(data, opts) {
	      var resource = this._getUrl();
	      var payload = {
	        data: _defineProperty({}, this.resourceSingularName, data),
	        params: opts
	      };
	      return this.client.post(resource, payload).then(extractResource(this.resourceSingularName)).then(this._wrapInstances(opts));
	    }
	  }, {
	    key: 'find',
	    value: function find(cb) {
	      return this.findAll({ complete: true }).then(function (resources) {
	        return (0, _lodash.find)(resources, cb);
	      });
	    }
	  }, {
	    key: 'findAll',
	    value: function findAll(opts) {
	      var _this3 = this;

	      var resource = this._getUrl();

	      if (opts && opts.complete) {
	        delete opts.complete;
	        return this.count(opts).then(function (count) {
	          var nCalls = Math.ceil(count / COLLECTION_LIMIT);
	          var calls = [];
	          for (var i = 1; i <= nCalls; i++) {
	            var cOpts = (0, _lodash.extend)({}, opts, { limit: 250, page: i });
	            calls.push(_this3.findAll(cOpts));
	          }
	          return Promise.all(calls).then(function (results) {
	            var _ref;

	            return (_ref = []).concat.apply(_ref, _toConsumableArray(results));
	          });
	        });
	      }

	      return this.client.get(resource, { params: opts }).then(extractResource(this.resourceName)).then(this._wrapInstances(opts));
	    }
	  }, {
	    key: 'findOne',
	    value: function findOne(id, opts) {
	      var resource = this._getUrl();

	      if (this.singular && typeof id !== 'number') {
	        opts = id;
	        id = null;
	      } else if (typeof id !== 'number') {
	        throw new ArgumentError();
	      }

	      if (id) {
	        resource += '/' + id;
	      }

	      var payload = { params: opts };

	      return this.client.get(resource, payload).then(extractResource(this.resourceSingularName)).then(this._wrapInstances(opts));
	    }
	  }, {
	    key: 'update',
	    value: function update(id, data, opts) {
	      var resource = '' + this._getUrl();

	      if (id) {
	        resource += '/' + id;
	      }

	      var payload = {
	        data: _defineProperty({}, this.resourceSingularName, data),
	        params: opts
	      };
	      return this.client.put(resource, payload).then(extractResource(this.resourceSingularName)).then(this._wrapInstances(opts));
	    }
	  }, {
	    key: 'remove',
	    value: function remove(id, opts) {
	      var resource = this._getUrl() + '/' + id;
	      var payload = { params: opts };
	      return this.client.del(resource, payload).then(function () {
	        return { deleted: true };
	      });
	    }
	  }]);

	  return Resource;
	}();

	exports.default = Resource;


	function extractResource(resource) {
	  return function (data) {
	    return data[resource];
	  };
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.e = require("lodash");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _url = __webpack_require__(7);

	var _url2 = _interopRequireDefault(_url);

	var _uuid = __webpack_require__(48);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _superagent = __webpack_require__(47);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _session = __webpack_require__(3);

	var _rateLimiter = __webpack_require__(11);

	var _rateLimiter2 = _interopRequireDefault(_rateLimiter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ShopifyClient = function () {
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
	    this.queue = ShopifyClient.getQueue(this.session.host);

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
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
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
	    key: 'buildInstallUrl',
	    value: function buildInstallUrl(redirectUri) {
	      var nonce = _uuid2.default.v4();
	      var uri = _url2.default.format({
	        protocol: 'https',
	        host: this.session.shop,
	        pathname: '/admin/oauth/authorize',
	        query: {
	          ShopifyClient_id: this.session.apiKey,
	          scope: this.session.scopes.join(','),
	          redirect_uri: _url2.default.format({
	            protocol: 'https',
	            host: this.session.host,
	            pathname: redirectUri
	          }),
	          state: nonce
	        }
	      });
	      return { uri: uri, nonce: nonce };
	    }
	  }, {
	    key: 'buildUrl',
	    value: function buildUrl(resource, opts) {
	      var noSuffix = opts && opts.noSuffix;
	      var pathname = '/admin/' + resource + (noSuffix ? '' : '.json');
	      var reqUrlFormat = {
	        protocol: 'https',
	        host: this.session.shop,
	        pathname: pathname
	      };

	      if (!this.oauth) {
	        reqUrlFormat.auth = this.session.apiKey + ':' + this.session.password;
	      }

	      return _url2.default.format(reqUrlFormat);
	    }
	  }, {
	    key: 'buildRequest',
	    value: function buildRequest(method, resource, opts) {
	      var request = _superagent2.default[method.toLowerCase()](this.buildUrl(resource));

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
	    key: 'getAccessToken',
	    value: function getAccessToken(code) {
	      var _this = this;

	      var url = this.buildUrl('oauth/access_token');
	      var request = _superagent2.default.post(url);
	      request.query({
	        ShopifyClient_id: this.session.apiKey,
	        ShopifyClient_secret: this.session.secret,
	        code: code
	      });
	      return this.makeRequest(request).then(function (resp) {
	        _this.session.update(resp);
	        return resp;
	      });
	    }
	  }, {
	    key: 'makeRequest',
	    value: function makeRequest(request) {
	      var _this2 = this;

	      return new Promise(function (resolve, reject) {
	        _this2.queue.push(request, 5, function (err, res) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(res.body);
	          }
	        });
	      });
	    }
	  }], [{
	    key: 'getQueue',
	    value: function getQueue(host) {
	      if (!ShopifyClient.buckets[host]) {
	        ShopifyClient.buckets[host] = new _rateLimiter2.default();
	      }
	      return ShopifyClient.buckets[host];
	    }
	  }]);

	  return ShopifyClient;
	}();

	ShopifyClient.buckets = {};
	exports.default = ShopifyClient;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OAuthSession = exports.PrivateSession = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _lodash = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PrivateSession = exports.PrivateSession = function () {
	  function PrivateSession(opts) {
	    _classCallCheck(this, PrivateSession);

	    this.host = opts.host;
	    this.apiKey = opts.apiKey;
	    this.password = opts.password;
	    this.secret = opts.secret;
	    this.shop = opts.shop;
	  }

	  _createClass(PrivateSession, [{
	    key: 'update',
	    value: function update(opts) {
	      (0, _lodash.merge)(this, opts);
	    }
	  }]);

	  return PrivateSession;
	}();

	var OAuthSession = exports.OAuthSession = function () {
	  function OAuthSession(opts) {
	    _classCallCheck(this, OAuthSession);

	    this.host = opts.host;
	    this.apiKey = opts.apiKey;
	    this.secret = opts.secret;
	    this.shop = opts.shop;
	    this.access_token = opts.access_token;
	    this.scopes = opts.scopes;
	  }

	  _createClass(OAuthSession, [{
	    key: 'update',
	    value: function update(opts) {
	      (0, _lodash.merge)(this, opts);
	    }
	  }]);

	  return OAuthSession;
	}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _client = __webpack_require__(2);

	var _client2 = _interopRequireDefault(_client);

	var _index = __webpack_require__(6);

	var resources = _interopRequireWildcard(_index);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ShopifyResources = function () {
	  function ShopifyResources(options) {
	    _classCallCheck(this, ShopifyResources);

	    this.defaults = {};

	    var opts = Object.assign({}, this.defaults, options);
	    if (!opts.session && !opts.client) {
	      throw new Error('Must provide a client or session.');
	    }

	    this.client = !opts.client ? new _client2.default({ session: opts.session }) : opts.client;

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
	      });
	    }
	  }]);

	  return ShopifyResources;
	}();

	exports.default = ShopifyResources;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var NotImplementedError = exports.NotImplementedError = function (_Error) {
	  _inherits(NotImplementedError, _Error);

	  function NotImplementedError() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, NotImplementedError);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(NotImplementedError)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.name = 'NotImplementedError', _this.message = 'Not implemented in this lib or Shopify.', _this.stack = new Error().stack, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return NotImplementedError;
	}(Error);

	var ArgumentError = exports.ArgumentError = function (_Error2) {
	  _inherits(ArgumentError, _Error2);

	  function ArgumentError() {
	    var _Object$getPrototypeO2;

	    var _temp2, _this2, _ret2;

	    _classCallCheck(this, ArgumentError);

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(ArgumentError)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.name = 'ArgumentError', _this2.message = 'Called with illegal arguments', _this2.stack = new Error().stack, _temp2), _possibleConstructorReturn(_this2, _ret2);
	  }

	  return ArgumentError;
	}(Error);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Webhooks = exports.Users = exports.Themes = exports.SmartCollections = exports.Shop = exports.Redirects = exports.RecurringApplicationCharges = exports.Products = exports.Policies = exports.Pages = exports.Orders = exports.OrderRisks = exports.Metafields = exports.Locations = exports.Images = exports.GiftCards = exports.FulfillmentServices = exports.Events = exports.Discounts = exports.Customers = exports.CustomerSavedSearches = exports.CustomCollections = exports.Countries = exports.Comments = exports.Collects = exports.Checkouts = exports.CarrierServices = exports.Blogs = exports.ApplicationCharges = undefined;

	var _applicationCharges = __webpack_require__(12);

	var _applicationCharges2 = _interopRequireDefault(_applicationCharges);

	var _blogs = __webpack_require__(13);

	var _blogs2 = _interopRequireDefault(_blogs);

	var _carrierServices = __webpack_require__(14);

	var _carrierServices2 = _interopRequireDefault(_carrierServices);

	var _checkouts = __webpack_require__(15);

	var _checkouts2 = _interopRequireDefault(_checkouts);

	var _collects = __webpack_require__(16);

	var _collects2 = _interopRequireDefault(_collects);

	var _comments = __webpack_require__(17);

	var _comments2 = _interopRequireDefault(_comments);

	var _countries = __webpack_require__(18);

	var _countries2 = _interopRequireDefault(_countries);

	var _customCollections = __webpack_require__(19);

	var _customCollections2 = _interopRequireDefault(_customCollections);

	var _customerSavedSearches = __webpack_require__(20);

	var _customerSavedSearches2 = _interopRequireDefault(_customerSavedSearches);

	var _customers = __webpack_require__(21);

	var _customers2 = _interopRequireDefault(_customers);

	var _discounts = __webpack_require__(22);

	var _discounts2 = _interopRequireDefault(_discounts);

	var _events = __webpack_require__(23);

	var _events2 = _interopRequireDefault(_events);

	var _fulfillmentServices = __webpack_require__(24);

	var _fulfillmentServices2 = _interopRequireDefault(_fulfillmentServices);

	var _giftCards = __webpack_require__(25);

	var _giftCards2 = _interopRequireDefault(_giftCards);

	var _images = __webpack_require__(26);

	var _images2 = _interopRequireDefault(_images);

	var _locations = __webpack_require__(28);

	var _locations2 = _interopRequireDefault(_locations);

	var _metafields = __webpack_require__(29);

	var _metafields2 = _interopRequireDefault(_metafields);

	var _orderRisks = __webpack_require__(30);

	var _orderRisks2 = _interopRequireDefault(_orderRisks);

	var _orders = __webpack_require__(31);

	var _orders2 = _interopRequireDefault(_orders);

	var _pages = __webpack_require__(32);

	var _pages2 = _interopRequireDefault(_pages);

	var _policies = __webpack_require__(33);

	var _policies2 = _interopRequireDefault(_policies);

	var _products = __webpack_require__(34);

	var _products2 = _interopRequireDefault(_products);

	var _recurringApplicationCharges = __webpack_require__(35);

	var _recurringApplicationCharges2 = _interopRequireDefault(_recurringApplicationCharges);

	var _redirects = __webpack_require__(36);

	var _redirects2 = _interopRequireDefault(_redirects);

	var _shop = __webpack_require__(37);

	var _shop2 = _interopRequireDefault(_shop);

	var _smartCollections = __webpack_require__(38);

	var _smartCollections2 = _interopRequireDefault(_smartCollections);

	var _themes = __webpack_require__(39);

	var _themes2 = _interopRequireDefault(_themes);

	var _users = __webpack_require__(40);

	var _users2 = _interopRequireDefault(_users);

	var _webhooks = __webpack_require__(41);

	var _webhooks2 = _interopRequireDefault(_webhooks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.ApplicationCharges = _applicationCharges2.default;
	exports.Blogs = _blogs2.default;
	exports.CarrierServices = _carrierServices2.default;
	exports.Checkouts = _checkouts2.default;
	exports.Collects = _collects2.default;
	exports.Comments = _comments2.default;
	exports.Countries = _countries2.default;
	exports.CustomCollections = _customCollections2.default;
	exports.CustomerSavedSearches = _customerSavedSearches2.default;
	exports.Customers = _customers2.default;
	exports.Discounts = _discounts2.default;
	exports.Events = _events2.default;
	exports.FulfillmentServices = _fulfillmentServices2.default;
	exports.GiftCards = _giftCards2.default;
	exports.Images = _images2.default;
	exports.Locations = _locations2.default;
	exports.Metafields = _metafields2.default;
	exports.OrderRisks = _orderRisks2.default;
	exports.Orders = _orders2.default;
	exports.Pages = _pages2.default;
	exports.Policies = _policies2.default;
	exports.Products = _products2.default;
	exports.RecurringApplicationCharges = _recurringApplicationCharges2.default;
	exports.Redirects = _redirects2.default;
	exports.Shop = _shop2.default;
	exports.SmartCollections = _smartCollections2.default;
	exports.Themes = _themes2.default;
	exports.Users = _users2.default;
	exports.Webhooks = _webhooks2.default;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.e = require("url");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _crypto = __webpack_require__(44);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _path = __webpack_require__(46);

	var _path2 = _interopRequireDefault(_path);

	var _url = __webpack_require__(7);

	var _url2 = _interopRequireDefault(_url);

	var _events = __webpack_require__(42);

	var _events2 = _interopRequireDefault(_events);

	var _client = __webpack_require__(2);

	var _client2 = _interopRequireDefault(_client);

	var _resources = __webpack_require__(4);

	var _resources2 = _interopRequireDefault(_resources);

	var _session = __webpack_require__(3);

	var _lodash = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var noop = function noop() {};

	var defaults = {
	  resources: true,
	  anonymousInstall: false,
	  autoInstall: true,
	  anonymousWebhooks: true,
	  applicationBase: '/',
	  applicationInstall: '/install',
	  applicationInstallCallback: '/install/callback',
	  routes: {
	    didInstall: '/'
	  },
	  webhooksBase: '/api/webhooks',
	  webhooks: ['app/uninstalled'],
	  scripts: [],
	  scriptsBase: '/',
	  willInstall: noop,
	  willUninstall: noop,
	  didInstall: noop,
	  didUninstall: noop
	};

	var ShopifyAuthMiddleware = function (_EventEmitter) {
	  _inherits(ShopifyAuthMiddleware, _EventEmitter);

	  function ShopifyAuthMiddleware(opts) {
	    _classCallCheck(this, ShopifyAuthMiddleware);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ShopifyAuthMiddleware).call(this));

	    _this.opts = (0, _lodash.merge)({}, defaults, opts);

	    // Merge doesn't merge arrays :P
	    if (opts.webhooks) {
	      _this.opts.webhooks = (0, _lodash.union)(defaults.webhooks, opts.webhooks);
	      _this.opts.scripts = (0, _lodash.union)(defaults.scripts, opts.scripts);
	    }

	    _this.on('app/uninstalled', _this.opts.didUninstall.bind(_this));
	    return _this;
	  }

	  _createClass(ShopifyAuthMiddleware, [{
	    key: 'callback',
	    value: function callback() {
	      return this.handler.bind(this);
	    }
	  }, {
	    key: 'handler',
	    value: function handler(req, res, next) {
	      var _this2 = this;

	      var o = this.opts;
	      var pUrl = req._parsedUrl;
	      var shop = req.query.shop;

	      var installing = (0, _lodash.startsWith)(pUrl.pathname, o.applicationInstall);
	      var installingCallback = (0, _lodash.startsWith)(pUrl.pathname, o.applicationInstallCallback);
	      var withinApp = (0, _lodash.startsWith)(pUrl.pathname, o.applicationBase);
	      var webhook = (0, _lodash.startsWith)(pUrl.pathname, o.webhooksBase);
	      var session = null;
	      var verified = false;

	      if (installing || installingCallback || withinApp || webhook) {

	        if (installing && o.anonymousInstall) {
	          verified = true;
	        }

	        if (webhook) {
	          var _ret = function () {
	            verified = _this2.verifyWebhookRequest(req);
	            var shop = req.headers['x-shopify-shop-domain'];
	            var topic = req.headers['x-shopify-topic'];
	            if (verified || o.anonymousWebhooks) {
	              if (req.query) {
	                req.query = {};
	              }
	              req.query.shop = shop;
	              o.willAuthenticate(req, res, function (tenant) {
	                _this2.emit(topic, tenant || { shop: shop }, req.body);
	              });
	              return {
	                v: res.sendStatus(201)
	              };
	            }
	            return {
	              v: res.sendStatus(401)
	            };
	          }();

	          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        }

	        if (!verified) {
	          verified = this.verifyRequest(req);
	        }

	        if (!verified) {
	          return res.sendStatus(401);
	        }

	        session = new _session.OAuthSession({
	          host: o.host,
	          apiKey: o.apiKey,
	          secret: o.secret,
	          shop: shop,
	          scopes: o.scopes
	        });

	        res.locals.client = new _client2.default({ session: session });

	        if (o.resources) {
	          res.locals.resources = new _resources2.default({ client: res.locals.client });
	        }

	        if (installingCallback) {
	          return this.installCallback(req, res, next);
	        }

	        if (installing) {
	          return this.install(req, res, next);
	        }

	        return o.willAuthenticate(req, res, function (tenant) {
	          if (!tenant || !tenant.access_token) {
	            if (o.autoInstall) {
	              return res.redirect(o.applicationInstall + pUrl.search);
	            }
	            return next();
	          }

	          session.update({
	            access_token: tenant.access_token
	          });

	          next();
	        });
	      }

	      next();
	    }
	  }, {
	    key: 'install',
	    value: function install(req, res, next) {
	      var o = this.opts;
	      var client = res.locals.client;
	      var shop = req.query.shop;

	      var _client$buildInstallU = client.buildInstallUrl(o.applicationInstallCallback, { noSuffix: true });

	      var uri = _client$buildInstallU.uri;
	      var nonce = _client$buildInstallU.nonce;


	      if (uri) {
	        return o.willInstall(shop, nonce, function (installed) {
	          if (installed === false) {
	            o.routes.error ? res.redirect(o.routes.error) : res.sendStatus(500);
	          } else {
	            res.redirect(uri);
	          }
	        });
	      }

	      next();
	    }
	  }, {
	    key: 'installCallback',
	    value: function installCallback(req, res, next) {
	      var _this3 = this;

	      var o = this.opts;
	      var client = res.locals.client;
	      var _req$query = req.query;
	      var shop = _req$query.shop;
	      var code = _req$query.code;
	      var state = _req$query.state;

	      o.willAuthenticate(req, res, function (tenant) {
	        if (tenant.nonce !== state) {
	          return res.sendStatus(401);
	        }
	        return client.getAccessToken(code).then(function (_ref) {
	          var access_token = _ref.access_token;

	          o.didInstall(shop, code, access_token, function () {
	            var query = req._parsedUrl.search;
	            var redirect = _this3.buildAppUrl(shop, o.routes.didInstall || o.applicationBase) + query;
	            res.redirect(redirect);
	          });
	          return null;
	        }).then(_this3.postInstall.bind(_this3, res, shop));
	      });
	    }
	  }, {
	    key: 'postInstall',
	    value: function postInstall(res, shop) {
	      var _this4 = this;

	      var o = this.opts;
	      var client = res.locals.client;


	      var webhooks = (0, _lodash.map)(o.webhooks, function (val, key) {
	        var topic = Array.isArray(o.webhooks) ? val : key;
	        var opts = Array.isArray(o.webhooks) ? {} : val;
	        var address = _this4.buildHostUrl(shop, o.webhooksBase + '/' + topic);
	        var payload = (0, _lodash.merge)({}, opts, { topic: topic, address: address });
	        return client.post('webhooks', { data: { webhook: payload } });
	      });

	      var scripts = (0, _lodash.map)(o.scripts, function (script) {
	        var src = _this4.buildHostUrl(shop, o.scriptsBase + script);
	        var event = 'onload';
	        var payload = { src: src, event: event };
	        return client.post('script_tags', { data: { script_tag: payload } });
	      });

	      var calls = [].concat(webhooks, scripts);

	      return Promise.all(calls);
	    }
	  }, {
	    key: 'buildAppUrl',
	    value: function buildAppUrl(shop, pathname) {
	      var handle = this.opts.listingHandle || this.opts.apiKey;
	      return _url2.default.format({
	        protocol: 'https',
	        host: shop,
	        pathname: '/admin/apps/' + handle + (pathname || '')
	      });
	    }
	  }, {
	    key: 'buildHostUrl',
	    value: function buildHostUrl(shop, pathname) {
	      return _url2.default.format({
	        protocol: 'https',
	        host: process.env.APP_HOST,
	        pathname: pathname
	      });
	    }
	  }, {
	    key: 'verifyWebhookRequest',
	    value: function verifyWebhookRequest(req) {
	      var hmac = req.headers['x-shopify-hmac-sha256'];
	      var hash = _crypto2.default.createHmac('sha256', this.opts.secret);
	      if (!req.rawBody) {
	        console.warn('Please install the `bodyParserVerify` function provided for webhook verification.');
	      }
	      hash.update(req.rawBody || '');
	      return hmac === hash.digest('base64');
	    }
	  }, {
	    key: 'verifyRequest',
	    value: function verifyRequest(req) {
	      var hmac = req.query.hmac;

	      var hash = _crypto2.default.createHmac('sha256', this.opts.secret);
	      var message = (0, _lodash.chain)(req.query).omit(['hmac', 'signature']).keys().sortBy() //alphabetical
	      .reduce(function (msg, key) {
	        if (msg.length) msg += '&';
	        msg += key + '=' + req.query[key].replace(/\%/g, '%25').replace(/\=/g, '%3D').replace(/\&/g, '%26');
	        return msg;
	      }, '').value();

	      hash.update(message);

	      return hmac === hash.digest('hex');
	    }
	  }, {
	    key: 'bodyParserVerify',
	    value: function bodyParserVerify(req, res, buf, encoding) {
	      req.rawBody = buf.toString();
	    }
	  }]);

	  return ShopifyAuthMiddleware;
	}(_events2.default);

	exports.default = ShopifyAuthMiddleware;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * A hierarchical token bucket for rate limiting. See
	 * http://en.wikipedia.org/wiki/Token_bucket for more information.
	 * @author John Hurliman <jhurliman@cull.tv>
	 * @private
	 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
	 *  Also known as the burst rate.
	 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
	 *  over the course of one interval.
	 * @param {String|Number} interval The interval length in milliseconds, or as
	 *  one of the following strings: 'second', 'minute', 'hour', day'.
	 */

	var Bucket = function () {
	  function Bucket() {
	    var bucketSize = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	    var tokensPerInterval = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
	    var interval = arguments[2];

	    _classCallCheck(this, Bucket);

	    this.lastDrip = +new Date();
	    this.content = bucketSize;
	    this.bucketSize = bucketSize;
	    this.tokensPerInterval = tokensPerInterval;

	    if (typeof interval === 'string') {
	      switch (interval) {
	        case 'sec':case 'second':
	          this.interval = 1000;break;
	        case 'min':case 'minute':
	          this.interval = 1000 * 60;break;
	        case 'hr':case 'hour':
	          this.interval = 1000 * 60 * 60;break;
	        case 'day':
	          this.interval = 1000 * 60 * 60 * 24;break;
	      }
	    } else {
	      this.interval = interval;
	    }
	  }

	  /**
	   * Add any new tokens to the bucket since the last drip.
	   * @returns {Boolean} True if new tokens were added, otherwise false.
	   */


	  _createClass(Bucket, [{
	    key: 'drip',
	    value: function drip() {
	      if (!this.tokensPerInterval) {
	        this.content = this.bucketSize;
	        return;
	      }

	      var now = +new Date();
	      var deltaMS = Math.max(now - this.lastDrip, 0);
	      this.lastDrip = now;

	      var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
	      this.content = Math.min(this.content + dripAmount, this.bucketSize);
	    }

	    /**
	     * Remove the requested number of tokens and fire the given callback. If the
	     * bucket (and any parent buckets) contains enough tokens this will happen
	     * immediately. Otherwise, the removal and callback will happen when enough
	     * tokens become available.
	     * @param {Number} count The number of tokens to remove.
	     * @returns {Boolean} True if transaction has been accepted, false otherwise
	     */

	  }, {
	    key: 'request',
	    value: function request(count) {

	      // Is this an infinite size bucket?
	      if (!this.bucketSize) {
	        return true;
	      }

	      // Make sure the bucket can hold the requested number of tokens
	      if (count > this.bucketSize) {
	        return false;
	      }

	      // Drip new tokens into this bucket
	      this.drip();

	      // If we don't have enough tokens in this bucket, do nothing
	      if (count > this.content) {
	        return false;
	      }

	      // Remove the requested tokens from this bucket
	      this.content -= count;
	      return true;
	    }
	  }]);

	  return Bucket;
	}();

	exports.default = Bucket;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _client = __webpack_require__(2);

	Object.defineProperty(exports, 'ShopifyClient', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_client).default;
	  }
	});

	var _resources = __webpack_require__(4);

	Object.defineProperty(exports, 'ShopifyResources', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_resources).default;
	  }
	});

	var _middleware = __webpack_require__(8);

	Object.defineProperty(exports, 'ShopifyAuthMiddleware', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_middleware).default;
	  }
	});

	var _session = __webpack_require__(3);

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _async = __webpack_require__(43);

	var _async2 = _interopRequireDefault(_async);

	var _bucket = __webpack_require__(9);

	var _bucket2 = _interopRequireDefault(_bucket);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @private
	 */

	var RateLimiter = function () {
	  function RateLimiter() {
	    _classCallCheck(this, RateLimiter);

	    this.bucket = new _bucket2.default(RateLimiter.BURST_RATE, RateLimiter.FILL_RATE, 'second');
	    this.queue = _async2.default.priorityQueue(this.worker.bind(this), RateLimiter.BURST_RATE);
	  }

	  _createClass(RateLimiter, [{
	    key: 'push',
	    value: function push() {
	      var _queue;

	      return (_queue = this.queue).push.apply(_queue, arguments);
	    }
	  }, {
	    key: 'worker',
	    value: function worker(req, callback) {
	      var _this = this;

	      RateLimiter.request(1, req, this.bucket, function (err, res) {
	        var conc = Math.floor(_this.bucket.content);
	        _this.queue.concurrency = conc >= 1 ? conc : 1;
	        callback(err, res);
	      });
	    }

	    /**
	     * Recursive fn for requesting a token as soon as it's available
	     * @param n
	     * @param req
	     * @param bucket
	     * @param cb
	     * @returns {*}
	     */

	  }], [{
	    key: 'request',
	    value: function request(n, req, bucket, cb) {
	      if (bucket.request(n)) {
	        req.end(cb);
	        return;
	      }
	      setTimeout(function () {
	        RateLimiter.request(n, req, bucket, cb);
	      }, 20);
	    }
	  }]);

	  return RateLimiter;
	}();

	RateLimiter.BURST_RATE = 40;
	RateLimiter.FILL_RATE = 2;
	exports.default = RateLimiter;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ApplicationChargesResource = function (_Resource) {
	  _inherits(ApplicationChargesResource, _Resource);

	  function ApplicationChargesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ApplicationChargesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ApplicationChargesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'application_charges', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return ApplicationChargesResource;
	}(_base2.default);

	exports.default = ApplicationChargesResource;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BlogResource = function (_Resource) {
	  _inherits(BlogResource, _Resource);

	  function BlogResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, BlogResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(BlogResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'blogs', _this.subResources = ['articles'], _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return BlogResource;
	}(_base2.default);

	exports.default = BlogResource;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CarrierServicesResource = function (_Resource) {
	  _inherits(CarrierServicesResource, _Resource);

	  function CarrierServicesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CarrierServicesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CarrierServicesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'carrier_services', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CarrierServicesResource;
	}(_base2.default);

	exports.default = CarrierServicesResource;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	var _errors = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CheckoutResource = function (_Resource) {
	  _inherits(CheckoutResource, _Resource);

	  function CheckoutResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CheckoutResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CheckoutResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'checkouts', _temp), _possibleConstructorReturn(_this, _ret);
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
	}(_base2.default);

	exports.default = CheckoutResource;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CollectsResource = function (_Resource) {
	  _inherits(CollectsResource, _Resource);

	  function CollectsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CollectsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CollectsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'collects', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CollectsResource;
	}(_base2.default);

	exports.default = CollectsResource;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	var _errors = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CommentsResource = function (_Resource) {
	  _inherits(CommentsResource, _Resource);

	  function CommentsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CommentsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CommentsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'comments', _temp), _possibleConstructorReturn(_this, _ret);
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
	}(_base2.default);

	exports.default = CommentsResource;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CountriesResource = function (_Resource) {
	  _inherits(CountriesResource, _Resource);

	  function CountriesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CountriesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CountriesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'countries', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CountriesResource;
	}(_base2.default);

	exports.default = CountriesResource;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CustomCollectionsResource = function (_Resource) {
	  _inherits(CustomCollectionsResource, _Resource);

	  function CustomCollectionsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CustomCollectionsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CustomCollectionsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'custom_collections', _this.subResources = ['products', 'metafields'], _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CustomCollectionsResource;
	}(_base2.default);

	exports.default = CustomCollectionsResource;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CustomerSavedSearchesResource = function (_Resource) {
	  _inherits(CustomerSavedSearchesResource, _Resource);

	  function CustomerSavedSearchesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CustomerSavedSearchesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CustomerSavedSearchesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'customer_saved_searches', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CustomerSavedSearchesResource;
	}(_base2.default);

	exports.default = CustomerSavedSearchesResource;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CustomersResource = function (_Resource) {
	  _inherits(CustomersResource, _Resource);

	  function CustomersResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, CustomersResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(CustomersResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'customers', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return CustomersResource;
	}(_base2.default);

	exports.default = CustomersResource;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DiscountsResource = function (_Resource) {
	  _inherits(DiscountsResource, _Resource);

	  function DiscountsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, DiscountsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(DiscountsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'discounts', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return DiscountsResource;
	}(_base2.default);

	exports.default = DiscountsResource;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EventsResource = function (_Resource) {
	  _inherits(EventsResource, _Resource);

	  function EventsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, EventsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EventsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'events', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return EventsResource;
	}(_base2.default);

	exports.default = EventsResource;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FulfillmentServicesResource = function (_Resource) {
	  _inherits(FulfillmentServicesResource, _Resource);

	  function FulfillmentServicesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, FulfillmentServicesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(FulfillmentServicesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'fulfillment_services', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return FulfillmentServicesResource;
	}(_base2.default);

	exports.default = FulfillmentServicesResource;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var GiftCardsResource = function (_Resource) {
	  _inherits(GiftCardsResource, _Resource);

	  function GiftCardsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, GiftCardsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(GiftCardsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'gift_cards', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return GiftCardsResource;
	}(_base2.default);

	exports.default = GiftCardsResource;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ImagesResource = function (_Resource) {
	  _inherits(ImagesResource, _Resource);

	  function ImagesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ImagesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ImagesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'images', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return ImagesResource;
	}(_base2.default);

	exports.default = ImagesResource;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(6);

	var resources = _interopRequireWildcard(_index);

	var _lodash = __webpack_require__(1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Instance = function () {
	  function Instance(data, parent) {
	    _classCallCheck(this, Instance);

	    this.attrs = data;
	    this.parent = parent;
	    this.client = parent.client;
	    this._buildSubResources();
	  }

	  _createClass(Instance, [{
	    key: '_getProperName',
	    value: function _getProperName(resource) {
	      return (0, _lodash.capitalize)((0, _lodash.camelCase)(resource));
	    }
	  }, {
	    key: '_buildSubResources',
	    value: function _buildSubResources() {
	      if (this.parent.subResources && !this.isNew()) {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = this.parent.subResources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var resource = _step.value;

	            this[this._getProperName(resource)] = this._buildResource(resource);
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: '_buildResource',
	    value: function _buildResource(resource) {
	      var Resource = resources[this._getProperName(resource)];
	      var opts = this.parent.opts;
	      opts.resourcePrefix = this.parent.resourceName + '/' + this.get('id');
	      return new Resource(opts);
	    }
	  }, {
	    key: '_mergeAttrs',
	    value: function _mergeAttrs(resource) {
	      this.attrs = (0, _lodash.merge)(this.attrs, resource);
	      return this;
	    }
	  }, {
	    key: 'get',
	    value: function get(key) {
	      return this.attrs[key] || undefined;
	    }
	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      return this.attrs[key] = value;
	    }
	  }, {
	    key: 'reload',
	    value: function reload() {
	      return this.load();
	    }
	  }, {
	    key: 'load',
	    value: function load() {
	      var id = !this.parent.singular ? this.get('id') : null;
	      return this.parent.findOne(id, { bare: true }).then(this._mergeAttrs.bind(this));
	    }
	  }, {
	    key: 'isNew',
	    value: function isNew() {
	      return !this.get('id');
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      if (this.isNew()) {
	        return this.parent.create(this.attrs, { bare: true }).then(this._mergeAttrs.bind(this));
	      } else {
	        return this.parent.update(null, this.attrs, { bare: true }).then(this._mergeAttrs.bind(this));
	      }
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      return this.parent.remove(this.get('id'));
	    }
	  }, {
	    key: 'toObject',
	    value: function toObject() {
	      return this.attrs;
	    }
	  }, {
	    key: 'toJSON',
	    value: function toJSON() {
	      return this.toObject();
	    }
	  }]);

	  return Instance;
	}();

	exports.default = Instance;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LocationsResource = function (_Resource) {
	  _inherits(LocationsResource, _Resource);

	  function LocationsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, LocationsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(LocationsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'locations', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return LocationsResource;
	}(_base2.default);

	exports.default = LocationsResource;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MetafieldsResource = function (_Resource) {
	  _inherits(MetafieldsResource, _Resource);

	  function MetafieldsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, MetafieldsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MetafieldsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'metafields', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return MetafieldsResource;
	}(_base2.default);

	exports.default = MetafieldsResource;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OrderRisksResource = function (_Resource) {
	  _inherits(OrderRisksResource, _Resource);

	  function OrderRisksResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, OrderRisksResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(OrderRisksResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'order_risks', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return OrderRisksResource;
	}(_base2.default);

	exports.default = OrderRisksResource;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OrdersResource = function (_Resource) {
	  _inherits(OrdersResource, _Resource);

	  function OrdersResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, OrdersResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(OrdersResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'orders', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return OrdersResource;
	}(_base2.default);

	exports.default = OrdersResource;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PagesResource = function (_Resource) {
	  _inherits(PagesResource, _Resource);

	  function PagesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, PagesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PagesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'pages', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return PagesResource;
	}(_base2.default);

	exports.default = PagesResource;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PoliciesResource = function (_Resource) {
	  _inherits(PoliciesResource, _Resource);

	  function PoliciesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, PoliciesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PoliciesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'policies', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return PoliciesResource;
	}(_base2.default);

	exports.default = PoliciesResource;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ProductResource = function (_Resource) {
	  _inherits(ProductResource, _Resource);

	  function ProductResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ProductResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ProductResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'products', _this.subResources = ['metafields', 'images'], _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return ProductResource;
	}(_base2.default);

	exports.default = ProductResource;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RecurringApplicationChargesResource = function (_Resource) {
	  _inherits(RecurringApplicationChargesResource, _Resource);

	  function RecurringApplicationChargesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, RecurringApplicationChargesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(RecurringApplicationChargesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'recurring_application_charges', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return RecurringApplicationChargesResource;
	}(_base2.default);

	exports.default = RecurringApplicationChargesResource;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var RedirectsResource = function (_Resource) {
	  _inherits(RedirectsResource, _Resource);

	  function RedirectsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, RedirectsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(RedirectsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'redirects', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return RedirectsResource;
	}(_base2.default);

	exports.default = RedirectsResource;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ShopResource = function (_Resource) {
	  _inherits(ShopResource, _Resource);

	  function ShopResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ShopResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ShopResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.singular = true, _this.resourceName = 'shop', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(ShopResource, [{
	    key: 'load',
	    value: function load() {
	      return this.findOne();
	    }
	  }]);

	  return ShopResource;
	}(_base2.default);

	exports.default = ShopResource;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SmartCollectionsResource = function (_Resource) {
	  _inherits(SmartCollectionsResource, _Resource);

	  function SmartCollectionsResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, SmartCollectionsResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(SmartCollectionsResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.metafields = true, _this.resourceName = 'smart_collections', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return SmartCollectionsResource;
	}(_base2.default);

	exports.default = SmartCollectionsResource;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ThemesResource = function (_Resource) {
	  _inherits(ThemesResource, _Resource);

	  function ThemesResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ThemesResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(ThemesResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'themes', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return ThemesResource;
	}(_base2.default);

	exports.default = ThemesResource;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UsersResource = function (_Resource) {
	  _inherits(UsersResource, _Resource);

	  function UsersResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, UsersResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(UsersResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'users', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return UsersResource;
	}(_base2.default);

	exports.default = UsersResource;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(0);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WebhooksResource = function (_Resource) {
	  _inherits(WebhooksResource, _Resource);

	  function WebhooksResource() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, WebhooksResource);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(WebhooksResource)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.resourceName = 'webhooks', _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  return WebhooksResource;
	}(_base2.default);

	exports.default = WebhooksResource;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.e = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.e = require("async");

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.e = require("crypto");

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.e = require("inflection");

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.e = require("path");

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.e = require("superagent");

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.e = require("uuid");

/***/ }
/******/ ])));