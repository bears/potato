<?php
namespace setting;

/*
 * Project/environment settings.
 */

const SETTING_FILE_PATH = __FILE__;

/*
 * Only available from server side.
 */

/**
 * @name Domain
 */
//@{
const MAIN_DOMAIN = '//potato.bears.home';
const AJAJ_DOMAIN = '//ajaj.bears.home';
//@}

/**
 * Assert behavior.
 */
//@{
error_reporting( E_ALL | E_STRICT );
assert_options( ASSERT_ACTIVE, 1 );
assert_options( ASSERT_BAIL, 1 );
//@}

/**
 * @name Switch
 */
const IS_LOG_AB_MISMATCH = true;

/*
 * Also available from client side.
 * E.g. PROFILE_RECLAIM => POTATO.PROFILE.RECLAIM
 */

const PROFILE_RECLAIM = true;
