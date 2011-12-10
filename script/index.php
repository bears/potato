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

	/**
	 * Find derived subject to handle request.
	 */
	public static function dispatch() {
		self::cross_domain();

		@list($rest, $class, $filter, $subject) = explode( '/', trim( $_SERVER['REQUEST_URI'], '/' ) );
		preg_match( '#^[\\w\\$]+$#', $class ) ? ($class = str_replace( '$', '\\', $class )) : trigger_error( 'invalid class', E_USER_ERROR );
		switch ( $rest ) {
			case 'a':
				$type = "\\aggregate\\$class";
				list($call, $arguments) = explode( '=', $filter, 2 );
				preg_match( '#^\\w+$#', $call ) ? ($call = "get_$call") : trigger_error( 'invalid method', E_USER_ERROR );
				$pass = explode( ',', $arguments );
				self::get_put( $type, $call, $pass, $subject );
				break;
			case 'i':
				$type = "\\individual\\$class";
				$call = 'select';
				$pass = array( $filter );
				self::get_put( $type, $call, $pass, $subject );
				break;
			case '!':
				$dispatcher = "\\subject\\$class";
				exit( new $dispatcher( $filter, $subject ) );
				break;
			default:
				exit( header( 'Status: 400 Bad Request', true, 400 ) );
				break;
		}
	}

	/**
	 * Get abbreviation for derived class.
	 * @return \famulus\ab
	 */
	protected static function ab() {
		$class = 'ab\\' . get_called_class();
		return $class::instance();
	}

	/**
	 * Process cross domain request header.
	 */
	private static function cross_domain() {
		$protocol = isset( $_SERVER['HTTPS'] ) && 'off' != $_SERVER['HTTPS'] ? 'https:' : 'http:';
		$accepted = $protocol . \setting\MAIN_DOMAIN;
		if ( isset( $_SERVER['HTTP_ORIGIN'] ) && $_SERVER['HTTP_ORIGIN'] == $accepted ) {
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
	private static function get_put( $type, $call, $pass, $subject ) {
		$data = call_user_func_array( array( $type, $call ), $pass );
		if ( empty( $_POST ) ) {
			preg_match( '#^\w+$#', $subject ) ? ($result = $data->decorate( $subject )) : trigger_error( 'invalid subject', E_USER_ERROR );
		}
		else {
			$update = $_POST;
			settype( $update, 'object' );
			$result = $data->renovate( $update );
		}
		exit( $result );
	}

}

// Go
subject::dispatch();
