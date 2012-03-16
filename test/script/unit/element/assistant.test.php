<?php
/**
 * Stub classes.
 */
namespace element {

	class origin extends element {

		public $check = 'value';

	}

	class helper extends assistant {

		public function & content( array &$vessel = array( ) ) {
			$vessel['check'] = $this->object->check;
			return $vessel;
		}

	}

}

/**
 * Test class.
 */
namespace test\element {

	/**
	 * Test class for \element\assistant.
	 */
	class assistant extends \PHPUnit_Framework_TestCase {

		/**
		 * @var \element\helper
		 */
		private $fixture;

		/**
		 * Sets up the fixture.
		 */
		protected function setUp() {
			$origin = new \element\origin();
			$this->fixture = new \element\helper( $origin );
		}

		/**
		 * @covers \element\assistant::__toString
		 */
		public function test__toString() {
			$this->assertEquals( '{"check":"value"}', "{$this->fixture}" );
		}

		/**
		 * @covers \element\assistant::content
		 */
		public function test_content() {
			$content = $this->fixture->content();
			$this->assertInternalType( 'array', $content );
			$this->assertArrayHasKey( 'check', $content );
		}

		/**
		 * @covers \element\assistant::trivial
		 */
		public function test_trivial() {
			$trivial = $this->fixture->trivial();
			$this->assertInternalType( 'array', $trivial );
			$this->assertEmpty( $trivial );
		}

	}

}
