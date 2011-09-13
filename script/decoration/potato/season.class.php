<?php
namespace decoration\potato;

/**
 * Decoration of potato in season subject.
 */
class season extends \decoration\individual {
	const SUBJECT = 'season';

	/**
	 * @see \decoration\individual::content
	 */
	public function content( array &$vessel = array( ) ) {
		parent::content( $vessel );
		$ab = \ab\potato\season::instance();
		$vessel[self::SUBJECT] = array(
			$ab( 'brand' ) => $this->data->brand,
			$ab( 'label' ) => $this->data->label,
			$ab( 'weight' ) => $this->data->weight,
		);
		return $vessel;
	}

}
