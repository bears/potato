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
		$ab = self::ab();
		$content = array(
			\famulus\ab::UUID_KEY => $uuid,
			$ab->subject() => array(
				$ab( 'chips' ) => $fries->decorate( 'fries' )->content(),
			),
		);
		return json_encode( $content );
	}

}
