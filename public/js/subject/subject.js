/**
 * Base class for holding data.
 * @param uuid {String}
 * @param data {Object} Optional
 */
function sSubject(uuid, data) {
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

	/**
	 * Convert key to its abbreviation/intactness form.
	 * @param normal {Boolean} true: this.ab; false: this.ba
	 * @param subject {String}
	 * @param field {String}
	 * @return {Object} {subject:"{String}",field:"{String}"}
	 */
	var abba = function(normal, subject, field) {
		var map = normal ? this.ab : this.ba;
		var pick = function(key, sub) {
			return ((key in map) && (sub in map[key])) ? map[key][sub] : sub;
		};
		return {
			subject : pick('$', subject),
			field : pick(subject, field)
		};
	}.bind(this);

	/**
	 * Hold all private properties.
	 */
	data = $.extend(data, {$:uuid});

	/**
	 * Getter.
	 * @param field {String}
	 * @param subject {String}
	 * @return {undefined} or anything else
	 */
	this.get = function(field, subject) {
		var ab = abba(true, subject, field);
		return data[ab.subject][ab.field];
	};

	/**
	 * Setter.
	 * @param value
	 * @param field {String}
	 * @param subject {String}
	 */
	this.set = function(value, field, subject) {
		var ab = abba(true, subject, field);
		data[ab.subject][ab.field] = value;
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
			throw 'UUID mismatch while updating ' + callStatic('typeOf')
				+ ' #' + data.$ + ' vs #' + renewal.$;
		}
		$.each(renewal, function(subject, content) {
			if ('$' != subject) {
				var notify = subject in data ? POTATO.NOTIFY.UPDATE : POTATO.NOTIFY.INSERT;
				data[subject] = $.extend(data[subject], content);
				broadcast(abba(false, subject).subject, notify);
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

		var ab = abba(true, subject);
		if (ab.subject in data) {
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
 * @return {sSubject}
 */
sSubject.getObject = function(uuid) {
	return (this.cache || {})[uuid];
};

/**
 * Add an object into cache.
 * @param item {sSubject}
 */
sSubject.setObject = function(item) {
	this.cache = this.cache || {};
	this.cache[item.uuid()] = item;
};

/**
 * Load abbreviation mapping.
 * @param ab {Object}
 */
sSubject.loadAb = function(ab) {
	var ba = {$:{}};
	$.each(ab.$, function(subject, s) {
		ba.$[s] = subject;
		if (subject in ab) {
			var fields = {};
			$.each(ab[subject], function(field, f) {
				fields[f] = field;
			});
			ba[s] = fields;
		}
	});
	this.prototype.ab = ab;
	this.prototype.ba = ba;
};

/**
 * Get class name.
 * @return {String}
 */
sSubject.typeOf = function() {
	return this.toString().match(/^function (\w+)/)[1];
};
