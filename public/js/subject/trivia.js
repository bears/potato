'use strict';

(function(POTATO) {
	/**
	 * Subject for a single chip.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.derive(POTATO.Element, 'Chip', function(uuid, data) {
		return POTATO.Element.apply(this, ['chip', uuid, data]);
	});

	/**
	 * Subject for a single potato.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.derive(POTATO.Element, 'Potato', function(uuid, data) {
		return POTATO.Element.apply(this, ['potato', uuid, data]);
	});
})(POTATO);

(function(POTATO) {
	/**
	 * Subject for chip set.
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Cluster, 'Chips', function(uuid) {
		return POTATO.Cluster.apply(this, ['Chip', 'chip', uuid]);
	});

	/**
	 * Subject for potato set.
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Cluster, 'Potatoes', function(uuid) {
		return POTATO.Cluster.apply(this, ['Potato', 'potato', uuid]);
	});
})(POTATO);