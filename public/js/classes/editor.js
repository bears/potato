/**
 * @class bhEditor
 * @brief Comment editor
 */
function bhEditor() {
	// Keep singleton
	if ( null != bhEditor._singleton ) {
		return bhEditor._singleton;
	}
	bhEditor._singleton = this;

	this.element = $('#editor');

	this._settle();

	return this;
}

/**
 * Hide the editor
 *
 * @param callback
 */
bhEditor.hide = function(callback) {
	(new bhEditor()).element.fadeOut('fast', function() {
		$(this).siblings('blockquote.ui-helper-hidden').removeClass('ui-helper-hidden');
		if ( 'function' == typeof callback ) {
			callback();
		}
	});
};

/**
 * Save content
 */
bhEditor.save = function() {
	bhEditor.hide();
};

/**
 * Show the editor
 *
 * @param container
 */
bhEditor.show = function(container) {
	bhEditor.hide(function() {
		$('#editor>iframe').load(function() {
			$(this).unbind('load');
			this.contentDocument.designMode = 'on';
			this.contentDocument.body.innerHTML = $('.editable', container).html();
			this.contentDocument.execCommand('styleWithCSS', false, true);
			bhEditor._singleton.document = this.contentDocument;
		});
		$(container).addClass('ui-helper-hidden').after((new bhEditor()).element.fadeIn('fast'));
	});
};

/**
 * Initialize editor
 */
bhEditor.prototype._settle = function() {
	$('#stylor>span:not(.ui-icon)').click(function() {
		var command = $(this).data('command');
		if (command)
			bhEditor._singleton.document.execCommand(command.toString(), false, $(this).data('value'));
	});
	$('#editor_action .ui-icon-check').click(function() {
		bhEditor.save();
	});
	$('#editor_action .ui-icon-close').click(function() {
		bhEditor.hide();
	});
};

/**
 * Singleton holder
 */
bhEditor._singleton = null;
