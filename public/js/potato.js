/**
 * Global profile with default settings
 */
window.POTATO_PROFILE = {
	locale : 'en_US'
};

/**
 * Initialize page when profile ready
 */
$(POTATO_PROFILE).bind('ready.potato', function() {
	// Localize
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	$('title').text(locale['title']);
	$('body').html($('body').html().replace(/{%(\w+)%}/g, function(whole, key) {
		return locale[key]
	})).removeClass('ui-helper-hidden');

	// Logo event
	$('#menu-home').click(function() {
		location = location.protocol + '//' + location.host + '/'
	});

	/** Left side panel
	 *********************************/
	// Category interaction
	var categories = [];
	$([ 'wait', 'work', 'done', 'dead' ]).each(function() {
		categories.push(new bhCategory(this));
	});
	var categoryTabs = $('#categories').tabs({
		select : function(event, ui) {
			categories[ui.index].show();
		}
	}).tabs('select', 1);
	var stickers = $('.stickers>li', categoryTabs).droppable({
		accept : '.category>li',
		hoverClass : 'ui-state-highlight',
		tolerance : 'pointer',
		drop : function(event, ui) {
			var category = $('.category', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function() {
				categoryTabs.tabs('select', stickers.index(sticker));
				$(this).appendTo(category).show('fast', function() {
					$(this).removeAttr('style');
				});
			});
		}
	});
	$('.category', categoryTabs).sortable({
		handle : '.handle',
		placeholder : 'ui-state-disabled ui-state-hover ui-corner-all',
		opacity : 0.5,
		stop : function(event, ui) {
			ui.item.removeAttr('style');
		}
	});

	// Category navigation
	$('nav>form').buttonset();
	$('form.item>[name="more"]').button('option', {
		icons : {
			primary : 'ui-icon-plusthick'
		}
	});
	$([ 'start', 'prev', 'next', 'end' ]).each(function() {
		$('form.page>[name="' + this + '"]').button('option', {
			icons : {
				primary : 'ui-icon-seek-' + this
			}
		});
	});
	
	/** Right side panel
	 *********************************/
	$('#calendar').datepicker();

	/** Main panel
	 *********************************/
	var detailTabs = $('#details').tabs();
});

/**
 * Load profile
 */
$(function() {
	$.getJSON('/ajaj/profile', function(profile) {
		$.extend(POTATO_PROFILE, profile);
		$(POTATO_PROFILE).trigger('ready.potato');
	});
});
