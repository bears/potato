'use strict';

(function(POTATO) {
	module('Subject')
	require('subject/subject.js')

	test('>derive', function() {
		strictEqual(typeof POTATO.Subject, 'function')
		strictEqual(typeof POTATO.SX, 'undefined')

		POTATO.derive(POTATO.Subject, 'SX', function(uuid) {
			return POTATO.Subject.apply(this, [uuid, function(gene) {
				gene.subscribe = function(subject, claimer) {
					strictEqual(subject, 'test')
					strictEqual(typeof claimer.notify, 'function')
				}
			}])
		})
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
})(POTATO)
