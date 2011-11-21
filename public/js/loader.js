/**
 * Namespace of all global variables of this project.
 */
var POTATO = {
	/**
	 * Domain of the service provider.
	 */
	AJAJ_DOMAIN : location.protocol + '//ajaj.bears.home/',

	/**
	 * Static initializers.
	 */
	INITIAL : []
};

/**
 * Load other JS/CSS files.
 */
(function() {
	/**
	 * Load a JavaScript file.
	 * @param path {String}
	 * @param onload {Function} optional
	 */
	function loadJs(path, onload) {
		var script = document.createElement('script');
		script.src = 'js/' + path + '.js';
		('function' == typeof onload) && (script.onload = onload);
		document.head.appendChild(script);
	}

	/**
	 * Load a CSS file.
	 * @param path {String}
	 */
	function loadCss(path) {
		var script = document.createElement('link');
		script.href = 'css/' + path + '.css';
		script.rel = 'stylesheet';
		document.head.appendChild(script);
	}

	/**
	 * Load all files.
	 * @param prefix {String}
	 */
	function loadAll(prefix) {
		prefix = prefix || '';
		loadJs(prefix + 'global', function() {
			$.each(POTATO.LOAD.JS, function() {
				loadJs(prefix + this);
			});
			$.each(POTATO.LOAD.CSS, function() {
				loadCss(prefix + this);
			});
		});
	}

	// Let cross domain requests bring cookies.
	$.ajaxSetup({
		xhrFields : {
			withCredentials : true
		}
	});

	// Get profile to determine prefix.
	$.getJSON(POTATO.AJAJ_DOMAIN + 'profile', function(profile) {
		POTATO.PROFILE = profile;
		loadAll(/*profile.g.v*/);
	});
})();
