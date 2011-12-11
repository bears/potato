<?php
namespace database;

/**
 * Manipulate individual object with database.
 */
abstract class individual {

	public function __clone() {
		$this->uuid = null;
		$this->lock = null;
	}

	/**
	 * Get uuid value of this object.
	 * @return uuid
	 */
	public function uuid() {
		return $this->uuid;
	}

	/**
	 * Get lock value of this object.
	 * @return integer
	 */
	public function lock() {
		return $this->lock;
	}

	/**
	 * Encapsulate $this into a decoration class.
	 * @param string $format
	 * @return \decoration
	 */
	public function decorate( $format ) {
		$decorater = str_replace( '^individual\\', '\\decoration\\', '^' . get_called_class() ) . "\\$format";
		return new $decorater( $this );
	}

	/**
	 * Encapsulate $this into a renovation class.
	 * @param \ArrayIterator $update
	 * @return \renovation
	 */
	public function renovate( \ArrayIterator $update ) {
		$renovater = str_replace( '^individual\\', '\\renovation\\', '^' . get_called_class() );
		return new $renovater( $this, $update );
	}

	/**
	 * Insert/update this object to database.
	 */
	public function save() {
		$domain = self::domain();
		$exist = isset( $this->uuid );
		self::discrete( get_object_vars( $this ), $names, $values );

		if ( $exist ) {
			$action = 'updating';
			$query = self::update_query( $domain, $names );
		}
		else {
			$action = 'inserting';
			$query = self::insert_query( $domain, $names );
			$values[':uuid'] = md5( uniqid( $domain ) );
			$values[':lock'] = 1;
		}

		self::assign( $query, $values );
		if ( $query->execute() ) {
			if ( 0 == $query->rowCount() ) {
				trigger_error( "$action expired", E_USER_ERROR );
			}
			$exist ? ++$this->lock : self::complement( $query );
		}
		else {
			$error = $query->errorInfo();
			trigger_error( "$action failed", E_USER_ERROR );
		}
	}

	/**
	 * Delete this object from database.
	 */
	public function delete() {
		$key = $this->key();
		$query = self::delete_query();
		$arguments = array( ':uuid' => $this->uuid, ':lock' => $this->lock );

		if ( $query->execute( $arguments ) ) {
			if ( 0 == $query->rowCount() ) {
				trigger_error( 'deleting expired', E_USER_ERROR );
			}
			unset( self::$object_pool[$key] );
			$this->uuid = null;
			$this->lock = null;
		}
		else {
			$error = $query->errorInfo();
			trigger_error( 'deleting failed', E_USER_ERROR );
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
				trigger_error( 'selecting failed', E_USER_ERROR );
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
				trigger_error( 'cache expired', E_USER_ERROR );
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
	 * Complement fields and cache of a new added object.
	 * @param \PDOStatement $query
	 */
	private function complement( \PDOStatement $query ) {
		foreach ( $query->fetch() as $field => $value ) {
			$this->$field = $value;
		}
		$query->closeCursor();
		self::$object_pool[$this->key()] = $this;
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
	 * Discrete property pairs to names and values
	 * @param array $properties
	 * @param array $names [OUT]
	 * @param array $values [OUT]
	 */
	private static function discrete( array $properties, &$names, &$values ) {
		$values = array( );
		foreach ( $properties as $field => $value ) {
			$values[":$field"] = $value;
		}
		unset( $properties['uuid'], $properties['lock'] );
		$names = array_keys( $properties );
	}

	/**
	 * Bind parameters to prepared query.
	 * @param \PDOStatement $query
	 * @param array $values
	 */
	private static function assign( \PDOStatement $query, array $values ) {
		foreach ( $values as $bind => $value ) {
			if ( is_int( $value ) )
				$type = \PDO::PARAM_INT;
			elseif ( is_bool( $value ) )
				$type = \PDO::PARAM_BOOL;
			elseif ( is_null( $value ) )
				$type = \PDO::PARAM_NULL;
			else
				$type = \PDO::PARAM_STR;
			$query->bindValue( $bind, $value, $type );
		}
	}

	/**
	 * Get prepared query to insert data.
	 * @param array $names
	 * @return \PDOStatement
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
	 * @return \PDOStatement
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
	 * @return \PDOStatement
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
	 * @return \PDOStatement
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
	 * @var array(\PDOStatement)
	 */
	//@{
	private static $insert_pool = array( );
	private static $update_pool = array( );
	private static $delete_pool = array( );
	private static $select_pool = array( );
	//@}

}
