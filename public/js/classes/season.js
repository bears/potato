/**
 * Class bhSeason
 * 
 * @brief Item navigate list
 * @param id
 *        One of 'spring', 'summer', 'autumn', 'winter'
 */
function bhSeason(id) {
	// Keep singleton
	if ( 'object' != typeof bhSeason._singleton[id] ) {
		throw id + ' is not a valid ID.';
	}
	if ( null != bhSeason._singleton[id] ) {
		return bhSeason._singleton[id];
	}
	bhSeason._singleton[id] = this;

	// Basic members
	this.id = id;
	this.page = 0;

	// Extended members
	this.container = $('#season_' + this.id + ' .season');
}

bhSeason.prototype.show = function() {
	if ( 'object' == typeof bhSeason._current ) {
		bhSeason._current.hide();
	}
	bhSeason._current = this;
	
	// Bind data
	this._touch(true);
	
	return this;
};

bhSeason.prototype.hide = function() {
	return this;
}

bhSeason.prototype.field = function(field) {
	var newPage = this.page;
	switch (field) {
		case 'start':
			newPage = 0;
			break;
		case 'prev':
			if (newPage > 0) --newPage;
			break;
		case 'next':
			if (newPage < this.maxPage) ++newPage;
			break;
		case 'end':
			newPage = this.maxPage;
			break;
	}
	if (newPage != this.page) {
		this._touch(false);
		this.page = newPage;
		$('#season_' + this.id + ' .season').empty();
		this._touch(true);
	}
};

/**
 * Notify callback
 * 
 * @param subject
 * @param type
 *        Notify reason, one of bhFactory.NOTIFY_*
 * @param data
 */
bhSeason.prototype.notify = function(subject, type, data) {
	switch ( type ) {
		case bhFactory.NOTIFY_INSERT:
			for ( var i = 0; i < data.tubers.length; ++i ) {
				this._insertItem(data.tubers[i]);
			}
			this.maxPage = data.max;
		break;

		case bhFactory.NOTIFY_UPDATE:
		break;

		case bhFactory.NOTIFY_DELETE:
		break;
	}
	return this;
};

/**
 * Insert new item into list
 * 
 * @param data
 */
bhSeason.prototype._insertItem = function(data) {
	var template = '<li id="tuber_{%id%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%icon%}"></a>{%label%}</li>';
	$(template.replace(/{%(\w+)%}/g, function(whole, key) {
		return data[key]
	})).appendTo(this.container).click(function() {
		var name = 'ui-state-highlight ui-corner-all';
		var filter = '.ui-state-highlight.ui-corner-all';
		$(this).toggleClass(name).siblings(filter).removeClass(name);
		
		var tag = '#detail_' + data.id.replace('#', '_');
		if (0 == $('#details [href$="' + tag + '"]').length)
			detailTabs.tabs('add', tag, data.label);
		else
			detailTabs.tabs('select', tag);
	});
	return this;
};

/**
 * Bind or unbind data source
 * 
 * @param link
 *        true: bind, false: unbind
 */
bhSeason.prototype._touch = function(link) {
	var method = link ? 'subscribe' : 'unsubscribe';
	(new bhFactory())[method](this, ('#season_' + this.id), ('season/' + this.id), this.page);
}

// Singleton holder for each category
bhSeason._singleton = {
	spring : null,
	summer : null,
	autumn : null,
	winter : null
}

/***********************************************************************************************************************
 * Static methods
 **********************************************************************************************************************/

bhSeason.settle = function() {
	// Contents
	for ( var season in bhSeason._singleton ) {
		new bhSeason(season);
	}
	
	// Tabs
	var tabs = $('#seasons').tabs({
		select : function(event, ui) {
			bhSeason._singleton[ui.tab.href.match(/#season_(\w+)/)[1]].show();
		}
	}).tabs('select', 1);
	var stickers = $('.stickers>li', tabs).droppable({
		accept : '.season>li',
		hoverClass : 'ui-state-highlight',
		tolerance : 'pointer',
		drop : function(event, ui) {
			var season = $('.season', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function() {
				tabs.tabs('select', stickers.index(sticker));
				$(this).appendTo(season).show('fast', function() {
					$(this).removeAttr('style');
				});
			});
		}
	});
	var lists = $('.season', tabs).sortable({
		handle : '.handle',
		placeholder : 'ui-state-disabled ui-state-hover ui-corner-all',
		opacity : 0.5,
		stop : function(event, ui) {
			ui.item.removeAttr('style');
		}
	});

	// Pages
	$('nav>div').buttonset();
	$('nav>.seed>[name="more"]').button('option', {
		icons : {
			primary : 'ui-icon-plusthick'
		}
	}).click(function(){
		$('#seed-info').fadeIn();
		$('#seed_label').focus();
	});
	$('#seed-info .ui-icon-close').click(function(){
		$('#seed-info').fadeOut();
	});
	$([ 'start', 'prev', 'next', 'end' ]).each(function() {
		var field = this.toString();
		$('nav>.field>[name="' + field + '"]').button('option', {
			icons : {
				primary : 'ui-icon-seek-' + field
			}
		}).click(function() {
			if ( 'object' == typeof bhSeason._current ) {
				bhSeason._current.field(field);
			}
		});
	});
};
