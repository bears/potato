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
		return @self::$map_pool[$class][parent::UUID_KEY][$subject];
	}

	/**
	 * Whole map.
	 * @var array
	 */
	protected static $map_pool = array( );

	/**
	 * Cached ba objects.
	 * @var array(ab)
	 */
	protected static $object_pool = array( );

}

// Initialize static data.
ba::load( 'ba' );
