<?php
namespace test\decoration {

	/**
	 * Test class for \decoration\individual.
	 */
	class individual extends \PHPUnit_Framework_TestCase {

		/**
		 * @covers \decoration\individual::content
		 */
		public function test_content() {
			$content = $this->object->content();

			$this->assertArrayHasKey( '$', $content );
			$this->assertEquals( \individual\unittest::FIXED_UUID, $content['$'] );

			$this->assertTrue( $content['unittest']['dummy'] );
		}

		/**
		 * @covers	\decoration\individual::__toString
		 * @depends	test_content
		 */
		public function test__toString() {
			$refer = '{"$":"' . \individual\unittest::FIXED_UUID . '","unittest":{"dummy":true}}';
			$this->assertEquals( $refer, "{$this->object}" );
		}

		/**
		 * Sets up the fixture, for example, opens a network connection.
		 * This method is called before a test is executed.
		 */
		protected function setUp() {
			$this->object = new \decoration\unittest( new \individual\unittest() );
		}

		/**
		 * Tears down the fixture, for example, closes a network connection.
		 * This method is called after a test is executed.
		 */
		protected function tearDown() {
			// Nothing...
		}

		/**
		 * @var \decoration\individual
		 */
		protected $object;

	}
}
namespace decoration {

	class unittest extends individual {

		public function content( array &$vessel = array( ) ) {
			parent::content( $vessel );
			$vessel['unittest'] = array( 'dummy' => true );
			return $vessel;
		}

	}
}
namespace individual {

	class unittest extends \database\individual {
		const FIXED_UUID = 'aa2c5224-5171-4d3f-8d37-94c426cbb4d8';

		protected $uuid = self::FIXED_UUID;

	}
}