'use strict';

(function() {
	/**
	 * Object cache pool.
	 */
	var pool = {};

	/**
	 * Get an object.
	 * @param type {String}
	 * @param uuid {String}
	 * @return {Object}
	 */
	POTATO.getObject = function(type, uuid) {
		return (pool[type] || {})[uuid];
	};

	/**
	 * Add an object.
	 * @param item {Object}
	 * @param uuid {String}
	 */
	POTATO.setObject = function(item, uuid) {
		var type = POTATO.typeOf(item);
		(type in pool) || (pool[type] = {});
		pool[type][uuid] = item;
	};

	/**
	 * Rid an object.
	 * @param type {String}
	 * @param uuid {String}
	 */
	POTATO.ridObject = function(type, uuid) {
		(type in pool) && (delete pool[type][uuid]);
	}

	/**
	 * Get class name.
	 * @return {String}
	 */
	POTATO.typeOf = function(item) {
		return item.__proto__.constructor.toString().match(/^function (\w+)/)[1];
	};
})();
