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
	 * The element contains original content.
	 */
	var target;

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
			$(target).removeClass('ui-helper-hidden');
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
				// Prevent duplicated execution.
				$(this).unbind('load');

				// Set content editable.
				vessel = this.contentDocument;
				vessel.designMode = 'on';
				vessel.body.innerHTML = $('.editable', element).html();
				vessel.execCommand('styleWithCSS', false, true);

				// Trigger menu.
				$(vessel).click(function(event) {
					event.stopPropagation();
					(new menu()).setup(actions);
				}).click();
			});
			target = $(element).addClass('ui-helper-hidden').after(widget.fadeIn('fast'));
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
		save : this.save,
		hide : this.hide
	};

	/**
	 * Stop propagating from margin/toolbar to container.
	 */
	widget.click(function(event) {
		event.stopPropagation();
	});
}
