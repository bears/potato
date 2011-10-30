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
	 * Setup menu.
	 * @param callbacks {Object} {label : callback, ...}
	 */
	this.setup = function(callbacks) {
		widget.fadeOut(function() {
			widget.empty();
			for (var label in callbacks) {
				$('<li>' + label + '</li>').appendTo(widget).click(callbacks[label]);
			}
			widget.fadeIn();
		})
	};
}
