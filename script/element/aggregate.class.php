<?php
namespace element;

/**
 * Manipulate object aggregate.
 */
abstract class aggregate extends element implements \IteratorAggregate {

	/**
	 * Required by \IteratorAggregate.
	 * @return \ArrayIterator
	 */
	public function getIterator() {
		return new \ArrayIterator( $this->objects );
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
		$instance = new static();
		$instance->objects = $delegate::select( parent::get_title(), $method, $arguments );
		return $instance;
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

	const ASSISTANT_SUFFIX = '\\aggregate'; ///< Required by get_assistant().

}
