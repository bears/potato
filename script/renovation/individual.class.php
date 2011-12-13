<?php
namespace renovation;

/**
 * The base class for renovating \database\individual object.
 */
abstract class individual {

	public function __construct( \database\individual $object, \ArrayIterator $update ) {
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
	 * @return array
	 */
	public function process() {
		return $this->trivial();
	}

	/**
	 * Default/common way to walk through the update.
	 * @return array
	 */
	protected function trivial() {
		$ba = self::ba();
		foreach ( $this->update as $label => $values ) {
			$subject = $ba->focus( $label );
			if ( isset( static::$fields[$subject] ) ) {
				$fields = static::$fields[$subject];
				foreach ( $values as $key => $value ) {
					$name = $ba( $key );
					if ( isset( $fields[$name] ) ) {
						$filter = $fields[$name];
						$this->object->$name = is_callable( $filter, true ) ? call_user_func( $filter, $value ) : $value;
					}
				}
			}
		}
		$this->object->save();
		return array( );
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
	 * @var \database\individual
	 */
	protected $object;

	/**
	 * The attributes to be applied.
	 * @var \ArrayIterator
	 */
	protected $update;

	/**
	 * Required by trivial().
	 * @var array
	 */
	protected static $fields = array( );

}
