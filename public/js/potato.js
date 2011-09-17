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
	INITIAL : [],

	/**
	 * Replace parameters in a template.
	 * @param template {String} HTML
	 * @param lookup {Object}
	 */
	replace : function(template, lookup) {
		return template.replace(/{%(\w+)%}/g, function(unused, key) {
			return lookup[key];
		});
	}
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
		(POTATO.renderPage = function() {
			var page = $('body').addClass('ui-helper-hidden');

			// Localize
			var locale = POTATO.L10N[POTATO.PROFILE.locale];
			$('title').text(locale.title);
			page.html(POTATO.replace(POTATO.TEMPLATE, locale));

			// Run initial routes
			$.each(POTATO.INITIAL, function() {
				return this.call();
			});

			// Header
			$('#menu_home').click(function() {
				location = location.protocol + '//' + location.host + '/'
			});
			$('#search').submit(function() {
				$('#search_target').blur().val('');
				return false;
			});

			// Footer
			$('#version').text(POTATO.PROFILE.version);

			// Left side panel
			new pSeason('summer');

			// Right side panel
			$('#calendar').datepicker();

			// Done, show it
			page.removeClass('ui-helper-hidden');
		})(/*do 1st time*/);
	});
});
