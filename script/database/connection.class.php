<?php
namespace database;

/**
 * Connect to database to do basic operations.
 */
require_once 'config/database.php';

class connection {

	/**
	 * Get PDO object
	 * @return PDO
	 */
	public static function get_pdo() {
		if ( !is_a( self::$pdo, 'PDO' ) ) {
			self::$pdo = new \PDO( \config\RUNTIME_DATABASE_DSN, null, null, array( \PDO::ATTR_PERSISTENT => true ) );
		}
		return self::$pdo;
	}

	private static $pdo;

}
