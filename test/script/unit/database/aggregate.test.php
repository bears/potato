<?php
namespace test\database;

/**
 * Test class for \database\aggregate.
 */
class aggregate extends \PHPUnit_Framework_TestCase {

	const TEST_CACHE_KEY = 'TEST_CACHE_KEY';

	/**
	 * @covers	\database\aggregate::__callStatic
	 */
	public function assertPreConditions() {
		$this->fixture = \aggregate\potato::tubers( 'summer', 0 );
		$this->assertInstanceOf( '\\aggregate\\potato', $this->fixture );
	}

	/**
	 * @covers	\database\aggregate::getIterator
	 */
	public function test_getIterator() {
		$count = 0;
		foreach ( $this->fixture as $object ) {
			$this->assertInstanceOf( '\\individual\\potato', $object );
			++$count;
		}
		$this->assertGreaterThan( 0, $count );
	}

	/**
	 * @covers	\database\aggregate::decorate
	 */
	public function test_decorate() {
		$this->assertInstanceOf( '\\decoration\\potato\\tuber\\aggregate', $this->fixture->decorate( 'tuber' ) );
	}

	/**
	 * @covers	\database\aggregate::cache
	 * @covers	\database\aggregate::fetch
	 */
	public function test_cache_and_fetch() {
		$this->assertNull( \aggregate\potato::fetch( self::TEST_CACHE_KEY ) );
		\aggregate\potato::cache( self::TEST_CACHE_KEY, $this->fixture );
		$this->assertSame( $this->fixture, \aggregate\potato::fetch( self::TEST_CACHE_KEY ) );
		$this->assertNotSame( $this->fixture, \aggregate\dolt::fetch( self::TEST_CACHE_KEY ) );
	}

	/**
	 * @covers	\database\aggregate::cache
	 *
	 * @expectedException			\exception\conflict_cache
	 * @expectedExceptionMessage	aggregate\potato#TEST_CACHE_KEY
	 */
	public function test_duplicated_cache() {
		\aggregate\potato::cache( self::TEST_CACHE_KEY, $this->fixture );
		\aggregate\potato::cache( self::TEST_CACHE_KEY, $this->fixture );
	}

	/**
	 * @covers	\database\aggregate::cache
	 *
	 * @expectedException			exception\failed_assertion
	 * @expectedExceptionMessage	aggregate\potato
	 */
	public function test_missmatched_cache() {
		\aggregate\dolt::cache( self::TEST_CACHE_KEY, $this->fixture );
	}

	/**
	 * @var \aggregate\potato
	 */
	private $fixture;

}
