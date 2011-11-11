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
	 * Build a <div> for variety key words.
	 * @param source {potato}
	 * @return {String}
	 */
	var getVariety = function(source) {
		var variety = source.get('variety', 'stock');
		var emphases = '<em>' + variety.split(';').join('</em><em>') + '</em>';
		var template = '<div class="variety"><label>{%n%}</label> {%v%}</div>';
		return POTATO.replace(template, {
			n : POTATO.L10N[POTATO.PROFILE.LOCALE].stock_variety,
			v : getInput('variety', variety, emphases)
		});
	};

	/**
	 * Build <summary> for <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getSummary = function(source) {
		var template = '<summary class="ui-corner-all ui-state-highlight"><time datetime="{%h%}">&nbsp;~&nbsp;{%t%}</time><time pubdate="pubdate" datetime="{%s%}">{%g%}</time><span class="ui-icon ui-icon-{%i%}"/>{%l%}</summary>';
		var seeding = source.get('seeding', 'stock');
		if (seeding) seeding = seeding.replace(' ', 'T') + 'Z';
		var harvest = source.get('harvest', 'stock');
		if (harvest) harvest = harvest.replace(' ', 'T') + 'Z';
		return POTATO.replace(template, {
			s : seeding,
			g : (new Date(seeding)).toLocaleDateString(),
			h : harvest,
			t : (new Date(harvest)).toLocaleDateString(),
			i : tuber.icons[source.get('brand', 'tuber')],
			l : getInput('label', source.get('label', 'tuber'))
		});
	};

	/**
	 * Build a <ul> for craft list.
	 * @param source {potato}
	 * @return {String}
	 */
	var getCraft = function(source) {
		var template = '<ul class="craft"><li>{%c%}</li></ul>';
		return POTATO.replace(template, {
			c : source.get('craft', 'stock')
		});
	};

	/**
	 * Build <details>.
	 * @param source {potato}
	 * @return {String}
	 */
	var getDetails = function(source) {
		var template = '<details open="open">{%s%}{%c%}{%v%}</details>';
		return POTATO.replace(template, {
			s : getSummary(source),
			c : getCraft(source),
			v : getVariety(source)
		});
	};

	/**
	 * Build a <fieldset> to hold fries in <blockquote>.
	 * @param source {potato}
	 * @return {String}
	 */
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
		target.html(getDetails(source) + getFries(source))
		new fries(source.uuid());
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
		plow : function() {
			$('#stock_' + uuid).toggleClass('editable');
		},
		harvest : function() {
			alert('Not implement yet!')
		}
	};

	// Put a place holder first.
	(function() {
		var html = '<div id="stock_' + uuid + '" class="readonly loading"></div>';
		$(html).data('self', this).appendTo($('#stocks'));
	})();

	// Subscribe to the data source.
	(new potato(uuid)).subscribe('stock', this);
}
