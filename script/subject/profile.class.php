<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	const LOCK_KEY = 'LOCK';
	const L10N_KEY = 'L10N';

	/**
	 * @return JSON
	 */
	public function __toString() {
		$lock = rand(); ///< @todo: fetch from user profile when available
		$data = array( self::LOCK_KEY => $lock );
		if ( file_get_contents( 'php://input' ) !== $lock ) {
			$data[self::L10N_KEY] = 'en-us';
		}
		return json_encode( $data );
	}

}
