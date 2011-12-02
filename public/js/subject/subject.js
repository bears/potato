'use strict';

(function() {
	/**
	 * Convert key to its abbreviation/intactness form.
	 * @param map {Object} Abbr. or V.V.
	 * @param pair {Array} [subject, field]
	 * @return {Array} Converted pair
	 */
	function abba(map, pair) {
		var subject = pair[0] + '';
		if (subject in map) {
			var lookup = map[subject];
			('$' in lookup) && (pair[0] = lookup.$);
			var field = pair[1] + '';
			(field in lookup) && (pair[1] = lookup[field]);
		}
		return pair;
	}

	/**
	 * Send notify to all subscribers.
	 * @param source {POTATO.Subject}
	 * @param focus {Object} Observers
	 * @param subject {String}
	 * @param notify {String} One of POTATO.NOTIFY.*
	 * @param except {Object}
	 */
	function broadcast(source, focus, subject, notify, except) {
		if (subject in focus) {
			$.each(focus[subject], function() {
				if (this != except) {
					this.notify(subject, notify, source);
				}
			});
		}
	}

	/**
	 * Callback for connection provider.
	 * @param data {Object}
	 * @param renewal {Object}
	 * @param focus {Object} Observers
	 * @param ba {Object} Abbreviation reverse transform.
	 * @param source {Object}
	 */
	function update(data, renewal, focus, ba, source) {
		if (renewal.$ != data.$) {
			throw 'UUID mismatch while updating ' + DERIVER
			+ ' #' + data.$ + ' vs #' + renewal.$;
		}
		$.each(renewal, function(subject, content) {
			if ('$' != subject) {
				var notify = subject in data ? POTATO.NOTIFY.UPDATE : POTATO.NOTIFY.INSERT;
				data[subject] = $.extend(data[subject], content);
				broadcast(source, focus, abba(ba, [subject])[0], notify);
			}
		});
	}

	/**
	 * Base class for holding data.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.Subject = function Subject(uuid, data) {
		var DERIVER = POTATO.typeOf(this);

		// Prevent duplicated object.
		var cached = POTATO.getObject(DERIVER, uuid);
		if (undefined !== cached) {
			return cached;
		}

		// Load abbreviation dictionary.
		var ab = POTATO.AB[DERIVER] || {};
		var ba = POTATO.BA[DERIVER] || {};

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
			var oppo = abba(ab, [subject, field]);
			return data[oppo[0]][oppo[1]];
		};

		/**
		 * Setter.
		 * @param value
		 * @param field {String}
		 * @param subject {String}
		 */
		this.set = function(value, field, subject) {
			var oppo = abba(ab, [subject, field]);
			data[oppo[0]][oppo[1]] = value;
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
		 * Append an observer to a subject.
		 * @param subject {String}
		 * @param claimer {Object} Must has method: notify(subject, action, source)
		 */
		this.subscribe = function(subject, claimer) {
			(subject in focus) ? focus[subject].push(claimer) : (focus[subject] = [claimer]);
			claimer.notify(subject, POTATO.NOTIFY.ATTACH, this);

			if (abba(ab, [subject])[0] in data) {
				claimer.notify(subject, POTATO.NOTIFY.INSERT, this);
			}
			else {
				$.getJSON(POTATO.AJAJ_DOMAIN + subject + '/' + this.uuid(), function(renewal) {
					update(data, renewal, focus, ba, this);
				}.bind(this));
			}
		};

		/**
		 * Remove an observer from a subject.
		 * @param subject {String}
		 * @param claimer {Object} Must has method: notify(subject, action, source)
		 */
		this.unsubscribe = function(subject, claimer) {
			if (subject in focus) {
				var index = focus[subject].indexOf(claimer);
				if (-1 != index) {
					focus[subject].splice(index, 1);
					claimer.notify(subject, POTATO.NOTIFY.DETACH, this);
				}
			}
		};

		// Cache this object.
		POTATO.setObject(this, uuid);
	};
})();
