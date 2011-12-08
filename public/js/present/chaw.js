'use strict';

(function() {
	/**
	 * Instantiate template.
	 * @param template {String}
	 * @param source {POTATO.Potato}
	 * @return {String}
	 */
	function mask(template, source) {
		return POTATO.replace(template, {
			u : source.uuid(),
			c : source.get('detail', 'fries')
		});
	}

	/**
	 * Single chip in fries.
	 * @param uuid {String}
	 * @param vessel {Element}
	 */
	POTATO.Chaw = function chaw(uuid, vessel) {
		return POTATO.Present.apply(this, [uuid, function() {
			/**
			 * menu items.
			 */
			var actions = {
				edit : function() {
					new POTATO.Edit(POTATO.getObject('Chip', uuid), 'fries', 'detail', $('#chaw_' + uuid).parent());
				}
			};

			/**
			 * Callback for chip.
			 * @param subject {String}
			 * @param type {String} One of POTATO.NOTIFY.*
			 * @param source {potato}
			 */
			this.notify = function(subject, type, source) {
				switch (type) {
					case POTATO.NOTIFY.INSERT:
						var target = $(mask(POTATO.TEMPLATE[subject], source)).click(function(event) {
							event.stopPropagation();
							(new POTATO.Menu()).setup(actions);
						}).appendTo(vessel);
						$('>.shrink', target).click(function(event) {
							$(this).parent().toggleClass('collapsed');
						});
						break;

					case POTATO.NOTIFY.UPDATE:
						break;
				};
			};
		}, {
			'fries' : POTATO.Chip
		}]);
	};
})();
