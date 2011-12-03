'use strict';

(function() {
	/**
	 * Single potato in center panel.
	 * @param uuid {String}
	 */
	POTATO.Stock = function Stock(uuid) {
		// Prevent duplicated object.
		var cached = $('#stock_' + uuid).data('self');
		if (cached instanceof Stock) {
			return cached;
		}

		/**
		 * Build an <input> with a <span> for editing.
		 * @param name {String}
		 * @param value {String}
		 * @return {String}
		 */
		var getInput = function(name, value, show) {
			var template = '<input name="{%n%}" value="{%v%}"/><span>{%s%}</span>';
			return POTATO.replace(template, {
				n : name,
				v : value,
				s : show ? show : value
			});
		};

		/**
		 * Build a <time>.
		 * @param time {String}
		 * @param publish {Boolean}
		 * @return {String}
		 */
		var getTime = function(time, publish) {
			var iso8601 = time ? (time.replace(' ', 'T') + 'Z') : '';
			var template = '<time {%p%} datetime="{%t%}">{%s%}</time>';
			return POTATO.replace(template, {
				t : iso8601,
				s : POTATO.genialTime(iso8601),
				p : publish ? 'pubdate="pubdate"' : ''
			});
		};

		/**
		 * Build <summary> for <details>.
		 * @param source {potato}
		 * @return {String}
		 */
		var getSummary = function(source) {
			var seeding = source.get('seeding', 'stock');
			var harvest = source.get('harvest', 'stock');
			var template = '<summary class="ui-corner-all ui-state-highlight"><span class="ui-icon ui-icon-{%i%}"/><span class="period">{%p%}</span>{%l%}</summary>';
			return POTATO.replace(template, {
				i : POTATO.tuberIcons[source.get('brand', 'tuber')],
				p : getInput('period', '10d', getTime(seeding, true) + ' ~ ' + getTime(harvest)),
				l : getInput('label', source.get('label', 'tuber'))
			});
		};

		/**
		 * Build <details>.
		 * @param source {potato}
		 * @return {String}
		 */
		var getDetails = function(source) {
			var template = '<details open="open">{%s%}<blockquote class="craft">{%c%}</blockquote></details>';
			return POTATO.replace(template, {
				s : getSummary(source),
				c : source.get('craft', 'stock')
			});
		};

		/**
		 * Build a <fieldset> to hold fries in <blockquote>.
		 * @param source {potato}
		 * @return {String}
		 */
		var getFries = function(source) {
			var template = '<fieldset><legend class="shrink"><span class="ui-icon ui-icon-triangle-1-s"/>{%l%}</legend><div class="fries loading"></div></fieldset>';
			var locale = POTATO.LOCALE;
			return POTATO.replace(template, {
				l : locale.stock_fries
			});
		};

		/**
		 * Setup an element to contain details.
		 * @param source {potato}
		 */
		var setup = function(source) {
			var target = $('#stock_' + uuid);
			target.html(getDetails(source) + getFries(source));
			(new POTATO.Potato(uuid)).subscribe('fries', this);
			target.removeClass('loading');
			target.click(function(event) {
				event.stopPropagation();
				(new POTATO.Menu()).setup({
					plow : function() {
						$('#stock_' + uuid).toggleClass('editable');
					},
					craft : function() {
						new POTATO.Edit(source, 'stock', 'craft', $('#stock_' + uuid + ' .craft'));
					}
				});
			}).click();
			$('legend.shrink', target).click(function() {
				$(this).parent().toggleClass('collapsed');
			});
		}.bind(this);

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
							setup(source);
							break;
						case 'fries':
							var vessel = $('#stock_' + uuid + ' .fries');
							vessel.removeClass('loading');
							$.each(source.get('chips', 'fries'), function() {
								new POTATO.Chip(this.$, this);
								new POTATO.Chaw(this.$, vessel);
							});
							break;
					}
					break;

				case POTATO.NOTIFY.UPDATE:
					break;
			}
		};

		// Put a place holder first.
		(function() {
			var html = '<div id="stock_' + uuid + '" class="loading"></div>';
			$(html).data('self', this).appendTo($('#stocks'));
		}).apply(this);

		// Subscribe to the data source.
		(new POTATO.Potato(uuid)).subscribe('stock', this);
	};
})();
