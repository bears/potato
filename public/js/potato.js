'use strict';

/**
 * Load a JavaScript file.
 * @param path {String}
 * @param onload {Function} optional
 */
function include(path, onload) {
	var script = document.createElement('script');
	script.src = 'js/' + path + '.js';
	('function' == typeof onload) && (script.onload = onload);
	document.head.appendChild(script);
}

// Include all other files.
//@{
include('famulus/ab');
include('famulus/locale');
include('subject/subject', function() {
	include('subject/trivia');
});
include('present/annual');
include('present/tuber');
include('present/stock');
include('present/chaw');
include('widget/edit');
include('widget/menu');
include('launch');
//@}
