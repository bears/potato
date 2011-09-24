<?php
namespace database;

require_once 'setting/database.php';

/**
 * An interface to connect to database.
 */
class connection {

	/**
	 * Get PDO object
	 * @return PDO
	 */
	public static function get_pdo() {
		if ( !is_a( self::$pdo, 'PDO' ) ) {
			self::$pdo = new \PDO( \config\MAJOR_DATABASE_DSN, null, null, array( \PDO::ATTR_PERSISTENT => true ) );
		}
		return self::$pdo;
	}

	/**
	 * Unique connection.
	 * @var \PDO
	 */
	private static $pdo;

}
