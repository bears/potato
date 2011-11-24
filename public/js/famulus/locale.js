'use strict';

/**
 * Localization dictionary.
 */
POTATO.L10N = {
	en_US : {
		// page title
		title : 'Potato',

		// header
		search : 'Plough Potato',

		// menu bar
		menu_stats : 'Stats',
		menu_seed : 'Seed',
		menu_plow : 'Plow',
		menu_harvest : 'Harvest',
		menu_save : 'Finish',
		menu_hide : 'Discard',

		// left panel
		season_spring : 'Spring',
		season_summer : 'Summer',
		season_autumn : 'Autumn',
		season_winter : 'Winter',

		// main panel
		stock_variety : 'Variety',
		stock_fries : 'Fries',

		// genial time
		time_present : 'Present',
		time_just_now : 'just now',
		time_5_minutes : 'about 5 mins ago',
		time_10_minutes : 'about 10 mins ago',
		time_quarter : 'about a quarter ago',
		time_half_an_hour : 'about half an hour ago',
		time_hour : 'about an hour ago',
		time_hours : '{%n%} hours ago',
		time_day : '1 day ago',
		time_days : '{%n%} days ago',
		time_week : '1 week ago',
		time_weeks : '{%n%} weeks ago',

		// edit bar
		editor_bold : 'Bold',
		editor_italic : 'Italic',
		editor_underline : 'Underline',
		editor_strike : 'Strike Through',
		editor_subscript : 'Subscript',
		editor_superscript : 'Superscript',
		editor_left : 'Align Left',
		editor_center : 'Align Center',
		editor_full : 'Align Full',
		editor_right : 'Align Right',
		editor_outdent : 'Outdent',
		editor_indent : 'Indent',
		editor_123 : 'Ordered List',
		editor_aaa : 'Unordered List',
		editor_hilite : 'Highlight',
		editor_save : 'Save',
		editor_discard : 'Discard',

		// right panel
		statistics : 'Statistics',

		// footer
		tips : [
		'Welcome to bears\' home!',
		'In spring we plan the year.',
		'Summer is the good time to do great.',
		'Potato will be harvested in autumn.',
		'All go to die in winter.'
		],
		copyright : 'Copyright &copy; 2011 Bears Home'
	}
};

/**
 * Translation map of current locale.
 */
POTATO.locale = function() {
	return POTATO.L10N[POTATO.PROFILE.CODE.LOCALE];
};

/**
 * Localize an ISO 8601 string to a genial presentation.
 * @param iso8601 {String}
 * @return {String}
 */
POTATO.genialTime = function(iso8601) {
	if (iso8601) {
		var distance = ((new Date()).getTime() - (new Date(iso8601)).getTime()) / 1000;
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
					var locale = POTATO.locale();
					var unit = step[next];
					if ('string' == typeof unit) {
						return locale['time_' + unit];
					}
					else {
						return POTATO.replace(locale['time_' + unit[0]], {
							n : Math.floor(distance / unit[1])
						});
					}
				}
			}
		}
		return (new Date(iso8601)).toLocaleDateString();
	}
	else {
		return POTATO.locale().time_present;
	}
};