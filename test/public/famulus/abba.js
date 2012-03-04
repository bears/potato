'use strict';

(function() {
	module('ABBA')

	test('match', function() {
		for (var i in POTATO.AB) {
			ok(i in POTATO.BA)
			var a = POTATO.AB[i]
			var b = POTATO.BA[i]
			for (var j in a) {
				var s = a[j]
				ok(s.$ in b)
				var o = b[s.$]
				for (var k in s) {
					if ('$' !== k) {
						strictEqual(o[s[k]], k)
					}
				}
			}
		}
	})
})()
