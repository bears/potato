<?php
namespace decoration;

/**
 * The base class for decorating \database\individual object.
 */
abstract class individual {

	const CASCADE_METHOD = 'method';
	const CASCADE_FORMAT = 'format';

	public function __construct( \database\individual $object ) {
		$this->object = $object;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		return json_encode( $this->content() );
	}

	/**
	 * Override this method to customize.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	public function & content( array &$vessel = array( ) ) {
		return self::trivial( $vessel );
	}

	/**
	 * Default/common way to append data in the final result.
	 * @param array $vessel [IN|OUT]
	 * @return array
	 */
	protected function & trivial( array &$vessel = array( ) ) {
		$uuid = $this->object->uuid();
		$vessel[\famulus\ab::UUID_KEY] = $uuid;
		if ( !(empty( static::$fields ) && empty( static::$cascades )) ) {
			$data = array( );
			$ab = self::ab();
			foreach ( static::$fields as $field => $filter ) {
				if ( null !== ($value = $this->object->$field) ) {
					$data[$ab( $field )] = is_callable( $filter, true ) ? call_user_func( $filter, $value ) : $value;
				}
			}
			foreach ( static::$cascades as $field => $cascade ) {
				$aggregate = call_user_func( $cascade[self::CASCADE_METHOD], $uuid, 0 );
				$data[$ab( $field )] = $aggregate->decorate( $cascade[self::CASCADE_FORMAT] )->content();
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
		return \famulus\ab::instance( strstr( get_called_class(), '\\' ) );
	}

	/**
	 * The object holds the base information.
	 * @var \database\individual
	 */
	protected $object;

	/**
	 * Required by trivial().
	 * @var array
	 */
	protected static $fields = array( );

	/**
	 * Required by trivial().
	 * @var array
	 */
	protected static $cascades = array( );

}
