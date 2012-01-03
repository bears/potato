'use strict';

(function(POTATO) {
	module('Cluster')
	require('subject/cluster.js')

	test('>derive', function() {
		strictEqual(typeof POTATO.Cluster, 'function')
		strictEqual(typeof POTATO.CX, 'undefined')

		POTATO.derive(POTATO.Cluster, 'CX', function(uuid) {
			return POTATO.Cluster.apply(this, ['EX', 'x', uuid])
		})
	})

	test('sign', function() {
		var x = new POTATO.CX('cluster=sign')
		strictEqual(x.sign(), 'sign')
	})

	test('append|each', 2, function() {
		var x = new POTATO.CX('cluster=test')
		x.append('test', 0, [{
			$: 'CX-1',
			s: {
				f:1
			}
		}, {
			$: 'CX-2',
			s: {
				f:1
			}
		}])
		x.each('test', function() {
			ok(POTATO.EX.prototype.isPrototypeOf(this))
		})
	})
})(POTATO)
