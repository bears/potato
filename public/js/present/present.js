'use strict';

(function(POTATO) {
	/**
	 * Base class for showing data.
	 * @param uuid {String}
	 * @param builder {Function}
	 * @param sources {Object}
	 */
	POTATO.Present = function(uuid, builder, sources) {
		return POTATO.Object.apply(this, [uuid, function(gene) {
			// Initialize this by deriver.
			('function' == typeof builder) && builder.apply(this, [gene]);

			// Subscribe to data sources.
			for (var subject in sources) {
				(new sources[subject](uuid)).subscribe(subject, gene.SELF);
			}
		}]);
	};
})(POTATO);
