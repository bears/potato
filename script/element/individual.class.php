<?php
namespace element;

/**
 * Manipulate individual object with database.
 */
abstract class individual {

	public function __clone() {
		$this->uuid = null;
		$this->lock = null;
	}

	/**
	 * Get uuid value of this object.
	 * @return string
	 */
	public function uuid() {
		return $this->uuid;
	}

	/**
	 * Get lock value of this object.
	 * @return integer
	 */
	public function lock() {
		return $this->lock;
	}

	/**
	 * Encapsulate $this into a decoration class.
	 * @param string $format
	 * @return \decoration
	 */
	public function decorate( $format ) {
		$decorator = self::helper( '\\decoration\\', $format );
		return new $decorator( $this );
	}

	/**
	 * Encapsulate $this into a renovation class.
	 * @param string $format
	 * @param \stdClass $update
	 * @return \renovation
	 */
	public function renovate( $format, \stdClass $update ) {
		$renovator = self::helper( '\\renovation\\', $format );
		return new $renovator( $this, $update );
	}

	/**
	 * Insert/update this object to database.
	 */
	public function save() {
		$delegate = '\\storage\\postgres\\individual';
		$properties = get_object_vars( $this );
		if ( isset( $this->uuid ) ) {
			$delegate::update( get_called_class(), $properties );
			++$this->lock;
		}
		else {
			$reload = $delegate::insert( get_called_class(), $properties );
			foreach ( $reload as $field => $value ) {
				$this->$field = $value;
			}
			self::$pool[$this->key()] = $this;
		}
	}

	/**
	 * Delete this object from database.
	 */
	public function delete() {
		$delegate = '\\storage\\postgres\\individual';
		$delegate::delete( get_called_class(), $this->uuid, $this->lock );
		unset( self::$pool[$this->key()] );
		$this->uuid = null;
		$this->lock = null;
	}

	/**
	 * Select individual object from database.
	 * @param string $uuid
	 * @return individual derived class.
	 */
	public static function select( $uuid ) {
		$key = self::_key( $uuid );
		if ( !isset( self::$pool[$key] ) ) {
			$delegate = '\\storage\\postgres\\individual';
			self::$pool[$key] = $delegate::select( get_called_class(), $uuid );
		}
		return self::$pool[$key];
	}

	/**
	 * Cache the given object.
	 * @param individual $object
	 * @return individual cached object.
	 */
	public static function cache( individual $object ) {
		$key = $object->key();
		if ( isset( self::$pool[$key] ) ) {
			$cache = self::$pool[$key];
			if ( ($object->lock != $cache->lock ) ) {
				trigger_error( 'cache expired', E_USER_ERROR );
			}
			else {
				$append = 0;
				$fields = get_object_vars( $object );
				foreach ( $fields as $field => $value ) {
					if ( !isset( $cache->$field ) ) {
						$cache->$field = $value;
						++$append;
					}
				}
				// TODO: log duplicated loading, $append / count($fields)
			}
		}
		else {
			self::$pool[$key] = $cache = $object;
		}
		return $cache;
	}

	/**
	 * Get cache key of this object.
	 * @return string
	 */
	private function key() {
		return self::_key( $this->uuid );
	}

	/**
	 * Get cache key of given object.
	 * @param string $uuid
	 * @return string
	 */
	private static function _key( $uuid ) {
		assert( "'$uuid'" );

		return get_called_class() . "#$uuid";
	}

	/**
	 * Get helper class name.
	 * @param string $domain
	 * @param string $format
	 * @return string
	 */
	private static function helper( $domain, $format ) {
		return str_replace( '^individual\\', $domain, '^' . get_called_class() ) . "\\$format";
	}

	/**
	 * Identity of this object.
	 * @var string
	 */
	protected $uuid;

	/**
	 * Lucky lock.
	 * @var integer
	 */
	protected $lock;

	/**
	 * Cached objects.
	 * @var array
	 */
	private static $pool = array( );

}
