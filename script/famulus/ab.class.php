<?php
namespace famulus;

/**
 * Translate a name to its abbreviation or reverse.
 */
abstract class ab {

	const KEY_UUID = '$';
	const DERIVED_NAME_RULE = '#^ab\\\\(?P<class>[\\w\\\\]+)\\\\(?P<subject>\\w+)$#';

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
		if ( isset( $this->map[self::KEY_UUID] ) ) {
			return $this->map[self::KEY_UUID];
		}
		else {
			$class = get_called_class();
			$split = strrpos( $class, '\\' );
			$split = $split ? $split + 1 : 0;
			return substr( $class, $split );
		}
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
		$ok = preg_match( self::DERIVED_NAME_RULE, get_called_class(), $match );
		assert( $ok );

		require_once 'setting/ab.php';

		extract( $match );
		$this->map = isset( $ab[$class][$subject] ) ? $ab[$class][$subject] : array( );
	}

	public function __destruct() {
		// TODO: log mismatched entries.
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
