'use strict';

(function() {
	require('famulus/pool.js');

	function X(uuid) {
		return POTATO.Object.apply(this, [uuid]);
	}
	function Y(uuid) {
		return POTATO.Object.apply(this, [uuid]);
	}

	test('typeOf', function() {
		var a = new X('typeOf')
		var b = new Y('typeOf')

		equal('X', POTATO.typeOf(a))
		equal('Y', POTATO.typeOf(b))
		notEqual(POTATO.typeOf(a), POTATO.typeOf(b))
	})

	test('{g|s}etObject', function() {
		var a = new X('xetObject#1')
		var b = new Y('xetObject#1')
		var c = new Y('xetObject#2')

		POTATO.setObject(a)
		POTATO.setObject(b)
		POTATO.setObject(c)

		strictEqual(a, POTATO.getObject('X', 'xetObject#1'))
		strictEqual(b, POTATO.getObject('Y', 'xetObject#1'))
		strictEqual(c, POTATO.getObject('Y', 'xetObject#2'))

		strictEqual(false, POTATO.getObject('Y', 'xetObject#3'))
		strictEqual(false, POTATO.getObject('Z', 'xetObject#1'))
	})

	test('ridObject', function() {
		strictEqual(false, POTATO.getObject('X', 'ridObject'))
		var a = new X('ridObject')
		POTATO.setObject(a)
		strictEqual(a, POTATO.getObject('X', 'ridObject'))
		POTATO.ridObject(a)
		strictEqual(false, POTATO.getObject('X', 'ridObject'))
	})
})();
