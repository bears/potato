'use strict';

POTATO.module('present/annual', ['present'], function() {
	/**
	 * Annual panel.
	 */
	POTATO.derive(POTATO.Present, 'Annual', function(current) {
		return POTATO.Present.call(this, POTATO.SINGLETON, function(gene) {
			/**
			 * Hold all private properties.
			 */
			var data = {
				spring : new POTATO.Potatoes('tubers=spring'),
				summer : new POTATO.Potatoes('tubers=summer'),
				autumn : new POTATO.Potatoes('tubers=autumn'),
				winter : new POTATO.Potatoes('tubers=winter')
			};

			// Default season.
			if (!(current in data)) {
				current = 'summer';
			}

			/**
			 * Callback for season.
			 * @param subject {String}
			 * @param type {String} One of POTATO.NOTIFY.*
			 * @param source {POTATO.Potatoes}
			 */
			this.notify = function(subject, type, source) {
				var target = source.sign();
				var vessel = $('#season_' + target + '>ul');
				switch (type) {
					case POTATO.NOTIFY.ATTACH:
						vessel.addClass('loading');
						break;

					case POTATO.NOTIFY.INSERT:
						source.each('tuber', function(uuid) {
							new POTATO.Tuber(uuid, target);
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
					data[current].unsubscribe('tuber', gene.SELF);
					current = ui.tab.href.match(/#season_(\w+)/)[1];
					data[current].subscribe('tuber', gene.SELF, '0');
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
				POTATO.require(['widget/menu'], function() {
					(new POTATO.Menu()).setup(actions);
				});
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
		});
	});
});
