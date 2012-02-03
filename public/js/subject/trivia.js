'use strict';

// Derivers of Element.
POTATO.module('element/trivia', ['element'], function() {
	/**
	 * Subject for a single chip.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.derive(POTATO.Element, 'Chip', function(uuid, data) {
		return POTATO.Element.call(this, 'chip', uuid, data);
	});

	/**
	 * Subject for a single potato.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.derive(POTATO.Element, 'Potato', function(uuid, data) {
		return POTATO.Element.call(this, 'potato', uuid, data);
	});
});

// Derivers of Cluster.
POTATO.module('cluster/trivia', ['cluster', 'element/trivia'], function() {
	/**
	 * Subject for chip set.
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Cluster, 'Chips', function(uuid) {
		return POTATO.Cluster.call(this, 'Chip', 'chip', uuid);
	});

	/**
	 * Subject for potato set.
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Cluster, 'Potatoes', function(uuid) {
		return POTATO.Cluster.call(this, 'Potato', 'potato', uuid);
	});
});
