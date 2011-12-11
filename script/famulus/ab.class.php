<?php
namespace famulus;

/**
 * Translate an intactness form to its abbreviation.
 */
abstract class ab {

	const UUID_KEY = '$';

	/**
	 * Translate the key to the other half.
	 * @param string $key
	 * @return string
	 */
	public function __invoke( $key ) {
		if ( isset( $this->map[$key] ) ) {
			return $this->map[$key];
		}
		else {
			\setting\IS_LOG_AB_MISMATCH && trigger_error( "*$key* is inexistent" );
			return $key;
		}
	}

	/**
	 * Get default subject name from derived class name.
	 * @return string
	 */
	public function subject() {
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
	 * Load the whole map.
	 */
	public static function load() {
		self::$map_pool = require 'setting/ab.php';
	}

	protected function __construct( $caller ) {
		preg_match( '#^ab\\\\(?P<class>[\\w\\\\]+)\\\\(?P<subject>\\w+)$#', $caller, $match );
		extract( $match );
		$this->map = isset( self::$map_pool[$class][$subject] ) ? self::$map_pool[$class][$subject] : array( );
		$this->subject = isset( $this->map[self::UUID_KEY] ) ? $this->map[self::UUID_KEY] : $subject;
	}

	/**
	 * Full name <=> abbreviation mapping.
	 * @var array(string)
	 */
	private $map;

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

}

// Initialize static data.
ab::load();
