'use strict';

(function() {
	/**
	 * Dynamic menu at top bar.
	 */
	POTATO.Menu = function() {
		return POTATO.Present.apply(this, [POTATO.SINGLETON, function() {
			/**
			 * The element to be operate.
			 */
			var widget = $('header>menu');

			/**
			 * Cache of current callbacks.
			 */
			var current;

			/**
			 * Build item list.
			 * @param callbacks {Object} {label : callback, ...}
			 */
			this.setup = function(callbacks) {
				if (current != callbacks) {
					widget.fadeOut(function() {
						widget.empty();
						var locale = POTATO.LOCALE;
						for (var label in callbacks) {
							$('<li>' + locale['menu_' + label] + '</li>').appendTo(widget).click(callbacks[label]);
						}
						current = callbacks;
						widget.fadeIn();
					});
				}
			};
		}]);
	};
})();
