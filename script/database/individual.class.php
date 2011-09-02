<?php
namespace database;

/**
 * Manipulate individual object with database.
 */
abstract class individual {

	/**
	 * Get uuid of this object.
	 * @return uuid
	 */
	public function uuid() {
		return $this->uuid;
	}

	/**
	 * Insert/update this object to database.
	 */
	public function save() {
		$exist = isset( $this->uuid );

		$vars = get_object_vars( $this );
		$properties = array( );
		foreach ( $vars as $name => $value ) {
			$properties[':' . $name] = $value;
		}
		unset( $vars['uuid'], $vars['lock'] );

		if ( $exist ) {
			$query = self::update_query( $vars );
		}
		else {
			$query = self::insert_query( $vars );
			unset( $properties[':uuid'], $properties[':lock'] );
		}
		$result = $query->execute( $properties );

		if ( !$result ) {
			$error = $query->errorInfo();
			throw new \exception\failed_store( $error[2], $error[0] );
		}
		else if ( !$exist ) {
			foreach ( $query->fetch() as $name => $default ) {
				$this->$name = $default;
			}
			$query->closeCursor();
			self::$object_pool[$this->key()] = $this;
		}
		else {
			++$this->lock;
		}
	}

	/**
	 * Delete this object from database.
	 * @return boolean
	 */
	public function delete() {
		$query = self::delete_query();
		$result = $query->execute( array( ':uuid' => $this->uuid ) );
		$key = $this->key();
		unset( self::$object_pool[$key], self::$sample_pool[$key] );
		return $result;
	}

	/**
	 * Select individual object from database.
	 * @param string $uuid
	 * @return individual derived class.
	 */
	public static function select( $uuid ) {
		$domain = self::domain();
		$key = "$domain#$uuid";
		if ( !isset( self::$object_pool[$key] ) ) {
			$query = self::select_query( $domain );
			if ( $query->execute( array( ':uuid' => $uuid ) ) ) {
				self::$object_pool[$key] = $query->fetch();
				$query->closeCursor();
			}
			else {
				throw new \exception\unkown_object();
			}
		}
		return self::$object_pool[$key];
	}

	/**
	 * Get cache key of this object.
	 * @return string
	 */
	private function key() {
		return self::domain() . '#' . $this->uuid;
	}

	/**
	 * Get prepared query to insert data.
	 * @param array $vars
	 * @return PDOStatement
	 */
	private static function insert_query( array &$vars ) {
		$domain = self::domain();
		if ( !isset( self::$insert_pool[$domain] ) ) {
			$keys = array_keys( $vars );
			$fields = '"uuid","lock","' . implode( '","', $keys ) . '"';
			$holders = 'uuid_generate_v4(),1,:' . implode( ',:', $keys );
			$query = connection::get_pdo()->prepare( "INSERT INTO \"$domain\"($fields) VALUES($holders) RETURNING \"uuid\",\"lock\"" );
			$query->setFetchMode( \PDO::FETCH_ASSOC );
			self::$insert_pool[$domain] = $query;
		}
		return self::$insert_pool[$domain];
	}

	/**
	 * Get prepared query to update data.
	 * @param array $vars
	 * @return PDOStatement
	 */
	private static function update_query( array &$vars ) {
		$domain = self::domain();
		if ( !isset( self::$update_pool[$domain] ) ) {
			$pairs = '"lock"="lock"+1';
			foreach ( array_keys( $vars ) as $field ) {
				$pairs .= ",\"$field\"=:$field";
			}
			$query = connection::get_pdo()->prepare( "UPDATE \"$domain\" SET $pairs WHERE \"uuid\"=:uuid AND \"lock\"=:lock" );
			self::$update_pool[$domain] = $query;
		}
		return self::$update_pool[$domain];
	}

	/**
	 * Get prepared query to delete data.
	 * @return PDOStatement
	 */
	private static function delete_query() {
		$domain = self::domain();
		if ( !isset( self::$delete_pool[$domain] ) ) {
			$query = connection::get_pdo()->prepare( "DELETE FROM \"$domain\" WHERE \"uuid\"=:uuid" );
			self::$delete_pool[$domain] = $query;
		}
		return self::$delete_pool[$domain];
	}

	/**
	 * Get prepared query to select data.
	 * @param string $domain
	 * @return PDOStatement
	 */
	private static function select_query( $domain ) {
		if ( !isset( self::$select_pool[$domain] ) ) {
			$query = connection::get_pdo()->prepare( "SELECT * FROM \"$domain\" WHERE \"uuid\"=:uuid" );
			$query->setFetchMode( \PDO::FETCH_CLASS, $domain );
			self::$select_pool[$domain] = $query;
		}
		return self::$select_pool[$domain];
	}

	/**
	 * Get domain name of derived class.
	 * @return string
	 */
	private static function domain() {
		return str_replace( '\\', '.', get_called_class() );
	}

	/// Must have properties
	//@{
	protected $uuid;
	protected $lock;
	//@}
	/// Cache pool
	//@{
	private static $object_pool = array( );
	private static $insert_pool = array( );
	private static $update_pool = array( );
	private static $delete_pool = array( );
	private static $select_pool = array( );
	//@}
}
?>
