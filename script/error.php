<?php
/**
 * Default error & exception callback.
 */

set_error_handler(function ($code, $message, $file, $line) {
	\exception\system_error::trigger($code, $message, $file, $line);
});

set_exception_handler(function ($exception) {
	error_log($exception, 4);
});
?>
