<?php

/*
 * Entry point of the application.
 */
require_once 'setting/profile.php';
require_once 'handler/error.php';
require_once 'handler/loader.php';

/**
 * The base class for handling 1st level request.
 */
class subject {

	const SUB_DOMAIN = 'ajaj.';

	/**
	 * Find derived subject to handle request.
	 */
	public static function dispatch() {
		self::cross_domain();

		@list($rest, $class, $filter, $subject) = explode( '/', trim( $_SERVER['REQUEST_URI'], '/' ) );
		preg_match( '#^[\\w\\$]+$#', $class ) || trigger_error( 'invalid class', E_USER_ERROR );
		$class = str_replace( '$', '\\', $class );
		switch ( $rest ) {
			case 'a':
				list($call, $arguments) = explode( '=', $filter, 2 );
				preg_match( '#^\\w+$#', $call ) || trigger_error( 'invalid method', E_USER_ERROR );
				self::do_rest( "\\aggregate\\$class", "get_$call", explode( ',', $arguments ), $subject );
				break;
			case 'i':
				self::do_rest( "\\individual\\$class", 'select', array( $filter ), $subject );
				break;
			case '!':
				$secondary = "\\subject\\$class";
				exit( new $secondary( $filter, $subject ) );
				break;
			default:
				exit( header( 'Status: 400 Bad Request', true, 400 ) );
				break;
		}
	}

	/**
	 * Process cross domain request header.
	 */
	private static function cross_domain() {
		isset( $_SERVER['HTTP_ORIGIN'] ) || trigger_error( 'unknown origin', E_USER_ERROR );
		$protocol = isset( $_SERVER['HTTPS'] ) && 'off' != $_SERVER['HTTPS'] ? 'https://' : 'http://';
		$accepted = $protocol . str_replace( self::SUB_DOMAIN, '', $_SERVER['SERVER_NAME'] );
		if ( $_SERVER['HTTP_ORIGIN'] == $accepted ) {
			header( "Access-Control-Allow-Origin: $accepted" );
			header( 'Access-Control-Allow-Credentials: true' );
		}
		else {
			trigger_error( 'unacceptable access', E_USER_ERROR );
		}
		header( 'Content-Type: application/json' );
	}

	/**
	 * Process GET/PUT request.
	 * @param string $type
	 * @param string $call
	 * @param array $pass
	 * @param string $subject
	 */
	private static function do_rest( $type, $call, $pass, $subject ) {
		$data = call_user_func_array( array( $type, $call ), $pass );
		preg_match( '#^\w+$#', $subject ) || trigger_error( 'invalid subject', E_USER_ERROR );
		$result = empty( $_POST ) ? $data->decorate( $subject ) : $data->renovate( $subject, new \ArrayIterator( $_POST ) );
		exit( $result );
	}

}

// Go
subject::dispatch();
