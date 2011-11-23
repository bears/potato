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
	}
};

/**
 * Load main JS/CSS files.
 */
(function() {
	// Let cross domain requests bring cookies.
	$.ajaxSetup({
		xhrFields : {
			withCredentials : true
		}
	});

	// Get profile to determine prefix.
	$.getJSON(POTATO.AJAJ_DOMAIN + 'profile', function(profile) {
		POTATO.PROFILE = profile;
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
	});
})();
