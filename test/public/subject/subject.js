'use strict';

(function() {
	module('Subject')

	POTATO.derive(POTATO.Subject, 'SX', function(uuid) {
		return POTATO.Subject.call(this, uuid, function(gene) {
			gene.subscribe = function(subject, claimer) {
				strictEqual(subject, 'test')
				strictEqual(typeof claimer.notify, 'function')
			}
		})
	})

	test('>derive', function() {
		var x = new POTATO.SX('derive')
		ok(x instanceof POTATO.SX)
		ok(x instanceof POTATO.Subject)
	})

	test('(un)subscribe', 8, function() {
		var claimer = {
			notify: function(subject, action, source) {
				ok(POTATO.SX.prototype.isPrototypeOf(source))
				strictEqual(subject, 'test')
				switch (action) {
					case POTATO.NOTIFY.ATTACH:
						QUnit.step(1)
						break;
					case POTATO.NOTIFY.DETACH:
						QUnit.step(2)
						break
				}
			}
		}

		var x = new POTATO.SX('subscribe')
		x.subscribe('test', claimer)
		x.unsubscribe('test', claimer)
	})
})()
