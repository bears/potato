<?php
namespace storage\postgres;

/**
 * Storage of aggregate using Postgres.
 */
class aggregate {

	/**
	 * Fetch an aggregate.
	 * @param string $title
	 * @param string $method
	 * @param array $arguments
	 * @return \element\aggregate
	 */
	public static function select( $title, $method, array &$arguments ) {
		$query = self::select_query( $title, $method, $arguments );
		connector::set_indexed_input( $query, $arguments );
		if ( $query->execute() ) {
			$objects = array( );
			foreach ( $query->fetchAll() as $object ) {
				$objects[] = \element\individual::cache( $object );
			}
			return $objects;
		}
		else {
			$error = $query->errorInfo();
			trigger_error( 'selecting failed', E_USER_ERROR );
		}
	}

	/**
	 * Get prepared query to select data.
	 * @param string $title
	 * @param string $method
	 * @param array $arguments
	 * @return \PDOStatement
	 */
	private static function select_query( $title, $method, array &$arguments ) {
		$stub = str_replace( '\\', '"."', "\"$title::$method\"" );
		$size = count( $arguments );
		$key = __METHOD__ . "@$stub@$size";
		return connector::get_query( $key, function() use($title, $stub, $size) {
			$slots = $size ? ('?' . str_repeat( ',?', $size - 1 )) : '';
			return "SELECT * FROM $stub($slots)";
		}, array( \PDO::FETCH_CLASS, "\\individual\\$title" ) );
	}

}
