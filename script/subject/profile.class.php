<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	/**
	 * @return JavaScript file.
	 */
	public function __toString() {
		$profile = array(
			'locale' => 'en_US',
		);
		$all_constants = get_defined_constants( true );
		foreach ( $all_constants['user'] as $name => $value ) {
			if ( preg_match( '#\bPROFILE_(?P<name>\w+)$#', $name, $match ) ) {
				$profile[strtolower( $match['name'] )] = $value;
			}
		}
		return 'POTATO.PROFILE = ' . json_encode( $profile );
	}

}
