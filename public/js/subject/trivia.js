/*
 * Trivial subjects.
 */

/**
 * Subject for a single chip.
 */
function chip() {
	return subject.apply(this, arguments);
}
$.extend(true, chip, subject);

/**
 * Subject for chips.
 */
function chips() {
	return subject.apply(this, arguments);
}
$.extend(true, chips, subject);

/**
 * Subject for a single potato.
 */
function potato() {
	return subject.apply(this, arguments);
}
$.extend(true, potato, subject);

/**
 * Subject for tubers.
 */
function season() {
	return subject.apply(this, arguments);
}
$.extend(true, season, subject);
