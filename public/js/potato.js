$(function(){
	$('title').text(POTATO['title']);
	$('body').html($('body').html().replace(/{%(\w+)%}/g, function(whole, key){
		return POTATO[key];
	})).removeClass('ui-helper-hidden');
	
	$('#menu_home').click(function(){
		location = location.protocol + '//' + location.host + '/';
	});
//	$('aside.left>ul').sortable({
//		placeholder: 'ui-state-highlight',
//		container: 'parent',
//		axis: 'y',
//		revert: true
//	});
//	$('aside.left>ul>li').dblclick(function(){
//		alert('hi');
//	});
//	$('aside.left>ul,aside.left>ul>li').disableSelection();
	
	/*var season = $('aside>div>form[action="season"]').buttonset()
		.children('label')
			.removeClass('ui-corner-left')
			.removeClass('ui-corner-right')
			.addClass('ui-corner-bottom')
		.end();*/
	$('#categories').tabs({selected: 2});
	
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
	
	$("#tabs").tabs();
	$(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *") 
		.removeClass("ui-corner-all ui-corner-top") 
		.addClass("ui-corner-bottom");
});