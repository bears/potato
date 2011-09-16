/**
 * Seasons panel.
 */
function pSeason(current) {
	// Keep singleton.
	if (pSeason.cache instanceof pSeason) {
		return pSeason.cache;
	}

	/**
	 * Hold all private properties.
	 */
	var data = {
		'spring' : new sSeason('spring'),
		'summer' : new sSeason('summer'),
		'autumn' : new sSeason('autumn'),
		'winter' : new sSeason('winter')
	};

	/**
	 * Callback for sSeason.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {sSeason}
	 */
	this.notify = function(subject, type, source) {
		var target = source.uuid();
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$.each(source.get('tubers', 'season'), function() {
					new sPotato(this.$, this);
					new pTuber(this.$, target);
				});
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		}
	};

	// Default season.
	if (!(current in data)) {
		current = 'summer';
	}

	// Cache this object.
	pSeason.cache = this;

	//
	var tabs = $('#seasons').tabs({
		select : function(event, ui) {
			data[current].unsubscribe('season', pSeason.cache);
			current = ui.tab.href.match(/#season_(\w+)/)[1];
			data[current].subscribe('season', pSeason.cache);
		}
	}).tabs('select', current);
	var stickers = $('.stickers>li', tabs).droppable({
		accept : '.season>li',
		hoverClass : 'ui-state-highlight',
		tolerance : 'pointer'
	});
}