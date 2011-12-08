'use strict';

(function() {
	require('famulus/ab.js');
	require('famulus/ba.js');
	require('subject/subject.js')
	require('subject/trivia.js')

	var template = {
		s1: {
			f1: 2
		},
		s2: {
			f2: '3'
		}
	}

	test('new subject', function() {
		ok((new POTATO.Chip('chip.new')) instanceof POTATO.Chip)
		ok((new POTATO.Potato('potato.new')) instanceof POTATO.Potato)

		function a() {
			return new POTATO.Chip('a:chip.new')
		}
		ok((new a()) instanceof POTATO.Chip)
		ok(!((new a()) instanceof a))
	})

	test('subject.get', function() {
		var a = new POTATO.Potato('subject.get', template)

		strictEqual(2, a.get('f1', 's1'))
		strictEqual('3', a.get('f2', 's2'))

		strictEqual(undefined, a.get('f2', 's1'))
		strictEqual(undefined, a.get('f1', 's2'))

		strictEqual(undefined, a.get('f3'))
	})

	test('subject.set', function() {
		var a = new POTATO.Potato('subject.set', template)

		a.set('x', 'f1', 's1')
		a.set(5, 'f2', 's2')
		a.set(false, 'f1', 's2')

		strictEqual('x', a.get('f1', 's1'))
		strictEqual(5, a.get('f2', 's2'))
		strictEqual(false, a.get('f1', 's2'))

		a.set(true, 'f3')
		strictEqual(true, a.get('f3'))
	})

	test('subject.uuid', function() {
		var a = new POTATO.Potato('subject.uuid#1', {
			$: 'subject.uuid-2'
		})
		var b = new POTATO.Potato('subject.uuid#3')

		equal('subject.uuid#1', a.uuid())
		equal('subject.uuid#3', b.uuid())

		notEqual(a.uuid(), b.uuid())
	})

	test('subject.subscribe', function() {
		//
	})

	test('subject.unsubscribe', function() {
		//
	})
})()
