'use strict';

(function() {
	/**
	 * Icon table.
	 */
	POTATO.tuberIcons = ['pencil', 'refresh', 'shuffle', 'note', 'document'];

	/**
	 * Instantiate template.
	 * @param template {String}
	 * @param source {POTATO.Potato}
	 * @return {String}
	 */
	function mask(template, source) {
		return POTATO.replace(template, {
			u : source.uuid(),
			i : POTATO.tuberIcons[source.get('brand', 'tuber')],
			t : source.get('label', 'tuber')
		});
	}

	/**
	 * Single potato in season panel.
	 * @param uuid {String}
	 * @param target {String}
	 */
	POTATO.Tuber = function(uuid, target) {
		return POTATO.Present.apply(this, [uuid, function() {
			/**
			 * The element to insert into.
			 */
			var vessel = $('#season_' + target + ' .season');

			/**
			 * Callback for potato.
			 * @param subject {String}
			 * @param type {String} One of POTATO.NOTIFY.*
			 * @param source {potato}
			 */
			this.notify = function(subject, type, source) {
				switch (type) {
					case POTATO.NOTIFY.INSERT:
						$(mask(POTATO.TEMPLATE[subject], source)).click(function(event) {
							event.stopPropagation();
							$('#annual .season>li.ui-state-highlight').removeClass('ui-state-highlight');
							$(this).addClass('ui-state-highlight');
							(new POTATO.Stock(uuid)).waken();
						}).appendTo(vessel);
						break;

					case POTATO.NOTIFY.UPDATE:
						$('#tuber_' + uuid).html(mask(POTATO.TEMPLATE[subject], source));
						break;
				}
			};
		}, {
			'tuber' : POTATO.Potato
		}]);
	};
})();
