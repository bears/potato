<?php

/*
 * Entry point of the application.
 */
require_once 'config/config.php';
require_once 'handler/error.php';
require_once 'handler/loader.php';

/**
 * The base class for handling 1st level request.
 */
class subject {

	public function __construct( array &$segments ) {
		$this->segments = $segments;
	}

	/**
	 * Find derived subject to handle request.
	 */
	public static function dispatch() {
		self::cross_domain();

		$segments = explode( '/', $_SERVER['REQUEST_URI'] );
		list($futile, $subject) = array_splice( $segments, 0, 2 );
		assert( "(''=='$futile')&&preg_match('#^\w+$#','$subject')" );

		header( 'Content-Type: application/json' );
		$dispatcher = "\subject\\$subject";
		echo new $dispatcher( $segments );
	}

	/**
	 * Process cross domain request header.
	 */
	private static function cross_domain() {
		$protocol = isset( $_SERVER['HTTPS'] ) && 'off' != $_SERVER['HTTPS'] ? 'https:' : 'http:';
		$accepted = $protocol . \config\MAIN_DOMAIN;
		if ( isset( $_SERVER['HTTP_ORIGIN'] ) && $_SERVER['HTTP_ORIGIN'] == $accepted ) {
			header( "Access-Control-Allow-Origin: $accepted" );
			header( 'Access-Control-Allow-Credentials: true' );
		}
		else {
			throw new \exception\unacceptable_access();
		}
	}

	/**
	 * Request URI splited by /.
	 * @var array(string)
	 */
	protected $segments;

}
// Go
subject::dispatch();
