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
	POTATO.Chaw = function Chaw(uuid, vessel) {
		return POTATO.Present.apply(this, [uuid, 'fries', function() {
			var template;

			/**
			 * Callback for chip.
			 * @param subject {String}
			 * @param type {String} One of POTATO.NOTIFY.*
			 * @param source {potato}
			 */
			this.notify = function(subject, type, source) {
				switch (type) {
					case POTATO.NOTIFY.SKETCH:
						template = subject;
						if (undefined === source) break;
					// goto next case

					case POTATO.NOTIFY.INSERT:
						if (template) {
							var target = $(mask(template, source)).data('self', this).click(function(event) {
								event.stopPropagation();
								(new menu()).setup({
									edit : function() {
										new edit(source, 'fries', 'detail', $('#chaw_' + uuid).parent());
									}
								});
							}).appendTo(vessel);
							$('>.shrink', target).click(function(event) {
								$(this).parent().toggleClass('collapsed');
							});
						}
						break;

					case POTATO.NOTIFY.UPDATE:
						break;
				};
			};
		}, {
			'fries' : new POTATO.Chip(uuid)
		}]);
	};
})();
