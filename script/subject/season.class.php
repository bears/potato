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
		$title = array_shift( $this->segments );
		$id = array_shift( $this->segments );
		$list = array( 't' => time(), 'max' => 5 );
		$icon = array( 'pencil' => '', 'refresh' => '', 'shuffle' => '', 'note' => '', 'document' => '' );
		for ( $i = 0; $i < rand( 20, 25 ); ++$i ) {
			$data = array(
				'id' => "$id$i",
				'label' => "Content for {$title}#{$id}",
				'icon' => array_rand( $icon, 1 ),
				't' => time(),
			);
			$list['tubers'][] = $data;
		}
		return json_encode( $list );
	}

}
