'use strict';

(function() {
	module('loader')

	test('>module', function() {
		POTATO.require([], function() {
			ok(true)
		})
		POTATO.provide('m1')
		POTATO.require(['m1'], function() {
			ok(true)
		})
		POTATO.module('m2', ['m1'], function() {
			ok(true)
		})
		POTATO.require(['m1', 'm2'], function() {
			ok(true)
		})
	})
})()
