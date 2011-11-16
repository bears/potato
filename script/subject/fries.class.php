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
		$uuid = array_shift( $this->segments );
		$fries = \aggregate\chip::fries( $uuid );
		$content = array(
			\famulus\ab::KEY_UUID => $uuid,
			'fries' => array(
				'chips' => $fries->decorate( 'fries' )->content(),
			),
		);
		return json_encode( $content );
	}

}
