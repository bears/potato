<?php
namespace famulus;

/**
 * Translate an intactness form to its abbreviation.
 */
class ab {

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
			\setting\IS_LOG_AB_MISMATCH && trigger_error( 'inexistent key' );
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
	 * @param string $path
	 * @return singleton
	 */
	public static function instance( $path ) {
		if ( !isset( static::$object_pool[$path] ) ) {
			$class = get_called_class();
			static::$object_pool[$path] = new $class( $path );
		}
		return static::$object_pool[$path];
	}

	/**
	 * Load the whole map.
	 */
	public static function load( $map ) {
		static::$map_pool = require "setting/$map.php";
	}

	protected function __construct( $path ) {
		$pos = strrpos( $path, '\\' );
		$class = substr( $path, 0, $pos );
		$subject = substr( $path, $pos + 1 );
		$this->map = isset( static::$map_pool[$class][$subject] ) ? static::$map_pool[$class][$subject] : array( );
		$this->subject = isset( $this->map[self::UUID_KEY] ) ? $this->map[self::UUID_KEY] : $subject;
	}

	/**
	 * Full name <=> abbreviation mapping.
	 * @var array(string)
	 */
	protected $map;

	/**
	 * Cache of subject name.
	 * @var string
	 */
	protected $subject;

	/**
	 * Whole map.
	 * @var array
	 */
	protected static $map_pool;

	/**
	 * Cached ab objects.
	 * @var array(ab)
	 */
	protected static $object_pool = array( );

}

// Initialize static data.
ab::load( 'ab' );
