'use strict';

POTATO.module('widget/menu', ['present'], function() {
	/**
	 * Dynamic menu at top bar.
	 */
	POTATO.derive(POTATO.Present, 'Menu', function() {
		return POTATO.Present.call(this, POTATO.SINGLETON, function() {
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
				if (current !== callbacks) {
					widget.fadeOut(function() {
						widget.empty();
						var l10n = POTATO.getL10n();
						for (var label in callbacks) {
							$('<li>' + l10n['menu_' + label] + '</li>').appendTo(widget).click(callbacks[label]);
						}
						current = callbacks;
						widget.fadeIn();
					});
				}
			};
		});
	});
});
