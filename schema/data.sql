-- Dirty Data

TRUNCATE "potato";
INSERT INTO "potato" VALUES (
	'ead7144b0626038de86497cc53177b0d', 1, 0, 'Hello world!', 'summer', 0.8, 'Test fetching data.', current_timestamp, NULL
), (
	'b3df6db4182ffe87371f1db8c63e4276', 1, 0, 'Hello world! 1', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
), (
	'fce672d34f8bd99c3d2fbeea9f6b01b6', 1, 0, 'Hello world! 2', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
), (
	'5236e6117acf55241f94aad5dd672098', 1, 0, 'Hello world! 3', 'winter', 0.3, 'Test fetching data.', current_timestamp, NULL
), (
	'53b3c1b9fbf10f5ba6043c0ca37ea3f8', 1, 0, 'Hello world! 4', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
), (
	'0ec37018773e6d0ac500be172e0d56a1', 1, 0, 'Hello world! 5', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
), (
	'c8e0c5ae764f2592d6969738672723a7', 1, 0, 'Hello world! 6', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
);

TRUNCATE "dummy";
INSERT INTO "dummy" VALUES (
	'41a6a0781d29ad6cbdea4a8ed1e5a63b', 1, true, 0, current_timestamp, 'Hello world! 1'
), (
	'fd99acf06a5cbf87b738f8a94308cd03', 2, false, 50, current_timestamp, 'Hello world! 2'
), (
	'c7c98d6751f7421f109c076191ffc380', 3, true, 100, current_timestamp, 'Hello world! 3'
), (
	'3dbaaa5a2f8d0f945ce6b7dfe2e2b65b', 4, false, 150, current_timestamp, 'Hello world! 4'
), (
	'b6ab24108c1e382ef8c2cc43a3964690', 5, true, 200, current_timestamp, 'Hello world! 5'
), (
	'cb2c2dd500273ca5054f84402925bfee', 6, false, 250, current_timestamp, 'Hello world! 6'
), (
	'0cb0d58c41c93cd1f3b14fa8ce1faf26', 7, true, 300, current_timestamp, 'Hello world! 7'
);
