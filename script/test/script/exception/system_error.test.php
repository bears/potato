<?php
namespace test\exception;

/**
 * Test class for \exception\system_error.
 */
class system_error extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers \exception\system_error::trigger
	 *
	 * @expectedException			\exception\system_error
	 * @expectedExceptionCode		123456
	 * @expectedExceptionMessage	Test Error
	 */
	public function test_trigger() {
		\exception\system_error::trigger( 123456, 'Test Error', __FILE__, __LINE__ );
	}

}
