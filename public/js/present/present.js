'use strict';

(function() {
	var templates = {};

	/**
	 * Send notify to all subscribers.
	 * @param subject {String}
	 */
	function broadcast(subject) {
		this.notify(subject, POTATO.NOTIFY.SKETCH, templates[subject]);
	}

	/**
	 * Base class for holding data.
	 * @param uuid {String}
	 * @param subject {String}
	 * @param builder {Function}
	 */
	POTATO.Present = function Present(uuid, subject, builder, sources) {
		var DERIVER = POTATO.typeOf(this);

		// Prevent duplicated object.
		var cached = POTATO.getObject(DERIVER, uuid);
		if (undefined !== cached) {
			return cached;
		}

		// Initialize this by deriver.
		builder.apply(this);

		// Subscribe to data sources.
		$.each(sources, function(index, source) {
			source.subscribe(index, this);
		}.bind(this));

		// Fetch HTML template.
		if (subject in templates) {
			if ('string' == typeof templates[subject]) {
				this.notify(templates[subject], POTATO.NOTIFY.SKETCH, sources[subject]);
			}
			else {
				templates[subject].push(this);
			}
		}
		else {
			templates[subject] = [this];
			$.get(POTATO.LOAD_PREFIX + 'html/' + subject + '.html', function(content) {
				var focus = templates[subject];
				templates[subject] = content;
				$.each(focus, function() {
					this.notify(templates[subject], POTATO.NOTIFY.SKETCH, sources[subject]);
				});
			});
		}

		// Cache this object.
		POTATO.setObject(this, uuid);
	};
})();
