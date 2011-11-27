<?php
namespace setting;

/*
 * Error handler settings.
 */

/**
 * @name Path
 */
const LOG_PATH = '/var/log/ajaj.bears.home';

/**
 * @name File mode
 */
const LOG_MODE = 0777;

/*
 * Switch
 */

/**
 * @name Error
 */
//@{
const IS_LOG_ERROR = true; ///< For recoverable error
const IS_LOG_ERROR_DUMP = true;
const IS_LOG_ERROR_RETURN = false;

const IS_LOG_USER_ERROR = true;
const IS_LOG_USER_ERROR_DUMP = true;
const IS_LOG_USER_ERROR_RETURN = false;
//@}

/**
 * @name Warning
 */
//@{
const IS_LOG_WARNING = true;
const IS_LOG_WARNING_DUMP = true;
const IS_LOG_WARNING_RETURN = true;

const IS_LOG_USER_WARNING = true;
const IS_LOG_USER_WARNING_DUMP = true;
const IS_LOG_USER_WARNING_RETURN = true;
//@}

/**
 * @name Notice
 */
//@{
const IS_LOG_NOTICE = true;
const IS_LOG_NOTICE_DUMP = false;
const IS_LOG_NOTICE_RETURN = true;

const IS_LOG_USER_NOTICE = true;
const IS_LOG_USER_NOTICE_DUMP = false;
const IS_LOG_USER_NOTICE_RETURN = true;
//@}

/**
 * @name Deprecated
 */
//@{
const IS_LOG_DEPRECATED = true;
const IS_LOG_DEPRECATED_DUMP = false;
const IS_LOG_DEPRECATED_RETURN = true;

const IS_LOG_USER_DEPRECATED = true;
const IS_LOG_USER_DEPRECATED_DUMP = false;
const IS_LOG_USER_DEPRECATED_RETURN = true;
//@}

/**
 * @name Exception
 */
//@{
const IS_LOG_EXCEPTION = true;
const IS_LOG_EXCEPTION_DUMP = true;
const IS_LOG_EXCEPTION_RETURN = false;
//@}
