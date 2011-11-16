<?php
namespace test\decoration;

/**
 * Test class for \decoration\aggregate.
 */
class aggregate extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\decoration\aggregate::content
	 */
	public function test_content() {
		$content = $this->fixture->content();
		$this->assertTrue( is_array( $content ) );
		foreach ( $content as $item ) {
			$this->assertArrayHasKey( \famulus\ab::KEY_UUID, $item );
		}
	}

	/**
	 * @covers	\decoration\aggregate::__toString
	 * @depends	test_content
	 */
	public function test__toString() {
		$recover = json_decode( "{$this->fixture}", true );
		$this->assertEquals( $recover, $this->fixture->content() );
	}

	protected function setUp() {
		$this->fixture = \aggregate\potato::tubers( 'summer', 0 )->decorate( 'tuber' );
	}

	/**
	 * @var \decoration\potato\tuber\aggregate
	 */
	protected $fixture;

}
