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
		var html = POTATO.replace(tuber.template, {
			uuid : source.uuid(),
			icon : tuber.icons[source.get('brand', 'tuber')],
			text : source.get('label', 'tuber')
		});
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$(html).data('self', this).click(function() {
					$('#seasons .season>li.ui-state-highlight').removeClass('ui-state-highlight');
					$(this).addClass('ui-state-highlight');
					new stock(source.uuid());
				}).appendTo(vessel);
				break;

			case POTATO.NOTIFY.UPDATE:
				$('#tuber_' + source.uuid()).html(html);
				break;
		}
	};

	// Subscribe to the data source.
	(new potato(uuid)).subscribe('tuber', this);
}

/**
 * HTML template for new element.
 */
tuber.template = '<li id="tuber_{%uuid%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%icon%}"></a>{%text%}</li>';

/**
 * Icon table.
 */
tuber.icons = ['pencil', 'refresh', 'shuffle', 'note', 'document'];