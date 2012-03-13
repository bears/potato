<?php
namespace setting;

/**
 * Settings of error log.
 */
class log {

	/**
	 * Get the triple switches of a $type.
	 * @param string $type
	 * @return array
	 */
	public static function get_triple( $type ) {
		if ( !isset( self::$known_types[$type] ) ) {
			$type = 'UNKNOWN';
		}
		return array(
			constant( "self::TO_LOG_{$type}" ),
			constant( "self::TO_DUMP_{$type}" ),
			constant( "self::TO_RETURN_{$type}" ),
		);
	}

	/**
	 * Path root
	 */
	const PATH = '/var/log/ajaj.bears.home';

	/**
	 * File mode
	 */
	const MODE = 0777;

	/**
	 *  E_ERROR = 1
	 */
	const TO_LOG_1 = true;
	const TO_DUMP_1 = true;
	const TO_RETURN_1 = false;

	/**
	 * E_WARNING = 2
	 */
	const TO_LOG_2 = true;
	const TO_DUMP_2 = true;
	const TO_RETURN_2 = true;

	/**
	 * E_NOTICE = 8
	 */
	const TO_LOG_8 = true;
	const TO_DUMP_8 = false;
	const TO_RETURN_8 = true;

	/**
	 * E_USER_ERROR = 256
	 */
	const TO_LOG_256 = true;
	const TO_DUMP_256 = true;
	const TO_RETURN_256 = false;

	/**
	 * E_USER_WARNING = 512
	 */
	const TO_LOG_512 = true;
	const TO_DUMP_512 = true;
	const TO_RETURN_512 = true;

	/**
	 * E_USER_NOTICE = 1024
	 */
	const TO_LOG_1024 = true;
	const TO_DUMP_1024 = false;
	const TO_RETURN_1024 = true;

	/**
	 * E_STRICT = 2048
	 */
	const TO_LOG_2048 = true;
	const TO_DUMP_2048 = false;
	const TO_RETURN_2048 = true;

	/**
	 * E_RECOVERABLE_ERROR = 4096
	 */
	const TO_LOG_4096 = true;
	const TO_DUMP_4096 = true;
	const TO_RETURN_4096 = false;

	/**
	 * E_DEPRECATED = 8192
	 */
	const TO_LOG_8192 = true;
	const TO_DUMP_8192 = false;
	const TO_RETURN_8192 = true;

	/**
	 * E_USER_DEPRECATED = 16384
	 */
	const TO_LOG_16384 = true;
	const TO_DUMP_16384 = false;
	const TO_RETURN_16384 = true;

	/**
	 * Exception
	 */
	const TO_LOG_EXCEPTION = true;
	const TO_DUMP_EXCEPTION = true;
	const TO_RETURN_EXCEPTION = false;

	/**
	 * Unknown
	 */
	const TO_LOG_UNKNOWN = true;
	const TO_DUMP_UNKNOWN = true;
	const TO_RETURN_UNKNOWN = false;

	/**
	 * Types have TO_LOG_*
	 */
	private static $known_types = array(
		E_ERROR => true,
		E_WARNING => true,
		/* E_PARSE */
		E_NOTICE => true,
		/* E_CORE_ERROR */
		/* E_CORE_WARNING */
		/* E_COMPILE_ERROR */
		/* E_COMPILE_WARNING */
		E_USER_ERROR => true,
		E_USER_WARNING => true,
		E_USER_NOTICE => true,
		E_STRICT => true,
		E_RECOVERABLE_ERROR => true,
		E_DEPRECATED => true,
		E_USER_DEPRECATED => true,
		'EXCEPTION' => true,
	);

}
