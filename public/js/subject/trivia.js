'use strict';

(function() {
	/**
	 * Subject for a single chip.
	 */
	POTATO.Chip = function Chip() {
		return POTATO.Subject.apply(this, arguments);
	};

	/**
	 * Subject for a single potato.
	 */
	POTATO.Potato = function Potato() {
		return POTATO.Subject.apply(this, arguments);
	};

	/**
	 * Subject for tubers.
	 */
	POTATO.Season = function Season() {
		return POTATO.Subject.apply(this, arguments);
	};
})();
