// Set default error handler
window.onerror = function(error, url, line) {
	if ( POTATO_PROFILE.reclaim ) {
		$.post('/ajaj/error', {
			error : error,
			line : line,
			url : url
		});
	}
};

// Initialize application
$(function() {
	// Localize
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	$('title').text(locale['title']);
	$('body').html($('body').html().replace(/{%(\w+)%}/g, function(whole, key) {
		return locale[key]
	})).removeClass('ui-helper-hidden');

	// Logo event
	$('#menu_home').click(function() {
		location = location.protocol + '//' + location.host + '/'
	});

	// Left side panel
	bhSeason.settle();

	// Right side panel
	$('#calendar').datepicker();

	// Main panel
	window.detailTabs = $('#details').tabs({
		tabTemplate : '<li><a href="#{href}">#{label}</a><span class="ui-icon ui-icon-close">&nbsp;</span></li>',
		add : function(event, ui) {
			$(ui.tab).siblings('.ui-icon-close').click(function() {
				detailTabs.tabs('remove', ui.tab.href.match(/#\w+$/)[0]);
			});
			$(ui.panel).append(ui.index);
			detailTabs.tabs('select', ui.index);
		}
	});
	$('legend').click(function() {
		$(this.parentNode).toggleClass('collapsed');
	});
});
