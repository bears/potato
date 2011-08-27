<?php
/**
 * The default class loader.
 */
spl_autoload_register(function ($name) {
	$file = str_replace('\\', DIRECTORY_SEPARATOR, $name) . '.class.php';
	if ( file_exists($file) ) {
		return require_once $file;
	}

	// Cannot find the file, try to dynamically generate.
	if ( preg_match('#^(?P<space>(?P<domain>\w+)(?:\\\\\w+)*)\\\\(?P<class>\w+)$#', $name, $match) ) {
		switch ( $match['domain'] ) {
			case 'exception':
				return eval("namespace {$match['space']}; class {$match['class']} extends \\Exception {}");
		}
	}
});
?>
