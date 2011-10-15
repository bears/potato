/**
 * Seasons panel.
 */
function pSeason(current) {
	// Keep singleton.
	if (pSeason.cache instanceof pSeason) {
		return pSeason.cache;
	}

	// Cache this object.
	pSeason.cache = this;

	/**
	 * Hold all private properties.
	 */
	var data = {
		spring : new season('spring'),
		summer : new season('summer'),
		autumn : new season('autumn'),
		winter : new season('winter')
	};

	// Default season.
	if (!(current in data)) {
		current = 'summer';
	}

	/**
	 * Callback for season.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {season}
	 */
	this.notify = function(subject, type, source) {
		var target = source.uuid();
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				$.each(source.get('tubers', 'season'), function() {
					new potato(this.$, this);
					new pTuber(this.$, target);
				});
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		}
	};

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
		tolerance : 'pointer',
		drop : function(event, ui) {
			var season = $('.season', $('a', this).attr('href'));
			var sticker = $(this);
			ui.draggable.hide('fast', function() {
				tabs.tabs('select', stickers.index(sticker));
				$(this).appendTo(season).show('fast', function() {
					$(this).removeAttr('style');
				});
			});
		}
	});
	var lists = $('.season', tabs).sortable({
		handle : '.handle',
		placeholder : 'ui-state-disabled ui-state-hover ui-corner-all',
		opacity : 0.5,
		stop : function(event, ui) {
			ui.item.removeAttr('style');
		}
	});
}