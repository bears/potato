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
	ok((new season('season.new')) instanceof season)
	ok((new potato('potato.new')) instanceof potato)
	ok((new chip('chip.new')) instanceof chip)

	function a() {
		return new chip('a:chip.new')
	}
	ok((new a()) instanceof chip)
	ok(!((new a()) instanceof a))
})

test('subject.get', function() {
	var a = new potato('subject.get', template)

	strictEqual(2, a.get('f1', 's1'))
	strictEqual('3', a.get('f2', 's2'))

	strictEqual(undefined, a.get('f2', 's1'))
	strictEqual(undefined, a.get('f1', 's2'))

	strictEqual(undefined, a.get('f3'))
})

test('subject.set', function() {
	var a = new potato('subject.set', template)

	a.set('x', 'f1', 's1')
	a.set(5, 'f2', 's2')
	a.set(false, 'f1', 's2');

	strictEqual('x', a.get('f1', 's1'))
	strictEqual(5, a.get('f2', 's2'))
	strictEqual(false, a.get('f1', 's2'))

	a.set(true, 'f3');
	strictEqual(true, a.get('f3'))
})

test('subject.uuid', function() {
	var a = new potato('subject.uuid#1', {
		$: 'subject.uuid-2'
	})
	var b = new potato('subject.uuid#3')

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

test('subject::getObject', function() {
	var a = new season('subject::getObject')
	var b = new potato('subject::getObject')

	strictEqual(a, season.getObject('subject::getObject'))
	strictEqual(b, potato.getObject('subject::getObject'))
	notStrictEqual(season.getObject('subject::getObject'), potato.getObject('subject::getObject'))
})

test('subject::setObject', function() {
	var a = new potato('subject::getObject#1')
	var b = new potato('subject::getObject#1')
	var c = new potato('subject::getObject#2')

	strictEqual(a, b)
	notStrictEqual(a, c)
})

test('subject::typeOf', function() {
	equal('season', season.typeOf())
	equal('potato', potato.typeOf())
	equal('chip', chip.typeOf())
})
