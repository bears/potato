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
		var template = '<input readonly="readonly" name="{%name%}" value="{%value%}"/>';
		return POTATO.replace(template, {
			name : name,
			value : value
		});
	};

	/**
	 * Build a <th> with a <td>.
	 * @param label {String}
	 * @param value {String}
	 * @return {String}
	 */
	var getRowPair = function(label, value) {
		var template = '<th>{%label%}</th><td>{%value%}</td>';
		return POTATO.replace(template, {
			label : label,
			value : value
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
		var template = '<div class="proportion"><div class="{%label%}" title="{%title%}" style="width:{%width%}%;"/></div>';
		return POTATO.replace(template, {
			label : label,
			title : title,
			width : width
		});
	};

	var getProgress = function(label, source) {
		var template = '<th>{%label%}</th><td class="progress">{%estimated%}{%practical%}</td>';
		return POTATO.replace(template, {
			label : label,
			estimated : getProportion('estimated', 'estimated', 100),
			practical : getProportion('practical', 'practical', 30)
		});
	};

	/**
	 * Build <summary> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getSummary = function(source) {
		var template = '<summary>{%label%}<span class="ui-icon ui-icon-wrench"/><time datetime="{%harvest%}"> ~ {%local_harvest%}</time><time pubdate="pubdate" datetime="{%seeding%}">{%local_seeding%}</time></summary>';
		var seeding = source.get('seeding', 'stock');
		if (seeding) seeding = seeding.replace(' ', 'T') + 'Z';
		var harvest = source.get('harvest', 'stock');
		if (harvest) harvest = harvest.replace(' ', 'T') + 'Z';
		return POTATO.replace(template, {
			label : getInput('label', source.get('label', 'tuber')),
			seeding : seeding,
			local_seeding : (new Date(seeding)).toLocaleDateString(),
			harvest : harvest,
			local_harvest : (new Date(harvest)).toLocaleDateString()
		});
	};

	/**
	 * Build a <table> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getTrivial = function(source) {
		var template = '<table class="fields"><tr>{%season%}{%variety%}</tr><tr>{%weight%}{%maturity%}</tr></table>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			season : getRowPair(locale.stock_season, getInput('season', locale['season_' + source.get('season', 'stock')])),
			variety : getRowPair(locale.stock_variety, getInput('variety', source.get('variety', 'stock'))),
			weight : getRowPair(locale.stock_weight, getInput('weight', source.get('weight', 'stock'))),
			maturity : getProgress(locale.stock_maturity, source)
		});
	};

	/**
	 * Build <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getDetails = function(source) {
		var template = '<details open="open">{%summary%}{%trivial%}</details>';
		return POTATO.replace(template, {
			summary : getSummary(source),
			trivial : getTrivial(source)
		});
	};

	var getCraft = function(source) {
		var template = '<fieldset><legend class="shrink"><span class="ui-icon ui-icon-triangle-1-s"/>{%legend%}</legend><div class="craft">{%content%}</div></fieldset>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			legend : locale.stock_craft,
			content : source.get('craft', 'stock')
		});
	};

	var getChips = function(source) {
		var template = '<fieldset><legend class="shrink"><span class="ui-icon ui-icon-triangle-1-s"/>{%legend%}<span class="ui-icon ui-icon-plus"/></legend>{%content%}</fieldset>';
		var locale = POTATO.L10N[POTATO.PROFILE.LOCALE];
		return POTATO.replace(template, {
			legend : locale.stock_chips,
			content : 'TODO'
		});
	};

	var active = function(element) {
		return element;
	};

	/**
	 * Setup an element to contain details.
	 * @param source {potato}
	 */
	var setup = function(source) {
		var template = '<div id="stock_{%uuid%}">{%details%}{%craft%}{%chips%}</div>';
		var html = POTATO.replace(template, {
			uuid : source.uuid(),
			details : getDetails(source),
			craft : getCraft(source),
			chips : getChips(source)
		});
		var vessel = $('#stocks');
		$('> div', vessel).addClass('ui-helper-hidden');
		active($(html).data('self', this)).appendTo(vessel);
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
