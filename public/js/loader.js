'use strict';

/**
 * Namespace of all global variables of this project.
 */
var POTATO = {
	/**
	 * Domain of the service provider.
	 */
	get AJAJ_DOMAIN() {
		return location.protocol + '//ajaj.bears.home/';
	},

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
		for (var i in STORAGES) {
			if (previous[i] != profile[i].LOCK) {
				POTATO.PROFILE[i] = profile[i];
				STORAGES[i].setItem(CACHE_KEY, JSON.stringify(profile[i]));
			}
		}

		launch();
	}, 'json');

	/**
	 * Load JS/CSS of next stage.
	 */
	function launch() {
		var prefix = undefined != POTATO.PROFILE.CODE.VERSION ? POTATO.PROFILE.CODE.VERSION + '/' : '';

		// Load main JavaScript.
		var script = document.createElement('script');
		script.src = prefix + 'js/potato.js';
		document.head.appendChild(script);

		// Load main CSS.
		var link = document.createElement('link');
		link.href = prefix + 'css/potato.css';
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	}
})();
