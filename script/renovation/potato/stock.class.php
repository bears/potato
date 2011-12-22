<?php
namespace renovation\potato;

/**
 * Renovation of potato in stock subject.
 */
class stock extends \renovation\individual {

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $fields = array(
		'craft' => false,
		'season' => false,
		'weight' => false,
		'variety' => false,
		'seeding' => false,
		'harvest' => false,
	);

}
