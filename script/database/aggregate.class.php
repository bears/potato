<?php
namespace database;

/**
 * Manipulate object aggregate with database.
 */
abstract class aggregate implements \IteratorAggregate {

	/**
	 * Required by \IteratorAggregate.
	 * @return ArrayIterator
	 */
	public function getIterator() {
		return new ArrayIterator( $this->objects );
	}

	/**
	 * Cache an existing aggregate.
	 * @param string $key
	 * @param aggregate $value
	 */
	public static function cache( $key, aggregate $value ) {
		if ( isset( self::$gather_pool[$key] ) ) {
			throw new \exception\conflict_cache();
		}
		else {
			self::$gather_pool[$key] = $value;
		}
	}

	/**
	 * Fetch an aggregate from cache.
	 * @param string $key
	 * @return aggregate
	 */
	public static function fetch( $key ) {
		return self::$gather_pool[$key];
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
			throw new \exception\database\failed_select( $error[2], $error[1] );
		}
	}

	/**
	 * Get prepared query to select data.
	 * @param string $aggregate
	 * @param string $method
	 * @param array $arguments
	 * @return PDOStatement
	 */
	private static function select_query( $aggregate, $method, array &$arguments ) {
		$sql_mode = '"' . str_replace( '\\', '"."', "$aggregate.$method" ) . '"';
		$function = str_replace( '"aggregate".', '', $sql_mode );
		$amount = count( $arguments );
		$key = "$function@$amount";
		if ( !isset( self::$select_pool[$key] ) ) {
			$holders = $amount ? ('?' . str_repeat( ',?', $amount - 1 )) : '';
			$query = connection::get_pdo()->prepare( "SELECT * FROM $function($holders)" );
			$individual = str_replace( '\aggregate\\', '\individual\\', "\\$aggregate" );
			$query->setFetchMode( \PDO::FETCH_CLASS, $individual );
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
	 * @var array(PDOStatement)
	 */
	private static $select_pool = array( );

}
?>
