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
		$this->fixture = \aggregate\dummy::top5();
		$this->assertInstanceOf( '\aggregate\dummy', $this->fixture );
	}

	/**
	 * @covers	\database\aggregate::getIterator
	 */
	public function test_getIterator() {
		$count = 0;
		foreach ( $this->fixture as $object ) {
			$this->assertInstanceOf( '\individual\dummy', $object );
			++$count;
		}
		$this->assertGreaterThan( 0, $count );
	}

	/**
	 * @covers	\database\aggregate::cache
	 * @covers	\database\aggregate::fetch
	 */
	public function test_cache_and_fetch() {
		$this->assertNull( \database\aggregate::fetch( self::TEST_CACHE_KEY ) );
		\database\aggregate::cache( self::TEST_CACHE_KEY, $this->fixture );
		$fetched = \database\aggregate::fetch( self::TEST_CACHE_KEY );
		$this->assertSame( $this->fixture, $fetched );
	}

	/**
	 * @covers	\database\aggregate::cache
	 *
	 * @expectedException			\exception\conflict_cache
	 * @expectedExceptionMessage	aggregate\dummy#TEST_CACHE_KEY
	 */
	public function test_duplicated_cache() {
		\database\aggregate::cache( self::TEST_CACHE_KEY, $this->fixture );
		\database\aggregate::cache( self::TEST_CACHE_KEY, $this->fixture );
	}

	/**
	 * @var \aggregate\unit
	 */
	private $fixture;

}
