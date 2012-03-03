<?php
namespace element;

/**
 * Common operations of objects.
 */
abstract class element {

	/**
	 * Encapsulate $this into a decoration class.
	 * @param string $format
	 * @return \decoration
	 */
	public function decorate( $format ) {
		$decorator = self::get_helper( 'decoration', $format );
		return new $decorator( $this );
	}

	/**
	 * Encapsulate $this into a renovation class.
	 * @param string $format
	 * @param \stdClass $update
	 * @return \renovation
	 */
	public function renovate( $format, \stdClass $update ) {
		$renovator = self::get_helper( 'renovation', $format );
		return new $renovator( $this, $update );
	}

	/**
	 * Get title name from full class name.
	 * (remove the 1st section)
	 * @return string
	 */
	public static function get_title() {
		$class = get_called_class();
		return substr( $class, strpos( $class, '\\' ) + 1 );
	}

	/**
	 * Get helper class name.
	 * @param string $label
	 * @param string $format
	 * @return string
	 */
	private static function get_helper( $label, $format ) {
		$title = self::get_title();
		return "$label\\$title\\$format" . static::HELPER_SUFFIX;
	}

	const HELPER_SUFFIX = ''; ///< Required by get_helper().

}
