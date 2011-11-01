/**
 * Editor for fries.
 */
function edit() {
	// Keep singleton.
	if (edit.cache instanceof edit) {
		return edit.cache;
	}

	// Cache this object.
	edit.cache = this;

	/**
	 * The element to be operate.
	 */
	var widget = $('#editor');

	/**
	 * The document to execute commands.
	 */
	var vessel;

	/**
	 * Save content (stub).
	 */
	this.save = function() {
		edit.cache.hide();
	};

	/**
	 * Hide the editor.
	 * @param callback {Function}
	 */
	this.hide = function(callback) {
		widget.fadeOut('fast', function() {
			$(this).siblings('.ui-helper-hidden').removeClass('ui-helper-hidden');
			('function' == typeof callback) && callback();
		});
	};

	/**
	 * Show the editor.
	 * @param element {Element}
	 */
	this.show = function(element) {
		edit.cache.hide(function() {
			$('#editor>iframe').load(function() {
				$(this).unbind('load');
				vessel = this.contentDocument;
				vessel.designMode = 'on';
				vessel.body.innerHTML = $('.editable', element).html();
				vessel.execCommand('styleWithCSS', false, true);
			});
			$(element).addClass('ui-helper-hidden').after(widget.fadeIn('fast'));
		});
	};

	// Initialize commands.
	$('#stylor>span:not(.ui-icon)').click(function() {
		var command = $(this).data('command');
		command && vessel.execCommand(command.toString(), false, $(this).data('value'));
	});
	$('#editor_action .ui-icon-check').click(this.save);
	$('#editor_action .ui-icon-close').click(this.hide);
}
