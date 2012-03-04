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
		 * Incompatible JS helper.
		 */
		queue : {
			/**
			 * Pending files.
			 */
			tasks : [],

			/**
			 * Load incompatible JS file.
			 * @param url {String}
			 * @param id {String}
			 */
			push : function(url, id) {
				load.queue.tasks.push({
					id : id,
					url : url
				});
				load.queue.pending || load.queue.next();
			},

			/**
			 * Load next JS file.
			 * @param id {String}
			 */
			next : function(id) {
				undefined !== id && POTATO.provide(id);

				var next = load.queue.tasks.pop();
				if (undefined !== next) {
					load.queue.pending = true;
					load.js(next.url, function() {
						load.queue.next(next.id);
					});
				}
				else {
					load.queue.pending = false;
				}
			}
		},

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
					var bind = POTATO.SETTING.BIND[POTATO.SETTING.PATH[id]];
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
				var url = POTATO.SETTING.PATH[id];
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
						load.queue.push(url, id);
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
	 * Origin of the service provider.
	 */
	var AJAJ_ORIGIN = location.protocol + '//potato.major.home';

	/**
	 * Ajaj request callback pool.
	 */
	var ajaj_pool = {};

	/**
	 * Receive proxy request from parent.
	 */
	window.addEventListener('message', function(event) {
		if (AJAJ_ORIGIN === event.origin) {
			var pass = JSON.parse(event.data);
			if (pass.tick in ajaj_pool) {
				try {
					ajaj_pool[pass.tick](JSON.parse(pass.data));
				}
				finally {
					delete ajaj_pool[pass.tick];
				}
			}
		}
	});

	/**
	 * Asynchronous JavaScript Access JSON.
	 * @param method {String} "get" or "post"
	 * @param url {String} without domain
	 * @param callback {Function} with one parameter in JSON
	 * @param data {Object} send to server
	 */
	function ajaj(method, url, callback, data) {
		var tick = Date.now() + Math.random();
		if ('function' === typeof callback) {
			ajaj_pool[tick] = callback;
		}
		window.parent.postMessage(JSON.stringify({
			tick : tick,
			method : method,
			url : url,
			data : data
		}), AJAJ_ORIGIN);
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
		var CACHE_KEY = 'setting';
		POTATO.SETTING = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
		var lock = location.search.substring(1);
		if (POTATO.SETTING.LOCK === lock) {
			ready(updateSetting);
		}
		else {
			load.js('potato' + lock, function() {
				var path = POTATO.SETTING.PATH;
				var bind = {};
				for (var i in path) {
					var url = path[i];
					if (!(url in bind)) {
						bind[url] = {};
					}
					bind[url][i] = true;
				}
				POTATO.SETTING.BIND = bind;
				POTATO.SETTING.LOCK = lock;
				localStorage.clear();
				localStorage.setItem(CACHE_KEY, JSON.stringify(POTATO.SETTING));
				ready(updateSetting);
			});
		}
	}

	/**
	 * Fetch & cache profile.
	 */
	function updateProfile() {
		var CACHE_KEY = 'profile';
		POTATO.PROFILE = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
		POTATO.post('!/profile', POTATO.PROFILE.LOCK, function(update) {
			if (POTATO.PROFILE.LOCK !== update.LOCK) {
				POTATO.PROFILE = update;
				sessionStorage.clear();
				sessionStorage.setItem(CACHE_KEY, JSON.stringify(POTATO.PROFILE));
			}
			ready(updateProfile);
		});
	}

	/**
	 * Setting or profile has ready.
	 * @param source {Function}
	 */
	function ready(source) {
		source.done = true;
		if (updateSetting.done && updateProfile.done) {
			POTATO.SETTING.LOAD.push('l10n/' + POTATO.PROFILE.L10N);
			POTATO.require(POTATO.SETTING.LOAD, function() {
				POTATO.render();
			});
		}
	}

	// Start load chain.
	if (window.parent !== window) {
		setTimeout(updateSetting, 1);
		setTimeout(updateProfile, 1);
	}
})();
