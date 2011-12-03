'use strict';

(function() {
	/**
	 * Base class for holding data.
	 * @param uuid {String}
	 * @param builder {Function}
	 */
	POTATO.Present = function Present(uuid, builder, sources) {
		var DERIVER = POTATO.typeOf(this);

		// Prevent duplicated object.
		var cached = POTATO.getObject(DERIVER, uuid);
		if (undefined !== cached) {
			return cached;
		}

		// Initialize this by deriver.
		builder.apply(this);

		// Subscribe to data sources.
		$.each(sources, function(subject, source) {
			(new source(uuid)).subscribe(subject, this);
		}.bind(this));

		// Cache this object.
		POTATO.setObject(this, uuid);
	};
})();
