-- Clear
DROP TABLE IF EXISTS "potato" CASCADE;

-- Class
CREATE TABLE "potato" (
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,

	"brand" integer NOT NULL,
	"label" text NOT NULL,
	"craft" text NOT NULL,
	"season" season NOT NULL,
	"weight" decimal NOT NULL CHECK ("weight" BETWEEN 0.0 AND 1.0),
	"variety" text NOT NULL,
	"seeding" timestamp NOT NULL,
	"harvest" timestamp
);

-- Method
CREATE FUNCTION "potato::get_tubers" ("season", integer)
RETURNS SETOF "potato:tuber" AS $$
	SELECT "uuid", "lock", "brand", "label"
		FROM "potato"
		WHERE "season"=$1
		LIMIT 20
		OFFSET $2
$$ LANGUAGE SQL;
