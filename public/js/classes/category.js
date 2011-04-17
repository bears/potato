/**
 * Class bhCategory
 * 
 * @brief Item navigate list
 */
function bhCategory(id) {
	if ('object' != typeof bhCategory._singleton[id])
		throw id + ' is not a valid ID.';
	if (null != bhCategory._singleton[id])
		return bhCategory._singleton[id];
	this.id = id;
	(new bhFactory()).subscribe(this, 'task');
	bhCategory._singleton[id] = this;
}

bhCategory.prototype.show = function() {
	if ('object' == typeof bhCategory._current)
		bhCategory._current.hide();
	bhCategory._current = this;
};

bhCategory.prototype.hide = function() {
	//
}

/**
 * Get a string to identify object
 */
bhCategory.prototype.getIdentity = function() {
	return 'bhCategory#' + this.id;
};

bhCategory.prototype.notify = function(type, data) {
	switch (type) {
	case bhFactory.NOTIFY_INSERT:
		this._insertItem(data);
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
 */
bhCategory.prototype._insertItem = function(data) {
	var parent = $('#season-' + data.category + ' .category');
	var template = '<li id="task-{%id%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%icon%}"></a>{%summary%}</li>';
	$(template.replace(/{%(\w+)%}/g, function(whole, key) {
		return data[key]
	})).appendTo(parent).click(function() {
		var name = 'ui-state-highlight ui-corner-all';
		var filter = '.ui-state-highlight.ui-corner-all';
		$(this).toggleClass(name).siblings(filter).removeClass(name);
	});
};

/**
 * Singleton holder for each category
 */
bhCategory._singleton = {
	wait : null,
	work : null,
	done : null,
	dead : null
}
