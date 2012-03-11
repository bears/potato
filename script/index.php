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
		header( 'Content-Type: application/json' );

		$segments = explode( '/', trim( $_SERVER['REQUEST_URI'], '/' ) );
		list($rest, $class, $filter, $subject) = array_pad( $segments, 4, null );
		if ( preg_match( '#^[\\w\\$]+$#', $class ) ) {
			$class = str_replace( '$', '\\', $class );
		}
		else {
			trigger_error( 'invalid class', E_USER_ERROR );
		}
		$addition = json_decode( file_get_contents( 'php://input' ) );

		switch ( $rest ) {
			case 'a':
				list($call, $arguments) = explode( '=', $filter, 2 );
				if ( !preg_match( '#^\\w+$#', $call ) ) {
					trigger_error( 'invalid method', E_USER_ERROR );
				}
				$fetch = array( "\\aggregate\\$class", "get_$call" );
				$filter = explode( ',', $arguments );
				self::do_rest( $fetch, $filter, $subject, $addition );
				break;
			case 'i':
				$fetch = array( "\\individual\\$class", 'select' );
				$filter = array( $filter );
				self::do_rest( $fetch, $filter, $subject, $addition );
				break;
			case '!':
				$secondary = "\\subject\\$class";
				exit( new $secondary( $addition ) );
				break;
			default:
				exit( header( 'Status: 400 Bad Request', true, 400 ) );
				break;
		}
	}

	/**
	 * Process GET/PUT request.
	 * @param array $fetch
	 * @param array $filter
	 * @param string $subject
	 * @param stdClass $addition
	 */
	private static function do_rest( array &$fetch, array &$filter, $subject, $addition ) {
		if ( !preg_match( '#^\w+$#', $subject ) ) {
			trigger_error( 'invalid subject', E_USER_ERROR );
		}
		$element = call_user_func_array( $fetch, $filter );
		if ( null === $addition ) {
			$assistant = $element->decorate( $subject );
		}
		else {
			$assistant = $element->renovate( $subject );
			$assistant->initialize( $addition );
		}
		exit( $assistant );
	}

}

// Go
subject::dispatch();
