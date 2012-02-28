'use strict';

POTATO.module('object', [], function() {
	/**
	 * Object cache pool.
	 */
	var pool = {};

	/**
	 * Guess class name.
	 * @param item {Function|Object|String}
	 * @return {String}
	 */
	var guessType = function(item) {
		switch (typeof item) {
			case 'function':
				return item.$;
			case 'object':
				return item.constructor.$;
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
		var type = guessType(item);
		return (type in pool) && pool[type][uuid] || false;
	};

	/**
	 * Add an object.
	 * @param {POTATO.Object}
	 */
	POTATO.setObject = function() {
		for (var i in arguments) {
			var item = arguments[i];
			var type = guessType(item);
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
			var type = guessType(item);
			(type in pool) && (delete pool[type][item.uuid()]);
		}
	};

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
		('function' === typeof builder) && builder.call(this, gene);
	};

	/**
	 * Define derived class.
	 * @param foundation {Function}
	 * @param name {String}
	 * @param derivative {Function}
	 */
	POTATO.derive = function(foundation, name, derivative) {
		Object.defineProperties(derivative, {
			prototype : {
				value : Object.create(foundation.prototype, {
					constructor : {
						value : derivative
					}
				})
			},
			$ : {
				value : name
			}
		});
		POTATO[name] = derivative;
	};

	/**
	 * UUID for singleton.
	 */
	Object.defineProperty(POTATO, 'SINGLETON', {
		value : '00000000-0000-0000-0000-000000000000'
	});
});
