/**
 * Single potato in season panel.
 * @param uuid {String}
 * @param target {String}
 */
function pTuber(uuid, target) {
	// Prevent duplicated object.
	var cached = $('#tuber_' + uuid).data('self');
	if (cached instanceof pTuber) {
		return cached;
	}

	/**
	 * The element to insert into.
	 */
	var vessel = $('#season_' + target + ' .season');

	/**
	 * Callback for sPotato.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {sPotato}
	 */
	this.notify = function(subject, type, source) {
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				var html = pTuber.template.replace(/{%(\w+)%}/g, function(unused, key) {
					return source.get(key, 'tuber');
				}).replace('{%$%}', source.uuid());
				$(html).data('self', this).click(function() {
					$('#seasons li.ui-state-highlight').removeClass('ui-state-highlight');
					$(this).addClass('ui-state-highlight');
					//new pDetail(data.id);
				}).appendTo(vessel);
				break;
		}
	};

	// Subscribe to the data source.
	(new sPotato(uuid)).subscribe('tuber', this);
}

/**
 * HTML template for new element.
 */
pTuber.template = '<li id="tuber_{%$%}" class="ui-widget-content"><a class="handle ui-icon ui-icon-{%brand%}"></a>{%label%}</li>';
