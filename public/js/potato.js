/**
 * Namespace of all global variables.
 */
var POTATO = {
	/**
	 * Notify type enumerations.
	 */
	NOTIFY : {
		// Data
		INSERT : 'INSERT',
		UPDATE : 'UPDATE',
		DELETE : 'DELETE',
		// Operation
		ATTACH : 'ATTACH',
		DETACH : 'DETACH'
	},

	/**
	 * Static initializers.
	 */
	INITIAL : []
};

/**
 * Initialize application.
 */
$(function() {
	$.getJSON(POTATO.AJAJ_DOMAIN + 'profile', function(profile) {
		POTATO.PROFILE = profile;

		/**
		 * Default error handler.
		 * @param error {String}
		 * @param url {Url}
		 * @param line {Number}
		 */
		window.onerror = function(error, url, line) {
			if ( POTATO.PROFILE.reclaim ) {
				$.post(POTATO.AJAJ_DOMAIN + 'error', {
					error : error,
					line : line,
					url : url
				});
				return true;
			}
		};

		// Let cross domain requests bring cookies.
		$.ajaxSetup({
			xhrFields : {
				withCredentials : true
			}
		});

		// Save the original page template.
		POTATO.TEMPLATE = $('body').html();

		/**
		 * Render the page by cached template.
		 */
		POTATO.renderPage = function() {
			// Localize
			var locale = POTATO.L10N[POTATO.PROFILE.locale];
			$('title').text(locale.title);
			$('body').html(POTATO.TEMPLATE.replace(/{%(\w+)%}/g, function(unused, key) {
				return locale[key]
			})).removeClass('ui-helper-hidden');
			$('#version').text(POTATO.PROFILE.version);

			// Logo event
			$('#menu_home').click(function() {
				location = location.protocol + '//' + location.host + '/'
			});

			// Right side panel
			$('#calendar').datepicker();

			// Run initial routes
			$.each(POTATO.INITIAL, function() {
				return this.call();
			});

			// Search
			$('#search').submit(function() {
				$('#search_target').blur().val('');
				return false;
			});
		};

		// Render page at 1st time.
		POTATO.renderPage();
	});
});
