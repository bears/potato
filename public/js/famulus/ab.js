'use strict';

POTATO.module('ab', [], function() {
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
				harvest : 'h',
				fries : 'f'
			}
		},
		chip : {
			fries : {
				$ : 'f',
				detail : 'd'
			}
		}
	};
});
