<?php
namespace famulus;

/**
 * Translate an abbreviation to its intactness form.
 */
class ba extends ab {

	/**
	 * Find subject intactness name from its abbreviation.
	 * @param string $class
	 * @param string $subject
	 * @return string
	 */
	public static function entry( $class, $subject ) {
		return @parent::$map_pool[$class][parent::UUID_KEY][$subject];
	}

}

// Initialize static data.
ba::load( 'ba' );
