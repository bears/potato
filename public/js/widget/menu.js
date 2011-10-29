/**
 * Dynamic menu at top bar.
 */
function menu() {
	// Keep singleton.
	if (menu.cache instanceof menu) {
		return menu.cache;
	}

	// Cache this object.
	menu.cache = this;

	/**
	 * The element to be operate.
	 */
	var widget = $('header>menu');

	/**
	 * Append an item into menu.
	 * @param name {String}
	 * @param callback {Function}
	 */
	var append = function(name, callback) {
		$('<li>' + name + '</li>').appendTo(widget).click(callback);
	};

	/**
	 * Setup menu.
	 * @param data {Object}
	 */
	this.setup = function(data) {
		widget.empty();
		for (var i in data) {
			append(i, data[i]);
		}
	};
}
