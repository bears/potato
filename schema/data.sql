-- Dirty Data

TRUNCATE "potato" CASCADE;
INSERT INTO "potato" VALUES (
	'00000000000000000000000000000000', 1, 0, 'Hello potato!', 'summer', 0.5, 'Welcome to bear''s home.', current_timestamp, NULL
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

TRUNCATE "craft";
INSERT INTO "craft" VALUES (
	'00000000000000000000000000000000', 1, 'This is the first step to do in bear''s home.', 0.2, '00000000000000000000000000000000'
), (
	'1d8daa9f434d6fe8e679c86e469fc7fd', 1, 'This is the first step to do in bear''s home.', 0.2, 'b3df6db4182ffe87371f1db8c63e4276'
), (
	'9f43c3a75e9790548b41c03d9b6a2c0e', 1, 'This is the first step to do in bear''s home.', 0.2, 'b3df6db4182ffe87371f1db8c63e4276'
), (
	'44e24d228996d098c4ef18bd8c776fa6', 1, 'This is the first step to do in bear''s home.', 0.2, 'fce672d34f8bd99c3d2fbeea9f6b01b6'
), (
	'd112e838a9fd1f7b78ddb532aeee6ec6', 1, 'This is the first step to do in bear''s home.', 0.2, '53b3c1b9fbf10f5ba6043c0ca37ea3f8'
), (
	'62c915f238283ba5282a4f47c69efe49', 1, 'This is the first step to do in bear''s home.', 0.2, 'b3df6db4182ffe87371f1db8c63e4276'
);
