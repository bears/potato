'use strict';

(function() {
	module('Object')

	test('~derive', function() {
		strictEqual(typeof POTATO.Object, 'function')
		strictEqual(typeof POTATO.OX, 'undefined')
		strictEqual(typeof POTATO.OY, 'undefined')

		POTATO.derive(POTATO.Object, 'OX', function(uuid) {
			return POTATO.Object.call(this, uuid)
		})

		POTATO.derive(POTATO.Object, 'OY', function(uuid) {
			return POTATO.Object.call(this, uuid)
		})
	})

	test('Object.prototype.isPrototypeOf', function() {
		var x = new POTATO.OX('isPrototypeOf#X')
		ok(POTATO.OX.prototype.isPrototypeOf(x))
		ok(POTATO.Object.prototype.isPrototypeOf(x))

		var y = new POTATO.OY('isPrototypeOf#Y')
		ok(POTATO.OY.prototype.isPrototypeOf(y))
		ok(POTATO.Object.prototype.isPrototypeOf(y))

		ok(!POTATO.OX.prototype.isPrototypeOf(y))
	})

	test('uuid', function() {
		var x = new POTATO.OX('uuid#X')
		var y = new POTATO.OY('uuid#Y', {
			$: 'uuid#Z'
		})

		strictEqual(x.uuid(), 'uuid#X')
		strictEqual(y.uuid(), 'uuid#Y')
	})

	test('~getObject', function() {
		var a = new POTATO.OX('getObject#1')
		var b = new POTATO.OY('getObject#1')
		var c = new POTATO.OY('getObject#2')

		strictEqual(POTATO.getObject('OX', 'getObject#1'), a)
		strictEqual(POTATO.getObject('OY', 'getObject#1'), b)
		strictEqual(POTATO.getObject('OY', 'getObject#2'), c)

		strictEqual(POTATO.getObject('OY', 'getObject#3'), false)
		strictEqual(POTATO.getObject('OZ', 'getObject#1'), false)
	})

	test('~ridObject', function() {
		strictEqual(POTATO.getObject('OX', 'ridObject'), false)

		var a = new POTATO.OX('ridObject')
		strictEqual(POTATO.getObject('OX', 'ridObject'), a)

		POTATO.ridObject(a)
		strictEqual(POTATO.getObject('OX', 'ridObject'), false)
	})
})()
