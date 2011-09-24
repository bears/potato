<?php
namespace test\database;

/**
 * Test class for \database\connection.
 */
class connection extends \PHPUnit_Framework_TestCase {

	/**
	 * @covers \database\connection::get_pdo
	 */
	public function test_get_pdo() {
		$instance1 = \database\connection::get_pdo();
		$this->assertInstanceOf( '\PDO', $instance1 );

		$instance2 = \database\connection::get_pdo();
		$this->assertInstanceOf( '\PDO', $instance2 );

		$this->assertSame( $instance1, $instance2 );
	}

}
