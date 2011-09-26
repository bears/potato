<?php
namespace setting;

/*
 * Setup assert behavior.
 */

error_reporting( E_ALL | E_STRICT );

assert_options( ASSERT_ACTIVE, 1 );
assert_options( ASSERT_WARNING, 0 );
assert_options( ASSERT_BAIL, 0 );
assert_options( ASSERT_QUIET_EVAL, 0 );
assert_options( ASSERT_CALLBACK, array( 'exception\\failed_assertion', 'callback' ) );
