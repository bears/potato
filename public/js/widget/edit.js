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
	var save = function() {
		hide();
	};

	/**
	 * Hide the editor.
	 * @param callback {Function}
	 */
	var hide = function(callback) {
		widget.fadeOut('fast', function() {
			$(widget.data('element')).removeClass('ui-helper-hidden');
			('function' == typeof callback) && callback();
		});
	};

	/**
	 * Show the editor.
	 * @param element {Element}
	 */
	this.show = function(element) {
		hide(function() {
			$('#editor>iframe').load(function() {
				// Prevent duplicated execution.
				$(this).unbind('load');

				// Set content editable.
				vessel = this.contentDocument;
				vessel.designMode = 'on';
				vessel.execCommand('styleWithCSS', false, true);
				$(vessel.body).html($('.editable', element).html());

				// Trigger menu.
				$(vessel).click(function(event) {
					event.stopPropagation();
					(new menu()).setup(actions);
				}).click();
			});
			$(element).addClass('ui-helper-hidden').after(widget.fadeIn('fast'));
			widget.data('element', element);
		});
	};

	// Initialize commands.
	$('#stylor>span:not(.ui-icon)').click(function() {
		var command = $(this).data('command');
		command && vessel.execCommand(command.toString(), false, $(this).data('value'));
	});

	/**
	 * menu items.
	 */
	var actions = {
		save : save,
		hide : hide
	};

	/**
	 * Stop propagating from margin/toolbar to container.
	 */
	widget.click(function(event) {
		event.stopPropagation();
	});
}
