/**
 * Base class for holding data.
 * @param uuid {String}
 */
function bhElement(uuid) {
	/// Prevent duplicated object.
	var cached = this.__proto__.constructor.getObject(uuid);
	if (undefined !== cached) {
		return cached;
	}

	/**
	 * Convert key to its abbreviation form.
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

	/**
	 * Send notify to all subscribers.
	 * @param subject {String}
	 * @param notify {String} One of POTATO.NOTIFY.
	 */
	this.broadcast = function(subject, notify) {
		if (subject in focus) {
			var source = this;
			$.each(focus[subject], function() {
				this.notify(subject, notify, source);
			});
		}
	}

	/// Cache this object.
	this.__proto__.constructor.setObject(this);
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
