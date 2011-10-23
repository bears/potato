<?php
namespace subject;

/**
 * Center panel, detail.
 */
class fries extends \subject {

	/**
	 * @return JSON
	 */
	public function __toString() {
		$potato = array_shift( $this->segments );
		$aggregate = \aggregate\chip::fries( $potato );
		$fries = new \decoration\chip\fries\aggregate( $aggregate );
		$content = array(
			\famulus\ab::KEY_UUID => $potato,
			'fries' => array(
				'chips' => $fries->content(),
			),
		);
		return json_encode( $content );
	}

}
