'use strict';

(function() {
	/**
	 * JavaScript files need to be loaded.
	 */
	var _SOURCES_ = [
	'famulus/ab',
	'famulus/ba',
	'famulus/pool',
	'famulus/l10n',
	'l10n/en-us',
	'subject/subject',
	'subject/element',
	'subject/cluster',
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
	function loadSource(index) {
		var script = document.createElement('script');
		script.src = 'js/' + _SOURCES_[index] + '.js';
		script.onload = function() {
			(++index < _SOURCES_.length) ? loadSource(index) : loadTemplate(0);
		};
		document.head.appendChild(script);
	}

	/**
	 * Load files listed in `_TEMPLATES_` one by one.
	 */
	function loadTemplate(index) {
		$.get('html/' + _TEMPLATES_[index] + '.html', function(content) {
			var template = $(content).first();
			POTATO.TEMPLATE[template.attr('id')] = template.html();
			(++index < _TEMPLATES_.length) ? loadTemplate(index) : POTATO.render();
		});
	}

	// Start loading sequence.
	loadSource(0);
})();
