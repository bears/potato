<?php
namespace decoration;

/**
 * To help the test of \decoration\individual and \decoration\aggregate.
 */
class dummy extends individual {

	/**
	 * @see \decoration\individual::content
	 */
	public function content( array &$vessel = array( ) ) {
		parent::content( $vessel );
		$vessel[parent::subject()] = array(
			'b' => $this->data->b,
			'i' => $this->data->i,
		);
		return $vessel;
	}

}
