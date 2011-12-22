<?php
namespace renovation;

/**
 * The base class for renovating \database\aggregate object.
 */
abstract class aggregate {

	public function __construct( \database\aggregate $object, \ArrayIterator $update ) {
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
	public function process() {
		$helper = str_replace( '\\aggregate$', '', get_called_class() . '$' );
		$vessel = array( );
		foreach ( $this->object as $unit ) {
			$renovator = new $helper( $unit, $this->update );
			$vessel[] = $renovator->process();
		}
		return $vessel;
	}

	/**
	 * The object holds the base information.
	 * @var \database\aggregate
	 */
	protected $object;

	/**
	 * The attributes to be applied.
	 * @var \ArrayIterator
	 */
	protected $update;

}
