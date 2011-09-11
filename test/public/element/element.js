$.extend(true, bhDirty, bhElement)
function bhDirty(){
	return bhElement.apply(this, arguments)
}

bhDirty.prototype.ab = {
	_:{'user':'u'},
	u:{'time':'t'}
}

test('uuid', 3, function() {
	var a = new bhDirty('xxx-aaa');
	equal(a.uuid(), 'xxx-aaa');
	var b = new bhDirty('yyy-bbb');
	equal(b.uuid(), 'yyy-bbb');
	notEqual(a.uuid(), b.uuid());
});

//test('get/set', 2, function() {
//	var c = new bhDirty('abc-123');
//	c.set(34, 'time', 'user');
//	equal(c.get('time', 'user'), 34);
//});

test('get/set-Object', 3, function() {
	var d = new bhDirty('ddd-123');
	var e = new bhDirty('eee-123');
	equal(d, bhDirty.getObject('ddd-123'));
	equal(e, bhDirty.getObject('eee-123'));
	notEqual(bhDirty.getObject('ddd-123'), bhDirty.getObject('eee-123'));
});

test('constructor', 2, function() {
	var f = new bhDirty('fff-ggg');
	var g = new bhDirty('fff-ggg');
	var h = new bhDirty('hhh-hhh');
	equal(f, g);
	notEqual(g, h);
});
