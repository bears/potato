<?php
namespace storage\postgres;

/**
 * Storage of individual using Postgres.
 */
class individual {

	/**
	 * Insert individual object to database.
	 * @param string $title
	 * @param array $properties
	 */
	public static function insert( $title, array &$properties ) {
		self::discrete( $properties, $names, $values );
		$query = self::insert_query( $title, $names );
		$values[':uuid'] = md5( uniqid( $title ) );
		$values[':lock'] = 1;
		self::save( 'inserting', $query, $values );
		$reload = $query->fetch();
		$query->closeCursor();
		return $reload;
	}

	/**
	 * Update individual object to database.
	 * @param string $title
	 * @param array $properties
	 */
	public static function update( $title, array &$properties ) {
		self::discrete( $properties, $names, $values );
		$query = self::update_query( $title, $names );
		self::save( 'updating', $query, $values );
	}

	/**
	 * Delete individual object from database.
	 * @param string $title
	 * @param string $uuid
	 * @param integer $lock
	 */
	public static function delete( $title, $uuid, $lock ) {
		$query = self::delete_query( $title );
		$arguments = array( ':uuid' => $uuid, ':lock' => $lock );
		if ( !($query->execute( $arguments ) && $query->rowCount()) ) {
			$error = $query->errorInfo();
			trigger_error( 'deleting failed', E_USER_ERROR );
		}
	}

	/**
	 * Select individual object from database.
	 * @param string $title
	 * @param string $uuid
	 * @return \element\aggregate derived class.
	 */
	public static function select( $title, $uuid ) {
		$query = self::select_query( $title );
		if ( $query->execute( array( ':uuid' => $uuid ) ) ) {
			$data = $query->fetch();
			$query->closeCursor();
			return $data;
		}
		else {
			$error = $query->errorInfo();
			trigger_error( 'selecting failed', E_USER_ERROR );
		}
	}

	/**
	 * Get prepared query to insert data.
	 * @param string $title
	 * @param array $names
	 * @return \PDOStatement
	 */
	public static function insert_query( $title, array &$names ) {
		$holder = implode( ',:', $names );
		$key = __METHOD__ . "@$title@:$holder";
		return connector::get_query( $key, function() use($title, $names, $holder) {
			$fields = '"uuid","lock","' . implode( '","', $names ) . '"';
			$values = ":uuid,:lock,:$holder";
			return "INSERT INTO $title($fields) VALUES($values) RETURNING *";
		}, array( \PDO::FETCH_ASSOC ) );
	}

	/**
	 * Get prepared query to update data.
	 * @param string $title
	 * @param array $names
	 * @return \PDOStatement
	 */
	public static function update_query( $title, array &$names ) {
		$key = __METHOD__ . "@$title@:" . implode( ',:', $names );
		return connector::get_query( $key, function() use($title, $names) {
			$pairs = '"lock"="lock"+1';
			foreach ( $names as $field ) {
				$pairs .= ",\"$field\"=:$field";
			}
			return "UPDATE $title SET $pairs WHERE \"uuid\"=:uuid AND \"lock\"=:lock";
		} );
	}

	/**
	 * Get prepared query to delete data.
	 * @param string $title
	 * @return \PDOStatement
	 */
	public static function delete_query( $title ) {
		$key = __METHOD__ . "@$title@";
		return connector::get_query( $key, function() use($title) {
			return "DELETE FROM $title WHERE \"uuid\"=:uuid AND \"lock\"=:lock";
		} );
	}

	/**
	 * Get prepared query to select data.
	 * @param string $title
	 * @return \PDOStatement
	 */
	public static function select_query( $title ) {
		$key = __METHOD__ . "@$title@";
		return connector::get_query( $key, function() use($title) {
			return "SELECT * FROM $title WHERE \"uuid\"=:uuid";
		}, array( \PDO::FETCH_CLASS, "\\individual\\$title" ) );
	}

	/**
	 * Insert/update this object to database.
	 * @param string $action
	 * @param \PDOStatement $query
	 * @param array $values
	 */
	private static function save( $action, $query, array &$values ) {
		connector::set_input($query, $values);
		if ( !($query->execute() && $query->rowCount()) ) {
			$error = $query->errorInfo();
			trigger_error( "$action failed", E_USER_ERROR );
		}
	}

	/**
	 * Discrete property pairs to names and values
	 * @param array $properties
	 * @param array $names [OUT]
	 * @param array $values [OUT]
	 */
	private static function discrete( array &$properties, &$names, &$values ) {
		$values = array( );
		foreach ( $properties as $field => $value ) {
			$values[":$field"] = $value;
		}
		unset( $properties['uuid'], $properties['lock'] );
		$names = array_keys( $properties );
	}

}
