'use strict';

(function() {
	/**
	 * Annual panel.
	 */
	POTATO.Annual = function Annual(current) {
		// Keep singleton.
		if (Annual.cache instanceof Annual) {
			return Annual.cache;
		}

		// Cache this object.
		Annual.cache = this;

		/**
		 * Hold all private properties.
		 */
		var data = {
			spring : new POTATO.Season('spring'),
			summer : new POTATO.Season('summer'),
			autumn : new POTATO.Season('autumn'),
			winter : new POTATO.Season('winter')
		};

		// Default season.
		if (!(current in data)) {
			current = 'summer';
		}

		/**
		 * Callback for season.
		 * @param subject {String}
		 * @param type {String} One of POTATO.NOTIFY.*
		 * @param source {POTATO.Season}
		 */
		this.notify = function(subject, type, source) {
			var target = source.uuid();
			var vessel = $('#season_' + target + '>ul');
			switch (type) {
				case POTATO.NOTIFY.ATTACH:
					vessel.addClass('loading');
					break;

				case POTATO.NOTIFY.INSERT:
					$.each(source.get('tubers', 'season'), function() {
						new POTATO.Potato(this.$, this);
						new POTATO.Tuber(this.$, target);
					});
					vessel.removeClass('loading');
					break;

				case POTATO.NOTIFY.UPDATE:
					break;
			}
		};

		// Initial container.
		var tabs = $('#annual').tabs({
			select : function(event, ui) {
				data[current].unsubscribe('season', Annual.cache);
				current = ui.tab.href.match(/#season_(\w+)/)[1];
				data[current].subscribe('season', Annual.cache);
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

		// Bind menu
		lists.click(function(event) {
			event.stopPropagation();
			(new menu()).setup(actions);
		});

		/**
		 * menu items.
		 */
		var actions = {
			seed : function() {
				alert('Not implement yet!');
			},
			stats : function() {
				alert('Not implement yet!')
			}
		};
	};
})();
