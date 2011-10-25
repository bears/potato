/**
 * Single chip in fries.
 * @param uuid {String}
 * @param vessel {Element}
 */
function chaw(uuid, vessel) {
	// Prevent duplicated object.
	var cached = $('#chaw_' + uuid).data('self');
	if (cached instanceof fries) {
		return cached;
	}

	/**
	 * Callback for chip.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {potato}
	 */
	this.notify = function(subject, type, source) {
		var template = '<blockquote class="ui-corner-br"><time/><span class="shrink ui-icon ui-icon-carat-1-s"/><div class="editable">{%c%}</div></blockquote>';
		var html = POTATO.replace(template, {
			c : source.get('detail', 'fries')
		});
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$(html).appendTo(vessel);
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		};
	};

	// Subscribe to the data source.
	(new chip(uuid)).subscribe('fries', this);
}
