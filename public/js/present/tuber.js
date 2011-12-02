'use strict';

(function() {
	/**
	 * Icon table.
	 */
	POTATO.tuberIcons = ['pencil', 'refresh', 'shuffle', 'note', 'document'];

	/**
	 * Single potato in season panel.
	 * @param uuid {String}
	 * @param target {String}
	 */
	POTATO.Tuber = function Tuber(uuid, target) {
		// Prevent duplicated object.
		var cached = $('#tuber_' + uuid).data('self');
		if (cached instanceof Tuber) {
			return cached;
		}

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
			var template = '<li id="tuber_{%u%}" title="{%t%}" class="ui-corner-all"><a class="handle ui-icon ui-icon-{%i%}"></a>{%t%}</li>';
			var html = POTATO.replace(template, {
				u : source.uuid(),
				i : POTATO.tuberIcons[source.get('brand', 'tuber')],
				t : source.get('label', 'tuber')
			});
			switch (type) {
				case POTATO.NOTIFY.INSERT:
					$(html).data('self', this).click(function(event) {
						event.stopPropagation();
						$('#annual .season>li.ui-state-highlight').removeClass('ui-state-highlight');
						$(this).addClass('ui-state-highlight');
						(new POTATO.Stock(uuid)).waken();
					}).appendTo(vessel);
					break;

				case POTATO.NOTIFY.UPDATE:
					$('#tuber_' + uuid).html(html);
					break;
			}
		};

		// Subscribe to the data source.
		(new POTATO.Potato(uuid)).subscribe('tuber', this);
	};
})();
