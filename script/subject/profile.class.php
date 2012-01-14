<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	const LOCK_KEY = 'lock';
	const SIGN_KEY = 'sign';
	const L10N_KEY = 'l10n';

	/**
	 * @return JSON
	 */
	public function __toString() {
		$lock = rand(); ///< @todo: fetch from user profile when available
		$data = array( self::LOCK_KEY => $lock );
		if ( file_get_contents( 'php://input' ) !== $lock ) {
			$data[self::L10N_KEY] = 'en-us';
			$data[self::SIGN_KEY] = '';
		}
		return json_encode( $data );
	}

}
