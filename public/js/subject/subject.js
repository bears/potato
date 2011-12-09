'use strict';

(function() {
	/**
	 * Notify type enumerations.
	 */
	POTATO.NOTIFY = {
		// Data
		INSERT : 'INSERT',
		UPDATE : 'UPDATE',
		DELETE : 'DELETE',
		// Operation
		ATTACH : 'ATTACH',
		DETACH : 'DETACH'
	};

	/**
	 * Base class for holding data.
	 * @param uuid {String}
	 * @param builder {Function}
	 */
	POTATO.Subject = function subject(uuid, builder) {
		return POTATO.Object.apply(this, [uuid, function(gene) {
			gene.focus = {};

			/**
			 * Send notify to all subscribers.
			 * @param subject {String}
			 * @param notify {String} One of POTATO.NOTIFY.*
			 * @param except {Object}
			 */
			gene.broadcast = function(subject, notify, except) {
				if (subject in gene.focus) {
					$.each(gene.focus[subject], function() {
						(this != except) && this.notify(subject, notify, gene.SELF);
					});
				}
			};

			/**
			 * Append an observer to a subject.
			 * @param subject {String}
			 * @param claimer {Object} Must has method: notify(subject, action, source)
			 */
			this.subscribe = function(subject, claimer) {
				(subject in gene.focus) ? gene.focus[subject].push(claimer) : (gene.focus[subject] = [claimer]);
				claimer.notify(subject, POTATO.NOTIFY.ATTACH, this);
				gene.subscribe.apply(this, arguments);
			};

			/**
			 * Remove an observer from a subject.
			 * @param subject {String}
			 * @param claimer {Object} Must has method: notify(subject, action, source)
			 */
			this.unsubscribe = function(subject, claimer) {
				if (subject in gene.focus) {
					var index = gene.focus[subject].indexOf(claimer);
					if (-1 != index) {
						gene.focus[subject].splice(index, 1);
						claimer.notify(subject, POTATO.NOTIFY.DETACH, this);
					}
				}
			};

			// Initialize this by deriver.
			('function' == typeof builder) && builder.apply(this, [gene]);
		}]);
	};
})();
