<?php
namespace decoration;

/**
 * The base class for decorating \database\individual object.
 */
abstract class decoration {

	public function __construct( \database\individual $object ) {
		$this->data = $object;
	}

	public function __toString() {
		return json_encode( $this->content() );
	}

	/**
	 * Derived class MUST override this method.
	 * @param array $vessel
	 * @return array
	 */
	public function content( array &$vessel = array( ) ) {
		return $vessel;
	}

	/**
	 * The object holds the base information.
	 * @var \database\individual
	 */
	protected $data;

}
?>
