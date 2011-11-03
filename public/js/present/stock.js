/**
 * Single potato in center panel.
 * @param uuid {String}
 */
function stock(uuid) {
	// Prevent duplicated object.
	var cached = $('#stock_' + uuid).data('self');
	if (cached instanceof stock) {
		return cached;
	}

	/**
	 * Build an <input> with a <span> for editing.
	 * @param name {String}
	 * @param value {String}
	 * @param extra {String}
	 * @return {String}
	 */
	var getInput = function(name, value, extra) {
		var template = '<input name="{%n%}" value="{%v%}" {%e%}/><span>{%v%}</span>';
		return POTATO.replace(template, {
			n : name,
			v : value,
			e : extra ? extra : ''
		});
	};

	/**
	 * Build an <input> for number in range (0, 1).
	 * @param name {String}
	 * @param value {Number}
	 * @return {String}
	 */
	var getWeight = function(value) {
		return getInput('weight', value * 100, 'type="range" min="0" max="100" step="0.1" size="2"') + ' %';
	};

	/**
	 * Build an <input> for variety key words.
	 * @param variety {String}
	 * @return {String}
	 */
	var getVariety = function(variety) {
		var emphases = variety.split(';').join('</em><em>');
		var template = '<input name="variety" value="{%v%}"/><span><em>{%e%}</em></span>';
		return POTATO.replace(template, {
			v : variety,
			e : emphases
		});
	};

	/**
	 * Build a <select> to choose seasons.
	 * @param season {String}
	 * @return {String}
	 */
	var getSeason = function(season) {
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		var options = '';
		(function() {
			var template = '<option value="{%v%}">{%c%}</option>';
			var seasons = ['spring', 'summer', 'autumn', 'winter'];
			for (var i in seasons) {
				options += POTATO.replace(template, {
					v : seasons[i],
					c : locale['season_' + seasons[i]]
				});
			}
		})();
		var template = '<select name="season">{%o%}</select><span>{%s%}</span>';
		return POTATO.replace(template, {
			o : options,
			s : locale['season_' + season]
		});
	};

	/**
	 * Build a <th> with a <td>.
	 * @param label {String}
	 * @param value {String}
	 * @return {String}
	 */
	var getRowPair = function(label, value) {
		var template = '<th>{%l%}</th><td>{%v%}</td>';
		return POTATO.replace(template, {
			l : label,
			v : value
		});
	};

	/**
	 * Build a <div> for progress bar.
	 * @param label {String}
	 * @param title {String}
	 * @param width {String}
	 * @return {String}
	 */
	var getProportion = function(label, title, width) {
		var template = '<div class="proportion"><div class="{%l%}" title="{%t%}" style="width:{%w%}%;"/></div>';
		return POTATO.replace(template, {
			l : label,
			t : title,
			w : width
		});
	};

	var getProgress = function(label, source) {
		var template = '<th>{%l%}</th><td class="progress">{%e%}{%p%}</td>';
		return POTATO.replace(template, {
			l : label,
			e : getProportion('estimated', 'estimated', 100),
			p : getProportion('practical', 'practical', 30)
		});
	};

	/**
	 * Build <summary> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getSummary = function(source) {
		var template = '<summary class="ui-corner-all ui-state-highlight"><time datetime="{%h%}">&nbsp;~&nbsp;{%t%}</time><time pubdate="pubdate" datetime="{%s%}">{%g%}</time>{%l%}</summary>';
		var seeding = source.get('seeding', 'stock');
		if (seeding) seeding = seeding.replace(' ', 'T') + 'Z';
		var harvest = source.get('harvest', 'stock');
		if (harvest) harvest = harvest.replace(' ', 'T') + 'Z';
		return POTATO.replace(template, {
			s : seeding,
			g : (new Date(seeding)).toLocaleDateString(),
			h : harvest,
			t : (new Date(harvest)).toLocaleDateString(),
			l : getInput('label', source.get('label', 'tuber'))
		});
	};

	/**
	 * Build a <table> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getTrivial = function(source) {
		var template = '<table class="fields"><tr>{%w%}{%v%}</tr><tr>{%s%}{%m%}</tr></table>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			w : getRowPair(locale.stock_weight, getWeight(source.get('weight', 'stock'))),
			v : getRowPair(locale.stock_variety, getVariety(source.get('variety', 'stock'))),
			s : getRowPair(locale.stock_season, getSeason(source.get('season', 'stock'))),
			m : getProgress(locale.stock_maturity, source)
		});
	};

	/**
	 * Build <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getDetails = function(source) {
		var template = '<details open="open">{%s%}{%t%}</details>';
		return POTATO.replace(template, {
			s : getSummary(source),
			t : getTrivial(source)
		});
	};

	var getCraft = function(source) {
		var template = '<fieldset><legend class="shrink"><span class="ui-icon ui-icon-triangle-1-s"/>{%l%}</legend><div class="craft">{%c%}</div></fieldset>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			l : locale.stock_craft,
			c : source.get('craft', 'stock')
		});
	};

	var getFries = function(source) {
		var template = '<fieldset><legend class="shrink"><span class="ui-icon ui-icon-triangle-1-s"/>{%l%}</legend><div class="fries loading"></div></fieldset>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
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
		target.html(getDetails(source) + getCraft(source) + getFries(source))
		new fries(source.uuid());
		$('option[value="' + source.get('season', 'stock') + '"]', target).attr('selected', true);
		target.removeClass('loading');
		target.click(function(event) {
			event.stopPropagation();
			(new menu()).setup(actions);
		}).click();
	}.bind(this);

	/**
	 * Bring to top.
	 */
	this.waken = function() {
		var target = $('#stock_' + uuid);
		if (target.length) {
			target.removeClass('ui-helper-hidden').click();
		}
		else {
			var html = '<div id="stock_' + uuid + '" class="readonly loading"></div>';
			target = $(html).data('self', this).appendTo($('#stocks'));
		}
		target.siblings().addClass('ui-helper-hidden');
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
				setup(source);
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		}
	};

	/**
	 * menu items.
	 */
	var actions = {
		edit : function() {
			$('#stock_' + uuid).removeClass('readonly').addClass('editable');
		}
	};

	// Subscribe to the data source.
	(new potato(uuid)).subscribe('stock', this);
}
