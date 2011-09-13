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
		$season = array_shift( $this->segments );
		$offset = array_shift( $this->segments );
		$list = array( 't' => time(), 'max' => 5 );
		$icon = array( 'pencil' => '', 'refresh' => '', 'shuffle' => '', 'note' => '', 'document' => '' );
		for ( $i = 0; $i < rand( 20, 25 ); ++$i ) {
			$data = array(
				'id' => "$offset$i",
				'label' => "Content for {$season}#{$offset}",
				'icon' => array_rand( $icon, 1 ),
				't' => time(),
			);
			$list['tubers'][] = $data;
		}
		try {
			$aggregate = \aggregate\potato::season( $season, $offset );
			$decoration = new \decoration\potato\season\aggregate( $aggregate );
			$list['try'] = "$decoration";
		}
		catch ( Exception $e ) {
			echo $e;
		}
		return json_encode( $list );
	}

}
