<?php
namespace renovation;

/**
 * The base class for renovating \element\aggregate object.
 */
abstract class aggregate {

	public function __construct( \element\aggregate $object, \stdClass $update ) {
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
	 * Gather content of each unit inside aggregate.
	 * @param array $vessel
	 * @return array
	 */
	public function process( array &$vessel = array( ) ) {
		$helper = str_replace( '\\aggregate$', '', get_called_class() . '$' );
		foreach ( $this->object as $unit ) {
			$renovator = new $helper( $unit, $this->update );
			$vessel[] = $renovator->process();
		}
		return $vessel;
	}

	/**
	 * The object holds the base information.
	 * @var \element\aggregate
	 */
	protected $object;

	/**
	 * The attributes to be applied.
	 * @var \stdClass
	 */
	protected $update;

}
