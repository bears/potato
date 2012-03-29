<?php
/**
 * Stub classes.
 */
namespace element {

	class origin extends element {

		public $check;

		public function __construct( $value ) {
			$this->check = $value;
		}

	}

	class helper extends assistant {

		public function & content( array &$vessel = array( ) ) {
			$vessel['c'] = $this->object->check;
			return $vessel;
		}

	}

}
namespace element\origin {

	class aggregate extends \element\aggregate {

		public function __construct() {
			$this->objects = array(
				new \element\origin( 123 ),
				new \element\origin( 'x' ),
			);
		}

	}

}
namespace element\helper {

	class aggregate extends \element\assistant {

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
			$origin = new \element\origin\aggregate();
			$this->fixture = new \element\helper\aggregate( $origin );
		}

		/**
		 * @covers \element\assistant::__toString
		 */
		public function test__toString() {
			$this->assertEquals( '[{"c":123},{"c":"x"}]', "{$this->fixture}" );
		}

		/**
		 * @covers \element\assistant::content
		 */
		public function test_content() {
			$vessel = array( 'x' => 'y' );
			$content = $this->fixture->content( $vessel );
			$this->assertSame( $vessel, $content );
			$this->assertCount( 3, $content );
		}

		/**
		 * @covers \element\assistant::trivial
		 */
		public function test_trivial() {
			$content = $this->fixture->content();
			$this->assertCount( 2, $content );

			$this->assertArrayHasKey( 'c', $content[0] );
			$this->assertSame( 123, $content[0]['c'] );

			$this->assertArrayHasKey( 'c', $content[1] );
			$this->assertSame( 'x', $content[1]['c'] );
		}

	}

}
