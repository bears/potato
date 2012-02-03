'use strict';

POTATO.module('cluster', ['subject'], function() {
	/**
	 * Base class for holding list.
	 * @param unit {String}
	 * @param type {String}
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Subject, 'Cluster', function(unit, type, uuid) {
		return POTATO.Subject.call(this, uuid, function(gene) {
			/**
			 * Hold all private properties.
			 */
			var data = {}, page = {};

			/**
			 * Append more items.
			 * @param subject {String}
			 * @param filter {String}
			 * @param shear {Array}
			 */
			this.append = function(subject, filter, shear) {
				(subject in data) || (data[subject] = {});
				(subject in page) || (page[subject] = {});
				var pool = data[subject];
				for (var i in shear) {
					var item = shear[i];
					var uuid = item.$;
					pool[uuid] = new POTATO[unit](uuid, item);
				}
				page[subject][filter] = true;
			};

			/**
			 * Iterating all items.
			 * @param subject {String}
			 * @param callback {Function}
			 */
			this.each = function(subject, callback) {
				var pool = data[subject];
				for (var uuid in pool) {
					callback.call(pool[uuid], uuid);
				}
			};

			/**
			 * Get distinct part of the uuid.
			 * @return {String}
			 */
			this.sign = function() {
				return uuid.split('=', 2)[1];
			};

			/**
			 * Append an observer to a subject.
			 * @param subject {String}
			 * @param claimer {Object} Must has method: notify(subject, action, source)
			 * @param filter {String}
			 */
			gene.subscribe = function(subject, claimer, filter) {
				if ((subject in page) && (filter in page[subject])) {
					claimer.notify(subject, POTATO.NOTIFY.INSERT, this);
				}
				else {
					var url = 'a/' + type + '/' + uuid + ',' + filter + '/' + subject;
					POTATO.get(url, function(shear) {
						gene.SELF.append(subject, filter, shear);
						gene.broadcast(subject, POTATO.NOTIFY.INSERT);
					});
				}
			};
		});
	});
});
