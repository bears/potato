<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	const CODE_KEY = 'CODE';
	const USER_KEY = 'USER';
	const LOCK_KEY = 'LOCK';
	const SIGN_KEY = 'SIGN';
	const L10N_KEY = 'L10N';

	/**
	 * @return JSON
	 */
	public function __toString() {
		$prev_code = isset( $_POST[self::CODE_KEY] ) ? $_POST[self::CODE_KEY] : null;
		$prev_user = isset( $_POST[self::USER_KEY] ) ? $_POST[self::USER_KEY] : null;
		return json_encode( array(
			self::CODE_KEY => $this->get_code_settings( $prev_code ),
			self::USER_KEY => $this->get_user_settings( $prev_user ),
		) );
	}

	/**
	 * Get code settings if $previous is expired.
	 * @param integer $previous
	 * @return array
	 */
	private function get_code_settings( $previous ) {
		$lock = filemtime( \setting\SETTING_FILE_PATH );
		$data = array( self::LOCK_KEY => $lock );
		if ( $previous != $lock ) {
			$constants = get_defined_constants( true );
			foreach ( $constants['user'] as $name => $value ) {
				if ( preg_match( '#\\bPROFILE_(?P<name>\\w+)$#', $name, $match ) ) {
					$data[$match['name']] = $value;
				}
			}
			$data[self::SIGN_KEY] = require 'setting/sign.php';
		}
		return $data;
	}

	/**
	 * Get user settings if $previous is expired.
	 * @param integer $previous
	 * @return array
	 */
	private function get_user_settings( $previous ) {
		$lock = '@todo: fetch from user profile when available';
		$data = array( self::LOCK_KEY => $lock );
		if ( $previous != $lock ) {
			$data[self::L10N_KEY] = 'en-us';
		}
		return $data;
	}

}
