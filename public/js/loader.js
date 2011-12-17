'use strict';

/**
 * Load profile to determine the next stage.
 */
(function() {
	/**
	 * Namespace of all global variables of this project.
	 */
	window.POTATO = {};

	/**
	 * Domain of the service provider.
	 */
	Object.defineProperty(POTATO, 'AJAJ_DOMAIN', {
		value : '//ajaj.' + location.hostname + '/'
	});

	// Let cross domain requests bring cookies.
	$.ajaxSetup({
		xhrFields : {
			withCredentials : true
		}
	});

	// Cache configurations.
	var CACHE_KEY = 'PROFILE';
	var STORAGES = {
		CODE : localStorage,
		USER : sessionStorage
	};

	// Try fill profile from local cache.
	var profile = {};
	var version = {};
	for (var i in STORAGES) {
		profile[i] = JSON.parse(STORAGES[i].getItem(CACHE_KEY) || '{}');
		version[i] = profile[i].LOCK;
	}

	// Get profile to determine prefix.
	$.post(POTATO.AJAJ_DOMAIN + '!/profile', version, function(update) {
		// Fill & cache profile.
		for (var i in STORAGES) {
			if (version[i] != update[i].LOCK) {
				profile[i] = update[i];
				STORAGES[i].clear();
				STORAGES[i].setItem(CACHE_KEY, JSON.stringify(profile[i]));
			}
		}
		POTATO.PROFILE = profile;

		// Report client error to server.
		if ( POTATO.PROFILE.CODE.RECLAIM ) {
			window.onerror = function(error, url, line) {
				$.post(POTATO.AJAJ_DOMAIN + '!/error', {
					error : error,
					line : line,
					url : url
				});
				return true;
			};
		}

		// Go to next stage.
		launch();
	}, 'json');

	/**
	 * Load JS/CSS of next stage.
	 */
	function launch() {
		var sign = POTATO.PROFILE.CODE.SIGN || {
			js : '',
			css : ''
		};

		// Load main JavaScript.
		var script = document.createElement('script');
		script.src = 'js/potato' + sign.js +'.js';
		document.head.appendChild(script);

		// Load main CSS.
		var link = document.createElement('link');
		link.href = 'css/potato' + sign.css +'.css';
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	}
})();
