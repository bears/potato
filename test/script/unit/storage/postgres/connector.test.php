<?php
namespace test\storage\postgres {

	/**
	 * For testing fetch mode.
	 */
	class vessel {

	}

	/**
	 * Test class for \storage\postgres\connector.
	 */
	class connector extends \PHPUnit_Framework_TestCase {

		/**
		 * @covers \storage\postgres\connector::get_pdo
		 */
		public function test_get_pdo() {
			$pdo = \storage\postgres\connector::get_pdo();
			$this->assertInstanceof( '\\PDO', $pdo );

			$query = $pdo->query( 'SELECT version() AS ver' );
			$this->assertInstanceof( '\\PDOStatement', $query );

			$version = $query->fetchAll( \PDO::FETCH_ASSOC );
			$this->assertArrayHasKey( 0, $version );
			$this->assertArrayHasKey( 'ver', $version[0] );
		}

		/**
		 * @covers \storage\postgres\connector::get_query
		 */
		public function test_get_query() {
			$query = \storage\postgres\connector::get_query( __METHOD__, function() {
				return 'SELECT version() AS test';
			}, array( \PDO::FETCH_CLASS, '\test\storage\postgres\vessel' ) );
			$duplicate = \storage\postgres\connector::get_query( __METHOD__, null );
			$this->assertSame( $query, $duplicate );

			$this->assertTrue( $query->execute() );

			$data = $query->fetch();
			$this->assertInstanceOf( '\test\storage\postgres\vessel', $data );
			$this->assertObjectHasAttribute( 'test', $data );

			$query->closeCursor();
		}

		/**
		 * @covers \storage\postgres\connector::get_pdo_type
		 */
		public function test_get_pdo_type() {
			$target = \storage\postgres\connector::get_pdo_type( gettype( true ) );
			$this->assertEquals( \PDO::PARAM_BOOL, $target );

			$target = \storage\postgres\connector::get_pdo_type( gettype( 2 ) );
			$this->assertEquals( \PDO::PARAM_INT, $target );

			$target = \storage\postgres\connector::get_pdo_type( gettype( null ) );
			$this->assertEquals( \PDO::PARAM_NULL, $target );

			$target = \storage\postgres\connector::get_pdo_type( gettype( 'x' ) );
			$this->assertEquals( \PDO::PARAM_STR, $target );
			$target = \storage\postgres\connector::get_pdo_type( gettype( 3.14 ) );
			$this->assertEquals( \PDO::PARAM_STR, $target );
		}

		/**
		 * @covers \storage\postgres\connector::get_pdo_type
		 */
		public function test_get_invalid_pdo_type() {
			$self = $this; // Work around before PHP 5.4
			$flag = false;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'invalid SQL argument', $message );
				return $flag = true;
			} );

			$target = \storage\postgres\connector::get_pdo_type( gettype( array( ) ) );

			$this->assertTrue( $flag );
			restore_error_handler();
		}

		/**
		 * @covers \storage\postgres\connector::set_labeled_input
		 */
		public function test_set_labeled_input() {
			$query = \storage\postgres\connector::get_query( __METHOD__, function() {
				return "SELECT :a || :b AS test";
			}, array( \PDO::FETCH_CLASS, '\test\storage\postgres\vessel' ) );

			$input = array( ':a' => 'abc', ':b' => 123 );
			\storage\postgres\connector::set_labeled_input( $query, $input );
			$this->assertTrue( $query->execute() );
			$this->assertEquals( 'abc123', $query->fetch()->test );
			$query->closeCursor();
		}

		/**
		 * @covers \storage\postgres\connector::set_indexed_input
		 */
		public function test_set_indexed_input() {
			$query = \storage\postgres\connector::get_query( __METHOD__, function() {
				return "SELECT ? || ? AS test";
			}, array( \PDO::FETCH_CLASS, '\test\storage\postgres\vessel' ) );

			$input = array( 'def', 456 );
			\storage\postgres\connector::set_indexed_input( $query, $input );
			$this->assertTrue( $query->execute() );
			$this->assertEquals( 'def456', $query->fetch()->test );
			$query->closeCursor();
		}

	}

}
