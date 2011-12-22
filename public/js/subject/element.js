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
	 * Base class for holding data.
	 * @param uuid {String}
	 * @param data {Object} Optional
	 */
	POTATO.Element = function(uuid, data) {
		return POTATO.Subject.apply(this, [uuid, function(gene) {
			/**
			 * Hold all private properties.
			 */
			data = $.extend(data, {
				$ : uuid,
				'undefined' : {/*for temporary values*/}
			});

			/**
			 * Change list of data.
			 */
			var changes = {};

			/**
			 * Map abbreviation dictionaries.
			 */
			var ab = POTATO.AB[this._] || {};
			var ba = POTATO.BA[this._] || {};

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
			 * @param atom {String} optional
			 */
			this.set = function(value, field, subject, atom) {
				var oppo = abba(ab, [subject, field]);
				if ($.isEmptyObject(gene.focus[subject])) {
					data[oppo[0]][oppo[1]] = value;
				}
				else {
					var instant = undefined === atom;
					instant && (atom = Date.now());

					(atom in changes) || (changes[atom] = {});
					(oppo[0] in changes[atom]) || (changes[atom][oppo[0]] = {});
					changes[atom][oppo[0]][oppo[1]] = value;

					instant && this.commit(atom);
				}
			};

			/**
			 * Finish a change.
			 * @param atom {String}
			 */
			this.commit = function(atom) {
				var url = 'i/' + this._ + '/' + this.uuid() + '/_';
				$.post(POTATO.AJAJ_DOMAIN + url, changes[atom], function() {
					$.extend(true, data, changes[atom]);
					delete changes[atom];
				});
			};

			/**
			 * Discard a change.
			 * @param atom {String}
			 */
			this.cancel = function(atom) {
				delete changes[atom];
			};

			/**
			 * Append an observer to a subject.
			 * @param subject {String}
			 * @param claimer {Object} Must has method: notify(subject, action, source)
			 */
			gene.subscribe = function(subject, claimer) {
				if (abba(ab, [subject])[0] in data) {
					claimer.notify(subject, POTATO.NOTIFY.INSERT, this);
				}
				else {
					var url = 'i/' + this._ + '/' + this.uuid() + '/' + subject;
					$.getJSON(POTATO.AJAJ_DOMAIN + url, function(renewal) {
						delete renewal.$;
						for (var subject in renewal) {
							var notify = subject in data ? POTATO.NOTIFY.UPDATE : POTATO.NOTIFY.INSERT;
							data[subject] = $.extend(data[subject], renewal[subject]);
							gene.broadcast(abba(ba, [subject])[0], notify);
						}
					});
				}
			};
		}]);
	};
})();
