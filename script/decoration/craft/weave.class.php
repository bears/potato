<?php
namespace decoration\craft;

/**
 * Decoration of craft in weave subject.
 */
class weave extends \decoration\individual {

	/**
	 * Required by parent::trivial().
	 * @var array(string)
	 */
	protected static $fields = array( 'detail', 'weight' );

}
