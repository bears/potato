/**
 * Subject for chips.
 */
function chips() {
	return subject.apply(this, arguments);
}
$.extend(true, chips, subject);
