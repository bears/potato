-- Clear
DROP TABLE IF EXISTS "chip" CASCADE;

-- Class
CREATE TABLE "chip" (
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,

	"detail" text NOT NULL,
	"potato" uuid NOT NULL REFERENCES "potato" ("uuid")
);

-- Method
CREATE FUNCTION "chip::get_fries" (uuid, integer)
RETURNS SETOF "chip" AS $$
	SELECT *
		FROM "chip"
		WHERE "potato"=$1
		LIMIT 20
		OFFSET $2
$$ LANGUAGE SQL;
