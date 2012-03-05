'use strict';

(function() {
	module('Loader')

	test('require', 1, function() {
		POTATO.require([], function() {
			ok(true)
		})
	})

	test('provide', 1, function() {
		POTATO.provide('m1')
		POTATO.require(['m1'], function() {
			ok(true)
		})
	})

	test('module', 2, function() {
		POTATO.module('m2', ['m1'], function() {
			ok(true)
		})
		POTATO.require(['m1', 'm2'], function() {
			ok(true)
		})
	})
})()
