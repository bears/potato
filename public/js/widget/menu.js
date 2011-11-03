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
	 * Cache of current callbacks.
	 */
	var current = null;

	/**
	 * Build item list.
	 * @param callbacks {Object} {label : callback, ...}
	 */
	this.setup = function(callbacks) {
		if (current != callbacks) {
			widget.fadeOut(function() {
				widget.empty();
				for (var label in callbacks) {
					$('<li>' + label + '</li>').appendTo(widget).click(callbacks[label]);
				}
				current = callbacks;
				widget.fadeIn();
			});
		}
	};
}
