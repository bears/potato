<?php
namespace test\database;

/**
 * Test class for \database\individual.
 */
class individual extends \PHPUnit_Framework_TestCase {

	const UUID_FORMAT = '%x-%x-%x-%x-%x';
	const UUID_PRESENCE = '41a6a078-1d29-ad6c-bdea-4a8ed1e5a63b';

	public function setUp() {
		\database\connection::get_pdo()->exec( 'START TRANSACTION' );

		$this->fixture = new \individual\dummy();
		$this->fixture->b = true;
		$this->fixture->i = 1000;
		$this->fixture->t = gmdate( 'c' );
		$this->fixture->s = __CLASS__;
		$this->fixture->save();
	}

	public function tearDown() {
		\database\connection::get_pdo()->exec( 'ROLLBACK' );
	}

	/**
	 * @covers	\database\individual::save
	 */
	public function test_save() {
		$uuid = $this->fixture->uuid();
		$this->assertEquals( 36, strlen( $uuid ) );
		$this->assertStringMatchesFormat( self::UUID_FORMAT, $uuid );

		$this->fixture->s = 'Truly';
		$this->fixture->save();
		$this->assertSame( $uuid, $this->fixture->uuid() );
	}

	/**
	 * @covers	\database\individual::delete
	 */
	public function test_delete() {
		$this->fixture->delete();
		$this->assertNull( $this->fixture->uuid() );
	}

	/**
	 * @covers	\database\individual::select
	 * @depends	test_save
	 */
	public function test_select() {
		$fetched = \individual\dummy::select( $this->fixture->uuid() );
		$this->assertSame( $this->fixture, $fetched );

		$another = \individual\dummy::select( self::UUID_PRESENCE );
		$this->assertNotSame( $this->fixture, $another );
	}

	/**
	 * @covers	\database\individual::__clone
	 */
	public function test__clone() {
		$another = clone $this->fixture;
		$this->assertNull( $another->uuid() );
		$this->assertNotSame( $another->uuid(), $this->fixture->uuid() );
	}

	/**
	 * @var \individual\dummy
	 */
	private $fixture;

}
