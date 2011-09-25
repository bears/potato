<?php
namespace exception;

/**
 * Triggered by failed assertion.
 */
class failed_assertion extends \Exception {

	/**
	 * Callback of failed assert().
	 * @param string $file
	 * @param integer $line
	 * @param string $message
	 */
	public static function callback( $file, $line, $message ) {
		$e = new failed_assertion( $message );
		$e->line = $line;
		$e->file = $file;
		throw $e;
	}

}
