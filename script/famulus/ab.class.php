<?php
namespace famulus;

/**
 * Translate a name to its abbreviation or reverse.
 */
abstract class ab {

	const UUID_KEY = '$';
	const DERIVED_NAME_RULE = '#^ab\\\\(?P<class>[\\w\\\\]+)\\\\(?P<subject>\\w+)$#';

	/**
	 * Translate the key to the other half.
	 * @param string $key
	 * @return string
	 * @todo Frequency count.
	 */
	public function __invoke( $key ) {
		$ab = isset( $this->map[$key] ) ? $this->map[$key] : $key;
		\setting\IS_LOG_AB_USE && $this->log[$ab] = $key;
		return $ab;
	}

	/**
	 * Get default subject name from derived class name.
	 * @return string
	 */
	public function subject() {
		if ( !$this->subject ) {
			if ( isset( $this->map[self::UUID_KEY] ) ) {
				$this->subject = $this->map[self::UUID_KEY];
			}
			else {
				$class = get_called_class();
				$split = strrpos( $class, '\\' );
				$split = $split ? $split + 1 : 0;
				$this->subject = substr( $class, $split );
			}
		}
		\setting\IS_LOG_AB_USE && $this->log[self::UUID_KEY] = $this->subject;
		return $this->subject;
	}

	/**
	 * Get an unique instance.
	 * @return ab Derived class.
	 */
	public static function instance() {
		$class = get_called_class();
		if ( !isset( self::$object_pool[$class] ) ) {
			self::$object_pool[$class] = new $class( $class );
		}
		return self::$object_pool[$class];
	}

	/**
	 * Log usage tracking.
	 */
	public static function log() {
		file_put_contents( \setting\LOG_PATH . '/ab.log', json_encode( self::$usage_pool ) . "\n", \FILE_APPEND );
	}

	/**
	 * Load the whole map.
	 */
	public static function load() {
		self::$map_pool = require 'setting/ab.php';
	}

	protected function __construct( $caller ) {
		$ok = preg_match( self::DERIVED_NAME_RULE, $caller, $match );
		assert( $ok );

		extract( $match );
		$this->map = isset( self::$map_pool[$class][$subject] ) ? self::$map_pool[$class][$subject] : array( );
		\setting\IS_LOG_AB_USE && self::$usage_pool[$class] = array( $subject => &$this->log );
	}

	/**
	 * Full name <=> abbreviation mapping.
	 * @var array(string)
	 */
	private $map;

	/**
	 * Record translated keys.
	 * @var array(string)
	 */
	private $log = array( );

	/**
	 * Cache of subject name.
	 * @var string
	 */
	private $subject;

	/**
	 * Whole map.
	 * @var array
	 */
	private static $map_pool;

	/**
	 * Cached ab objects.
	 * @var array(ab)
	 */
	private static $object_pool = array( );

	/**
	 * Tracking usage.
	 * @var array
	 */
	private static $usage_pool = array( );

}

/**
 * Set callback to log usage tracking.
 */
\setting\IS_LOG_AB_USE && register_shutdown_function( array( '\\famulus\\ab', 'log' ) );

// Initialize static data.
ab::load();
