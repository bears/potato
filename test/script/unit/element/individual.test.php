<?php
namespace test\element {

	/**
	 * Test class for \element\individual.
	 */
	class individual extends \PHPUnit_Framework_TestCase {

		const UUID_FORMAT = '#^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$#i';
		const UUID_PRIMITIVE = '00000000-0000-0000-0000-000000000000';

		/**
		 * Sets up the environment.
		 */
		public static function setUpBeforeClass() {
			self::get_pdo()->exec( <<<SQL
-- Table
CREATE TEMPORARY TABLE IF NOT EXISTS "test"
(
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,
	"test" text NOT NULL
);

-- Data
INSERT INTO "test" VALUES
	('00000000-0000-0000-0000-000000000000', '0', 'hello');
SQL
			);
		}

		/**
		 * Reset the environment.
		 */
		public static function tearDownAfterClass() {
			self::get_pdo()->exec( 'DROP TABLE "test" CASCADE' );
		}

		/**
		 * @var \individual\test
		 */
		private $fixture;

		/**
		 * Sets up the fixture.
		 */
		protected function setUp() {
			self::get_pdo()->beginTransaction();

			$this->fixture = new \individual\test();
			$this->fixture->test = uniqid( __CLASS__ );
		}

		/**
		 * Reset the fixture.
		 */
		protected function tearDown() {
			self::get_pdo()->rollBack();
		}

		/**
		 * @covers \element\individual::save
		 */
		public function assertPreConditions() {
			$this->assertNull( $this->fixture->uuid() );
			$this->assertNull( $this->fixture->lock() );
			$this->fixture->save();
			$this->assertNotNull( $this->fixture->uuid() );
			$this->assertNotNull( $this->fixture->lock() );
		}

		/**
		 * @covers \element\individual::__clone
		 */
		public function test__clone() {
			$another = clone $this->fixture;
			$this->assertNull( $another->uuid() );
			$this->assertNull( $another->lock() );
		}

		/**
		 * @covers \element\individual::uuid
		 */
		public function test_uuid() {
			$uuid = $this->fixture->uuid();
			$this->fixture->save();
			$this->assertSame( $uuid, $this->fixture->uuid() );
			$this->assertSame( 1, preg_match( self::UUID_FORMAT, $uuid ) );
		}

		/**
		 * @covers \element\individual::lock
		 */
		public function test_lock() {
			$lock = $this->fixture->lock();
			$this->fixture->save();
			$this->assertGreaterThan( $lock, $this->fixture->lock() );
		}

		/**
		 * @covers \element\individual::save
		 */
		public function test_expired_save() {
			$self = $this; // Work around before PHP 5.4
			$flag = false;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'updating failed', $message );
				return $flag = true;
			} );

			$copy = self::full_copy( $this->fixture );
			$copy->test = uniqid( __CLASS__ );
			$copy->save();
			$this->fixture->save();

			$this->assertTrue( $flag );
			restore_error_handler();
		}

		/**
		 * @covers \element\individual::delete
		 */
		public function test_delete() {
			$this->fixture->delete();
			$this->assertNull( $this->fixture->uuid() );
			$this->assertNull( $this->fixture->lock() );
		}

		/**
		 * @covers \element\individual::delete
		 */
		public function test_expired_delete() {
			$self = $this; // Work around before PHP 5.4
			$flag = false;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'deleting failed', $message );
				return $flag = true;
			} );

			$copy = self::full_copy( $this->fixture );
			$this->fixture->delete();
			$copy->delete();

			$this->assertTrue( $flag );
			restore_error_handler();
		}

		/**
		 * @covers \element\individual::select
		 */
		public function test_select() {
			$fetched = \individual\test::select( $this->fixture->uuid() );
			$this->assertSame( $this->fixture, $fetched );

			$another = \individual\test::select( self::UUID_PRIMITIVE );
			$this->assertInstanceOf( '\\individual\\test', $another );
			$this->assertNotSame( $this->fixture, $another );
		}

		/**
		 * @covers \element\individual::select
		 */
		public function test_missed_select() {
			$extirpate = str_replace( '0', 'F', self::UUID_PRIMITIVE );
			$this->assertFalse( \individual\test::select( $extirpate ) );
		}

		/**
		 * @covers \element\individual::cache
		 */
		public function test_cache() {
			$uuid = $this->fixture->uuid();
			$this->assertSame( $this->fixture, \individual\test::select( $uuid ) );

			$copy = self::full_copy( $this->fixture );
			$this->fixture->delete();
			$this->assertFalse( \individual\test::select( $uuid ) );

			\individual\test::cache( $copy );
			$this->assertSame( $copy, \individual\test::select( $uuid ) );
		}

		/**
		 * @covers \element\individual::cache
		 */
		public function test_expired_cache() {
			$self = $this; // Work around before PHP 5.4
			$flag = false;
			set_error_handler( function ($code, $message, $file, $line, $context) use($self, &$flag) {
				$self->assertSame( 'cache expired', $message );
				return $flag = true;
			} );

			$copy = self::full_copy( $this->fixture );
			$this->fixture->save();
			\individual\test::cache( $copy );

			$this->assertTrue( $flag );
			restore_error_handler();
		}

		protected static function full_copy( $origin ) {
			return unserialize( serialize( $origin ) );
		}

		protected static function get_pdo() {
			return \storage\postgres\connector::get_pdo();
		}

	}

}
