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
	 * Part of the path for loading static resources.
	 */
	get LOAD_PREFIX() {
		return undefined != POTATO.PROFILE.CODE.VERSION ? POTATO.PROFILE.CODE.VERSION + '/' : '';
	},

	/**
	 * Localization of current locale.
	 */
	get LOCALE() {
		return POTATO.L10N[POTATO.PROFILE.USER.LOCALE];
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
	$.post(POTATO.AJAJ_DOMAIN + 'profile', previous, function(profile) {
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
				$.post(POTATO.AJAJ_DOMAIN + 'error', {
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
		// Load main JavaScript.
		var script = document.createElement('script');
		script.src = POTATO.LOAD_PREFIX + 'js/potato.js';
		document.head.appendChild(script);

		// Load main CSS.
		var link = document.createElement('link');
		link.href = POTATO.LOAD_PREFIX + 'css/potato.css';
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	}
})();
