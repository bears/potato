'use strict';

(function() {
	module('Cluster')

	POTATO.derive(POTATO.Cluster, 'CX', function(uuid) {
		return POTATO.Cluster.call(this, 'EX', 'x', uuid)
	})

	test('>derive', function() {
		var x = new POTATO.CX('cluster=derived')
		ok(x instanceof POTATO.CX)
		ok(x instanceof POTATO.Cluster)
	})

	test('sign', function() {
		var x = new POTATO.CX('cluster=sign')
		strictEqual(x.sign(), 'sign')
		// var y = new POTATO.CX('cluster=sign=more')
		// strictEqual(y.sign(), 'sign=more')
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
})()
