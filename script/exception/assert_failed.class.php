<?php
namespace exception;
/**
 * Triggered by failed assertion.
 */

class assert_failed extends \Exception {
	/**
	 * Callback of failed assert().
	 * @param string $file
	 * @param integer $line
	 * @param string $message
	 */
	public static function callback($file, $line, $message) {
		$e = new assert_failed($message);
		$e->line = $line;
		$e->file = $file;
		throw $e;
	}
}
?>
