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
		$this->assertNull( \aggregate\dummy::fetch( self::TEST_CACHE_KEY ) );
		\aggregate\dummy::cache( self::TEST_CACHE_KEY, $this->fixture );
		$this->assertSame( $this->fixture, \aggregate\dummy::fetch( self::TEST_CACHE_KEY ) );
		$this->assertNotSame( $this->fixture, \aggregate\dolt::fetch( self::TEST_CACHE_KEY ) );
	}

	/**
	 * @covers	\database\aggregate::cache
	 *
	 * @expectedException			\exception\conflict_cache
	 * @expectedExceptionMessage	aggregate\dummy#TEST_CACHE_KEY
	 */
	public function test_duplicated_cache() {
		\aggregate\dummy::cache( self::TEST_CACHE_KEY, $this->fixture );
		\aggregate\dummy::cache( self::TEST_CACHE_KEY, $this->fixture );
	}

	/**
	 * @covers	\database\aggregate::cache
	 *
	 * @expectedException			exception\failed_assert
	 * @expectedExceptionMessage	aggregate\dummy
	 */
	public function test_missmatched_cache() {
		\aggregate\dolt::cache( self::TEST_CACHE_KEY, $this->fixture );
	}

	/**
	 * @var \aggregate\dummy
	 */
	private $fixture;

}
