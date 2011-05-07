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

	// Basic attributes
	this.id = id;
	this.page = 0;

	// Extended attributes
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
			for ( var i = 0; i < data.tubers.length; ++i ) {
				this._insert(data.tubers[i]);
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

/***********************************************************************************************************************
 * Private methods
 **********************************************************************************************************************/
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
 * Change current page
 *
 * @param field
 *        The page change to, one of start, prev, next, or end
 */
bhSeason.prototype._field = function(field) {
	var newPage = this.page;
	switch (field) {
		case 'start':
			newPage = 0;
			break;
		case 'prev':
			if (newPage > 0)
				--newPage;
			break;
		case 'next':
			if (newPage < this.maxPage)
				++newPage;
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

/***********************************************************************************************************************
 * Static methods
 **********************************************************************************************************************/
/**
 * Initialize season panel
 */
bhSeason.settle = function() {
	// Contents
	for ( var season in bhSeason._singleton ) {
		new bhSeason(season);
	}

	// Tabs
	var tabs = $('#seasons').tabs({
		select : function(event, ui) {
			bhSeason._singleton[ui.tab.href.match(/#season_(\w+)/)[1]]._show();
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
	$([ 'start', 'prev', 'next', 'end' ]).each(function() {
		var field = this.toString();
		$('nav>.field>[name="' + field + '"]').button('option', {
			icons : {
				primary : 'ui-icon-seek-' + field
			}
		}).click(function() {
			if ( 'object' == typeof bhSeason._current ) {
				bhSeason._current._field(field);
			}
		});
	});

	// Seed
	var seed = $('#seed-info').submit(function() {
		// TODO: Submit data asynchronously
		seed.fadeOut();
		return false;
	});
	$('.ui-icon-close', seed).click(function() {
		seed.fadeOut();
	});
	$('nav>.seed>[name="more"]').button('option', {
		icons : {
			primary : 'ui-icon-plusthick'
		}
	}).click(function() {
		var label = $('#seed_label').val('');
		seed.fadeIn();
		label.focus();
	});
};

/***********************************************************************************************************************
 * Static attributes
 **********************************************************************************************************************/
/**
 * Singleton holder for each category
 */
bhSeason._singleton = {
	spring : null,
	summer : null,
	autumn : null,
	winter : null
};
