'use strict';

/**
 * Single potato in season panel.
 * @param uuid {String}
 * @param target {String}
 */
function tuber(uuid, target) {
	// Prevent duplicated object.
	var cached = $('#tuber_' + uuid).data('self');
	if (cached instanceof tuber) {
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
			i : tuber.icons[source.get('brand', 'tuber')],
			t : source.get('label', 'tuber')
		});
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$(html).data('self', this).click(function(event) {
					event.stopPropagation();
					$('#annual .season>li.ui-state-highlight').removeClass('ui-state-highlight');
					$(this).addClass('ui-state-highlight');
					(new stock(uuid)).waken();
				}).appendTo(vessel);
				break;

			case POTATO.NOTIFY.UPDATE:
				$('#tuber_' + uuid).html(html);
				break;
		}
	};

	// Subscribe to the data source.
	(new potato(uuid)).subscribe('tuber', this);
}

/**
 * Icon table.
 */
tuber.icons = ['pencil', 'refresh', 'shuffle', 'note', 'document'];