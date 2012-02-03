'use strict';

POTATO.module('widget/edit', ['present', 'html!edit'], function() {
	/**
	 * General text editor.
	 */
	POTATO.derive(POTATO.Present, 'Edit', function(source, subject, field, element) {
		var uuid = source.uuid() + '-' + subject + '-' + field;
		return POTATO.Present.call(this, uuid, function(gene) {
			/**
			 * The element to be operate.
			 */
			var widget = $(POTATO.TEMPLATE.edit).attr('id', uuid);

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
					('function' === typeof callback) && callback();
					$(element).removeClass('ui-helper-hidden').click();
					widget.remove();
					POTATO.ridObject(gene.SELF);
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

			// Show the editor.
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
					POTATO.require(['widget/menu'], function() {
						(new POTATO.Menu()).setup(actions);
					});
				}).click();
			});
			$(element).addClass('ui-helper-hidden').after(widget.fadeIn('fast'));
		});
	});
});
