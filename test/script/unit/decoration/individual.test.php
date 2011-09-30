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
		$this->assertArrayHasKey( \famulus\ab::KEY_UUID, $content );
		unset( $content[\famulus\ab::KEY_UUID] );
		foreach ( $content as $key => $subject ) {
			$this->assertTrue( is_array( $subject ) );
		}
	}

	/**
	 * @covers	\decoration\individual::__toString
	 * @depends	test_content
	 */
	public function test__toString() {
		$recover = json_decode( "{$this->fixture}", true );
		$this->assertEquals( $recover, $this->fixture->content() );
	}

	protected function setUp() {
		\database\connection::get_pdo()->beginTransaction();

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
		\database\connection::get_pdo()->rollBack();
	}

	/**
	 * @var \decoration\potato\tuber
	 */
	protected $fixture;

}
