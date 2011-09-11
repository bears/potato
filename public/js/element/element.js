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
	 * Hold all private properties.
	 */
	var data = {$:uuid};

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

	/// Cache this object.
	this.__proto__.constructor.setObject(this);
}

/**
 * Get a cached object.
 * @param uuid {String}
 * @return {bhElement}
 */
bhElement.getObject = function(uuid) {
	return (this._cache || {})[uuid];
}

/**
 * Add an object into cache.
 * @param item {bhElement}
 */
bhElement.setObject = function(item) {
	this._cache = this._cache || {};
	this._cache[item.uuid()] = item;
}

/**
 * Append an observer to a subject.
 * @param subject {String}
 * @param subscriber {Object} Must has method: notify(subject, action, source)
 */
bhElement.prototype.subscribe = function(subject, subscriber) {
	this._focus = this._focus || {};
	if (subject in this._focus) {
		this._focus[subject].push(subscriber);
	}
	else {
		this._focus[subject] = [subscriber];
	}
	subscriber.notify(subject, POTATO.NOTIFY.ATTACH, this);
}

/**
 * Remove an observer from a subject.
 * @param subject {String}
 * @param subscriber {Object} Must has method: notify(subject, action, source)
 */
bhElement.prototype.unsubscribe = function(subject, subscriber) {
	if (subject in this._focus) {
		var index = this._focus[subject].indexOf(subscriber);
		if (-1 != index) {
			this._focus[subject].splice(index, 1);
			subscriber.notify(subject, POTATO.NOTIFY.DETACH, this);
		}
	}
}

/**
 * Send notify to all subscribers.
 * @param subject {String}
 * @param notify {String} One of POTATO.NOTIFY.
 */
bhElement.prototype.broadcast = function(subject, notify) {
	this._focus = this._focus || {};
	if (subject in this._focus) {
		var source = this;
		$.each(this._focus[subject], function() {
			this.notify(subject, notify, source);
		});
	}
}

/**
 * Notify type enumerations
 */
var POTATO = POTATO || {};
POTATO.NOTIFY = {
	///@name Data
	//@{
	INSERT:'INSERT',
	UPDATE:'UPDATE',
	DELETE:'DELETE',
	//@}

	///@name Operation
	//@{
	ATTACH:'ATTACH',
	DETACH:'DETACH'
	//@
};
