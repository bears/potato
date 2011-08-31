<?php
namespace database;

/**
 * Manipulate individual object with database.
 */
abstract class individual {

	public function __construct() {
		self::sampling( get_object_vars( $this ) );
	}

	/**
	 * Get uuid of this object.
	 * @return uuid
	 */
	public function uuid() {
		return $this->uuid;
	}

	/**
	 * Update this object to datebase.
	 */
	public function update() {
		$type = str_replace( '\\', '.', self::domain() );
		$query = self::update_query( $type );
		$query->execute( array( ':uuid' => $this->uuid ) );
	}

	/**
	 * Delete this object from database.
	 */
	public function delete() {
		$type = str_replace( '\\', '.', self::domain() );
		$query = self::delete_query( $type );
		$query->execute( array( ':uuid' => $this->uuid ) );
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
			$query->execute( array( ':uuid' => $uuid ) );
			self::$object_pool[$key] = $query->fetch();
			$query->closeCursor();
		}
		return self::$object_pool[$key];
	}

	/**
	 * Get prepared query to select data.
	 * @param string $type
	 * @return PDOStatement
	 */
	private static function select_query( $type ) {
		if ( !isset( self::$select_pool[$type] ) ) {
			$query = connection::get_pdo()->prepare( "SELECT * FROM $type WHERE uuid=:uuid" );
			$query->setFetchMode( \PDO::FETCH_CLASS, $type );
			self::$select_pool[$type] = $query;
		}
		return self::$select_pool[$type];
	}

	/**
	 * Get prepared query to delete data.
	 * @param string $type
	 * @return PDOStatement
	 */
	private static function delete_query( $type ) {
		if ( !isset( self::$delete_pool[$type] ) ) {
			$query = connection::get_pdo()->prepare( "DELETE FROM $type WHERE uuid=:uuid" );
			self::$delete_pool[$type] = $query;
		}
		return self::$delete_pool[$type];
	}

	/**
	 * Take trait of an object for conditional updating.
	 * @param string $key
	 */
	private static function sampling( $properties ) {
		$key = self::domain() . '#' . $properties['uuid'];
		unset( $properties['uuid'], $properties['lock'] );
		$samples = array( );
		foreach ( $properties as $name => $value ) {
			$samples[crc32( $name )] = crc32( $value );
		}
		self::$sample_pool[$key] = $samples;
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
	private static $select_pool = array( );
	private static $update_pool = array( );
	private static $delete_pool = array( );
	//@}
}
?>
