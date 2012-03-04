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
		return self::get_assistant( 'decoration', $format );
	}

	/**
	 * Encapsulate $this into a renovation class.
	 * @param string $format
	 * @return \renovation
	 */
	public function renovate( $format ) {
		return self::get_assistant( 'renovation', $format );
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
	 * Get assistant class name.
	 * @param string $label
	 * @param string $format
	 * @return string
	 */
	private function get_assistant( $label, $format ) {
		$title = self::get_title();
		$class = "$label\\$title\\$format" . static::ASSISTANT_SUFFIX;
		return new $class( $this );
	}

	const ASSISTANT_SUFFIX = ''; ///< Required by get_assistant().

}
