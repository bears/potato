'use strict';

(function() {
	/**
	 * Base class for showing data.
	 * @param uuid {String}
	 * @param builder {Function}
	 * @param sources {Object}
	 */
	POTATO.Present = function present(uuid, builder, sources) {
		return POTATO.Object.apply(this, [uuid, function(gene) {
			// Initialize this by deriver.
			('function' == typeof builder) && builder.apply(this, [gene]);

			// Subscribe to data sources.
			$.each((sources || {}), function(subject, source) {
				(new source(uuid)).subscribe(subject, gene.SELF);
			});
		}]);
	};
})();
