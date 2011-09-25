<?php
namespace decoration\potato;

/**
 * Decoration of potato in stock subject.
 */
class stock extends \decoration\potato\tuber {

	/**
	 * Required by parent::trivial().
	 * @var array(string)
	 */
	protected static $fields = array( 'season', 'weight', 'variety', 'seeding', 'harvest' );

}
