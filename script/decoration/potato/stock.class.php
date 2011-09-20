<?php
namespace decoration\potato;

/**
 * Decoration of potato in stock subject.
 */
class stock extends \decoration\potato\tuber {

	/**
	 * @see \decoration\individual::content
	 */
	public function content( array &$vessel = array( ) ) {
		parent::content( $vessel );
		$ab = \ab\potato\stock::instance();
		$vessel[self::subject()] = array(
			$ab( 'season' ) => $this->data->season,
			$ab( 'weight' ) => $this->data->weight,
			$ab( 'variety' ) => $this->data->variety,
			$ab( 'seeding' ) => $this->data->seeding,
			$ab( 'harvest' ) => $this->data->harvest,
		);
		return $vessel;
	}

}
