/**
 * Subject for seasons.
 */
function sSeason() {
	return sSubject.apply(this, arguments);
}
$.extend(true, sSeason, sSubject);

sSeason.loadAb({$:{}});
