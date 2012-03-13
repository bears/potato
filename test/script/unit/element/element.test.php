<?php
/**
 * Stub classes.
 */
namespace element {

	const TEST_FORMAT = 'format';

	class pure_derive extends element {

	}

	class with_suffix extends element {

		const ASSISTANT_SUFFIX = '\\suffix';

	}

}
namespace decoration\pure_derive {

	class format {

	}

}
namespace decoration\with_suffix\format {

	class suffix {

	}

}
namespace renovation\pure_derive {

	class format {

	}

}
namespace renovation\with_suffix\format {

	class suffix {

	}

}

/**
 * Test class.
 */
namespace test\element {

	/**
	 * Test class for \element\element.
	 */
	class element extends \PHPUnit_Framework_TestCase {

		/**
		 * @covers element\element::decorate
		 */
		public function test_decorate() {
			$deco1 = $this->fixture1->decorate( \element\TEST_FORMAT );
			$this->assertInstanceOf( '\\decoration\\pure_derive\\format', $deco1 );

			$deco2 = $this->fixture2->decorate( \element\TEST_FORMAT );
			$this->assertInstanceOf( '\\decoration\\with_suffix\\format\\suffix', $deco2 );
		}

		/**
		 * @covers element\element::renovate
		 */
		public function test_renovate() {
			$reno1 = $this->fixture1->renovate( \element\TEST_FORMAT );
			$this->assertInstanceOf( '\\renovation\\pure_derive\\format', $reno1 );

			$reno2 = $this->fixture2->renovate( \element\TEST_FORMAT );
			$this->assertInstanceOf( '\\renovation\\with_suffix\\format\\suffix', $reno2 );
		}

		/**
		 * @covers element\element::get_title
		 */
		public function test_get_title() {
			$title1 = $this->fixture1->get_title();
			$this->assertEquals( 'pure_derive', $title1 );

			$title2 = $this->fixture2->get_title();
			$this->assertEquals( 'with_suffix', $title2 );
		}

		/**
		 * Sets up the fixtures.
		 */
		public function setUp() {
			$this->fixture1 = new \element\pure_derive();
			$this->fixture2 = new \element\with_suffix();
		}

		/**
		 * @var \element\pure_derive
		 */
		private $fixture1;

		/**
		 * @var \element\with_suffix
		 */
		private $fixture2;

	}

}
