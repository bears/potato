'use strict';

(function() {
	/**
	 * Base class for holding list.
	 * @param uuid {String}
	 */
	POTATO.Cluster = function(uuid) {
		return POTATO.Subject.apply(this, [uuid, function(gene) {
			var AGAINST = POTATO[this._];

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
					pool[uuid] = new AGAINST(uuid, item);
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
					callback.apply(pool[uuid], [uuid]);
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
					var url = 'a/' + AGAINST.prototype._ + '/' + uuid + ',' + filter + '/' + subject;
					POTATO.get(url, function(shear) {
						gene.SELF.append(subject, filter, shear);
						gene.broadcast(subject, POTATO.NOTIFY.INSERT);
					});
				}
			};
		}]);
	};
})();
