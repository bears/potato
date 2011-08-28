<?php
namespace exception;
/**
 * Triggered by error handler.
 */

class system_error extends \Exception {
	/**
	 * To trigger this exception.
	 * @param integer $code
	 * @param string $message
	 * @param string $file
	 * @param integer $line
	 */
	public static function trigger($code, $message, $file, $line) {
		$e = new system_error($message, $code);
		$e->file = $file;
		$e->line = $line;
		throw $e;
	}
}
?>
