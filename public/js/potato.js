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
			if ( POTATO.PROFILE.RECLAIM ) {
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
			var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
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
			(function() {
				var index = 0;
				var bound = locale.tip.length;
				var tip = $('#tip').text(locale.tip[0]);
				clearInterval(tip.data('roll'))
				tip.data('roll', setInterval(function() {
					tip.fadeOut(function() {
						(++index < bound) || (index = 0);
						tip.text(locale.tip[index]).fadeIn();
					});
				}, 12345));
			})();

			// Left side panel
			new pSeason('summer');

			// Right side panel
			$('#calendar').datepicker();

			// Done, show it
			page.removeClass('ui-helper-hidden');
		})(/*do 1st time*/);
	});

	/**
	 * Build reverse dictionary.
	 */
	(function() {
		POTATO.BA = {};
		for (var c in POTATO.AB) {
			var ab_class = POTATO.AB[c];
			var ba_class = {};
			for (var s in ab_class) {
				var ab_subject = ab_class[s];
				var ba_subject = {};
				for (var i in ab_subject) {
					ba_subject[ab_subject[i]] = i;
				}
				delete ba_subject[ab_subject.$];
				ba_subject.$ = s;
				ba_class[ab_subject.$] = ba_subject;
			}
			POTATO.BA[c] = ba_class;
		}
	})();
});
