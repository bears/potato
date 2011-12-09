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
	 * @param data {Object} Optional
	 */
	POTATO.Cluster = function cluster(filter, extra, data) {
		return POTATO.Subject.apply(this, [filter, function(gene) {
			var ADDRESS = formalName(gene.DERIVER);

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
							list.push(new POTATO[ADDRESS](this.$, this));
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
			this.key = function() {
				return filter.split('=', 2)[1];
			};

			/**
			 * Append an observer to a subject.
			 * @param subject {String}
			 * @param claimer {Object} Must has method: notify(subject, action, source)
			 * @param extra {String}
			 */
			gene.subscribe = function(subject, claimer, extra) {
				if (-1 != page.indexOf(extra)) {
					claimer.notify(subject, POTATO.NOTIFY.INSERT, this);
				}
				else {
					var url = 'a/' + gene.DERIVER + '/' + filter + ',' + extra + '/' + subject;
					$.getJSON(POTATO.AJAJ_DOMAIN + url, function(data) {
						this.append(extra, data);
						gene.broadcast(subject, POTATO.NOTIFY.INSERT);
					}.bind(this));
				}
			};
		}]);
	};
})();
