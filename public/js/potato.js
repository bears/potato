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
	 * Load files listed in `_SOURCES_` one by one.
	 */
	(function _1_BY_1_(index) {
		var script = document.createElement('script');
		script.src = 'js/' + _SOURCES_[index] + '.js';
		if (++index < _SOURCES_.length) {
			script.onload = function() {
				_1_BY_1_(index);
			};
		}
		document.head.appendChild(script);
	})(0);
})();
