<?php
namespace renovation;

/**
 * The base class for renovating \element\individual object.
 */
abstract class individual {

	public function __construct( \element\individual $object, \stdClass $update ) {
		$this->object = $object;
		$this->update = $update;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		return json_encode( $this->process() );
	}

	/**
	 * Override this method to customize.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function process( array &$vessel = array( ) ) {
		return $this->trivial()->content( $vessel );
	}

	/**
	 * Default/common way to walk through the update.
	 * @return \decoration\individual
	 */
	protected function trivial() {
		$count = 0;
		$ba = self::ba();
		foreach ( $this->update as $key => $value ) {
			$name = $ba( $key );
			if ( isset( static::$fields[$name] ) ) {
				$filter = static::$fields[$name];
				$this->object->$name = is_callable( $filter, true ) ? call_user_func( $filter, $value ) : $value;
				++$count;
			}
		}
		(0 < $count) && $this->object->save();

		$type = get_called_class();
		$split = strrpos( $type, '\\' ) + 1;
		$format = substr( $type, $split );
		return $this->object->decorate( $format );
	}

	/**
	 * Get abbreviation for derived class.
	 * @return \famulus\ba
	 */
	protected static function ba() {
		return \famulus\ba::instance( strstr( get_called_class(), '\\' ) );
	}

	/**
	 * The object holds the base information.
	 * @var \element\individual
	 */
	protected $object;

	/**
	 * The attributes to be applied.
	 * @var \stdClass
	 */
	protected $update;

	/**
	 * Required by trivial().
	 * @var array
	 */
	protected static $fields = array( );

}
