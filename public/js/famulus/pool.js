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
	 * @return {subject}
	 */
	POTATO.getObject = function(type, uuid) {
		return (pool[type] || {})[uuid];
	};

	/**
	 * Add an object.
	 * @param item {subject}
	 * @param uuid {String}
	 */
	POTATO.setObject = function(item, uuid) {
		var type = POTATO.typeOf(item);
		(type in pool) || (pool[type] = {});
		pool[type][uuid] = item;
	};

	/**
	 * Get class name.
	 * @return {String}
	 */
	POTATO.typeOf = function(item) {
		return item.__proto__.constructor.toString().match(/^function (\w+)/)[1];
	};
})();
