'use strict';

(function() {
	/**
	 * Subject for a single chip.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.Chip = function(uuid, data) {
		return POTATO.Element.apply(this, ['chip', uuid, data]);
	};

	/**
	 * Subject for a single potato.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.Potato = function(uuid, data) {
		return POTATO.Element.apply(this, ['potato', uuid, data]);
	};
})();

(function() {
	/**
	 * Subject for chip set.
	 * @param uuid {String}
	 */
	POTATO.Chips = function(uuid) {
		return POTATO.Cluster.apply(this, ['Chip', 'chip', uuid]);
	};

	/**
	 * Subject for potato set.
	 * @param uuid {String}
	 */
	POTATO.Potatoes = function(uuid) {
		return POTATO.Cluster.apply(this, ['Potato', 'potato', uuid]);
	};
})();