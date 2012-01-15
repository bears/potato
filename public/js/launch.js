'use strict';

POTATO.module('launch', [], function() {
	/**
	 * Initialize main elements.
	 */
	POTATO.construct = function(l10n) {
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
			var bound = l10n.tips.length;
			var tip = $('#tip').text(l10n.tips[0]);
			clearInterval(tip.data('roll'))
			tip.data('roll', setInterval(function() {
				tip.fadeOut(function() {
					(++index < bound) || (index = 0);
					tip.text(l10n.tips[index]).fadeIn();
				});
			}, 12345));
		})();

		// Left side panel
		new POTATO.Annual('summer');

		// Right side panel
		$('#calendar').datepicker({
			beforeShowDay : function(date) {
				return [true, '', 'Hello, world!'];
			}
		});
	};

	/**
	 * Render the page using cached template.
	 */
	POTATO.render = function() {
		var page = $('body').css('visibility', 'hidden');

		var l10n = POTATO.getL10n();
		$('title').text(l10n.title);
		page.html(POTATO.replace(POTATO.TEMPLATE.body, l10n));
		POTATO.construct(l10n);

		page.css('visibility', 'visible');
	};
});
