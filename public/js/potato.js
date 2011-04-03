$(function(){
	// Localize
	$('title').text(POTATO['title']);
	$('body').html($('body').html().replace(/{%(\w+)%}/g, function(whole, key){
		return POTATO[key];
	})).removeClass('ui-helper-hidden');
	
	// Logo event
	$('#menu_home').click(function(){
		location = location.protocol + '//' + location.host + '/';
	});

	// Category interaction
	var categories = $('#categories').tabs({selected: 2});
	var stickers = $('.stickers>li', categories).droppable({
		accept: '.category>li',
		hoverClass: 'ui-state-highlight',
		drop: function(event, ui){
			var category = $('.category', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function(){
				categories.tabs('select', stickers.index(sticker));
				$(this).appendTo(category).show('fast');
			});
		}
	});
	$('.category', categories).sortable({handle: '.handle', placeholder: 'ui-state-highlight'});
	
	// Category navigation
	var page = $('aside>nav>form').buttonset();
	$('[name="first"]', page).button('option', {
		icons: {primary: 'ui-icon-seek-start'}
	});
	$('[name="previous"]', page).button('option', {
		icons: {primary: 'ui-icon-seek-prev'}
	});
	$('[name="next"]', page).button('option', {
		icons: {primary: 'ui-icon-seek-next'}
	});
	$('[name="last"]', page).button('option', {
		icons: {primary: 'ui-icon-seek-end'}
	});
});