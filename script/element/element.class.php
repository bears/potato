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
	 * Get helper class name.
	 * @param string $label
	 * @param string $format
	 * @return string
	 */
	private static function get_helper( $label, $format ) {
		$class = get_called_class();
		$title = substr( $class, strpos( $class, '\\' ) + 1 );
		return "$label\\$title\\$format" . static::HELPER_SUFFIX;
	}

	const HELPER_SUFFIX = ''; ///< Required by get_helper().

}
