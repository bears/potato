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
		assert( "(''=='$futile')&&preg_match('#^\\w+$#','$subject')" );

		header( 'Content-Type: application/json' );
		$dispatcher = "\\subject\\$subject";
		echo new $dispatcher( $segments );
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
	}

	/**
	 * Request URI splited by /.
	 * @var array(string)
	 */
	protected $segments;

}

// Go
subject::dispatch();
