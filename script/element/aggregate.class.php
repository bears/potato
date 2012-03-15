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
		$class = get_class( $value );
		$index = "$class#$key";
		if ( isset( self::$pool[$index] ) && (self::$pool[$index] !== $value) ) {
			trigger_error( 'override cache' );
		}
		self::$pool[$index] = $value;
	}

	/**
	 * Fetch an aggregate from cache.
	 * @param string $key
	 * @return aggregate
	 */
	public static function fetch( $key ) {
		$class = get_called_class();
		$index = "$class#$key";
		if ( isset( self::$pool[$index] ) ) {
			return self::$pool[$index];
		}
		else {
			trigger_error( 'inexistent cache' );
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
