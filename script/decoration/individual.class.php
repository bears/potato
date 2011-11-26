<?php
namespace decoration;

/**
 * The base class for decorating \database\individual object.
 */
abstract class individual {

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
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function & content( array &$vessel = array( ) ) {
		$vessel[\famulus\ab::UUID_KEY] = $this->data->uuid();
		self::trivial( $vessel );
		return $vessel;
	}

	/**
	 * Default/common way to append data in the final result.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	protected function & trivial( array &$vessel = array( ) ) {
		if ( !empty( static::$fields ) ) {
			$data = array( );
			$ab = self::ab();
			foreach ( static::$fields as $field ) {
				$value = $this->data->$field;
				( null !== $value ) && ($data[$ab( $field )] = $value);
			}
			$vessel[$ab->subject()] = $data;
		}
		return $vessel;
	}

	/**
	 * Get abbreviation for derived class.
	 * @return \famulus\ab
	 */
	protected static function ab() {
		$class = str_replace( '^decoration\\', 'ab\\', '^' . get_called_class() );
		return $class::instance();
	}

	/**
	 * The object holds the base information.
	 * @var \database\individual
	 */
	protected $data;

	/**
	 * Required by trivial().
	 * @var array(string)
	 */
	protected static $fields = array( );

}
