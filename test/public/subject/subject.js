function sDirty(){
	return sSubject.apply(this, arguments)
}
$.extend(true, sDirty, sSubject);
sDirty.loadAb({$:{'user':'u'}, user:{'time':'t'}});

test('uuid', 3, function() {
	var a = new sDirty('xxx-aaa');
	equal(a.uuid(), 'xxx-aaa');
	var b = new sDirty('yyy-bbb');
	equal(b.uuid(), 'yyy-bbb');
	notEqual(a.uuid(), b.uuid());
});

test('get/set', 2, function() {
	var c = new sDirty('abc-123', {u:{t:21}});
	equal(c.get('time', 'user'), 21);
	c.set(34, 'time', 'user');
	equal(c.get('time', 'user'), 34);
});

test('get/set-Object', 3, function() {
	var d = new sDirty('ddd-123');
	var e = new sDirty('eee-123');
	equal(d, sDirty.getObject('ddd-123'));
	equal(e, sDirty.getObject('eee-123'));
	notEqual(sDirty.getObject('ddd-123'), sDirty.getObject('eee-123'));
});

test('constructor', 2, function() {
	var f = new sDirty('fff-ggg');
	var g = new sDirty('fff-ggg');
	var h = new sDirty('hhh-hhh');
	equal(f, g);
	notEqual(g, h);
});
