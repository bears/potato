'use strict';

/**
 * Notify type enumerations.
 */
POTATO.NOTIFY = {
	// Data
	INSERT : 'INSERT',
	UPDATE : 'UPDATE',
	DELETE : 'DELETE',
	// Operation
	ATTACH : 'ATTACH',
	DETACH : 'DETACH'
};

/**
 * Base class for holding data.
 * @param uuid {String}
 * @param data {Object} Optional
 */
function subject(uuid, data) {
	/**
	 * Call static method from object.
	 * @param object {Object}
	 * @param method {String}
	 * @param ...
	 */
	var callStatic = function() {
		var slices = [].slice.call(arguments);
		var method = slices.shift();
		var callee = this.__proto__.constructor;
		return callee[method].apply(callee, slices);
	}.bind(this);

	// Prevent duplicated object.
	var cached = callStatic('getObject', uuid);
	if (undefined !== cached) {
		return cached;
	}

	// Load abbreviation dictionary.
	var myType = callStatic('typeOf');
	var ab = POTATO.AB[myType] || {};
	var ba = POTATO.BA[myType] || {};

	/**
	 * Convert key to its abbreviation/intactness form.
	 * @param normal {Boolean} true: ab; false: ba
	 * @param pair {Array} [subject, field]
	 * @return {Object} {subject:"{String}",field:"{String}"}
	 */
	var abba = function(normal, pair) {
		var map = normal ? ab : ba;
		var subject = pair[0] + '';
		if (subject in map) {
			var lookup = map[subject];
			('$' in lookup) && (pair[0] = lookup.$);
			var field = pair[1] + '';
			(field in lookup) && (pair[1] = lookup[field]);
		}
		return pair;
	};

	/**
	 * Hold all private properties.
	 */
	data = $.extend(data, {
		$ : uuid,
		'undefined' : {/*for temporary values*/}
	});

	/**
	 * Getter.
	 * @param field {String}
	 * @param subject {String}
	 * @return {undefined} or anything else
	 */
	this.get = function(field, subject) {
		var ab = abba(true, [subject, field]);
		return data[ab[0]][ab[1]];
	};

	/**
	 * Setter.
	 * @param value
	 * @param field {String}
	 * @param subject {String}
	 */
	this.set = function(value, field, subject) {
		var ab = abba(true, [subject, field]);
		data[ab[0]][ab[1]] = value;
	};

	/**
	 * Get UUID.
	 * @return {String}
	 */
	this.uuid = function() {
		return data.$;
	};

	/**
	 * Hold all subscribers.
	 */
	var focus = {};

	/**
	 * Send notify to all subscribers.
	 * @param subject {String}
	 * @param notify {String} One of POTATO.NOTIFY.*
	 * @param except {Object}
	 */
	var broadcast = function(subject, notify, except) {
		if (subject in focus) {
			var source = this;
			$.each(focus[subject], function() {
				if (this != except) {
					this.notify(subject, notify, source);
				}
			});
		}
	}.bind(this);

	/**
	 * Callback for connection provider.
	 * @param renewal {Object}
	 */
	var update = function(renewal) {
		if (renewal.$ != data.$) {
			throw 'UUID mismatch while updating ' + myType
			+ ' #' + data.$ + ' vs #' + renewal.$;
		}
		$.each(renewal, function(subject, content) {
			if ('$' != subject) {
				var notify = subject in data ? POTATO.NOTIFY.UPDATE : POTATO.NOTIFY.INSERT;
				data[subject] = $.extend(data[subject], content);
				broadcast(abba(false, [subject])[0], notify);
			}
		});
	};

	/**
	 * Append an observer to a subject.
	 * @param subject {String}
	 * @param subscriber {Object} Must has method: notify(subject, action, source)
	 */
	this.subscribe = function(subject, subscriber) {
		if (subject in focus) {
			focus[subject].push(subscriber);
		}
		else {
			focus[subject] = [subscriber];
		}
		subscriber.notify(subject, POTATO.NOTIFY.ATTACH, this);

		if (abba(true, [subject])[0] in data) {
			subscriber.notify(subject, POTATO.NOTIFY.INSERT, this);
		}
		else {
			$.getJSON(POTATO.AJAJ_DOMAIN + subject + '/' + this.uuid(), update);
		}
	};

	/**
	 * Remove an observer from a subject.
	 * @param subject {String}
	 * @param subscriber {Object} Must has method: notify(subject, action, source)
	 */
	this.unsubscribe = function(subject, subscriber) {
		if (subject in focus) {
			var index = focus[subject].indexOf(subscriber);
			if (-1 != index) {
				focus[subject].splice(index, 1);
				subscriber.notify(subject, POTATO.NOTIFY.DETACH, this);
			}
		}
	};

	// Cache this object.
	callStatic('setObject', this);
}

/**
 * Get a cached object.
 * @param uuid {String}
 * @return {subject}
 */
subject.getObject = function(uuid) {
	return (this.cache || {})[uuid];
};

/**
 * Add an object into cache.
 * @param item {subject}
 */
subject.setObject = function(item) {
	this.cache = this.cache || {};
	this.cache[item.uuid()] = item;
};

/**
 * Get class name.
 * @return {String}
 */
subject.typeOf = function() {
	return this.toString().match(/^function (\w+)/)[1];
};
