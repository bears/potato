'use strict';

(function() {
	/**
	 * Object cache pool.
	 */
	var pool = {};

	/**
	 * Get class name.
	 * @param item {Function|Object|String}
	 * @return {String}
	 */
	var getType = function(item) {
		switch (typeof item) {
			case 'function':
				return item.$;
			case 'object':
				return item.__proto__.constructor.$;
			case 'string':
				return item;
			default:
				throw 'unkown type';
		}
	};

	/**
	 * Get an object.
	 * @param item {Function|Object|String}
	 * @param uuid {String}
	 * @return {POTATO.Object}
	 */
	POTATO.getObject = function(item, uuid) {
		var type = getType(item);
		return (type in pool) && pool[type][uuid] || false;
	};

	/**
	 * Add an object.
	 * @param {POTATO.Object}
	 */
	POTATO.setObject = function() {
		for (var i in arguments) {
			var item = arguments[i];
			var type = getType(item);
			(type in pool) || (pool[type] = {});
			pool[type][item.uuid()] = item;
		}
	};

	/**
	 * Rid an object.
	 * @param {POTATO.Object}
	 */
	POTATO.ridObject = function() {
		for (var i in arguments) {
			var item = arguments[i];
			var type = getType(item);
			(type in pool) && (delete pool[type][item.uuid()]);
		}
	}

	/**
	 * Root class.
	 * @param uuid {String}
	 * @param builder {Function}
	 */
	POTATO.Object = function(uuid, builder) {
		var gene = {
			SELF : this
		};

		// Prevent duplicated object.
		var cached = POTATO.getObject(this, uuid);
		if (cached) {
			return cached;
		}

		/**
		 * Get UUID.
		 * @return {String}
		 */
		this.uuid = function() {
			return uuid;
		};

		// Cache this object.
		POTATO.setObject(this);

		// Initialize this by deriver.
		('function' == typeof builder) && builder.apply(this, [gene]);
	};
})();
