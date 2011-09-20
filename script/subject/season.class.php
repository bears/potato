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
		$season = array_shift( $this->segments );
		$offset = 0; //array_shift( $this->segments );
		$aggregate = \aggregate\potato::tuber( $season, $offset );
		$tubers = new \decoration\potato\tuber\aggregate( $aggregate );
		$content = array(
			\decoration\individual::UUID_KEY => $season,
			'season' => array(
				'tubers' => $tubers->content(),
			),
		);
		return json_encode( $content );
	}

}
