-- Clear
DROP TABLE IF EXISTS "potato" CASCADE;

-- Class
CREATE TABLE "potato" (
	"uuid" uuid PRIMARY KEY,
	"lock" integer NOT NULL,

	"brand" integer NOT NULL,
	"label" text NOT NULL,
	"season" season NOT NULL,
	"weight" decimal NOT NULL CHECK ("weight" BETWEEN 0.0 AND 1.0),
	"variety" text NOT NULL,
	"seeding" timestamp NOT NULL,
	"harvest" timestamp
);

-- Method
CREATE FUNCTION "potato::tubers" ("season", integer)
RETURNS SETOF "potato:tuber" AS $$
	SELECT "uuid", "lock", "brand", "label"
		FROM "potato"
		WHERE "season"=$1
		LIMIT 20
		OFFSET $2
$$ LANGUAGE SQL;

-- Dirty Data
INSERT INTO "potato" VALUES (
	'ead7144b0626038de86497cc53177b0d', 1, 0, 'Hello world!', 'summer', 0.8, 'Test fetching data.', current_timestamp, NULL
),
(
	'b3df6db4182ffe87371f1db8c63e4276', 1, 0, 'Hello world! 1', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
),
(
	'fce672d34f8bd99c3d2fbeea9f6b01b6', 1, 0, 'Hello world! 2', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
),
(
	'5236e6117acf55241f94aad5dd672098', 1, 0, 'Hello world! 3', 'winter', 0.3, 'Test fetching data.', current_timestamp, NULL
),
(
	'53b3c1b9fbf10f5ba6043c0ca37ea3f8', 1, 0, 'Hello world! 4', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
),
(
	'0ec37018773e6d0ac500be172e0d56a1', 1, 0, 'Hello world! 5', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
),
(
	'c8e0c5ae764f2592d6969738672723a7', 1, 0, 'Hello world! 6', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
);
