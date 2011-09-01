<?php
namespace database;

/**
 * Manipulate individual object with database.
 */
abstract class individual {

	public function __construct() {
		if ( isset( $this->uuid ) ) {
			self::sampling( $this );
		}
		else {
			$this->lock = 0;
		}
	}

	/**
	 * Get uuid of this object.
	 * @return uuid
	 */
	public function uuid() {
		return $this->uuid;
	}

	/**
	 * Insert/update this object to database.
	 * @return boolean
	 */
	public function save() {
		$exist = isset( $this->uuid );
		if ( $exist ) {
			$query = self::update_query();
			$result = $query->execute( array( ':uuid' => $this->uuid ) );
		}
		else {
			$query = self::insert_query( $this, $properties );
			$result = $query->execute( $properties );
		}
		if ( $result ) {
			foreach ( $query->fetch() as $name => $value ) {
				$this->$name = $value;
			}
			$query->closeCursor();
		}
		else {
			$error = $query->errorInfo();
			throw new \exception\failed_store( $error[2], $error[0] );
		}
		if ( !$exist ) {
			self::$object_pool[$this->key()] = $this;
		}
		self::sampling( $this );
		return $result;
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
	 * Take trait of an object for conditional updating.
	 * @param individual $object
	 */
	private static function sampling( individual $object ) {
		$properties = get_object_vars( $object );
		$key = self::domain() . '#' . $properties['uuid'];
		unset( $properties['uuid'], $properties['lock'] );
		$samples = array( );
		foreach ( $properties as $name => $value ) {
			$samples[crc32( $name )] = crc32( $value );
		}
		self::$sample_pool[$key] = $samples;
	}

	/**
	 * Get prepared query to insert data.
	 * @param individual $object
	 * @param array $properties [OUT]
	 * @return PDOStatement
	 */
	private static function insert_query( individual $object, &$properties ) {
		$vars = get_object_vars( $object );
		unset( $vars['uuid'] );
		foreach ( $vars as $name => $value ) {
			$properties[':' . $name] = $value;
		}

		$domain = self::domain();
		if ( !isset( self::$insert_pool[$domain] ) ) {
			$fields = '"uuid","' . implode( '","', array_keys( $vars ) ) . '"';
			$holder = 'uuid_generate_v4(),' . implode( ',', array_keys( $properties ) );
			$query = connection::get_pdo()->prepare( "INSERT INTO \"$domain\"($fields) VALUES($holder) RETURNING \"uuid\"" );
			$query->setFetchMode( \PDO::FETCH_ASSOC );
			self::$insert_pool[$domain] = $query;
		}
		return self::$insert_pool[$domain];
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
	private static $sample_pool = array( );
	private static $insert_pool = array( );
	private static $update_pool = array( );
	private static $delete_pool = array( );
	private static $select_pool = array( );
	//@}
}
?>
