<?php
namespace subject;

/**
 * User profile settings.
 */
class profile extends \subject {

	const LOCK_KEY = 'LOCK';
	const L10N_KEY = 'L10N';

	public function __construct( $previous ) {
		$this->lock = rand(); ///< @todo: fetch from user profile when available
		$this->skip = $previous === $this->lock;
	}

	/**
	 * @return JSON
	 */
	public function __toString() {
		$data = array( self::LOCK_KEY => $this->lock );
		if ( !$this->skip ) {
			$data[self::L10N_KEY] = 'en-us';
		}
		return json_encode( $data );
	}

	/**
	 * @var boolean
	 */
	private $skip;

}
