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
	 * Build a read-only <input>.
	 * @param name {String}
	 * @param value {String}
	 * @return {String}
	 */
	var getInput = function(name, value) {
		var template = '<input readonly="readonly" name="{%n%}" value="{%v%}" type="number"/>';
		return POTATO.replace(template, {
			n : name,
			v : value
		});
	};

	/**
	 * Build a <select> to choose seasons.
	 */
	var getSeason = function() {
		var options = '';
		(function() {
			var template = '<option value="{%v%}">{%c%}</option>';
			var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
			var seasons = ['spring', 'summer', 'autumn', 'winter'];
			for (var i in seasons) {
				options += POTATO.replace(template, {
					v : seasons[i],
					c : locale['season_' + seasons[i]]
				});
			}
		})();
		var template = '<select readonly="readonly" name="season">{%o%}</select>';
		return POTATO.replace(template, {
			o : options
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
		var template = '<summary class="ui-corner-all ui-state-highlight">{%l%}<time datetime="{%h%}">&nbsp;~&nbsp;{%t%}</time><time pubdate="pubdate" datetime="{%s%}">{%g%}</time></summary>';
		var seeding = source.get('seeding', 'stock');
		if (seeding) seeding = seeding.replace(' ', 'T') + 'Z';
		var harvest = source.get('harvest', 'stock');
		if (harvest) harvest = harvest.replace(' ', 'T') + 'Z';
		return POTATO.replace(template, {
			l : getInput('label', source.get('label', 'tuber')),
			s : seeding,
			g : (new Date(seeding)).toLocaleDateString(),
			h : harvest,
			t : (new Date(harvest)).toLocaleDateString()
		});
	};

	/**
	 * Build a <table> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getTrivial = function(source) {
		var template = '<table class="fields"><tr>{%s%}{%v%}</tr><tr>{%w%}{%m%}</tr></table>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			s : getRowPair(locale.stock_season, getSeason()),//getInput('season', locale['season_' + source.get('season', 'stock')])
			v : getRowPair(locale.stock_variety, getInput('variety', source.get('variety', 'stock'))),
			w : getRowPair(locale.stock_weight, getInput('weight', source.get('weight', 'stock'))),
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

	var active = function(source, element) {
		new fries(source.uuid());
	};

	/**
	 * Setup an element to contain details.
	 * @param source {potato}
	 */
	var setup = function(source) {
		var template = '<div id="stock_{%u%}">{%d%}{%c%}{%f%}</div>';
		var html = POTATO.replace(template, {
			u : source.uuid(),
			d : getDetails(source),
			c : getCraft(source),
			f : getFries(source)
		});
		var vessel = $('#stocks');
		$('> div', vessel).addClass('ui-helper-hidden');
		active(source, $(html).data('self', this).appendTo(vessel));
	}.bind(this);

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

	// Subscribe to the data source.
	(new potato(uuid)).subscribe('stock', this);
}
