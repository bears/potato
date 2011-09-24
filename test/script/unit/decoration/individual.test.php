<?php
namespace test\decoration;

require_once dirname( __FILE__ ) . '/dummy.fake.php';

/**
 * Test class for \decoration\individual.
 */
class individual extends \PHPUnit_Framework_TestCase {

	const UUID_PRESENCE = '41a6a078-1d29-ad6c-bdea-4a8ed1e5a63b';

	/**
	 * @covers	\decoration\individual::content
	 */
	public function test_content() {
		$content = $this->fixture->content();
		$this->assertArrayHasKey( \decoration\individual::UUID_KEY, $content );
		$this->assertArrayHasKey( 'dummy', $content );
		$this->assertTrue( is_array( $content['dummy'] ) );
		$this->assertArrayHasKey( 'b', $content['dummy'] );
		$this->assertArrayHasKey( 'i', $content['dummy'] );
	}

	/**
	 * @covers	\decoration\individual::__toString
	 * @depends	test_content
	 */
	public function test__toString() {
		$recover = json_decode( "{$this->fixture}", true );
		$this->assertEquals( $recover, $this->fixture->content() );
	}

	/**
	 * @covers	\decoration\individual::subject
	 */
	public function test_subject() {
		$this->assertEquals( 'dummy', $this->fixture->subject() );
	}

	protected function setUp() {
		$this->fixture = new \decoration\dummy( \individual\dummy::select( self::UUID_PRESENCE ) );
	}

	/**
	 * @var \decoration\individual
	 */
	protected $fixture;

}
