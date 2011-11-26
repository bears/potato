<?php
namespace handler;

require_once 'setting/log.php';

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
	if ( constant( "\\setting\\IS_LOG_{$type}" ) ) {
		$uuid = uniqid();
		$path = \setting\LOG_PATH . date( '/o/m/d' );
		mkdir( $path, \setting\LOG_MODE, true );

		$log = date( 'c' ) . " [$type #$uuid] $file($line): $message\n";
		error_log( $log, 3, "$path/error.log" );

		if ( constant( "\\setting\\IS_LOG_{$type}_DUMP" ) ) {
			$dump = json_encode( array( 'log' => $log, 'env' => $context, 'stk' => debug_backtrace() ) );
			error_log( $dump, 3, "/$path/$uuid.dump" );
		}
	}
	return constant( "\\setting\\IS_LOG_{$type}_RETURN" ) || die( $code );
} );

/**
 * Set default exception callback.
 */
set_exception_handler( function ($exception) {
	error_log( $exception, 4 );
} );
