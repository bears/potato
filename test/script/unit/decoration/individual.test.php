<?php
/**
 * Stub classes.
 */
namespace decoration\test {

	class sample extends \decoration\individual {

		/**
		 * Required by parent::trivial().
		 * @var array
		 */
		protected static $fields = array(
			'brand' => false,
			'label' => array( __CLASS__, 'filter_label' ),
		);

		public static function filter_label( $origin ) {
			return "$origin-$origin";
		}

	}

}

/**
 * Test class.
 */
namespace test\decoration {

	/**
	 * Test class for \decoration\individual.
	 */
	class individual extends \PHPUnit_Framework_TestCase {

		/**
		 * @var \decoration\potato\tuber
		 */
		private $fixture;

		/**
		 * Sets up the fixtures.
		 */
		protected function setUp() {
			\famulus\ab::load( array(
				'\\test' => array(
					'sample' => array(
						'$' => 's',
						'brand' => 'b',
						'label' => '2',
					),
				),
			) );

			$test = new \individual\test();
			$test->brand = 123;
			$test->label = 'x';

			$this->fixture = $test->decorate( 'sample' );
		}

		/**
		 * @covers \decoration\individual::trivial
		 */
		public function test_trivial() {
			$content = $this->fixture->trivial();
			$this->assertCount( 2, $content );

			$this->assertArrayHasKey( \famulus\ab::UUID_KEY, $content );

			$this->assertArrayHasKey( 's', $content );
			$subject = $content['s'];
			$this->assertCount( 2, $subject );

			$this->assertArrayHasKey( 'b', $subject );
			$this->assertSame( 123, $subject['b'] );

			$this->assertArrayHasKey( '2', $subject );
			$this->assertSame( 'x-x', $subject['2'] );
		}

	}

}
