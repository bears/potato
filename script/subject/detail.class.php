<?php
namespace subject;

/**
 * Detail panel.
 */
class detail extends \subject {

	/**
	 * @return JSON
	 */
	public function __toString() {
		$id = array_shift( $this->segments );
		$data = array(
			'id' => $id,
			'title' => 'Title of detail #' . $id,
			'dates' => array(
				'start' => '2011-04-08T03:06:00Z',
				'end' => '2011-04-28T05:28:04Z'
			),
			'season' => 'spring',
			'variety' => 'Shopping',
			'weight' => rand( 1, 9 ),
			'progress' => array(
				'estimated' => 604800,
				'practical' => 86400,
				'original' => 259200,
			),
			'description' => array(
				'After starting the test-suite it will automatically run a large number of small tests which will determine if your browser is compatible with a large number of CSS selectors.',
				'If it is not compatible with a particular selector it is marked as such.',
				'You can click on each CSS selector to see the results, including a small example and explanation for each of tests.',
			),
			'comments' => array(
				array(
					'date' => '2011-03-02T00:00:00Z',
					'content' => '<div>Let\'s take a closer look at what\'s new.</div>',
				),
				array(
					'date' => '2011-04-02T00:00:00Z',
					'content' => '<p>Opera have once again kicked their level of CSS3 support up a notch with the release of the latest beta version of their popular web browser. Opera version 11.10 beta, code named \'Barracuda\', was first unveiled at this weeks SXSW in Austin, Texas, before being made available for download as a public beta yesterday.</div>',
				),
				array(
					'date' => '2011-04-28T20:00:00Z',
					'content' => '<p>The W3C CSS Working Group have released two further updated working draft specifications for CSS3.</div>',
				),
			),
		);
		return json_encode( $data );
	}

}
