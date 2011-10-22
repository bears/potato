<?php
namespace decoration\potato;

/**
 * Decoration of potato in stock subject.
 */
class stock extends \decoration\individual {

	/**
	 * Required by parent::trivial().
	 * @var array(string)
	 */
	protected static $fields = array( 'craft', 'season', 'weight', 'variety', 'seeding', 'harvest' );

}
