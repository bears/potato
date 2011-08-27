// Set default error handler
window.onerror = function(error, url, line) {
	if ( POTATO_PROFILE.reclaim ) {
		$.post('/ajaj/error', {
			error : error,
			line : line,
			url : url
		});
		return true;
	}
};

// Initialize application
$(function() {
	// Localize
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	$('title').text(locale.title);
	window.POTATO_TEMPLATE = $('body').html();
	$('body').html(POTATO_TEMPLATE.replace(/{%(\w+)%}/g, function(unused, key) {
		return locale[key]
	})).removeClass('ui-helper-hidden');
	$('#version').text(POTATO_PROFILE.version);

	// Logo event
	$('#menu_home').click(function() {
		location = location.protocol + '//' + location.host + '/'
	});

	// Right side panel
	$('#calendar').datepicker();

	// Run initial routes
	$(window.POTATO_INITIAL || []).each(function(){
		this.apply();
	});

	// Search
	$('#search').submit(function() {
		$('#search_target').blur().val('');
		return false;
	});
});
