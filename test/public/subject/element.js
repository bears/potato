'use strict';

(function() {
	module('Element')

	var template = {
		s1: {
			f1: 2
		},
		s2: {
			f2: '3'
		}
	}

	POTATO.derive(POTATO.Element, 'EX', function(uuid, data) {
		return POTATO.Element.call(this, 'x', uuid, data)
	})

	test('>derive', function() {
		var x = new POTATO.EX('derive', template)
		ok(x instanceof POTATO.EX)
		ok(x instanceof POTATO.Element)
	})

	test('get', function() {
		var x = new POTATO.EX('get', template)

		strictEqual(x.get('f1', 's1'), 2)
		strictEqual(x.get('f2', 's2'), '3')

		strictEqual(x.get('f2', 's1'), undefined)
		strictEqual(x.get('f1', 's2'), undefined)

		strictEqual(x.get('f3'), undefined)
	})

	test('set', function() {
		var x = new POTATO.EX('set', template)

		x.set('x', 'f1', 's1')
		x.set(5, 'f2', 's2')
		x.set(false, 'f1', 's2')

		strictEqual(x.get('f1', 's1'), 'x')
		strictEqual(x.get('f2', 's2'), 5)
		strictEqual(x.get('f1', 's2'), false)

		x.set(true, 'f3')
		strictEqual(x.get('f3'), true)
	})

	var claimer = {
		notify: function(subject, action, source) {
			strictEqual(subject, 's1')
			switch (action) {
				case POTATO.NOTIFY.ATTACH:
					QUnit.step(1)
					break;
				case POTATO.NOTIFY.INSERT:
					QUnit.step(2)
					break;
				case POTATO.NOTIFY.CHANGE:
					QUnit.step(3)
					break
				case POTATO.NOTIFY.UPDATE:
					QUnit.step(4)
					break;
			}
		}
	}

	test('commit-auto', function() {
		POTATO.post = function(url, data, callback) {
			strictEqual(data.f1, 'x')
			callback({
				$: 'commit-auto',
				s1: data
			})
		}

		var x = new POTATO.EX('commit-auto', template)
		x.subscribe('s1', claimer)

		x.set('x', 'f1', 's1')
	})

	test('commit-manual', function() {
		POTATO.post = function(url, data, callback) {
			strictEqual(data.f1, 'x')
			strictEqual(data.f2, 3)
			callback({
				$: 'commit-manual',
				s1: data
			})
		}

		var x = new POTATO.EX('commit-manual', template)
		x.subscribe('s1', claimer)

		var t = Date.now();
		x.set('x', 'f1', 's1', t)
		x.set(3, 'f2', 's1', t)
		x.commit(t)
	})

	test('cancel', function() {
		POTATO.post = function(url, data, callback) {
			ok(false)
		}

		var x = new POTATO.EX('cancel', template)
		x.subscribe('s1', claimer)

		var t = Date.now();
		x.set('x', 'f1', 's1', t)
		x.cancel(t)

		raises(function() {
			x.commit(t)
		}, new RegExp(t))
	})
})()
