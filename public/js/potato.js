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

	/*******************************************************************************************************************
	 * Left side panel
	 ******************************************************************************************************************/
	// Category interaction
	var seasons = [];
	$([ 'spring', 'summer', 'autumn', 'winter' ]).each(function() {
		seasons.push(new bhSeason(this));
	});
	var seasonTabs = $('#seasons').tabs({
		select : function(event, ui) {
			seasons[ui.index].show();
		}
	}).tabs('select', 1);
	var stickers = $('.stickers>li', seasonTabs).droppable({
		accept : '.season>li',
		hoverClass : 'ui-state-highlight',
		tolerance : 'pointer',
		drop : function(event, ui) {
			var season = $('.season', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function() {
				seasonTabs.tabs('select', stickers.index(sticker));
				$(this).appendTo(season).show('fast', function() {
					$(this).removeAttr('style');
				});
			});
		}
	});
	$('.season', seasonTabs).sortable({
		handle : '.handle',
		placeholder : 'ui-state-disabled ui-state-hover ui-corner-all',
		opacity : 0.5,
		stop : function(event, ui) {
			ui.item.removeAttr('style');
		}
	});

	// Category navigation
	$('nav>form').buttonset();
	$('form.seed>[name="more"]').button('option', {
		icons : {
			primary : 'ui-icon-plusthick'
		}
	});
	$([ 'start', 'prev', 'next', 'end' ]).each(function() {
		$('form.field>[name="' + this + '"]').button('option', {
			icons : {
				primary : 'ui-icon-seek-' + this
			}
		});
	});

	/*******************************************************************************************************************
	 * Right side panel
	 ******************************************************************************************************************/
	$('#calendar').datepicker();

	/*******************************************************************************************************************
	 * Main panel
	 ******************************************************************************************************************/
	var detailTabs = $('#details').tabs();
});
