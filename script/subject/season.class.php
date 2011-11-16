<?php
namespace subject;

/**
 * Season panel, brief list.
 */
class season extends \subject {

	/**
	 * @return JSON
	 */
	public function __toString() {
		//setcookie('hello', 'world', 0, '/');
		$uuid = array_shift( $this->segments );
		$offset = 0; //array_shift( $this->segments );
		$tubers = \aggregate\potato::tubers( $uuid, $offset );
		$content = array(
			\famulus\ab::KEY_UUID => $uuid,
			'season' => array(
				'tubers' => $tubers->decorate( 'tuber' )->content(),
			),
		);
		return json_encode( $content );
	}

}
