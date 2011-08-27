/**
 * @class bhSeason
 * @brief Item navigate list
 *
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

	this.id = id;
	this.page = 0;
	this.container = $('#season_' + this.id + ' .season');

	return this;
}

/**
 * Notify callback, needed by hbFactory
 *
 * @param subject
 * @param type
 *        Notify reason, one of bhFactory.NOTIFY_*
 * @param data
 */
bhSeason.prototype.notify = function(subject, type, data) {
	switch ( type ) {
		case bhFactory.NOTIFY_INSERT:
			this.maxPage = data.max;
			for ( var i = 0; i < data.tubers.length; ++i ) {
				this._insert(data.tubers[i]);
			}
			if ( 'function' == typeof this.loaded ) {
				this.loaded.apply(this);
			}
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
bhSeason.prototype._insert = function(data) {
	var template = '<li id="tuber_{%id%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%icon%}"></a>{%label%}</li>';
	$(template.replace(/{%(\w+)%}/g, function(unused, key) {
		return data[key]
	})).appendTo(this.container).click(function() {
		$('#seasons li.ui-state-highlight').removeClass('ui-state-highlight');
		$(this).addClass('ui-state-highlight');
		new bhDetail(data.id);
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
};

/**
 * Called when current tab selected
 */
bhSeason.prototype._show = function() {
	// Hide previous
	if ( 'object' == typeof bhSeason._current ) {
		bhSeason._current._hide();
	}
	bhSeason._current = this;

	// Bind data
	this._touch(true);

	return this;
};

/**
 * Called when current tab un-selected
 */
bhSeason.prototype._hide = function() {
	return this;
};

/**
 * Singleton holder for each category
 */
bhSeason._singleton = {
	spring : null,
	summer : null,
	autumn : null,
	winter : null
};

/**
 * Initializer
 */
var POTATO_INITIAL = POTATO_INITIAL || [];
POTATO_INITIAL.push(function() {
	// Contents
	for ( var season in bhSeason._singleton ) {
		new bhSeason(season);
	}

	// Load the first
	bhSeason._singleton.summer.loaded = function() {
		delete bhSeason._singleton.summer.loaded;
		$('>li:first-child', this.container).click();
	};

	// Tabs
	var tabs = $('#seasons').tabs({
		select : function(event, ui) {
			bhSeason._singleton[ui.tab.href.match(/#season_(\w+)/)[1]]._show();
		}
	}).tabs('select', 'summer');
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
});
