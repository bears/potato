<?php
namespace storage\postgres;

/**
 * Connector of Postgres.
 */
class connector {

	/**
	 * Get PDO object.
	 * @return \PDO
	 */
	public static function get_pdo() {
		if ( !is_a( self::$pdo, 'PDO' ) ) {
			$dsn = require 'setting/database.php';
			$opt = array( \PDO::ATTR_PERSISTENT => true );
			self::$pdo = new \PDO( $dsn, null, null, $opt );
		}
		return self::$pdo;
	}

	/**
	 * Get prepared query.
	 * @param string $key
	 * @param callback $sql
	 * @param array $fetch
	 * @return \PDOStatement
	 */
	public static function get_query( $key, $sql, $fetch = null ) {
		if ( !isset( self::$query[$key] ) ) {
			$query = self::get_pdo()->prepare( $sql() );
			if ( null !== $fetch ) {
				call_user_func_array( array( $query, 'setFetchMode' ), $fetch );
			}
			self::$query[$key] = $query;
		}
		return self::$query[$key];
	}

	/**
	 * Unique connection.
	 * @var \PDO
	 */
	private static $pdo;

	/**
	 * Prepared queries.
	 * @var array
	 */
	private static $query = array( );

}
