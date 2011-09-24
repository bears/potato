--
DROP TYPE IF EXISTS "season" CASCADE;
CREATE TYPE "season" AS ENUM ('spring', 'summer', 'autumn', 'winter');

-- Return type of "potato::tubers"
DROP TYPE IF EXISTS "potato:tuber" CASCADE;
CREATE TYPE "potato:tuber" AS (
	"uuid" uuid,
	"lock" integer,
	"brand" integer,
	"label" text
);

