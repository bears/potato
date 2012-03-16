<?php
namespace test\famulus {

	/**
	 * Test class for \famulus\ab.
	 */
	class ab extends \PHPUnit_Framework_TestCase {

		/**
		 * Sets up the environment.
		 */
		public static function setUpBeforeClass() {
			\famulus\ab::load( array(
				'\\test_a' => array(
					'sub_a' => array(
						'$' => 'd',
						'field' => 'a',
					),
					'sub_b' => array(
						'$' => 'e',
						'field' => 'b',
					),
				),
				'\\test_b' => array(
					'sub_a' => array(
						'$' => 'f',
						'field' => 'c',
					),
				),
			) );
		}

		/**
		 * @var \famulus\ab
		 */
		private $fixture1;
		private $fixture2;
		private $fixture3;
		private $fixture4;

		/**
		 * Sets up the fixtures.
		 */
		protected function setUp() {
			$this->fixture1 = \famulus\ab::instance( '\\test_a\\sub_a' );
			$this->fixture2 = \famulus\ab::instance( '\\test_a\\sub_b' );
			$this->fixture3 = \famulus\ab::instance( '\\test_b\\sub_a' );
			$this->fixture4 = \famulus\ab::instance( '\\test_b\\sub_b' );
		}

		/**
		 * @covers \famulus\ab::__invoke
		 */
		public function test__invoke() {
			$ab1 = $this->fixture1;
			$this->assertSame( 'a', $ab1( 'field' ) );
			$ab2 = $this->fixture2;
			$this->assertSame( 'b', $ab2( 'field' ) );
			$ab3 = $this->fixture3;
			$this->assertSame( 'c', $ab3( 'field' ) );
		}

		/**
		 * @covers \famulus\ab::__invoke
		 */
		public function test_missed__invoke() {
			$self = $this; // Work around before PHP 5.4
			$flag = 0;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'inexistent key', $message );
				++$flag;
				return true;
			} );

			$ab1 = $this->fixture1;
			$this->assertSame( 'thing', $ab1( 'thing' ) );
			$ab4 = $this->fixture4;
			$this->assertSame( 'field', $ab4( 'field' ) );

			$this->assertEquals( 2, $flag );
			restore_error_handler();
		}

		/**
		 * @covers \famulus\ab::subject
		 */
		public function test_subject() {
			$this->assertSame( 'd', $this->fixture1->subject() );
			$this->assertSame( 'e', $this->fixture2->subject() );
			$this->assertSame( 'f', $this->fixture3->subject() );
			$this->assertSame( 'sub_b', $this->fixture4->subject() );
		}

		/**
		 * @covers \famulus\ab::instance
		 */
		public function test_instance() {
			$this->assertSame( \famulus\ab::instance( '\\test_b\\sub_b' ), $this->fixture4 );
			$this->assertNotSame( \famulus\ab::instance( '\\test_b\\sub_c' ), $this->fixture4 );
		}

	}

}
