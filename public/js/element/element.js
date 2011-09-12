/**
 * Base class for holding data.
 * @param uuid {String}
 */
function bhElement(uuid) {
	/**
	 * Call static method from object.
	 * @param object {Object}
	 * @param method {String}
	 * @param ...
	 */
	var callStatic = function() {
		var object = Array.shift(arguments);
		var method = Array.shift(arguments);
		var callee = object.__proto__.constructor;
		return callee[method].apply(callee, arguments);
	}

	/// Prevent duplicated object.
	var cached = callStatic(this, 'getObject', uuid);
	if (undefined !== cached) {
		return cached;
	}

	/**
	 * Convert key to its abbreviation form.
	 * (Ab. of an ab. is its intact form.)
	 * @param key {Json} {subject:"{String}",field:"{String}"}
	 */
	var toAb = function(key) {
		if (('_' in this.ab) && (key.subject in this.ab._)) {
			key.subject = this.ab._[key.subject];
		}
		if ((key.subject in this.ab) && (key.field in this.ab[key.subject])) {
			key.field = this.ab[key.subject][key.field];
		}
		return key;
	}

	/**
	 * Hold all private properties.
	 */
	var data = {$:uuid};

	/**
	 * Getter.
	 * @param field {String}
	 * @param subject {String}
	 * @return {undefined} or anything else
	 */
	this.get = function(field, subject) {
		var ab = toAb.call(this, {subject:subject, field:field});
		return data[ab.subject][ab.field];
	};

	/**
	 * Setter.
	 * @param value
	 * @param field {String}
	 * @param subject {String}
	 */
	this.set = function(value, field, subject) {
		var ab = toAb.call(this, {subject:subject, field:field});
		data[ab.subject][ab.field] = value;
	};

	/**
	 * Get UUID.
	 * @return {String}
	 */
	this.uuid = function() {
		return data['$'];
	}

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
	}

	/**
	 * Callback for connection provider.
	 * @param renewal {Object}
	 */
	var update = function(renewal) {
		if (renewal.$ != data.$) {
			throw 'UUID mismatch while updating ' + callStatic(this, 'typeOf')
				+ ' #' + data.$ + ' vs #' + renewal.$;
		}
		$.each(renewal, function(subject, content) {
			if ('$' != subject) {
				var notify = subject in data ? POTATO.NOTIFY.UPDATE : POTATO.NOTIFY.INSERT;
				data[subject] = $.extend(data[subject], content);
				var ab = toAb.call(this, {subject:subject, field:null});
				broadcast(ab.subject, notify);
			}
		});
	}

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

		var ab = toAb.call(this, {subject:subject, field:null});
		if (ab.subject in data) {
			subscriber.notify(subject, POTATO.NOTIFY.INSERT, this);
		}
		else {
			// TODO: register at connection provider to use update() as callback
		}
	}

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
	}

	/// Cache this object.
	callStatic(this, 'setObject', this);
}

/**
 * Get a cached object.
 * @param uuid {String}
 * @return {bhElement}
 */
bhElement.getObject = function(uuid) {
	return (this.cache || {})[uuid];
}

/**
 * Add an object into cache.
 * @param item {bhElement}
 */
bhElement.setObject = function(item) {
	this.cache = this.cache || {};
	this.cache[item.uuid()] = item;
}

/**
 * Load abbreviation mapping.
 * @param ab {Object}
 */
bhElement.loadAb = function(ab) {
	$.each(ab._, function(full, k) {
		ab._[k] = full;
	});
	$.each(ab, function(subject, mapping) {
		$.each(mapping, function(full, k) {
			mapping[k] = full;
		});
		if (subject in ab._) {
			ab[ab._[subject]] = mapping;
		}
	});
	this.prototype.ab = ab;
}

/**
 * Get class name.
 * @return {String}
 */
bhElement.typeOf = function() {
	return this.toString().match(/^function (\w+)/)[1];
}
