<?php
namespace config;

/*
 * Database connection settings.
 */

const MAJOR_DATABASE_DSN = <<<'DSN'
pgsql:
	host=localhost;
	port=5432;
	dbname=potato;
	user=potato;
	password=plough
DSN;
