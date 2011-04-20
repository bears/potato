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
	this.container = $(this.getIdentity() + ' .season');
}

bhSeason.prototype.show = function() {
	if ( 'object' == typeof bhSeason._current ) {
		bhSeason._current.hide();
	}
	bhSeason._current = this;
	
	// Bind data
	(new bhFactory()).subscribe(this, this.getIdentity(), this.getSubject(), this.page);
	
	return this;
};

bhSeason.prototype.hide = function() {
	// Unbind data
	// (new bhFactory()).unsubscribe(this, this.getIdentity(), this.getSubject(), this.page);
	
	return this;
}

/**
 * Get a string to identify object
 */
bhSeason.prototype.getIdentity = function() {
	return '#season_' + this.id;
};

/**
 * Get a string of related subject
 */
bhSeason.prototype.getSubject = function() {
	return 'season/' + this.id;
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
	});
	return this;
};

// Singleton holder for each category
bhSeason._singleton = {
	spring : null,
	summer : null,
	autumn : null,
	winter : null
}
