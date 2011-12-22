<?php
namespace renovation\potato;

/**
 * Renovation of potato in tuber subject.
 */
class tuber extends \renovation\individual {

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $fields = array(
		'brand' => false,
		'label' => false,
	);

}
