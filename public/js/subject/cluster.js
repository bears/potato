'use strict';

(function() {
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
	 * Base class for holding list.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.Cluster = function Cluster(filter, extra, data) {
		var DERIVER = POTATO.typeOf(this);

		// Prevent duplicated object.
		var cached = POTATO.getObject(DERIVER, filter);
		if (undefined !== cached) {
			cached.append(extra, data);
			return cached;
		}

		/**
		 * Hold all private properties.
		 */
		var page = [], list = [];

		/**
		 * Append more items.
		 * @param extra {String}
		 * @param data {Array}
		 */
		(this.append = function(extra, data) {
			if ((undefined !== extra) && (-1 == page.indexOf(extra))) {
				page.push(extra);
				if ($.isArray(data)) {
					$.each(data, function() {
						list.push(new POTATO[DERIVER](this.$, this));
					})
				}
			}
		})(extra, data);

		/**
		 * Iterating all items.
		 * @param callback {Function}
		 */
		this.each = function(callback) {
			$.each(list, function() {
				callback.apply(this);
			});
		};

		/**
		 * Get distinct part of the filter.
		 * @return {String}
		 */
		this.uuid = function() {
			return filter.split('=', 2)[1];
		};

		/**
		 * Hold all subscribers.
		 */
		var focus = {};

		/**
		 * Append an observer to a subject.
		 * @param subject {String}
		 * @param claimer {Object} Must has method: notify(subject, action, source)
		 * @param extra {String}
		 */
		this.subscribe = function(subject, claimer, extra) {
			(subject in focus) ? focus[subject].push(claimer) : (focus[subject] = [claimer]);
			claimer.notify(subject, POTATO.NOTIFY.ATTACH, this);

			if (-1 != page.indexOf(extra)) {
				claimer.notify(subject, POTATO.NOTIFY.INSERT, this);
			}
			else {
				var url = 'a/' + DERIVER.toLowerCase() + '/' + filter + ',' + extra + '/' + subject;
				$.getJSON(POTATO.AJAJ_DOMAIN + url, function(data) {
					this.append(extra, data);
					broadcast(this, focus, subject, POTATO.NOTIFY.INSERT);
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
		POTATO.setObject(this, filter);
	};
})();
