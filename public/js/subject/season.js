/**
 * Subject for seasons.
 */
function season() {
	return subject.apply(this, arguments);
}
$.extend(true, season, subject);
