'use strict';

/**
 * Namespace of all global variables of this project.
 */
var POTATO = {
	/**
	 * Domain of the service provider.
	 */
	get AJAJ_DOMAIN() {
		return location.protocol + '//ajaj.' + location.hostname + location.pathname;
	},

	/**
	 * Localization of current locale.
	 */
	get LOCALE() {
		return POTATO.L10N[POTATO.PROFILE.USER.LOCALE];
	},

	/**
	 * UUID for singleton.
	 */
	get SINGLETON() {
		return '00000000-0000-0000-0000-000000000000';
	},

	/**
	 * Localization dictionary.
	 */
	L10N : {},

	/**
	 * Settings for both code and user.
	 */
	PROFILE : {}
};

/**
 * Load profile to determine the next stage.
 */
(function() {
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
	var previous = {};
	for (var i in STORAGES) {
		POTATO.PROFILE[i] = JSON.parse(STORAGES[i].getItem(CACHE_KEY) || '{}');
		previous[i] = POTATO.PROFILE[i].LOCK;
	}

	// Get profile to determine prefix.
	$.post(POTATO.AJAJ_DOMAIN + '!/profile', previous, function(profile) {
		// Fill & cache profile.
		for (var i in STORAGES) {
			if (previous[i] != profile[i].LOCK) {
				POTATO.PROFILE[i] = profile[i];
				STORAGES[i].clear();
				STORAGES[i].setItem(CACHE_KEY, JSON.stringify(profile[i]));
			}
		}

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
