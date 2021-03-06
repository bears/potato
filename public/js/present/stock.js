'use strict';

POTATO.module('present/stock', ['present', 'html!stock'], function() {
	function iso8601(time) {
		return time ? (time.replace(' ', 'T').slice(0, 19) + 'Z') : '';
	}

	/**
	 * Instantiate template.
	 * @param template {String}
	 * @param source {POTATO.Potato}
	 * @return {String}
	 */
	function mask(template, source) {
		var seeding = iso8601(source.get('seeding', 'stock'));
		var harvest = iso8601(source.get('harvest', 'stock'));
		return POTATO.replace(template, {
			u : source.uuid(),
			i : POTATO.tuberIcons[source.get('brand', 'tuber')],
			p : '10d', ///< TODO: add this in schema
			s : seeding,
			S : POTATO.genialTime(seeding),
			h : harvest,
			H : POTATO.genialTime(harvest),
			l : source.get('label', 'tuber'),
			c : source.get('craft', 'stock'),
			f : POTATO.getL10n().stock_fries
		});
	}

	/**
	 * Setup an element to contain details.
	 * @param source {Potato}
	 */
	function fillStock(source) {
		/**
		 * menu items.
		 */
		var actions = {
			plow : function() {
				target.toggleClass('editable');
			},
			craft : function() {
				POTATO.require(['widget/edit'], function() {
					new POTATO.Edit(source, 'stock', 'craft', $('.craft', target));
				});
			}
		};

		var target = $(mask(POTATO.TEMPLATE.stock, source))
		.attr('id', 'stock_' + source.uuid())
		.appendTo($('#stocks').removeClass('loading'))
		.click(function(event) {
			event.stopPropagation();
			POTATO.require(['widget/menu'], function() {
				(new POTATO.Menu()).setup(actions);
			});
		}).click();
		$('legend.shrink', target).click(function() {
			$(this).parent().toggleClass('collapsed');
		});
	}

	/**
	 * Setup an element to contain fries.
	 * @param source {Potato}
	 */
	function fillFries(source) {
		var vessel = $('#stock_' + source.sign() + ' .fries').removeClass('loading');
		source.each('fries', function(uuid) {
			new POTATO.Chaw(uuid, vessel);
		});
	}

	/**
	 * Single potato in center panel.
	 * @param uuid {String}
	 */
	POTATO.derive(POTATO.Present, 'Stock', function(uuid) {
		return POTATO.Present.call(this, uuid, function() {
			$('#stocks').addClass('loading');

			/**
			 * Bring to top.
			 */
			this.waken = function() {
				$('#stock_' + uuid).removeClass('ui-helper-hidden').click().siblings().addClass('ui-helper-hidden');
			};

			/**
			 * Callback for potato.
			 * @param subject {String}
			 * @param type {String} One of POTATO.NOTIFY.*
			 * @param source {potato}
			 */
			this.notify = function(subject, type, source) {
				switch (type) {
					case POTATO.NOTIFY.INSERT:
						switch (subject) {
							case 'stock':
								fillStock(source);
								this.waken();
								var chips = new POTATO.Chips('fries=' + source.uuid());
								chips.append('fries', 0, source.get('fries', 'stock'));
								chips.subscribe('fries', this, '0');
								break;
							case 'fries':
								fillFries(source);
								break;
						}
						break;

					case POTATO.NOTIFY.UPDATE:
						break;
				}
			};
		}, {
			'stock' : POTATO.Potato
		});
	});
});
