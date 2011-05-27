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
			var details = $('<details/>');
			details.append(this._buildSummary(data));
			details.append(this._buildFields(data));

			var holder = $('<div/>');
			holder.append(details);
			holder.append(this._buildDescription(data));
			holder.append(this._buildComments(data));
			this._bindEvents(holder);

			$('#detail_' + this.id).data('self', this).empty().append(holder);
			break;

		case bhFactory.NOTIFY_UPDATE:
			break;

		case bhFactory.NOTIFY_DELETE:
			break;
	}
	return this;
};

/***********************************************************************************************************************
 * Private methods
 **********************************************************************************************************************/
/**
 * Called when current tab removed
 */
bhDetail.prototype._close = function() {
	(new bhFactory()).unsubscribe(this, ('#detail_' + this.id), 'detail', this.id);
};

/**
 * Build <summary> for <details>
 *
 * @param data
 */
bhDetail.prototype._buildSummary = function(data) {
	var summary = $('<summary/>');
	summary.append(data.title);
	summary.append($('<span class="ui-icon ui-icon-wrench"/>'));
	var endDate = data.dates.end;
	summary.append($('<time/>').attr('datetime', endDate).html((new Date(endDate)).toLocaleDateString()));
	var startDate = data.dates.start;
	summary.append($('<time pubdate="pubdate"/>').attr('datetime', startDate).html((new Date(startDate)).toLocaleDateString() + '&nbsp;~&nbsp;'));
	return summary;
};

/**
 * Build a <table> contains trivial info.
 *
 * @param data
 */
bhDetail.prototype._buildFields = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var fields = $('<table class="fields"/>');

	var row1 = $('<tr/>');
	row1.append($('<th/>').html(locale.detail_season))
	row1.append($('<td/>').html(locale['season_' + data.season]))
	row1.append($('<th/>').html(locale.detail_variety))
	row1.append($('<td/>').html(data.variety))
	fields.append(row1);

	var row2 = $('<tr/>');
	row2.append($('<th/>').html(locale.detail_weight))
	row2.append($('<td/>').html(data.weight))
	row2.append($('<th/>').html(locale.detail_maturity))
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
	var progress = $('<td class="progress"/>');

	var estimated = $('<div class="progress-bar"/>');
	estimated.append($('<div class="estimated"/>').attr('title', '3 days').css('width', (data.progress.original / data.progress.estimated * 100) + '%'));
	progress.append(estimated);

	var practical = $('<div class="progress-bar"/>');
	practical.append($('<div class="practical"/>').attr('title', '3 days').css('width', (data.progress.practical / data.progress.estimated * 100) + '%'));
	progress.append(practical);

	return progress;
};

/**
 * Build a <fieldset> contains description list
 */
bhDetail.prototype._buildDescription = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var description = $('<fieldset/>');

	var title = $('<legend class="compressor"/>');
	title.append($('<span class="ui-icon ui-icon-triangle-1-s"/>'));
	title.append(locale.detail_description);
	description.append(title);

	var list = $('<ul class="description"/>');
	$(data.description).each(function(){
		list.append($('<li/>').html(this.toString()));
	});
	description.append(list);

	return description;
};

/**
 * Build a <fieldset> contains comment list
 */
bhDetail.prototype._buildComments = function(data) {
	var locale = POTATO_L10N[POTATO_PROFILE.locale];
	var comments = $('<fieldset/>');

	var title = $('<legend class="compressor"/>');
	title.append($('<span class="ui-icon ui-icon-triangle-1-s"/>'));
	title.append(locale.detail_comments);
	title.append($('<span class="ui-icon ui-icon-plus"/>'));
	comments.append(title);

	var self = this;
	$(data.comments).each(function(){
		comments.append(self._buildComment(this));
	});

	return comments;
};

/**
 * Build a <blockquote> contains a single comment
 */
bhDetail.prototype._buildComment = function(data) {
	var quote = $('<blockquote class="ui-corner-br"/>');
	quote.append($('<span class="ui-icon ui-icon-pencil"/>'));
	quote.append($('<time/>').attr('datetime', data.date).html((new Date(data.date)).toLocaleDateString()));
	quote.append($('<span class="compressor ui-icon ui-icon-carat-1-s"/>'));
	quote.append($('<div class="editable"/>').html(data.content));
	return quote;
};

/**
 * Bind action to hotpot
 *
 * @param target
 *        Content holder element
 */
bhDetail.prototype._bindEvents = function(target) {
	$('.compressor', target).click(function() {
		$(this.parentNode).toggleClass('collapsed');
	});
	$('.ui-icon-wrench', target).click(function() {
		// TODO: modify basic info
	});
	// Append comment
	$('legend .ui-icon-plus', target).click(function(event) {
		var self  = target.parent().data('self');
		var comment = self._buildComment({
			date : self._getTimeString(new Date()),
			content : ''
		});
		$(this).parents('fieldset').append(comment);
		//$('.ui-icon-pencil', comment).click(self._editComment);
		event.stopPropagation();
	});
	// Edit comments
	$('.ui-icon-pencil', target).click(this._editComment);
};

/**
 * Event callback for comment editing
 */
bhDetail.prototype._editComment = function() {
	var self = $(this.parentNode);
	bhEditor.show(self, function() {
		self.addClass('ui-helper-hidden').siblings('.ui-helper-hidden').removeClass('ui-helper-hidden');
	});
};

/**
 * Get UTC time string in 'yyyy-mm-ddThh:ii:ssZ' format
 *
 * @param date
 */
bhDetail.prototype._getTimeString = function(date) {
	function couple(number){
		number += '';
		return (number.length < 2) ? ('0' + number) : number;
	}
	return date.getUTCFullYear() + '-'
		+ couple(date.getUTCMonth() + 1) + '-'
		+ couple(date.getUTCDate()) + 'T'
		+ couple(date.getUTCHours()) + ':'
		+ couple(date.getUTCMinutes()) + ':'
		+ couple(date.getUTCSeconds()) + 'Z';
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
				if (self) self._close();
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
