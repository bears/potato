<?php
namespace test\exception;

/**
 * Test class for \exception\failed_assertion.
 */
class failed_assertion extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\exception\failed_assertion::callback
	 *
	 * @expectedException			\exception\failed_assertion
	 * @expectedExceptionMessage	Test Assertion
	 */
	public function test_callback() {
		\exception\failed_assertion::callback( __FILE__, __LINE__, 'Test Assertion' );
	}

}
