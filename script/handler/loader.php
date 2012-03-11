<?php
namespace handler;

/**
 * Set default class loader.
 */
spl_autoload_register( function ($name) {
	$file = str_replace( '\\', DIRECTORY_SEPARATOR, $name ) . '.class.php';
	if ( is_readable( $file ) ) {
		return require_once $file;
	}

	// Cannot find the file, try to dynamically generate.
	if ( preg_match( '#^(?P<space>(?P<label>\\w+)(?:\\\\\\w+)*)\\\\(?P<class>\\w+)$#', $name, $match ) ) {
		$space = $match['space'];
		$label = $match['label'];
		$class = $match['class'];
		switch ( $label ) {
			case 'aggregate':
			case 'individual':
				return eval( "namespace $space; class $class extends \\element\\$label {}" );
			case 'decoration':
				if ( 'aggregate' === $class ) {
					return eval( "namespace $space; class aggregate extends \\decoration\\aggregate {}" );
				}
				else {
					trigger_error( 'invalid decoration name', E_USER_ERROR );
				}
			case 'renovation':
				if ( '_' === $class ) {
					return eval( "namespace $space; class _ extends \\renovation\\chaos {}" );
				}
				else {
					trigger_error( 'invalid renovation name', E_USER_ERROR );
				}
		}
	}
} );
