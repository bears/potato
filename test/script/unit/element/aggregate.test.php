<?php
namespace test\database {

	/**
	 * Test class for \element\aggregate.
	 */
	class aggregate extends \PHPUnit_Framework_TestCase {

		const TEST_CACHE_KEY = 'TEST_CACHE_KEY';

		/**
		 * @covers	\element\aggregate::getIterator
		 */
		public function test_getIterator() {
			$this->assertInstanceOf( '\\aggregate\\test', $this->fixture );
			$count = 0;
			foreach ( $this->fixture as $object ) {
				$this->assertInstanceOf( '\\individual\\test', $object );
				++$count;
			}
			$this->assertEquals( 2, $count );
		}

		/**
		 * @covers	\element\aggregate::cache
		 * @covers	\element\aggregate::fetch
		 */
		public function test_cache_and_fetch() {
			$self = $this; // Work around before PHP 5.4
			$flag = false;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'inexistent cache', $message );
				return $flag = true;
			} );

			$this->assertNull( \aggregate\test::fetch( self::TEST_CACHE_KEY ) );

			$fixture = new \aggregate\dolt();
			\aggregate\dolt::cache( self::TEST_CACHE_KEY, $fixture );
			\aggregate\test::cache( self::TEST_CACHE_KEY, $this->fixture );

			$this->assertNotSame( $fixture, $this->fixture );
			$this->assertSame( $fixture, \aggregate\dolt::fetch( self::TEST_CACHE_KEY ) );
			$this->assertSame( $this->fixture, \aggregate\test::fetch( self::TEST_CACHE_KEY ) );

			$this->assertTrue( $flag );
			restore_error_handler();
		}

		/**
		 * @covers	\element\aggregate::cache
		 */
		public function test_duplicated_cache() {
			$self = $this; // Work around before PHP 5.4
			$flag = 0;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'override cache', $message );
				++$flag;
				return true;
			} );

			$fixture = \aggregate\test::fetch( self::TEST_CACHE_KEY );
			\aggregate\test::cache( self::TEST_CACHE_KEY, $fixture );
			$this->assertNotSame( $fixture, $this->fixture );
			\aggregate\test::cache( self::TEST_CACHE_KEY, $this->fixture );

			$this->assertEquals( 1, $flag );
			restore_error_handler();
		}

		/**
		 * @covers	\element\aggregate::__callStatic
		 */
		public function test__callStatic() {
			$fixture = \aggregate\test::get_side( true );
			$this->assertNotSame( $fixture, $this->fixture );
		}

		public function setUp() {
			self::get_pdo()->beginTransaction();

			$this->fixture = \aggregate\test::get_side( false );
		}

		public function tearDown() {
			self::get_pdo()->rollBack();
		}

		public static function setUpBeforeClass() {
			self::get_pdo()->exec( <<<SQL
-- Table
CREATE TEMPORARY TABLE IF NOT EXISTS "test"
(
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,
	"flag" boolean NOT NULL
);

-- Function
CREATE FUNCTION "test::get_side" (boolean)
RETURNS SETOF "test" AS
$$
	SELECT *
		FROM "test"
		WHERE "flag"=$1
$$
LANGUAGE SQL;

-- Data
INSERT INTO "test" VALUES
	('00000000-0000-0000-0000-000000000001', '0', TRUE),
	('00000000-0000-0000-0000-000000000002', '0', FALSE),
	('00000000-0000-0000-0000-000000000003', '0', TRUE),
	('00000000-0000-0000-0000-000000000004', '0', FALSE),
	('00000000-0000-0000-0000-000000000005', '0', TRUE);
SQL
			);
		}

		public static function tearDownAfterClass() {
			self::get_pdo()->exec( 'DROP TABLE "test" CASCADE' );
		}

		protected static function hard_copy( $origin ) {
			return unserialize( serialize( $origin ) );
		}

		protected static function get_pdo() {
			return \storage\postgres\connector::get_pdo();
		}

		/**
		 * @var \aggregate\test
		 */
		private $fixture;

	}

}
