<?php
namespace famulus;

require_once 'setting/ab.php';

/**
 * Translate a name to its abbreviation or reverse.
 */
abstract class ab {

	const KEY_UUID = '$';

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
	 * Get default subject name from derived class name.
	 * @return string
	 */
	public function subject() {
		$class = get_called_class();
		$split = strrpos( $class, '\\' );
		$split = $split ? $split + 1 : 0;
		return substr( $class, $split );
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
		global $ab;
		$re = '#^ab\\\\(P<class>[\\w\\\\]+)\\\\(P<subject>\\w+)$#';
		return preg_match( $re, get_called_class(), $m ) ? $ab[$m['class']][$m['subject']] : array( );
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
