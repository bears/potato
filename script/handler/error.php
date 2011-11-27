<?php
namespace handler;

require_once 'setting/log.php';

/**
 * Write error message to log file.
 * @param string $type
 * @param integer $code
 * @param string $message
 * @param string $file
 * @param integer $line
 * @param array $context
 * @param array $trace
 * @return boolean
 */
function log_error( $type, $code, $message, $file, $line, &$context, &$trace ) {
	$uuid = uniqid();
	if ( constant( "\\setting\\IS_LOG_{$type}" ) ) {
		$path = \setting\LOG_PATH . date( '/o/m/d' );
		is_dir( $path ) || mkdir( $path, \setting\LOG_MODE, true );

		$log = date( 'c' ) . " [$type #$uuid] $file($line): $message";
		error_log( "$log\n", 3, "$path/error.log" );

		if ( constant( "\\setting\\IS_LOG_{$type}_DUMP" ) ) {
			$dump = json_encode( array( 'log' => $log, 'env' => $context, 'trace' => $trace ) );
			error_log( $dump, 3, "/$path/$uuid.dump" );
		}
	}
	return constant( "\\setting\\IS_LOG_{$type}_RETURN" ) || die( header( "X-Error: $code-$uuid", true, 500 ) );
}

/**
 * Set default error callback.
 */
set_error_handler( function ($code, $message, $file, $line, $context) {
	switch ( $code ) {
		case E_USER_ERROR:
			$is_user = true;
		case E_RECOVERABLE_ERROR:
			$key = 'ERROR';
			break;

		case E_USER_WARNING:
			$is_user = true;
		case E_WARNING:
			$key = 'WARNING';
			break;

		case E_USER_NOTICE:
			$is_user = true;
		case E_NOTICE:
			$key = 'NOTICE';
			break;

		case E_USER_DEPRECATED:
			$is_user = true;
		case E_DEPRECATED:
			$key = 'DEPRECATED';
			break;
	}

	$type = (isset( $is_user ) ? 'USER_' : '') . $key;
	if ( constant( "\\setting\\IS_LOG_{$type}_DUMP" ) ) {
		$trace = debug_backtrace();
		array_unshift( $trace );
	}
	return log_error( $type, $code, $message, $file, $line, $context, $trace );
} );

/**
 * Set default exception callback.
 */
set_exception_handler( function ($exception) {
	$type = 'EXCEPTION';
	$code = $exception->getCode();
	$message = $exception->getMessage();
	$file = $exception->getFile();
	$line = $exception->getLine();
	$context = 'UNKNOWN';
	if ( constant( "\\setting\\IS_LOG_{$type}_DUMP" ) ) {
		$trace = $exception->getTrace();
	}
	return log_error( $type, $code, $message, $file, $line, $context, $trace );
} );
