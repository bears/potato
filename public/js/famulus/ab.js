'use strict';

/**
 * Abbreviation dictionary.
 */
POTATO.AB = {
	potato : {
		tuber : {
			$ : 't',
			brand : 'b',
			label : 'l'
		},
		stock : {
			$ : 's',
			craft : 'c',
			season : 'n',
			weight : 'w',
			variety : 'v',
			seeding : 'g',
			harvest : 'h'
		},
		fries : {
			$ : 'f',
			chips : 'c'
		}
	},
	chip : {
		fries : {
			$ : 'f',
			detail : 'd'
		}
	},
	season : {
		season : {
			$ : 's',
			tubers : 't'
		}
	}
};

/**
 * Build reverse dictionary.
 */
(function() {
	POTATO.BA = {};
	for (var c in POTATO.AB) {
		var ab_class = POTATO.AB[c];
		var ba_class = {};
		for (var s in ab_class) {
			var ab_subject = ab_class[s];
			var ba_subject = {};
			for (var i in ab_subject) {
				ba_subject[ab_subject[i]] = i;
			}
			delete ba_subject[ab_subject.$];
			ba_subject.$ = s;
			ba_class[ab_subject.$] = ba_subject;
		}
		POTATO.BA[c] = ba_class;
	}
})();
