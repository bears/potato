<?php
namespace handler;

/**
 * Set default class loader.
 */
spl_autoload_register( function ($name) {
	$file = str_replace( '\\', DIRECTORY_SEPARATOR, $name ) . '.class.php';
	if ( file_exists( $file ) ) {
		return require_once $file;
	}

	// Cannot find the file, try to dynamically generate.
	if ( preg_match( '#^(?P<space>(?P<domain>\\w+)(?:\\\\\\w+)*)\\\\(?P<class>\\w+)$#', $name, $match ) ) {
		extract( $match );
		switch ( $domain ) {
			case 'aggregate':
			case 'individual':
				return eval( "namespace $space; class $class extends \\element\\$domain {}" );
			case 'decoration':
				( 'aggregate' == $class ) || trigger_error( 'invalid decoration name', E_USER_ERROR );
				return eval( "namespace $space; class aggregate extends \\decoration\\aggregate {}" );
			case 'renovation':
				( '_' == $class ) || trigger_error( 'invalid renovation name', E_USER_ERROR );
				return eval( "namespace $space; class _ extends \\renovation\\chaos {}" );
		}
	}
} );
