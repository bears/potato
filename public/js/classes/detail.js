/**
 * Class bhDetail
 *
 * @param id
 */
function bhDetail(id) {
	var tag = '#detail_' + id;
	if ( 0 < $('#details [href$="' + tag + '"]').length ) {
		bhDetail._singleton.tabs('select', tag);
		return $(tag).data('self');
	}

	// Basic attributes
	this.id = id;

	bhDetail._singleton.tabs('add', tag, id);
	(new bhFactory()).subscribe(this, tag, 'detail', this.id);

	return this;
};

/**
 * Notify callback, needed by hbFactory
 *
 * @param subject
 * @param type
 *        Notify reason, one of bhFactory.NOTIFY_*
 * @param data
 */
bhDetail.prototype.notify = function(subject, type, data) {
	switch ( type ) {
		case bhFactory.NOTIFY_INSERT:
			var details = $('<details>');
			details.append(this._buildSummary(data));
			details.append(this._buildFields(data));

			var holder = $('<div>');
			holder.append(details);
			holder.append(this._buildDescription(data));
			holder.append(this._buildComments(data));

			var targetId = '#detail_' + this.id;
			$(targetId).html(holder.html()).data('self', this);
			$('.compressor', targetId).click(function() {
				$(this.parentNode).toggleClass('collapsed');
			});
			break;

		case bhFactory.NOTIFY_UPDATE:
			break;

		case bhFactory.NOTIFY_DELETE:
			break;
	}
	return this;
};

/**
 * Called when current tab removed
 */
bhDetail.prototype.close = function() {
	(new bhFactory()).unsubscribe(this, ('#detail_' + this.id), 'detail', this.id);
};

/***********************************************************************************************************************
 * Private methods
 **********************************************************************************************************************/
/**
 * Build <summary> for <details>
 *
 * @param data
 */
bhDetail.prototype._buildSummary = function(data) {
	var summary = $('<summary>');
	summary.append(data.title);
	summary.append($('<span class="ui-icon ui-icon-pencil">'));
	var endDate = data.dates.end;
	summary.append($('<time>').attr('datetime', endDate).html((new Date(endDate)).toLocaleDateString()));
	var startDate = data.dates.start;
	summary.append($('<time pubdate="pubdate">').attr('datetime', startDate).html((new Date(startDate)).toLocaleDateString() + ' ~ '));
	return summary;
};

/**
 * Build a <table> contains trivial info.
 *
 * @param data
 */
bhDetail.prototype._buildFields = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var fields = $('<table class="fields">');

	var row1 = $('<tr>');
	row1.append($('<th>').html(locale.detail_season))
	row1.append($('<td>').html(locale['season_' + data.season]))
	row1.append($('<th>').html(locale.detail_variety))
	row1.append($('<td>').html(data.variety))
	fields.append(row1);

	var row2 = $('<tr>');
	row2.append($('<th>').html(locale.detail_weight))
	row2.append($('<td>').html(data.weight))
	row2.append($('<th>').html(locale.detail_maturity))
	row2.append(this._buildProgress(data));
	fields.append(row2);

	return fields;
};

/**
 * Build a couple of progress bar
 *
 * @param data
 */
bhDetail.prototype._buildProgress = function(data) {
	var progress = $('<td class="progress">');

	var estimated = $('<div class="progress-bar">');
	estimated.append($('<div class="estimated">').attr('title', '3 days').css('width', (data.progress.original / data.progress.estimated * 100) + '%'));
	progress.append(estimated);

	var practical = $('<div class="progress-bar">');
	practical.append($('<div class="practical">').attr('title', '3 days').css('width', (data.progress.practical / data.progress.estimated * 100) + '%'));
	progress.append(practical);

	return progress;
};

/**
 * Build a <fieldset> contains description list
 */
bhDetail.prototype._buildDescription = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var description = $('<fieldset>');

	var title = $('<legend class="compressor">');
	title.append($('<span class="ui-icon ui-icon-triangle-1-s">'));
	title.append(locale.detail_description);
	description.append(title);

	var list = $('<ul class="description">');
	$(data.description).each(function(){
		list.append($('<li>').html(this.toString()));
	});
	description.append(list);

	return description;
};

/**
 * Build a <fieldset> contains comment list
 */
bhDetail.prototype._buildComments = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var comments = $('<fieldset>');

	var title = $('<legend class="compressor">');
	title.append($('<span class="ui-icon ui-icon-triangle-1-s">'));
	title.append(locale.detail_comments);
	comments.append(title);

	$(data.comments).each(function(){
		var quote = $('<blockquote class="ui-corner-br">');
		quote.append($('<span class="ui-icon ui-icon-pencil">'));
		quote.append($('<time>').attr('datetime', this.date).html((new Date(this.date)).toLocaleDateString()));
		var lines = $('<p>');
		lines.append($('<span class="compressor ui-icon ui-icon-carat-1-s">'))
		lines.append(this.content);
		quote.append(lines);
		comments.append(quote);
	});

	return comments;
};

/***********************************************************************************************************************
 * Static methods
 **********************************************************************************************************************/
/**
 * Initialize season panel
 */
bhDetail.settle = function() {
	bhDetail._singleton = $('#details').tabs({
		tabTemplate : '<li><a href="#{href}" title="#{label}"><div class="ellipsis">#{label}</div></a><span class="ui-icon ui-icon-close">&nbsp;</span></li>',
		add : function(event, ui) {
			$(ui.panel).append('<img src="css/images/loading.gif" />');
			$(ui.tab).siblings('.ui-icon-close').click(function() {
				var self = $(ui.panel).data('self');
				if (self) self.close();
				bhDetail._singleton.tabs('remove', ui.tab.href.match(/#\w+$/)[0]);
			});
			bhDetail._singleton.tabs('select', ui.index);
		}
	});
	$('#detail_depot .compressor').click(function() {
		$(this.parentNode).toggleClass('collapsed');
	});
};

/***********************************************************************************************************************
 * Static attributes
 **********************************************************************************************************************/
/**
 * Singleton holder for tabs
 */
bhDetail._singleton = null;
