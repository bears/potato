'use strict';

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

	/**
	 * Domain of the service provider.
	 */
	var AJAJ_DOMAIN = '//ajaj.' + location.hostname + '/';

	/**
	 * Namespace of all global variables of this project.
	 */
	window.POTATO = {
		get : function(url, callback) {
			$.get(AJAJ_DOMAIN + url, null, callback, 'json');
		},

		post : function(url, data, callback) {
			$.post(AJAJ_DOMAIN + url, data, callback, 'json');
		}
	};

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

	// Update profile from server.
	POTATO.post('!/profile', version, function(update) {
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
				POTATO.post('!/error', {
					error : error,
					line : line,
					url : url
				});
				return true;
			};
		}

		// Load CSS/JS of next stage.
		var sign = POTATO.PROFILE.CODE.SIGN;
		var l10n = POTATO.PROFILE.USER.L10N;
		$('#potato-css').attr('href', 'css/potato' + sign['potato.css'] + '.css');
		$('#potato-js').attr('src', 'js/potato' + sign['potato.js'] + '.js');
		$('#potato-l10n').attr('src', 'js/l10n/' + l10n + sign[l10n] + '.js');
	});
})();
