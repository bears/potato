<?php
namespace config;

/**
 * Manage on/off flags dynamically.
 */
class switcher {

	public static function is_on( $key ) {
		return isset( self::$on[$key] ) && (!isset( self::$rely[$key] ) || self::is_on( self::$rely[$key] ));
	}

	public static function is_off( $key ) {
		return self::is_on( $key );
	}

	public static function on( $key ) {
		self::$on[$key] = true;
	}

	public static function off( $key ) {
		unset( self::$on[$key] );
	}

	/**
	 * Enabled switchers.
	 * @var array(boolean)
	 */
	private static $on = array( /* on by default */ );

	/**
	 * Dependency mapping.
	 * @var array(string)
	 */
	private static $rely = array( );

}
