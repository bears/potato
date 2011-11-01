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
	 * Build item list.
	 * @param callbacks {Object} {label : callback, ...}
	 */
	this.setup = function(callbacks) {
		widget.fadeOut(function() {
			widget.empty();
			for (var label in callbacks) {
				$('<li>' + label + '</li>').appendTo(widget).click(callbacks[label]);
			}
			widget.fadeIn();
		});
	};

	/**
	 * Dynamically change menu by click.
	 * @param vessel {jQuery}
	 * @param callbacks {Object} {label : callback, ...}
	 */
	this.bind = function(vessel, callbacks) {
		$(vessel).click(function(event) {
			event.stopPropagation();
			if (menu.target != vessel) {
				menu.target = vessel;
				menu.cache.setup(callbacks);
			}
		});
	};
}
