<?php
namespace renovation;

/**
 * The base class for renovating \element\individual object.
 */
abstract class individual extends \element\assistant {

	/**
	 * The 2nd step of construction.
	 * @param \stdClass $update
	 */
	public function initialize( \stdClass $update ) {
		$this->update = $update;
	}

	/**
	 * Default/common way to walk through the update.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function & trivial( array &$vessel = array( ) ) {
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
		return $this->object->decorate( $format )->content( $vessel );
	}

	/**
	 * Get abbreviation for derived class.
	 * @return \famulus\ba
	 */
	protected static function ba() {
		return \famulus\ba::instance( strstr( get_called_class(), '\\' ) );
	}

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
