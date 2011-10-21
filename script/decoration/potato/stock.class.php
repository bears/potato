<?php
namespace decoration\potato;

/**
 * Decoration of potato in stock subject.
 */
class stock extends \decoration\individual {

	public function & content( array &$vessel = array( ) ) {
		parent::content( $vessel );
		$aggregate = \aggregate\craft::weave( $this->data->uuid() );
		$weave = new \decoration\craft\weave\aggregate( $aggregate );
		$ab = self::ab();
		$vessel[$ab->subject()][$ab( 'crafts' )] = $weave->content();
		return $vessel;
	}

	/**
	 * Required by parent::trivial().
	 * @var array(string)
	 */
	protected static $fields = array( 'season', 'weight', 'variety', 'seeding', 'harvest' );

}
