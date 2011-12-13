<?php
namespace renovation;

/**
 * renovation of chip.
 */
class chip extends individual {

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $fields = array(
		'fries' => array(
			'detail' => false,
		),
	);

}
