'use strict';

(function() {
	/**
	 * Convert a private name to public name.
	 * @param privateName {String}
	 * @return {String}
	 */
	function formalName(privateName) {
		return ('_' + privateName).replace(/_(.)/, function(unused, first) {
			return first.toUpperCase();
		});
	}

	/**
	 * Base class for holding list.
	 * @param uuid {String}
	 */
	POTATO.Cluster = function cluster(uuid) {
		return POTATO.Subject.apply(this, [uuid, function(gene) {
			var AGAINST = POTATO[formalName(gene.DERIVER)];

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
					var url = 'a/' + gene.DERIVER + '/' + uuid + ',' + filter + '/' + subject;
					$.getJSON(POTATO.AJAJ_DOMAIN + url, function(shear) {
						gene.SELF.append(subject, filter, shear);
						gene.broadcast(subject, POTATO.NOTIFY.INSERT);
					});
				}
			};
		}]);
	};
})();
