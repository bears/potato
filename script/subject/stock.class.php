<?php
namespace subject;

/**
 * Center panel, detail.
 */
class stock extends \subject {

	/**
	 * @return JSON
	 */
	public function __toString() {
		$uuid = array_shift( $this->segments );
		$data = \individual\potato::select( $uuid );
		return (string) new \decoration\potato\stock( $data );;
	}

}
