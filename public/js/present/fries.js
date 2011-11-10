/**
 * Chips in stock panel.
 * @param uuid {String}
 */
function fries(uuid) {
	/**
	 * The element to insert into.
	 */
	var vessel = $('#stock_' + uuid + ' .fries');

	// Prevent duplicated object.
	var cached = vessel.data('self');
	if (cached instanceof fries) {
		return cached;
	}

	// Cache this object.
	vessel.data('self', this);

	/**
	 * Callback for chips.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {potato}
	 */
	this.notify = function(subject, type, source) {
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				vessel.removeClass('loading');
				$.each(source.get('chips', 'fries'), function() {
					new chip(this.$, this);
					new chaw(this.$, vessel);
				});
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		};
	};

	// Subscribe to the data source.
	(new chips(uuid)).subscribe('fries', this);
}
