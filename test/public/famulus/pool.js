'use strict';

(function() {
	require('famulus/pool.js');

	function X() {}
	function Y() {}

	test('typeOf', function() {
		var a = new X()
		var b = new Y()

		equal('X', POTATO.typeOf(a))
		equal('Y', POTATO.typeOf(b))
		notEqual(POTATO.typeOf(a), POTATO.typeOf(b))
	})

	test('{g|s}etObject', function() {
		var a = new X()
		var b = new Y()
		var c = new Y()

		POTATO.setObject(a, 'xetObject#1')
		POTATO.setObject(b, 'xetObject#1')
		POTATO.setObject(c, 'xetObject#2')

		strictEqual(a, POTATO.getObject('X', 'xetObject#1'))
		strictEqual(b, POTATO.getObject('Y', 'xetObject#1'))
		strictEqual(c, POTATO.getObject('Y', 'xetObject#2'))

		strictEqual(undefined, POTATO.getObject('Y', 'xetObject#3'))
		strictEqual(undefined, POTATO.getObject('Z', 'xetObject#1'))
	})

	test('ridObject', function() {
		strictEqual(undefined, POTATO.getObject('X', 'ridObject'))
		var a = new X()
		POTATO.setObject(a, 'ridObject')
		strictEqual(a, POTATO.getObject('X', 'ridObject'))
		POTATO.ridObject('X', 'ridObject')
		strictEqual(undefined, POTATO.getObject('X', 'ridObject'))
	})
})();
