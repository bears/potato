-- Clear
DROP TABLE IF EXISTS "dummy" CASCADE;

-- Class
CREATE TABLE "dummy" (
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,

	"b" boolean NOT NULL,
	"i" integer NOT NULL,
	"t" timestamp NOT NULL,
	"s" varchar(50) NOT NULL
);

-- Method
CREATE FUNCTION "dummy::top5" ()
RETURNS SETOF "dummy" AS $$
	SELECT *
		FROM "dummy"
		ORDER BY lock DESC
		LIMIT 5
$$ LANGUAGE SQL;
