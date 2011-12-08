'use strict';

(function() {
	/**
	 * Subject for a single chip.
	 */
	POTATO.Chip = function Chip() {
		return POTATO.Element.apply(this, arguments);
	};

	/**
	 * Subject for a single potato.
	 */
	POTATO.Potato = function Potato() {
		return POTATO.Element.apply(this, arguments);
	};

	/**
	 * Subject for tubers.
	 */
	POTATO.Season = function Season() {
		return POTATO.Element.apply(this, arguments);
	};
})();

(function() {
	/**
	 * Subject for chip set.
	 */
	POTATO.Chips = function Chip() {
		return POTATO.Cluster.apply(this, arguments);
	};

	/**
	 * Subject for potato set.
	 */
	POTATO.Potatoes = function Potato() {
		return POTATO.Cluster.apply(this, arguments);
	};
})();