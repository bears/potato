<?php
namespace handler;

require_once 'setting/log.php';

/**
 * Write error message to log file.
 * @param boolean $isException
 * @param integer $code
 * @param string $message
 * @param string $file
 * @param integer $line
 * @param array $extra
 * @return boolean
 */
function log_error( $isException, $code, $message, $file, $line, &$extra ) {
	$uuid = uniqid();
	$type = $isException ? 'EXCEPTION' : $code;
	list($toLog, $toDump, $toReturn) = \setting\log::get_triple( $type );

	if ( $toLog ) {
		$path = \setting\log::PATH . date( '/o/m/d' );
		if ( (is_dir( $path ) || mkdir( $path, \setting\log::MODE, true )) && is_writable( $path ) ) {
			$log = date( 'c' ) . " [$type #$uuid] $file($line): $message";
			error_log( $log . PHP_EOL, 3, "$path/error.log" );
			if ( $toDump ) {
				$dump = array( 'log' => $log );
				if ( $isException ) {
					$dump['trace'] = $extra;
				}
				else {
					$trace = debug_backtrace();
					array_shift( $trace );
					$dump['trace'] = $trace;
					$dump['env'] = $extra;
				}
				error_log( json_encode( $dump ), 3, "$path/$uuid.dump" );
			}
		}
	}

	return $toReturn || die( header( "X-Error: $code-$uuid", true, 500 ) );
}

/**
 * Set default error callback.
 */
set_error_handler( function ($code, $message, $file, $line, $context) {
	return log_error( false, $code, $message, $file, $line, $context );
} );

/**
 * Set default exception callback.
 */
set_exception_handler( function ($e) {
	return log_error( true, $e->getCode(), $e->getMessage(), $e->getFile(), $e->getLine(), $e->getTrace() );
} );

/**
 * Set shutdown callback for fatal error.
 */
register_shutdown_function( function () {
	$e = error_get_last();
	if ( null !== $e ) {
		log_error( false, $e['code'], $e['message'], $e['file'], $e['line'] );
	}
} );