'use strict';

(function() {
	/**
	 * Subject for a single chip.
	 */
	POTATO.Chip = function chip() {
		return POTATO.Element.apply(this, arguments);
	};

	/**
	 * Subject for a single potato.
	 */
	POTATO.Potato = function potato() {
		return POTATO.Element.apply(this, arguments);
	};
})();

(function() {
	/**
	 * Subject for chip set.
	 */
	POTATO.Chips = function chip() {
		return POTATO.Cluster.apply(this, arguments);
	};

	/**
	 * Subject for potato set.
	 */
	POTATO.Potatoes = function potato() {
		return POTATO.Cluster.apply(this, arguments);
	};
})();