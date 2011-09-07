<?php
namespace test\config;

/**
 * Test class for \config\switcher.
 */
class switcher extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers	\config\switcher::is_on
	 * @covers	\config\switcher::is_off
	 * @covers	\config\switcher::on
	 * @covers	\config\switcher::off
	 */
	public function test_is_on_or_off() {
		$this->assertTrue( \config\switcher::is_on( \config\switcher::DEFAULT_ON ) );
		$this->assertFalse( \config\switcher::is_off( \config\switcher::DEFAULT_ON ) );

		$this->assertFalse( \config\switcher::is_on( \config\switcher::SUPPOSE_ON ) );
		$this->assertTrue( \config\switcher::is_off( \config\switcher::SUPPOSE_ON ) );

		\config\switcher::on( \config\switcher::SUPPOSE_ON );

		$this->assertTrue( \config\switcher::is_on( \config\switcher::SUPPOSE_ON ) );
		$this->assertFalse( \config\switcher::is_off( \config\switcher::SUPPOSE_ON ) );

		\config\switcher::off( \config\switcher::DEFAULT_ON );

		$this->assertFalse( \config\switcher::is_on( \config\switcher::DEFAULT_ON ) );
		$this->assertTrue( \config\switcher::is_off( \config\switcher::DEFAULT_ON ) );

		$this->assertFalse( \config\switcher::is_on( \config\switcher::SUPPOSE_ON ) );
		$this->assertTrue( \config\switcher::is_off( \config\switcher::SUPPOSE_ON ) );

		\config\switcher::off( \config\switcher::SUPPOSE_ON );

		$this->assertFalse( \config\switcher::is_on( \config\switcher::SUPPOSE_ON ) );
		$this->assertTrue( \config\switcher::is_off( \config\switcher::SUPPOSE_ON ) );
	}

}
