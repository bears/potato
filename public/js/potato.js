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
	var categories = $('#categories').tabs({selected: 1});
	var stickers = $('.stickers>li', categories).droppable({
		accept: '.category>li',
		hoverClass: 'ui-state-highlight',
		tolerance: 'pointer',
		drop: function(event, ui){
			var category = $('.category', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function(){
				categories.tabs('select', stickers.index(sticker));
				$(this).appendTo(category).show('fast', function(){
					$(this).removeAttr('style');
				});
			});
		}
	});
	$('.category', categories).sortable({
		handle: '.handle',
		placeholder: 'ui-state-disabled ui-state-hover ui-corner-all',
		opacity: 0.5,
		stop: function(event, ui){
			ui.item.removeAttr('style');
		}
	});
	$('.category>li').click(function(){
		var name = 'ui-state-highlight ui-corner-all';
		var filter = '.ui-state-highlight.ui-corner-all';
		$(this).toggleClass(name).siblings(filter).removeClass(name);
	});
	
	// Category navigation
	$('nav>form').buttonset();
	$('form.item>[name="more"]').button('option', {
		icons: {primary: 'ui-icon-plusthick'}
	});
	$('form.page>[name="first"]').button('option', {
		icons: {primary: 'ui-icon-seek-start'}
	});
	$('form.page>[name="prev"]').button('option', {
		icons: {primary: 'ui-icon-seek-prev'}
	});
	$('form.page>[name="next"]').button('option', {
		icons: {primary: 'ui-icon-seek-next'}
	});
	$('form.page>[name="last"]').button('option', {
		icons: {primary: 'ui-icon-seek-end'}
	});
});