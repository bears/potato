'use strict';

/**
 * Single chip in fries.
 * @param uuid {String}
 * @param vessel {Element}
 */
function chaw(uuid, vessel) {
	// Prevent duplicated object.
	var cached = $('#chaw_' + uuid).data('self');
	if (cached instanceof chaw) {
		return cached;
	}

	/**
	 * Callback for chip.
	 * @param subject {String}
	 * @param type {String} One of POTATO.NOTIFY.*
	 * @param source {potato}
	 */
	this.notify = function(subject, type, source) {
		switch (type) {
			case POTATO.NOTIFY.INSERT:
				var template = '<blockquote class="ui-corner-br"><time/><span class="shrink ui-icon ui-icon-carat-1-s"/><div id="chaw_{%u%}" class="editable">{%c%}</div></blockquote>';
				var html = POTATO.replace(template, {
					u : uuid,
					c : source.get('detail', 'fries')
				});
				var target = $(html).data('self', this).click(function(event) {
					event.stopPropagation();
					(new menu()).setup(actions);
				}).appendTo(vessel);
				$('>.shrink', target).click(function(event) {
					$(this).parent().toggleClass('collapsed');
				});
				break;

			case POTATO.NOTIFY.UPDATE:
				break;
		};
	};

	/**
	 * menu items.
	 */
	var actions = {
		edit : function() {
			(new edit()).show($('#chaw_' + uuid).parent());
		}
	};

	// Subscribe to the data source.
	(new chip(uuid)).subscribe('fries', this);
}
