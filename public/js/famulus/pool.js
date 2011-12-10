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
	 * @return {POTATO.Object}
	 */
	POTATO.getObject = function(type, uuid) {
		return (type in pool) && pool[type][uuid] || false;
	};

	/**
	 * Add an object.
	 * @param {POTATO.Object}
	 */
	POTATO.setObject = function() {
		for (var i in arguments) {
			var item = arguments[i];
			var type = POTATO.typeOf(item);
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
			var type = POTATO.typeOf(item);
			(type in pool) && (delete pool[type][item.uuid()]);
		}
	}

	/**
	 * Get class name.
	 * @param item {Object}
	 * @return {String}
	 */
	POTATO.typeOf = function(item) {
		return item.__proto__.constructor.toString().match(/^function (\w+)/)[1];
	};

	/**
	 * Root class.
	 * @param uuid {String}
	 * @param builder {Function}
	 */
	POTATO.Object = function(uuid, builder) {
		var gene = {
			SELF : this,
			DERIVER : POTATO.typeOf(this)
		};

		// Prevent duplicated object.
		var cached = POTATO.getObject(gene.DERIVER, uuid);
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
