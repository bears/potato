'use strict';

(function() {
	/**
	 * Subject for a single chip.
	 */
	POTATO.Chip = function() {
		return POTATO.Element.apply(this, arguments);
	};
	POTATO.Chip.prototype._ = 'chip';

	/**
	 * Subject for a single potato.
	 */
	POTATO.Potato = function() {
		return POTATO.Element.apply(this, arguments);
	};
	POTATO.Potato.prototype._ = 'potato';
})();

(function() {
	/**
	 * Subject for chip set.
	 */
	POTATO.Chips = function() {
		return POTATO.Cluster.apply(this, arguments);
	};
	POTATO.Chips.prototype._ = 'Chip';

	/**
	 * Subject for potato set.
	 */
	POTATO.Potatoes = function() {
		return POTATO.Cluster.apply(this, arguments);
	};
	POTATO.Potatoes.prototype._ = 'Potato';
})();