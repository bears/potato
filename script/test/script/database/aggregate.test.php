<?php
namespace test\database;

/**
 * Test class for \database\aggregate.
 */
class aggregate extends \PHPUnit_Framework_TestCase {
	const TEST_CACHE_KEY = 'TEST_CACHE_KEY';

	/**
	 * @covers \database\aggregate::cache
	 * @covers \database\aggregate::fetch
	 */
	public function test_cache_and_fetch() {
		$test1 = new \aggregate\unittest();
		$this->assertInstanceOf( '\database\aggregate', $test1 );

		$this->assertNull( \database\aggregate::fetch( self::TEST_CACHE_KEY ) );
		\database\aggregate::cache( self::TEST_CACHE_KEY, $test1 );
		$test2 = \database\aggregate::fetch( self::TEST_CACHE_KEY );
		$this->assertSame( $test1, $test2 );
	}

	/**
	 * @covers \database\aggregate::cache
	 *
	 * @expectedException			\exception\conflict_cache
	 * @expectedExceptionMessage	aggregate\unittest#TEST_CACHE_KEY
	 */
	public function test_duplicated_cache() {
		$test1 = new \aggregate\unittest();
		\database\aggregate::cache( self::TEST_CACHE_KEY, $test1 );
		\database\aggregate::cache( self::TEST_CACHE_KEY, $test1 );
	}

	/**
	 * @covers \database\aggregate::__callStatic
	 * @todo Implement test__callStatic().
	 */
	public function test__callStatic() {
		// Remove the following lines when you implement this test.
		$this->markTestIncomplete(
		'This test has not been implemented yet.'
		);
	}

	/**
	 * @covers	\database\aggregate::getIterator
	 * @depends	test__callStatic
	 * @todo Implement testGetIterator().
	 */
	public function testGetIterator() {
		// Remove the following lines when you implement this test.
		$this->markTestIncomplete(
		'This test has not been implemented yet.'
		);
	}

}
