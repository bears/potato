<?php
namespace setting;

/*
 * Database connection settings.
 */

return <<<'DSN'
pgsql:
	host=127.0.0.1;
	port=5432;
	dbname=potato;
	user=potato;
	password=plough
DSN;
