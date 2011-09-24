<?php
namespace famulus;

/**
 * Manage on/off flags dynamically.
 */
class switcher {

	/**
	 * For test default.
	 * @default ON
	 */
	const DEFAULT_ON = 'DEFAULT_ON';

	/**
	 * For test dependency.
	 * @default OFF
	 */
	const SUPPOSE_ON = 'SUPPOSE_ON';

	/**
	 * Check if $switcher is enabled.
	 * @param string $switcher
	 * @return boolean
	 */
	public static function is_on( $switcher ) {
		return isset( self::$on[$switcher] ) && (!isset( self::$rely[$switcher] ) || self::is_on( self::$rely[$switcher] ));
	}

	/**
	 * Check if $switcher is disabled.
	 * @param string $switcher
	 * @return boolean
	 */
	public static function is_off( $switcher ) {
		return!self::is_on( $switcher );
	}

	/**
	 * Enable $switcher.
	 * @param string $switcher
	 */
	public static function on( $switcher ) {
		self::$on[$switcher] = true;
	}

	/**
	 * Disable $switcher.
	 * @param string $switcher
	 */
	public static function off( $switcher ) {
		unset( self::$on[$switcher] );
	}

	/**
	 * Enabled switchers.
	 * @var array(boolean)
	 */
	private static $on = array(
		self::DEFAULT_ON => true,
	);

	/**
	 * Dependency mapping.
	 * @var array(string)
	 */
	private static $rely = array(
		self::SUPPOSE_ON => self::DEFAULT_ON,
	);

}
