<?php
namespace setting;

/*
 * Project/environment settings.
 */

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
 * @name Version
 */
//@{
const MAJOR_VERSION = 0;
const MINOR_VERSION = 0;
const PATCH_VERSION = 0;
//@

/**
 * @name Path
 */
const LOG_PATH = '/var/log/ajaj.bears.home';

/*
 * Also available from client side.
 * E.g. PROFILE_RECLAIM => POTATO.PROFILE.RECLAIM
 */

const PROFILE_RECLAIM = true;
