export const FIXTURE_NOT_START_OPT: FIXTURE_STATUS_TYPES[] =
	['CANCL', 'POSTP', 'INT', 'NS', 'TBA', 'SUSP'];
export const FIXTURE_NO_VOTES_OPT: FIXTURE_STATUS_TYPES[] =
	[
		'FT',
		'AET',
		'FT_PEN',
		'CANCL',
		'POSTP',
		'INT',
		'ABAN',
		'SUSP',
		'AWARDED',
		'WO'
	];
export const FIXTURE_LIVE_TIME_OPT: FIXTURE_STATUS_TYPES[] =
	['LIVE', 'HT', 'ET', 'BREAK', 'PEN_LIVE'];
export const FIXTURE_FULL_TIME_OPT: FIXTURE_STATUS_TYPES[] =
	['FT', 'AET', 'FT_PEN'];

// DOC: https://docs.sportmonks.com/football/api-references/statussus-and-definitions
export type FIXTURE_STATUS_TYPES =
	// [ℹ] GAME NOT STARTED
	| 'NS' // The initial status of a game
	| 'TBA' // The game does not have a confirmed date and time yet. It will be announced later on.
	| 'SUSP' // The game has suspended and will continue at a later time or day
	| 'INT' // The game has been interrupted. Can be due to bad weather
	| 'POSTP' // The game has been postponed
	| 'CANCL' // The game has been canceled
	| 'ABAN' // The game has been abandoned
	| 'AWARDED' // The game has been awarded
	| 'WO' // The game has been walk-over
	// [ℹ] GAME IS LIVE
	| 'LIVE' // The game is currently inplay
	| 'HT' // The game currently is in half-time
	| 'ET' // The game currently is in extra time, can happen in knockout games
	| 'BREAK' // Waiting for extra time or penalties to start
	| 'PEN_LIVE' // ET status didn't get a winner, penalties are taken to determine the winner
	// [ℹ] GAME IS COMPLETE
	| 'FT' // The game has ended after 90 minutes. When a game goes into extra time, the FT status will be presented for a few seconds and then move to the BREAK status.
	| 'AET' // The game has finished after 120 minutes
	| 'FT_PEN'; // Finished after penalty shootout
