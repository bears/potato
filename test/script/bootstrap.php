<?php
namespace test;

/**
 * Setup include/load path for unit test.
 */
chdir( dirname( __FILE__ ) . '/../../script' );
require_once 'setting/setting.php';
require_once 'handler/error.php';
require_once 'handler/loader.php';
