/**
 * Subject for a potato.
 */
function sPotato() {
	return sSubject.apply(this, arguments);
}
$.extend(true, sPotato, sSubject);

sPotato.loadAb({$:{}});
