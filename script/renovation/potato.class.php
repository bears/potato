<?php
namespace renovation;

/**
 * Renovation of potato.
 */
class potato extends individual {

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $fields = array(
		'stock' => array(
			'craft' => false,
			'season' => false,
			'weight' => false,
			'variety' => false,
			'seeding' => false,
			'harvest' => false,
		),
		'tuber' => array(
			'brand' => false,
			'label' => false,
		),
	);

}
