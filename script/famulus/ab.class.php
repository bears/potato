<?php
namespace famulus;

/**
 * Translate a name to its abbreviation or reverse.
 */
abstract class ab {

	/**
	 * Translate the key to the other half.
	 * @param string $key
	 * @return string
	 * @todo Frequency count.
	 */
	public function __invoke( $key ) {
		return isset( $this->map[$key] ) ? $this->map[$key] : $key;
	}

	/**
	 * Get an unique instance.
	 * @return ab Derived class.
	 */
	public static function instance() {
		$class = get_called_class();
		if ( !isset( self::$object_pool[$class] ) ) {
			self::$object_pool[$class] = new $class();
		}
		return self::$object_pool[$class];
	}

	protected function __construct() {
		$map = self::map();
	}

	/**
	 * Load translation mapping.
	 * @return array
	 * @todo Load from config.
	 */
	protected static function map() {
		return array( );
	}

	/**
	 * Full name <=> abbreviation mapping.
	 * @var array(string)
	 */
	private $map;

	/**
	 * Cached ab objects.
	 * @var array(ab)
	 */
	private static $object_pool = array( );

}
