<?php
namespace decoration\potato;

/**
 * Decoration of potato in season subject.
 */
class tuber extends \decoration\individual {

	/**
	 * Required by parent::trivial().
	 * @var array
	 */
	protected static $fields = array(
		'brand' => false,
		'label' => false,
	);

}
