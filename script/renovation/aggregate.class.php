<?php
namespace renovation;

/**
 * The base class for renovating \element\aggregate object.
 */
abstract class aggregate extends \element\assistant {

	/**
	 * The 2nd step of construction.
	 * @param \stdClass $update
	 */
	public function initialize( \stdClass $update ) {
		$this->update = $update;
	}

	/**
	 * Initialize a unit object.
	 * @param type $unit
	 */
	protected function initialize_unit( $unit ) {
		$unit->initialize( $this->update );
	}

	/**
	 * The attributes to be applied.
	 * @var \stdClass
	 */
	protected $update;

}
