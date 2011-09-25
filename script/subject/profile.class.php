<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	/**
	 * @return JSON
	 */
	public function __toString() {
		$profile = array(
			'LOCALE' => 'en_US',
		);
		$all_constants = get_defined_constants( true );
		foreach ( $all_constants['user'] as $name => $value ) {
			if ( preg_match( '#\bPROFILE_(?P<name>\w+)$#', $name, $match ) ) {
				$profile[$match['name']] = $value;
			}
		}
		return json_encode( $profile );
	}

}
