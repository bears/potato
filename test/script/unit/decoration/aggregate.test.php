<?php
namespace test\decoration;

require_once dirname( __FILE__ ) . '/dummy.fake.php';

/**
 * Test class for \decoration\aggregate.
 */
class aggregate extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\decoration\aggregate::content
	 */
	public function test_content() {
		$content = $this->fixture->content();
		$this->assertFalse( empty( $content ) );
		foreach ( $content as $item ) {
			$this->assertArrayHasKey( \decoration\individual::UUID_KEY, $item );
		}
	}

	/**
	 * @covers	\decoration\aggregate::__toString
	 * @depends	test_content
	 */
	public function test__toString() {
		$recover = json_decode( "{$this->fixture}", true );
		$this->assertFalse( empty( $recover ) );
		foreach ( $recover as $item ) {
			$this->assertArrayHasKey( \decoration\individual::UUID_KEY, $item );
		}
	}

	protected function setUp() {
		$this->fixture = new \decoration\dummy\aggregate( \aggregate\dummy::top5() );
	}

	/**
	 * @var \decoration\aggregate
	 */
	protected $fixture;

}
