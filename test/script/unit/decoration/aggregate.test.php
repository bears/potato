<?php
namespace test\decoration {

	/**
	 * Test class for \decoration\aggregate.
	 */
	class aggregate extends \PHPUnit_Framework_TestCase {

		/**
		 * @covers \decoration\aggregate::content
		 */
		public function test_content() {
			$content = $this->object->content();
			$this->assertCount( 2, $content );
			$this->assertArrayHasKey( '$', $content[0] );
		}

		/**
		 * @covers	\decoration\aggregate::__toString
		 * @depends	test_content
		 */
		public function test__toString() {
			$recover = json_decode( "{$this->object}", true );
			$this->assertCount( 2, $recover );
			$this->assertArrayHasKey( '$', $recover[0] );
		}

		/**
		 * Sets up the fixture, for example, opens a network connection.
		 * This method is called before a test is executed.
		 */
		protected function setUp() {
			$this->object = new \decoration\unittest\aggregate( new \aggregate\unittest() );
		}

		/**
		 * Tears down the fixture, for example, closes a network connection.
		 * This method is called after a test is executed.
		 */
		protected function tearDown() {
			// Nothing...
		}

		/**
		 * @var \decoration\aggregate
		 */
		protected $object;

	}
}
namespace aggregate {

	class unittest extends \database\aggregate {

		public function __construct() {
			$this->objects = array(
				new \individual\unittest(),
				new \individual\unittest(),
			);
		}

	}
}
