'use strict';

(function() {
	/**
	 * JavaScript files need to be loaded.
	 */
	var _SOURCES_ = [
	'famulus/ab',
	'famulus/ba',
	'famulus/pool',
	'famulus/locale',
	'famulus/convert',
	'subject/subject',
	'subject/trivia',
	'present/present',
	'present/annual',
	'present/tuber',
	'present/stock',
	'present/chaw',
	'widget/edit',
	'widget/menu',
	'launch'
	];

	/**
	 * HTML files need to be loaded.
	 */
	var _TEMPLATES_ = [
	'body',
	'tuber',
	'stock',
	'fries',
	'edit'
	];

	/**
	 * HTML templates.
	 */
	POTATO.TEMPLATE = {};

	/**
	 * Load files listed in `_SOURCES_` one by one.
	 */
	(function loadSource(index) {
		var script = document.createElement('script');
		script.src = 'js/' + _SOURCES_[index] + '.js';
		script.onload = function() {
			(++index < _SOURCES_.length) ? loadSource(index) : loadTemplate();
		};
		document.head.appendChild(script);
	})(0);

	/**
	 * Load files listed in `_TEMPLATES_`.
	 */
	function loadTemplate() {
		$.each(_TEMPLATES_, function() {
			$.get(POTATO.LOAD_PREFIX + 'html/' + this + '.html', function(content) {
				var template = $(content).first();
				var name = template.attr('id');
				POTATO.TEMPLATE[name] = template.html();
				('body' == name) && POTATO.render();
			});
		});
	}
})();
