<?php
namespace loader;
/**
 * The main file of class loader for others to include.
 */

spl_autoload_register(function ($name) {
	$file = str_replace('\\', DIRECTORY_SEPARATOR, $name) . '.class.php';
	if (file_exists($file)) {
		require_once $file;
	}
});

require_once 'loader/exception.php';
?>
