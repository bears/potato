'use strict';

/**
 * Load profile to determine the next stage.
 */
(function() {
	/**
	 * Asynchronous load helper.
	 */
	var load = {
		/**
		 * Module list.
		 */
		module : {},

		/**
		 * Load HTML file.
		 * @param url {String}
		 * @param onload {Function}
		 */
		html : function(url, onload) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', 'html/' + url + '.html');
			xhr.onload = onload;
			xhr.send();
		},

		/**
		 * Load CSS file.
		 * @param url {String}
		 */
		css : function(url) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'css/' + url + '.css';
			document.head.appendChild(link);
		},

		/**
		 * Load JS file.
		 * @param url {String}
		 * @param onload {Function}
		 */
		js : function(url, onload) {
			var script = document.createElement('script');
			script.onload = onload;
			script.src = 'js/' + url + '.js';
			document.head.appendChild(script);
		},

		/**
		 * Add observer to modules.
		 * @param ids {Object}
		 * @param notify {Function}
		 */
		listen : function(ids, notify) {
			for (var id in ids) {
				if (id in load.module) {
					if (load.module[id].status) {
						delete ids[id];
						continue;
					}
					else {
						ids[id] = true;
					}
				}
				else {
					var bind = POTATO.BIND[POTATO.PATH[id]];
					for (var i in bind) {
						load.module[i] = {
							status : false,
							listen : []
						}
					}
				}
				load.module[id].listen.push(notify);
			}
		},

		/**
		 * Load a batch of files.
		 * @param ids {Object}
		 */
		batch : function(ids) {
			for (var id in ids) {
				if (ids[id]) {
					// Skip duplicated load.
					continue;
				}
				var url = POTATO.PATH[id];
				switch (id.substring(0, id.indexOf('!'))) {
					case 'html':
						load.html(url, function() {
							var match;
							var knife = /(<!-- #(\w+)# -->)([\s\S]*)\1/g;
							while (match = knife.exec(this.responseText)) {
								POTATO.TEMPLATE[match[2]] = match[3];
								POTATO.provide('html!' + match[2]);
							}
						});
						break;
					case 'css':
						load.css(url);
						POTATO.provide(id);
						break;
					case 'js':
						// Incompatible JavaScript.
						(function(id) {
							load.js(url, function() {
								POTATO.provide(id);
							});
						})(id);
						break;
					default:
						// Compatible JavaScript.
						load.js(url);
						break;
				}
			}
		}
	};

	/**
	 * Domain of the service provider.
	 */
	var AJAJ_DOMAIN = '//ajaj.' + location.hostname + '/';

	/**
	 * Cross domain request handler.
	 */
	if ('object' !== typeof XDomainRequest) {
		window.XDomainRequest = function() {
			var self = new XMLHttpRequest();
			self.withCredentials = true;
			return self;
		}
	}

	/**
	 * Asynchronous JavaScript Access JSON.
	 * @param method {String} "get" or "post"
	 * @param url {String} without domain
	 * @param callback {Function} with one parameter in JSON
	 * @param data {Object} send to server
	 */
	function ajaj(method, url, callback, data) {
		var xdr = new XDomainRequest();
		xdr.open(method, AJAJ_DOMAIN + url);
		xdr.onload = function() {
			callback(JSON.parse(xdr.responseText));
		};
		xdr.send(data);
	}

	/**
	 * Namespace of all global variables of this project.
	 */
	window.POTATO = {
		/// @see ajaj()
		get : function(url, callback) {
			ajaj('get', url, callback);
		},

		/// @see ajaj()
		post : function(url, data, callback) {
			ajaj('post', url, callback, data);
		},

		/**
		 * Announce a module has been loaded.
		 * @param id {String}
		 */
		provide : function(id) {
			if (id in load.module) {
				var task = load.module[id];
				task.status = true;
				for (var i in task.listen) {
					task.listen[i](id);
				}
				delete task.listen;
			}
			else {
				load.module[id] = {
					status : true
				};
			}
		},

		/**
		 * Require other modules to be loaded.
		 * @param ids {Array}
		 * @param callback {Function}
		 */
		require : function(ids, callback) {
			if (0 === ids.length) {
				return callback();
			}
			var map = {};
			for (var i in ids) {
				map[ids[i]] = false;
			}
			load.listen(map, function(id) {
				delete map[id];
				for (var empty in map) {
					return;
				}
				callback();
			});
			for (var empty in map) {
				return load.batch(map);
			}
			callback();
		},

		/**
		 * Define a module.
		 * @param id {String}
		 * @param requires {Array}
		 * @param factory {Function}
		 */
		module : function(id, requires, factory) {
			POTATO.require(requires, function() {
				factory();
				POTATO.provide(id);
			});
		},

		/**
		 * HTML templates
		 */
		TEMPLATE : {}
	};

	/**
	 * Report client error to server.
	 */
	window.onerror = function(error, url, line) {
		POTATO.post('!/error', {
			error : error,
			line : line,
			url : url
		});
		return true;
	};

	/**
	 * Fetch & cache setting.
	 */
	function updateSetting() {
		load.js('potato' + POTATO.PROFILE.sign, function() {
			var path = POTATO.PATH;
			var bind = {};
			for (var i in path) {
				var url = path[i];
				if (!(url in bind)) {
					bind[url] = {};
				}
				bind[url][i] = true;
			}
			POTATO.BIND = bind;

			POTATO.LOAD.push('l10n/' + POTATO.PROFILE.l10n);
			POTATO.require(POTATO.LOAD, function() {
				POTATO.render();
			});
		});
	}

	/**
	 * Fetch & cache profile.
	 */
	function updateProfile() {
		var CACHE_KEY = 'profile';
		var cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
		POTATO.post('!/profile', cache.lock, function(update) {
			if (cache.lock !== update.lock) {
				cache = update;
				sessionStorage.clear();
				sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
			}
			POTATO.PROFILE = cache;
			updateSetting();
		});
	}

	// Start load chain.
	updateProfile();
})();
