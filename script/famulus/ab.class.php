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
		$class = get_called_class();
		$key = "$class@$path";
		if ( !isset( self::$object_pool[$key] ) ) {
			self::$object_pool[$key] = new $class( $path );
		}
		return self::$object_pool[$key];
	}

	/**
	 * Load the whole map.
	 */
	public static function load() {
		self::$map_pool = require 'setting/ab.php';
	}

	protected function __construct( $path ) {
		$pos = strrpos( $path, '\\' );
		$class = substr( $path, 0, $pos );
		$subject = substr( $path, $pos + 1 );
		$this->map = isset( self::$map_pool[$class][$subject] ) ? self::$map_pool[$class][$subject] : array( );
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
	private static $object_pool = array( );

}

// Initialize static data.
ab::load();
