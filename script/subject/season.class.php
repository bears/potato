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
//		setcookie('hello', 'world', 0, '/');
//		$season = array_shift( $this->segments );
//		$offset = array_shift( $this->segments );
//		$list = array( 't' => time(), 'max' => 5 );
//		$icon = array( 'pencil' => '', 'refresh' => '', 'shuffle' => '', 'note' => '', 'document' => '' );
//		for ( $i = 0; $i < rand( 20, 25 ); ++$i ) {
//			$data = array(
//				'id' => "$offset$i",
//				'label' => "Content for {$season}#{$offset}",
//				'icon' => array_rand( $icon, 1 ),
//				't' => time(),
//			);
//			$list['tubers'][] = $data;
//		}
//		try {
//		}
//		catch ( Exception $e ) {
//			echo $e;
//		}
//		return json_encode( $list );

		$season = array_shift( $this->segments );
		$offset = 0;
		$aggregate = \aggregate\potato::season( $season, $offset );
		$tubers = new \decoration\potato\season\aggregate( $aggregate );
		$content = array(
			\decoration\individual::UUID_KEY => $season,
			'season' => array(
				'tubers' => $tubers->content(),
			),
		);
		return json_encode( $content );
	}

}
