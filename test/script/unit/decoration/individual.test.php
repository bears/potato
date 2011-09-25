<?php
namespace test\decoration;

/**
 * Test class for \decoration\individual.
 */
class individual extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\decoration\individual::content
	 */
	public function test_content() {
		$content = $this->fixture->content();
		$this->assertArrayHasKey( \decoration\individual::UUID_KEY, $content );
		$this->assertArrayHasKey( 'tuber', $content );
		$this->assertTrue( is_array( $content['tuber'] ) );
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
		$this->assertEquals( 'tuber', $this->fixture->subject() );
	}

	protected function setUp() {
		\database\connection::get_pdo()->exec( 'START TRANSACTION' );

		$potato = new \individual\potato();
		$potato->brand = 2;
		$potato->label = __METHOD__;
		$potato->season = 'spring';
		$potato->weight = 0.9876;
		$potato->variety = __FILE__;
		$potato->seeding = gmdate( 'c' );
		$potato->save();

		$this->fixture = new \decoration\potato\tuber( $potato );
	}

	protected function tearDown() {
		\database\connection::get_pdo()->exec( 'ROLLBACK' );
	}

	/**
	 * @var \decoration\potato\tuber
	 */
	protected $fixture;

}
