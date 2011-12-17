'use strict';

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
	return POTATO[POTATO.PROFILE.USER.LOCALE];
};

/**
 * Localize an ISO 8601 string to a genial presentation.
 * @param iso8601 {String}
 * @return {String}
 */
POTATO.genialTime = function(iso8601) {
	var l10n = POTATO.getL10n();
	if (iso8601) {
		var distance = (Date.now() - (new Date(iso8601)).getTime()) / 1000;
		if (0 <= distance) {
			var step = {
				'300' : 'just_now',
				'600' : '5_minutes',
				'900' : '10_minutes',
				'1800' : 'quarter',
				'3600' : 'half_an_hour',
				'7200' : 'hour',
				'86400' : ['hours', 3600],
				'172800' : 'day',
				'604800' : ['days', 86400],
				'1209600' : 'week',
				'1814400' : ['weeks', 604800]
			};
			for (var next in step) {
				if (distance < next) {
					var unit = step[next];
					if ('string' == typeof unit) {
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
