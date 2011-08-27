<?php
namespace loader;
/**
 * Loading exception classes.
 */

spl_autoload_register(function ($name) {
	if (preg_match('#^(?P<namespace>exception(?:\\\\.+)?)\\\\(?P<basename>\w+)$#', $name, $match)) {
		eval("namespace {$match['namespace']}; class {$match['basename']} extends \\Exception {}");
	}
});
?>
