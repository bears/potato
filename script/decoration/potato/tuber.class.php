<?php
namespace decoration\potato;

/**
 * Decoration of potato in season subject.
 */
class tuber extends \decoration\individual {

	/**
	 * @see \decoration\individual::content
	 */
	public function content( array &$vessel = array( ) ) {
		parent::content( $vessel );
		$ab = \ab\potato\season::instance();
		$vessel[self::subject()] = array(
			$ab( 'brand' ) => $this->data->brand,
			$ab( 'label' ) => $this->data->label,
			$ab( 'weight' ) => $this->data->weight,
		);
		return $vessel;
	}

}
