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

	/**
	 * Find derived subject to handle request.
	 */
	public static function dispatch() {
		$protocol = isset($_SERVER['HTTPS']) && 'off' != $_SERVER['HTTPS'] ? 'https:' : 'http:';
		$segments = explode( '/', $_SERVER['REQUEST_URI'] );
		list($futile, $subject) = array_splice( $segments, 0, 2 );
		assert( "(''=='$futile')&&preg_match('#^\w+$#','$subject')" );

		header( "Access-Control-Allow-Origin: $protocol" . \config\PROFILE_MAIN_DOMAIN );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Content-Type: application/x-javascript' );
		$dispatcher = "\subject\\$subject";
		echo new $dispatcher( $segments );
	}

	public function __construct( array &$segments ) {
		$this->segments = $segments;
	}

	/**
	 * Request URI splited by /.
	 * @var array(string)
	 */
	protected $segments;

}

// Go
subject::dispatch();
