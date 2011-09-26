<?php
namespace test\database;

/**
 * Test class for \database\individual.
 */
class individual extends \PHPUnit_Framework_TestCase {

	const UUID_FORMAT = '%x-%x-%x-%x-%x';
	const UUID_PRIMITIVE = '00000000-0000-0000-0000-000000000000';

	/**
	 * @covers	\database\aggregate::save
	 */
	public function assertPreConditions() {
		$this->assertNull( $this->fixture->uuid() );
		$this->fixture->save();
		$this->assertStringMatchesFormat( self::UUID_FORMAT, $this->fixture->uuid() );
	}

	/**
	 * @covers	\database\individual::save
	 */
	public function test_save() {
		$uuid = $this->fixture->uuid();
		$this->fixture->label = __METHOD__;
		$this->fixture->save();
		$this->assertSame( $uuid, $this->fixture->uuid() );
	}

	/**
	 * @covers	\database\individual::save
	 *
	 * @expectedException	exception\database\expired_updating
	 */
	public function test_expired_save() {
		$this->fixture->harvest = gmdate( 'c' );
		$copy = unserialize( serialize( $this->fixture ) );
		$this->fixture->save();
		$copy->harvest = '2012-12-21T12:34:56.789Z';
		$copy->save();
	}

	/**
	 * @covers	\database\individual::delete
	 */
	public function test_delete() {
		$this->fixture->delete();
		$this->assertNull( $this->fixture->uuid() );
	}

	/**
	 * @covers	\database\individual::delete
	 *
	 * @expectedException	exception\database\expired_deleting
	 */
	public function test_expired_delete() {
		$copy = unserialize( serialize( $this->fixture ) );
		$this->fixture->delete();
		$copy->delete();
	}

	/**
	 * @covers	\database\individual::select
	 */
	public function test_select() {
		$fetched = \individual\potato::select( $this->fixture->uuid() );
		$this->assertSame( $this->fixture, $fetched );

		$another = \individual\potato::select( self::UUID_PRIMITIVE );
		$this->assertInstanceOf( '\\individual\\potato', $another );
		$this->assertNotSame( $this->fixture, $another );
	}

	/**
	 * @covers	\database\individual::select
	 */
	public function test_missmatched_select() {
		$extirpate = str_replace( '0', 'F', self::UUID_PRIMITIVE );
		$this->assertFalse( \individual\potato::select( $extirpate ) );
	}

	/**
	 * @covers	\database\individual::__clone
	 */
	public function test__clone() {
		$another = clone $this->fixture;
		$this->assertNull( $another->uuid() );
		$another->save();
		$this->assertNotSame( $another->uuid(), $this->fixture->uuid() );
	}

	protected function setUp() {
		\database\connection::get_pdo()->beginTransaction();

		$this->fixture = new \individual\potato();
		$this->fixture->brand = 2;
		$this->fixture->label = __METHOD__;
		$this->fixture->season = 'spring';
		$this->fixture->weight = 0.9876;
		$this->fixture->variety = __FILE__;
		$this->fixture->seeding = gmdate( 'c' );
	}

	protected function tearDown() {
		\database\connection::get_pdo()->rollBack();
	}

	/**
	 * @var \individual\potato
	 */
	private $fixture;

}
