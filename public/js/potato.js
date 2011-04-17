/**
 * Global profile with default settings
 */
window.POTATO_PROFILE = {
	locale : 'en_US'
};

/**
 * Initialize page when profile ready
 */
$(POTATO_PROFILE).bind('potato.ready', function() {
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

	// Category interaction
	var categories = $('#categories').tabs({
		selected : 1
	});
	var stickers = $('.stickers>li', categories).droppable({
		accept : '.category>li',
		hoverClass : 'ui-state-highlight',
		tolerance : 'pointer',
		drop : function(event, ui) {
			var category = $('.category', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function() {
				categories.tabs('select', stickers.index(sticker));
				$(this).appendTo(category).show('fast', function() {
					$(this).removeAttr('style');
				});
			});
		}
	});
	$('.category', categories).sortable({
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
	$('form.page>[name="first"]').button('option', {
		icons : {
			primary : 'ui-icon-seek-start'
		}
	});
	$('form.page>[name="prev"]').button('option', {
		icons : {
			primary : 'ui-icon-seek-prev'
		}
	});
	$('form.page>[name="next"]').button('option', {
		icons : {
			primary : 'ui-icon-seek-next'
		}
	});
	$('form.page>[name="last"]').button('option', {
		icons : {
			primary : 'ui-icon-seek-end'
		}
	});

	var details = $('#details').tabs();
	$('#calendar').datepicker();

	// Test
	(new bhFactory()).subscribe((new bhCategory()), 'Task');
});

/**
 * Load profile
 */
$(function() {
	$.getJSON('/ajaj/profile', function(profile) {
		$.extend(POTATO_PROFILE, profile);
		$(POTATO_PROFILE).trigger('potato.ready');
	});
});

function bhCategory(id) {
}

bhCategory.prototype.notify = function(type, data) {
	switch (type) {
	case bhFactory.NOTIFY_INSERT:
		var parent = $('#season-' + data.category + ' .category');
		var template = '<li id="task-{%id%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%icon%}"></a>{%summary%}</li>';
		$(template.replace(/{%(\w+)%}/g, function(whole, key) {
			return data[key]
		})).appendTo(parent).click(function() {
			var name = 'ui-state-highlight ui-corner-all';
			var filter = '.ui-state-highlight.ui-corner-all';
			$(this).toggleClass(name).siblings(filter).removeClass(name);
		});
		break;

	case bhFactory.NOTIFY_UPDATE:
		break;

	case bhFactory.NOTIFY_DELETE:
		break;
	}
};

bhCategory.prototype.getIdentity = function() {
	return 'bhCategory#singleton';
};
