/**
 * Subject for a potato.
 */
function potato() {
	return subject.apply(this, arguments);
}
$.extend(true, potato, subject);
