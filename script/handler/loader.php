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
				return eval( "namespace $space; class $class extends \\database\\$domain {}" );
			case 'decoration':
			case 'renovation':
				assert( "'aggregate'=='$class'" );
				return eval( "namespace $space; class aggregate extends \\$domain\\aggregate {}" );
			case 'ab':
				return eval( "namespace $space; class $class extends \\famulus\\ab {}" );
		}
	}
} );
