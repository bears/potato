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
		@list($rest, $class, $filter, $subject) = explode( '/', trim( $_SERVER['REQUEST_URI'], '/' ) );
		preg_match( '#^[\\w\\$]+$#', $class ) ? ($class = str_replace( '$', '\\', $class )) : trigger_error( 'invalid class', E_USER_ERROR );
		$post = json_decode( file_get_contents( 'php://input' ) );
		header( 'Content-Type: application/json' );
		switch ( $rest ) {
			case 'a':
				list($call, $arguments) = explode( '=', $filter, 2 );
				preg_match( '#^\\w+$#', $call ) || trigger_error( 'invalid method', E_USER_ERROR );
				self::do_rest( "\\aggregate\\$class", "get_$call", explode( ',', $arguments ), $subject, $post );
				break;
			case 'i':
				self::do_rest( "\\individual\\$class", 'select', array( $filter ), $subject, $post );
				break;
			case '!':
				$secondary = "\\subject\\$class";
				exit( new $secondary( $post ) );
				break;
			default:
				exit( header( 'Status: 400 Bad Request', true, 400 ) );
				break;
		}
	}

	/**
	 * Process GET/PUT request.
	 * @param string $type
	 * @param string $call
	 * @param array $pass
	 * @param string $subject
	 * @param stdClass $post
	 */
	private static function do_rest( $type, $call, $pass, $subject, $post ) {
		$data = call_user_func_array( array( $type, $call ), $pass );
		preg_match( '#^\w+$#', $subject ) || trigger_error( 'invalid subject', E_USER_ERROR );
		if ( null === $post ) {
			$assistant = $data->decorate( $subject );
		}
		else {
			$assistant = $data->renovate( $subject );
			$assistant->initialize( $post );
		}
		exit( $assistant );
	}

}

// Go
subject::dispatch();
