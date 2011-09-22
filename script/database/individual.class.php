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
		$domain = self::domain();
		$exist = isset( $this->uuid );

		$vars = get_object_vars( $this );
		$properties = array( );
		foreach ( $vars as $field => $value ) {
			$properties[":$field"] = $value;
		}
		unset( $vars['uuid'], $vars['lock'] );
		$names = array_keys( $vars );

		if ( $exist ) {
			$query = self::update_query( $domain, $names );
		}
		else {
			$query = self::insert_query( $domain, $names );
			$properties[':uuid'] = md5( uniqid( $domain ) );
			$properties[':lock'] = 1;
		}

		if ( $query->execute( $properties ) ) {
			if ( $exist ) {
				++$this->lock;
			}
			else {
				foreach ( $query->fetch() as $field => $value ) {
					$this->$field = $value;
				}
				$query->closeCursor();
				self::$object_pool[$this->key()] = $this;
			}
		}
		else {
			$error = $query->errorInfo();
			$exception = '\exception\database\failed_' . ($exist ? 'update' : 'insert');
			throw new $exception( $error[2], $error[1] );
		}
	}

	/**
	 * Delete this object from database.
	 */
	public function delete() {
		unset( self::$object_pool[$this->key()] );

		$query = self::delete_query();
		$arguments = array( ':uuid' => $this->uuid, ':lock' => $this->lock );

		if ( $query->execute( $arguments ) ) {
			$this->uuid = null;
			$this->lock = null;
		}
		else {
			$error = $query->errorInfo();
			throw new \exception\database\failed_delete( $error[2], $error[1] );
		}
	}

	/**
	 * Select individual object from database.
	 * @param string $uuid
	 * @return individual derived class.
	 */
	public static function select( $uuid ) {
		$key = self::_key( $uuid );
		if ( !isset( self::$object_pool[$key] ) ) {
			$query = self::select_query();
			if ( $query->execute( array( ':uuid' => $uuid ) ) ) {
				self::$object_pool[$key] = $query->fetch();
				$query->closeCursor();
			}
			else {
				$error = $query->errorInfo();
				throw new \exception\database\failed_select( $error[2], $error[1] );
			}
		}
		return self::$object_pool[$key];
	}

	/**
	 * Cache the given object.
	 * @param individual $object
	 * @return individual cached object.
	 */
	public static function cache( individual $object ) {
		$key = $object->key();
		if ( isset( self::$object_pool[$key] ) ) {
			$cache = self::$object_pool[$key];
			if ( ($object->lock != $cache->lock ) ) {
				throw new \exception\expired_cache( get_class( $cache )
				. " #{$cache->uuid}"
				. " cached: {$cache->lock}"
				. " coming: {$object->lock}"
				);
			}
			else {
				$append = 0;
				$fields = get_object_vars( $object );
				foreach ( $fields as $field => $value ) {
					if ( !isset( $cache->$field ) ) {
						$cache->$field = $value;
						++$append;
					}
				}
				// TODO: log duplicated loading, $append / count($fields)
			}
		}
		else {
			self::$object_pool[$key] = $cache = $object;
		}
		return $cache;
	}

	/**
	 * Get cache key of this object.
	 * @return string
	 */
	private function key() {
		return self::_key( $this->uuid );
	}

	/**
	 * Get cache key of given object.
	 * @param string $uuid
	 * @return string
	 */
	private static function _key( $uuid ) {
		assert( "'$uuid'" );

		return self::domain() . "#$uuid";
	}

	/**
	 * Get prepared query to insert data.
	 * @param array $names
	 * @return PDOStatement
	 */
	private static function insert_query( $domain, array &$names ) {
		$holder = implode( ',:', $names );
		$key = $domain . crc32( $holder );
		if ( !isset( self::$insert_pool[$key] ) ) {
			$fields = '"uuid","lock","' . implode( '","', $names ) . '"';
			$values = ":uuid,:lock,:$holder";
			$query = connection::get_pdo()->prepare( "INSERT INTO $domain($fields) VALUES($values) RETURNING *" );
			$query->setFetchMode( \PDO::FETCH_ASSOC );
			self::$insert_pool[$key] = $query;
		}
		return self::$insert_pool[$key];
	}

	/**
	 * Get prepared query to update data.
	 * @param array $names
	 * @return PDOStatement
	 */
	private static function update_query( $domain, array &$names ) {
		$key = $domain . crc32( implode( ',', $names ) );
		if ( !isset( self::$update_pool[$key] ) ) {
			$pairs = '"lock"="lock"+1';
			foreach ( $names as $field ) {
				$pairs .= ",\"$field\"=:$field";
			}
			$query = connection::get_pdo()->prepare( "UPDATE $domain SET $pairs WHERE \"uuid\"=:uuid AND \"lock\"=:lock" );
			self::$update_pool[$key] = $query;
		}
		return self::$update_pool[$key];
	}

	/**
	 * Get prepared query to delete data.
	 * @return PDOStatement
	 */
	private static function delete_query() {
		$domain = self::domain();
		if ( !isset( self::$delete_pool[$domain] ) ) {
			$query = connection::get_pdo()->prepare( "DELETE FROM $domain WHERE \"uuid\"=:uuid AND \"lock\"=:lock" );
			self::$delete_pool[$domain] = $query;
		}
		return self::$delete_pool[$domain];
	}

	/**
	 * Get prepared query to select data.
	 * @return PDOStatement
	 */
	private static function select_query() {
		$domain = self::domain();
		if ( !isset( self::$select_pool[$domain] ) ) {
			$query = connection::get_pdo()->prepare( "SELECT * FROM $domain WHERE \"uuid\"=:uuid" );
			$query->setFetchMode( \PDO::FETCH_CLASS, get_called_class() );
			self::$select_pool[$domain] = $query;
		}
		return self::$select_pool[$domain];
	}

	/**
	 * Get domain name of derived class.
	 * @return string
	 */
	private static function domain() {
		$real_name = str_replace( '^individual\\', '', '^' . get_called_class() );
		return str_replace( '\\', '"."', "\"$real_name\"" );
	}

	/**
	 * Identity of this object.
	 * @var string
	 */
	protected $uuid;

	/**
	 * Lucky lock.
	 * @var integer
	 */
	protected $lock;

	/**
	 * Cached objects.
	 * @var array(individual)
	 */
	private static $object_pool = array( );

	/**
	 * Cached prepared query.
	 * @var array(PDOStatement)
	 */
	//@{
	private static $insert_pool = array( );
	private static $update_pool = array( );
	private static $delete_pool = array( );
	private static $select_pool = array( );
	//@}
}
