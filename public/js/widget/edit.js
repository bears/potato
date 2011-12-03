'use strict';

/**
 * Editor for fries.
 */
function edit(source, subject, field, element) {
	var uuid = source.uuid() + '-' + subject + '-' + field;

	// Prevent duplicated object.
	var cache = $('#' + uuid).data('self');
	if (cache instanceof edit) {
		return cache;
	}

	/**
	 * The element to be operate.
	 */
	var widget = $(POTATO.TEMPLATE.edit).attr('id', uuid).data('self', this);

	/**
	 * The document to execute commands.
	 */
	var vessel;

	/**
	 * Hide the editor.
	 * @param callback {Function}
	 */
	var hide = function(callback) {
		widget.fadeOut('fast', function() {
			('function' == typeof callback) && callback();
			$(element).removeClass('ui-helper-hidden').click();
			widget.remove();
		});
	};

	/**
	 * Save content (stub).
	 */
	var save = function() {
		hide(function() {
			source.set(vessel.body.innerHTML, field, subject);
		});
	};

	// Initialize commands.
	$('.stylor>span:not(.ui-icon)', widget).click(function() {
		var command = $(this).data('command');
		command && vessel.execCommand(command.toString(), false, $(this).data('value'));
	});

	/**
	 * Stop propagating from margin/toolbar to container.
	 */
	widget.click(function(event) {
		event.stopPropagation();
	});

	/**
	 * menu items.
	 */
	var actions = {
		save : save,
		hide : hide
	};

	/**
	 * Show the editor.
	 * @param element {Element}
	 */
	(function() {
		var box = $('>iframe', widget).load(function() {
			// Prevent duplicated execution.
			$(this).unbind('load');

			// Set content editable.
			vessel = this.contentDocument;
			vessel.designMode = 'on';
			vessel.execCommand('styleWithCSS', false, true);
			vessel.body.innerHTML = source.get(field, subject);

			// Bind events.
			$(vessel).focus(function() {
				box.addClass('focus')
			}).blur(function() {
				box.removeClass('focus')
			}).click(function(event) {
				event.stopPropagation();
				(new menu()).setup(actions);
			}).click();
		});
		$(element).addClass('ui-helper-hidden').after(widget.fadeIn('fast'));
	})();
}
