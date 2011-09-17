<?php
namespace decoration;

/**
 * The base class for decorating \database\individual object.
 */
abstract class individual {
	const UUID_KEY = '$';

	public function __construct( \database\individual $object ) {
		$this->data = $object;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		return json_encode( $this->content() );
	}

	/**
	 * Derived class MUST override this method.
	 * @param array $vessel
	 * @return array
	 */
	public function content( array &$vessel = array( ) ) {
		$vessel[self::UUID_KEY] = $this->data->uuid();
		return $vessel;
	}

	/**
	 * Get default subject name from derived class name.
	 * @return string
	 */
	public static function subject() {
		$class = get_called_class();
		$split = strrpos( $class, '\\' );
		$split = $split ? $split + 1 : 0;
		return substr( $class, $split );
	}

	/**
	 * The object holds the base information.
	 * @var \database\individual
	 */
	protected $data;

}
