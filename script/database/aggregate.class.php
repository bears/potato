<?php
namespace database;

/**
 * Manipulate object aggregate with database.
 */
abstract class aggregate implements \IteratorAggregate {

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
		if ( isset( self::$gather_pool[$index] ) ) {
			throw new \exception\conflict_cache( $index );
		}
		else {
			self::$gather_pool[$index] = $value;
		}
	}

	/**
	 * Fetch an aggregate from cache.
	 * @param string $key
	 * @return aggregate
	 */
	public static function fetch( $key ) {
		$index = self::index( $key );
		if ( isset( self::$gather_pool[$index] ) ) {
			return self::$gather_pool[$index];
		}
	}

	/**
	 * Call stored function to retrieve objects.
	 * @param string $method
	 * @param array $arguments
	 * @return aggregate
	 */
	public static function __callStatic( $method, array $arguments ) {
		$aggregate = get_called_class();
		$query = self::select_query( $aggregate, $method, $arguments );
		if ( $query->execute( $arguments ) ) {
			$holder = new $aggregate();
			foreach ( $query->fetchAll() as $object ) {
				$holder->objects[] = individual::cache( $object );
			}
			return $holder;
		}
		else {
			$error = $query->errorInfo();
			throw new \exception\database\failed_selecting( $error[2], $error[1] );
		}
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
	 * Get prepared query to select data.
	 * @param string $aggregate
	 * @param string $method
	 * @param array $arguments
	 * @return \PDOStatement
	 */
	private static function select_query( $aggregate, $method, array &$arguments ) {
		$real_name = str_replace( '^aggregate\\', '', '^' . $aggregate );
		$function = str_replace( '\\', '"."', "\"$real_name::$method\"" );
		$amount = count( $arguments );
		$key = "$function@$amount";
		if ( !isset( self::$select_pool[$key] ) ) {
			$holders = $amount ? ('?' . str_repeat( ',?', $amount - 1 )) : '';
			$query = connection::get_pdo()->prepare( "SELECT * FROM $function($holders)" );
			$query->setFetchMode( \PDO::FETCH_CLASS, "\\individual\\$real_name" );
			self::$select_pool[$key] = $query;
		}
		return self::$select_pool[$key];
	}

	/**
	 * Collected by derived class.
	 * @var array(individual)
	 */
	protected $objects = array( );

	/**
	 * Cached aggregates.
	 * @var array(aggregate)
	 */
	private static $gather_pool = array( );

	/**
	 * Cached prepared query.
	 * @var array(\PDOStatement)
	 */
	private static $select_pool = array( );

}
