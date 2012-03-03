<?php
namespace decoration;

/**
 * The base class for decorating \element\aggregate object.
 */
abstract class aggregate {

	public function __construct( \element\aggregate $object ) {
		$this->object = $object;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		return json_encode( $this->content() );
	}

	/**
	 * Gather content of each unit inside aggregate.
	 * @param array $vessel
	 * @return array
	 */
	public function content( array &$vessel = array( ) ) {
		$helper = str_replace( '\\aggregate$', '', get_called_class() . '$' );
		foreach ( $this->object as $unit ) {
			$decorator = new $helper( $unit );
			$vessel[] = $decorator->content();
		}
		return $vessel;
	}

	/**
	 * The object holds the base information.
	 * @var \element\individual
	 */
	protected $object;

}
