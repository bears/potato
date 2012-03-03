<?php
namespace element;

/**
 * Manipulate object aggregate with database.
 */
abstract class aggregate implements \IteratorAggregate {

	/**
	 * @param array $objects
	 */
	public function __construct( array &$objects ) {
		$this->objects = $objects;
	}

	/**
	 * Required by \IteratorAggregate.
	 * @return \ArrayIterator
	 */
	public function getIterator() {
		return new \ArrayIterator( $this->objects );
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
	 * Cache an existing aggregate.
	 * @param string $key
	 * @param aggregate $value
	 */
	public static function cache( $key, aggregate $value ) {
		assert( 'get_called_class()=="' . get_class( $value ) . '"' );

		$index = self::index( $key );
		if ( isset( self::$pool[$index] ) ) {
			trigger_error( 'cache conflict', E_USER_WARNING );
		}
		self::$pool[$index] = $value;
	}

	/**
	 * Fetch an aggregate from cache.
	 * @param string $key
	 * @return aggregate
	 */
	public static function fetch( $key ) {
		$index = self::index( $key );
		if ( isset( self::$pool[$index] ) ) {
			return self::$pool[$index];
		}
	}

	/**
	 * Call stored function to retrieve objects.
	 * @param string $method
	 * @param array $arguments
	 * @return aggregate
	 */
	public static function __callStatic( $method, array $arguments ) {
		$delegate = '\\storage\\postgres\\aggregate';
		return $delegate::select( get_called_class(), $method, $arguments );
	}

	/**
	 * Get helper class name.
	 * @param string $domain
	 * @param string $format
	 * @return string
	 */
	private static function helper( $domain, $format ) {
		return str_replace( '^aggregate\\', $domain, '^' . get_called_class() ) . "\\$format\\aggregate";
	}

	/**
	 * Generate an index for cache
	 * @param string $key
	 * @return string
	 */
	private static function index( $key ) {
		return get_called_class() . "#$key";
	}

	/**
	 * Collected by derived class.
	 * @var array(individual)
	 */
	protected $objects;

	/**
	 * Cached aggregates.
	 * @var array(aggregate)
	 */
	private static $pool = array( );

}
