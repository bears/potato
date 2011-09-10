/**
 * @class bhDetail
 * @brief Main representation of each item
 *
 * @param id
 */
function bhDetail(id) {
	var tag = $('#detail_' + id);
	if ( tag.length ) {
		tag.siblings('div').addClass('ui-helper-hidden');
		return tag.removeClass('ui-helper-hidden').data('self');
	}

	this.id = id;

	(new bhFactory()).subscribe(this, '#detail_' + id, 'detail', this.id);

	return this;
}

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
			var details = $('<details open="open"/>');
			details.append(bhDetail._buildSummary(data));
			details.append(bhDetail._buildFields(data));

			var holder = $('<div/>');
			holder.attr('id', 'detail_' + this.id).data('self', this);
			holder.append(details);
			holder.append(bhDetail._buildDescription(data));
			holder.append(bhDetail._buildComments(data));
			bhDetail._bindEvents(holder);

			$('> div', bhDetail._singleton).addClass('ui-helper-hidden');
			holder.appendTo(bhDetail._singleton);
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
//bhDetail.prototype._close = function() {
//	(new bhFactory()).unsubscribe(this, ('#detail_' + this.id), 'detail', this.id);
//};

/**
 * Build <summary> for <details>
 *
 * @param data
 */
bhDetail._buildSummary = function(data) {
	var summary = $('<summary/>');
	summary.append(bhDetail._buildInput(data.title, 'title'));
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
bhDetail._buildFields = function(data) {
	var locale = POTATO.L10N[POTATO.PROFILE.locale];
	var fields = $('<table class="fields"/>');

	var row1 = $('<tr/>');
	row1.append($('<th/>').html(locale.detail_season));
	row1.append($('<td/>').append(bhDetail._buildInput(locale['season_' + data.season], 'season')));
	row1.append($('<th/>').html(locale.detail_variety));
	row1.append($('<td/>').append(bhDetail._buildInput(data.variety, 'variety')));
	fields.append(row1);

	var row2 = $('<tr/>');
	row2.append($('<th/>').html(locale.detail_weight));
	row2.append($('<td/>').append(bhDetail._buildInput(data.weight, 'weight')));
	row2.append($('<th/>').html(locale.detail_maturity));
	row2.append(bhDetail._buildProgress(data));
	fields.append(row2);

	return fields;
};

/**
 * Build a <input> contains editable info.
 *
 * @param data
 * @param name
 */
bhDetail._buildInput = function(data, name) {
	return $('<input readonly="readonly"/>').attr('name', name).val(data);
};

/**
 * Build a couple of progress bar
 *
 * @param data
 */
bhDetail._buildProgress = function(data) {
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
 *
 * @param data
 */
bhDetail._buildDescription = function(data) {
	var locale = POTATO.L10N[POTATO.PROFILE.locale];
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
 *
 * @param data
 */
bhDetail._buildComments = function(data) {
	var locale = POTATO.L10N[POTATO.PROFILE.locale];
	var comments = $('<fieldset/>');

	var title = $('<legend class="compressor"/>');
	title.append($('<span class="ui-icon ui-icon-triangle-1-s"/>'));
	title.append(locale.detail_comments);
	title.append($('<span class="ui-icon ui-icon-plus"/>'));
	comments.append(title);

	$(data.comments).each(function(){
		comments.append(bhDetail._buildComment(this));
	});

	return comments;
};

/**
 * Build a <blockquote> contains a single comment
 *
 * @param data
 */
bhDetail._buildComment = function(data) {
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
bhDetail._bindEvents = function(target) {
	$('.compressor', target).click(function() {
		$(this.parentNode).toggleClass('collapsed');
	});
	$('.ui-icon-wrench', target).click(function(event) {
		$('input[readonly]', $(this).parents('div:first')).prop('readonly', false);
		// TODO: modify basic info
	});
	// Append comment
	$('legend .ui-icon-plus', target).click(function(event) {
		var comment = bhDetail._buildComment({
			date : bhDetail._getTimeString(new Date()),
			content : ''
		});
		$(this).parents('fieldset').append(comment);
		$('.ui-icon-pencil', comment).click(function() {
			bhEditor.show(this.parentNode);
		});
		event.stopPropagation();
	});
	// Edit comments
	$('.ui-icon-pencil', target).click(function() {
		bhEditor.show(this.parentNode);
	});
};

/**
 * Get UTC time string in 'yyyy-mm-ddThh:ii:ssZ' format
 *
 * @param date
 */
bhDetail._getTimeString = function(date) {
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

/**
 * Singleton holder for tabs
 */
bhDetail._singleton = null;

/**
 * Initializer
 */
POTATO.INITIAL = POTATO.INITIAL || [];
POTATO.INITIAL.push(function() {
	bhDetail._singleton = $('#details');
});
