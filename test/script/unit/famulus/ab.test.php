<?php
namespace test\famulus;

/**
 * Test class for \famulus\ab.
 */
class ab extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\famulus\ab::__invoke
	 */
	public function test__invoke() {
		$expect = md5( uniqid( __METHOD__ ) );
		$ab = $this->fixture;
		$this->assertEquals( $expect, $ab( $expect ) );
	}

	/**
	 * @covers	\famulus\ab::subject
	 */
	public function test_subject() {
		$this->assertEquals( 1, preg_match( '/^[A-Z0-9]+$/i', $this->fixture->subject() ) );
	}

	/**
	 * @covers	\famulus\ab::instance
	 */
	public function test_instance() {
		$class = get_class( $this->fixture );
		$another = $class::instance();
		$this->assertSame( $another, $this->fixture );
	}

	protected function setUp() {
		$this->fixture = \ab\dolt\folly::instance();
	}

	/**
	 * @var \famulus\ab
	 */
	protected $fixture;

}
