'use strict';

/**
 * Replace parameters in a template.
 * @param template {String} HTML
 * @param lookup {Object}
 */
POTATO.replace = function(template, lookup) {
	return template.replace(/{%(\w+)%}/g, function(unused, key) {
		return lookup[key];
	});
};

/**
 * Initialize application.
 */
$(window).load(function() {
	// Report client error to server.
	if ( POTATO.PROFILE.CODE.RECLAIM ) {
		/**
		 * Default error handler.
		 * @param error {String}
		 * @param url {Url}
		 * @param line {Number}
		 */
		window.onerror = function(error, url, line) {
			$.post(POTATO.AJAJ_DOMAIN + 'error', {
				error : error,
				line : line,
				url : url
			});
			return true;
		};
	}

	// Save the original page template.
	POTATO.TEMPLATE = $('body').html();

	/**
	 * Render the page by cached template.
	 */
	(POTATO.renderPage = function() {
		var page = $('body').css('visibility', 'hidden');

		// Localize
		var locale = POTATO.LOCALE;
		$('title').text(locale.title);
		page.html(POTATO.replace(POTATO.TEMPLATE, locale));

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
			var bound = locale.tips.length;
			var tip = $('#tip').text(locale.tips[0]);
			clearInterval(tip.data('roll'))
			tip.data('roll', setInterval(function() {
				tip.fadeOut(function() {
					(++index < bound) || (index = 0);
					tip.text(locale.tips[index]).fadeIn();
				});
			}, 12345));
		})();

		// Left side panel
		new annual('summer');

		// Right side panel
		$('#calendar').datepicker({
			beforeShowDay : function(date) {
				return [true, '', 'Hello, world!'];
			}
		});

		// Done, show it
		page.css('visibility', 'visible');
	})(/*do 1st time*/);
});
