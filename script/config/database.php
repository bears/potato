<?php
namespace config;

/**
 * Database connection settings.
 */
const RUNTIME_DATABASE_DSN = <<<'DSN'
pgsql:
	host=localhost;
	port=5432;
	dbname=potato;
	user=potato;
	password=plough
DSN;
