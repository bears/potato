/**
 * Subject for chip.
 */
function chip() {
	return subject.apply(this, arguments);
}
$.extend(true, chip, subject);
