<?php
namespace storage;

/**
 * Description of factory
 */
class factory {

	/**
	 * Get title name from a full class name.
	 * @param string $name
	 * @return string
	 */
	public static function get_title( $name ) {
		return substr( $name, strpos( $name, '\\' ) + 1 );
	}

}
