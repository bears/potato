'use strict';

POTATO.module('famulus/l10n', [], function() {
	/**
	 * Replace parameters in a template.
	 * @param template {String} HTML
	 * @param lookup {Object}
	 */
	POTATO.replace = function(template, lookup) {
		return template.replace(/{%(\w+)%}/g, function(unused, key) {
			return lookup[key];
		});
	};

	/**
	 * Localization of current locale.
	 */
	POTATO.getL10n = function() {
		return POTATO[POTATO.PROFILE.L10N];
	};

	/**
	 * Localize an ISO 8601 string to a genial presentation.
	 * @param iso8601 {String}
	 * @return {String}
	 */
	POTATO.genialTime = function(iso8601) {
		var l10n = POTATO.getL10n();
		if (iso8601) {
			var distance = (Date.now() - (new Date(iso8601)).getTime()) / 100000;
			if (0 <= distance) {
				var step = {
					'3' : 'just_now',
					'6' : '5_minutes',
					'9' : '10_minutes',
					'18' : 'quarter',
					'36' : 'half_an_hour',
					'72' : 'hour',
					'864' : ['hours', 36],
					'1728' : 'day',
					'6048' : ['days', 864],
					'12096' : 'week',
					'18144' : ['weeks', 6048]
				};
				for (var next in step) {
					if (distance < next) {
						var unit = step[next];
						if ('string' === typeof unit) {
							return l10n['time_' + unit];
						}
						else {
							return POTATO.replace(l10n['time_' + unit[0]], {
								n : Math.floor(distance / unit[1])
							});
						}
					}
				}
			}
			return (new Date(iso8601)).toLocaleDateString();
		}
		else {
			return l10n.time_present;
		}
	};
});
