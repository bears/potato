-- Dirty Data

TRUNCATE "potato" CASCADE;
INSERT INTO "potato" VALUES (
	'00000000000000000000000000000000', 1, 0, 'Hello potato!', 'This is the first step to do in bear''s home.', 'summer', 0.5, 'Welcome to bear''s home.', current_timestamp, NULL
), (
	'b3df6db4182ffe87371f1db8c63e4276', 1, 0, 'Hello world! 1', 'This is the first step to do in bear''s home.', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
), (
	'fce672d34f8bd99c3d2fbeea9f6b01b6', 1, 0, 'Hello world! 2', 'This is the first step to do in bear''s home.', 'spring', 0.5, 'Test fetching data.', current_timestamp, NULL
), (
	'5236e6117acf55241f94aad5dd672098', 1, 0, 'Hello world! 3', 'This is the first step to do in bear''s home.', 'winter', 0.3, 'Test fetching data.', current_timestamp, NULL
), (
	'53b3c1b9fbf10f5ba6043c0ca37ea3f8', 1, 0, 'Hello world! 4', 'This is the first step to do in bear''s home.', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
), (
	'0ec37018773e6d0ac500be172e0d56a1', 1, 0, 'Hello world! 5', 'This is the first step to do in bear''s home.', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
), (
	'c8e0c5ae764f2592d6969738672723a7', 1, 0, 'Hello world! 6', 'This is the first step to do in bear''s home.', 'summer', 0.9, 'Test fetching data.', current_timestamp, NULL
);

TRUNCATE "chip" CASCADE;
INSERT INTO "chip" VALUES (
	'00000000000000000000000000000000', 1, 'Hello chip!', '00000000000000000000000000000000'
), (
	'cfd75ba63cd0cda64f6b337d475714f7', 1, 'Hello chip!', 'b3df6db4182ffe87371f1db8c63e4276'
), (
	'34dd22f19011475833ba384c474cb3b7', 1, 'Hello chip!', 'fce672d34f8bd99c3d2fbeea9f6b01b6'
), (
	'47a24eb7371170232a70891426bb682a', 1, 'Hello chip!', '5236e6117acf55241f94aad5dd672098'
), (
	'aba53b60c2d4e4e5ff569892f679a2a5', 1, 'Hello chip!', '53b3c1b9fbf10f5ba6043c0ca37ea3f8'
), (
	'4549e983dd2cc0fb4ae6b36ef16abd16', 1, 'Hello chip!', 'b3df6db4182ffe87371f1db8c63e4276'
);
