<?php
namespace decoration\potato;

/**
 * Decoration of potato in stock subject.
 */
class stock extends \decoration\individual {

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

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $cascades = array(
		'fries' => array(
			parent::CASCADE_METHOD => '\\aggregate\\chip::get_fries',
			parent::CASCADE_FORMAT => 'fries',
		),
	);

}
