<?php
namespace test\famulus {

	/**
	 * Test class for \famulus\switcher.
	 */
	class switcher extends \PHPUnit_Framework_TestCase {

		/**
		 * @covers \famulus\switcher::is_on
		 * @covers \famulus\switcher::is_off
		 * @covers \famulus\switcher::on
		 * @covers \famulus\switcher::off
		 */
		public function test_is_on_or_off() {
			$this->assertTrue( \famulus\switcher::is_on( \famulus\switcher::DEFAULT_ON ) );
			$this->assertFalse( \famulus\switcher::is_off( \famulus\switcher::DEFAULT_ON ) );

			$this->assertFalse( \famulus\switcher::is_on( \famulus\switcher::SUPPOSE_ON ) );
			$this->assertTrue( \famulus\switcher::is_off( \famulus\switcher::SUPPOSE_ON ) );

			\famulus\switcher::on( \famulus\switcher::SUPPOSE_ON );

			$this->assertTrue( \famulus\switcher::is_on( \famulus\switcher::SUPPOSE_ON ) );
			$this->assertFalse( \famulus\switcher::is_off( \famulus\switcher::SUPPOSE_ON ) );

			\famulus\switcher::off( \famulus\switcher::DEFAULT_ON );

			$this->assertFalse( \famulus\switcher::is_on( \famulus\switcher::DEFAULT_ON ) );
			$this->assertTrue( \famulus\switcher::is_off( \famulus\switcher::DEFAULT_ON ) );

			$this->assertFalse( \famulus\switcher::is_on( \famulus\switcher::SUPPOSE_ON ) );
			$this->assertTrue( \famulus\switcher::is_off( \famulus\switcher::SUPPOSE_ON ) );

			\famulus\switcher::off( \famulus\switcher::SUPPOSE_ON );

			$this->assertFalse( \famulus\switcher::is_on( \famulus\switcher::SUPPOSE_ON ) );
			$this->assertTrue( \famulus\switcher::is_off( \famulus\switcher::SUPPOSE_ON ) );
		}

	}

}
