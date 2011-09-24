<?php
namespace test\exception;

/**
 * Test class for \exception\failed_assert.
 */
class failed_assert extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\exception\failed_assert::callback
	 *
	 * @expectedException			\exception\failed_assert
	 * @expectedExceptionMessage	Test Assert
	 */
	public function test_callback() {
		\exception\failed_assert::callback( __FILE__, __LINE__, 'Test Assert' );
	}

}
