'use strict';

(function(POTATO) {
	module('L10n')
	require('famulus/l10n.js')

	POTATO['PROFILE'] = {
		USER : {
			L10N : 'te-st'
		}
	}
	POTATO['te-st'] = {
		time_present : 'p',
		time_just_now : 'j',
		time_5_minutes : '5m',
		time_10_minutes : '10m',
		time_quarter : '1/4h',
		time_half_an_hour : '1/2h',
		time_hour : '1h',
		time_hours : '{%n%}hs',
		time_day : '1d',
		time_days : '{%n%}ds',
		time_week : '1w',
		time_weeks : '{%n%}ws'
	}

	test('replace', function() {
		strictEqual(POTATO.replace('{%a%} {%b%} {%a%}', {
			a:'again',
			b:'and'
		}), 'again and again')
	})

	test('getL10n', function() {
		var l10n = POTATO.getL10n()
		strictEqual(typeof l10n, 'object')
		strictEqual(l10n.time_present, POTATO['te-st'].time_present)
	})

	test('genialTime', function() {
		strictEqual(POTATO.genialTime(), 'p')

		function dt(offset) {
			var now = Date.now()
			return (new Date(now + offset * 1000)).toJSON()
		}

		strictEqual(POTATO.genialTime(dt(0)), 'j')
		strictEqual(POTATO.genialTime(dt(-299)), 'j')
		strictEqual(POTATO.genialTime(dt(-300)), '5m')
		strictEqual(POTATO.genialTime(dt(-599)), '5m')
		strictEqual(POTATO.genialTime(dt(-600)), '10m')
		strictEqual(POTATO.genialTime(dt(-899)), '10m')
		strictEqual(POTATO.genialTime(dt(-900)), '1/4h')
		strictEqual(POTATO.genialTime(dt(-1799)), '1/4h')
		strictEqual(POTATO.genialTime(dt(-1800)), '1/2h')
		strictEqual(POTATO.genialTime(dt(-3599)), '1/2h')
		strictEqual(POTATO.genialTime(dt(-3600)), '1h')
		strictEqual(POTATO.genialTime(dt(-7199)), '1h')
		strictEqual(POTATO.genialTime(dt(-7200)), '2hs')
		strictEqual(POTATO.genialTime(dt(-10799)), '2hs')
		strictEqual(POTATO.genialTime(dt(-10800)), '3hs')
		strictEqual(POTATO.genialTime(dt(-14399)), '3hs')
		strictEqual(POTATO.genialTime(dt(-14400)), '4hs')
		strictEqual(POTATO.genialTime(dt(-86399)), '23hs')
		strictEqual(POTATO.genialTime(dt(-86400)), '1d')
		strictEqual(POTATO.genialTime(dt(-172799)), '1d')
		strictEqual(POTATO.genialTime(dt(-172800)), '2ds')
		strictEqual(POTATO.genialTime(dt(-604799)), '6ds')
		strictEqual(POTATO.genialTime(dt(-604800)), '1w')
		strictEqual(POTATO.genialTime(dt(-1209599)), '1w')
		strictEqual(POTATO.genialTime(dt(-1209600)), '2ws')
		strictEqual(POTATO.genialTime(dt(-1814399)), '2ws')
	})
})(POTATO)
