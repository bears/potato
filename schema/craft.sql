-- Clear
DROP TABLE IF EXISTS "craft" CASCADE;

-- Class
CREATE TABLE "craft" (
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,

	"detail" text NOT NULL,
	"weight" decimal NOT NULL CHECK ("weight" BETWEEN 0.0 AND 1.0),
	"potato" uuid NOT NULL REFERENCES "potato" ("uuid")
);

-- Method
CREATE FUNCTION "craft::weave" (uuid)
RETURNS SETOF "craft" AS $$
	SELECT *
		FROM "craft"
		WHERE "potato"=$1
$$ LANGUAGE SQL;
