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
 * @name Path
 */
const LOG_PATH = '/var/log/ajaj.bears.home';

/**
 * @name Switch
 */
const IS_LOG_AB_USE = true;

/*
 * Also available from client side.
 * E.g. PROFILE_RECLAIM => POTATO.PROFILE.RECLAIM
 */

const PROFILE_RECLAIM = true;
