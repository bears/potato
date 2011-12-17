'use strict';

/**
 * Initialize main elements.
 */
POTATO.construct = function(locale) {
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

	var locale = POTATO.LOCALE;
	$('title').text(locale.title);
	page.html(POTATO.replace(POTATO.TEMPLATE.body, locale));
	POTATO.construct(locale);

	page.css('visibility', 'visible');
};

/**
 * Prepare data.
 */
(function() {
	// Set internal types.
	for (var i in POTATO) {
		('function' == typeof POTATO[i]) && (POTATO[i].$ = i);
	}

	// Load templates.
	if (undefined === POTATO.TEMPLATE) {
		var sign = POTATO.PROFILE.CODE.SIGN || {
			html : ''
		};
		$.get('potato' + sign.html +'.html', function(content) {
			POTATO.TEMPLATE = {};
			$(content).each(function() {
				POTATO.TEMPLATE[this.id] = this.innerHTML;
			});
			POTATO.render();
		});
	}
})();
