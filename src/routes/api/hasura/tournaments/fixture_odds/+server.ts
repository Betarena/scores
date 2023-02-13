import { dev } from '$app/environment';
import { initGrapQLClient } from '$lib/graphql/init_graphQL';
import {
	REDIS_CACHE_FIXTURES_ODDS_DATA_2,
	REDIS_CACHE_FIXTURES_ODDS_DATA_4
} from '$lib/graphql/tournaments/fixtures_odds/query';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import { performance } from 'perf_hooks';

import type {
	BETARENA_HASURA_fixtures_odds_query,
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures,
	Fixture_Odds_Team,
	Rounds_Data,
	Tournament_Fixture_Odds,
	Tournament_Season_Fixtures_Odds,
	Weeks_Data
} from '$lib/models/tournaments/fixtures_odds/types';

// [ℹ] debug info
const logs = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] ENDPOINT METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

export async function GET(req): Promise<unknown> {
	// [ℹ] get seasonId
	const seasonId: string =
		req.url['searchParams'].get('seasonId');

	const target_season_fixtures = await main(
		seasonId
	);

	return json(target_season_fixtures);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [MAIN] METHOD
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function main(
	_seasonId: string
): Promise<Tournament_Season_Fixtures_Odds | null> {
	// [ℹ] relying on Season Id
	// [ℹ] to get ALL Fixtures
	// [ℹ] for ALL seasons
	// [ℹ] and return

	const SEASON_ID = parseInt(_seasonId);

	/**
	 * [ℹ] obtain target historic_fixtures
	 * [ℹ] obtain taget season_id's
	 */
	const h_fixtures_arr =
		await getTargetSeasonFixtures(SEASON_ID);
	// [ℹ] exit
	if (
		h_fixtures_arr == undefined ||
		h_fixtures_arr.length == 0
	) {
		return null;
	}

	const season_details_data =
		await getTargetSeasonDetailsData(SEASON_ID);

	const historic_fixtures_map = new Map<
		number,
		BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures
	>();

	// [ℹ] conversion to hashmap
	const t0 = performance.now();
	for (const h_fixture of h_fixtures_arr) {
		historic_fixtures_map.set(
			h_fixture.id,
			h_fixture
		);
	}
	const t1 = performance.now();
	logs.push(
		`historic_fixtures_map generated with size: ${historic_fixtures_map.size}`
	);
	logs.push(
		`Hashmap conversion completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	// [🐞]
	/*
    if (dev) {
      const data = JSON.stringify(h_fixtures_arr, null, 4)
      fs.writeFile('./datalog/h_fixtures_arr.json', data, err => {
        if (err) {
          console.error(err);
        }
      });
    }
  */

	// [🐞]
	/*
    const mainArrIds = []
    for (const i of h_fixtures_arr) {
      mainArrIds.push(i.id)
    }
    const duplicates = mainArrIds.filter((e, i, a) => a.indexOf(e) !== i) // [2, 4]
    logs.push(`duplicates: ${duplicates.length}`)
  */

	// [🐞]
	/*
    if (dev) {
      const data = JSON.stringify(duplicates, null, 4)
      await fs.writeFile(`./datalog/duplicates_local_main.json`, data);
    }
  */

	/**
	 * [ℹ] breakdown season by weeks
	 * [ℹ] breakdown season by rounds
	 */

	const season_week_round_ranges_map =
		await breakdownWeeksAndRounds(
			SEASON_ID,
			season_details_data,
			historic_fixtures_map
		);
	// [ℹ] exit
	if (season_week_round_ranges_map == undefined) {
		return null;
	}

	/**
	 * [ℹ] data pre-processing
	 * [ℹ] grouping fixtures by league_id's
	 * [ℹ] based in nested season_id's objects
	 * [ℹ] housing fixture_odds objects
	 */

	const historic_fixtures_season_arr: Tournament_Season_Fixtures_Odds =
		{};
	historic_fixtures_season_arr.season_id =
		SEASON_ID;
	historic_fixtures_season_arr.fixtures = [];

	for (const [
		,
		value
	] of historic_fixtures_map.entries()) {
		// const fix_season_id = value.data?.season_id;
		// const league_id = value.league_id;
		const fixture_id = value?.id;
		const home_team_id = value?.localteam_id_j;
		const away_team_id = value?.visitorteam_id_j;

		const round = value?.round_j?.data?.name;
		const fixture_date = value.fixture_day;
		const fixture_time = value.time;
		const minutes = value.time_j?.minute;
		const status = value.time_j?.status;

		const tip_link = value.tip_link_wp;
		const media_link = value.media_link;
		const fixture_link = value.urls;

		const home_team_name = value.home_team_name;
		const home_red_cards =
			value?.stats_j?.data?.find(
				({ team_id }) => team_id === home_team_id
			)?.redcards;
		const home_team_score =
			value?.scores_j?.localteam_score;

		const away_team_name = value.away_team_name;
		const away_red_cards =
			value?.stats_j?.data?.find(
				({ team_id }) => team_id === away_team_id
			)?.redcards;
		const away_team_score =
			value?.scores_j?.visitorteam_score;

		const home_team_obj: Fixture_Odds_Team = {
			name: home_team_name,
			score: home_team_score || 0,
			red_cards: home_red_cards || null
		};

		const away_team_obj: Fixture_Odds_Team = {
			name: away_team_name,
			score: away_team_score || 0,
			red_cards: away_red_cards || null
		};

		// [ℹ] generate fixtures_odds object
		const fixtures_odds_object: Tournament_Fixture_Odds =
			{
				id: fixture_id,
				round,
				// week:             2, // FIXME: unecessary, using fixture_date instead
				minute: minutes,
				status,
				fixture_time,
				fixture_date,
				teams: {
					home: home_team_obj,
					away: away_team_obj
				},
				tip_link,
				media_link,
				fixture_link
			};

		// [ℹ] add fixtures
		// [ℹ] to season
		historic_fixtures_season_arr.fixtures.push(
			fixtures_odds_object
		);
	}

	/**
	 * [ℹ] merge rounds & weeks data
	 * [ℹ] with each league_id's (sub) season_id
	 */

	historic_fixtures_season_arr.weeks =
		season_week_round_ranges_map.get(SEASON_ID)
			?.weeks || [];
	historic_fixtures_season_arr.rounds =
		season_week_round_ranges_map.get(SEASON_ID)
			?.rounds || [];

	// [🐛] debug
	if (
		historic_fixtures_season_arr?.weeks == null ||
		historic_fixtures_season_arr?.weeks ==
			undefined
	) {
		if (dev)
			console.log(
				`week value: ${historic_fixtures_season_arr?.weeks}`
			);
	}

	// [ℹ] remove empty (NaN) fixtures num.
	// [ℹ] target weeks from weeks_list
	const modWeeksData = await identifyFixtureWeeks(
		historic_fixtures_season_arr
	);
	historic_fixtures_season_arr.weeks =
		modWeeksData;

	// [🐛] debug
	if (dev) {
		const data = JSON.stringify(
			historic_fixtures_season_arr,
			null,
			4
		);
		fs.writeFile(
			'./datalog/hasura-tournaments-fixture-odds.json',
			data,
			(err) => {
				if (err) {
					console.error(err);
				}
			}
		);
	}

	// [ℹ] return fixtures for THIS
	// [ℹ] target season
	return historic_fixtures_season_arr;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~
//  [HELPER] OTHER METHODS
// ~~~~~~~~~~~~~~~~~~~~~~~~

async function getTargetSeasonFixtures(
	seasonId: number
): Promise<
	BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[]
> {
	// [ℹ] obtain target historic_fixtures
	const queryName =
		'REDIS_CACHE_FIXTURES_ODDS_DATA_4';
	const t0 = performance.now();
	const VARIABLES = {
		season_id: seasonId
	};
	const response: BETARENA_HASURA_fixtures_odds_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURES_ODDS_DATA_4,
			VARIABLES
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response.historic_fixtures;
}

async function getTargetSeasonDetailsData(
	seasonIdsArr: number
): Promise<BETARENA_HASURA_fixtures_odds_query> {
	const VARIABLES_1 = {
		seasonIds: [seasonIdsArr]
	};

	const t0 = performance.now();
	const queryName =
		'REDIS_CACHE_FIXTURES_ODDS_DATA_2';
	const response: BETARENA_HASURA_fixtures_odds_query =
		await initGrapQLClient().request(
			REDIS_CACHE_FIXTURES_ODDS_DATA_2,
			VARIABLES_1
		);
	const t1 = performance.now();
	logs.push(
		`${queryName} completed in: ${
			(t1 - t0) / 1000
		} sec`
	);

	return response;
}

async function breakdownWeeksAndRounds(
	SEASON_ID: number,
	season_details_data: BETARENA_HASURA_fixtures_odds_query,
	historic_fixtures_map: Map<
		number,
		BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures
	>
): Promise<
	Map<number, Tournament_Season_Fixtures_Odds>
> {
	/**
	 * [ℹ] breakdown season by weeks
	 * [ℹ] breakdown season by rounds
	 * [ℹ] NOTE: updated [20/12/2022]
	 * [ℹ] NOTE: using HIST-FIXTURES DATA for
	 * [ℹ] NOTE: week start-end identification.
	 * [ℹ] NOTE: For rounds - using stages and stage_id
	 * [ℹ] NOTE: data to identify matching fixtures to
	 * [ℹ] NOTE: stages / rounds span
	 */

	const season_week_round_ranges_map = new Map<
		number,
		Tournament_Season_Fixtures_Odds
	>();

	const t_season =
		season_details_data.scores_football_seasons_details.find(
			({ id }) => id === SEASON_ID
		);

	// [ℹ] season does not exist
	if (t_season == undefined) {
		return;
	}

	const season_fixture_arr: BETARENA_HASURA_SURGICAL_JSONB_historic_fixtures[] =
		[];
	// [ℹ] get all fixtures[] from this SEASON
	for await (const [
		,
		fixture_data
	] of historic_fixtures_map.entries()) {
		const fixture_season_id =
			fixture_data?.season_id;
		// [ℹ] validation check
		if (fixture_season_id == t_season?.id) {
			season_fixture_arr.push(fixture_data);
		}
	}

	// [ℹ] order season fixtures by ASC dates
	season_fixture_arr.sort(
		(a, b) =>
			new Date(a.fixture_day).getTime() -
			new Date(b.fixture_day).getTime()
	);

	// [🐞]
	if (dev) {
		console.log(
			`SEASON start_date: ${season_fixture_arr[0]?.fixture_day.replace(
				'T00:00:00',
				''
			)}`
		);
		console.log(
			`SEASON end_date: ${season_fixture_arr[
				season_fixture_arr.length - 1
			]?.fixture_day.replace('T00:00:00', '')}`
		);
	}

	const seasonObj: Tournament_Season_Fixtures_Odds =
		{};

	// ~~~~~~~~~~~~~~~
	// ROUNDS DATA GENERATION
	// ~~~~~~~~~~~~~~~

	// [ℹ] cherry-pick rounds data correctly
	let mod_rounds: Rounds_Data[] =
		t_season.round_data.map((d) => ({
			name: d?.name.toString(),
			type: 'round',
			s_date: d?.start.toString(),
			e_date: d?.end.toString(),
			stage_id: d?.stage_id
		}));

	const season_rounds_stage_mod_data: Rounds_Data[] =
		[];
	// [ℹ] complete rounds generation data based off STAGE_ID
	// [ℹ] using THIS SEASON stage data
	for await (const stage of t_season.stages) {
		// [ℹ] validation check
		const rounds_match_stage = mod_rounds.find(
			({ stage_id }) => stage_id === stage.id
		);
		if (rounds_match_stage != undefined) {
			// [🐞]
			if (dev)
				console.log(
					`removing already existing stage_id in MAIN: ${stage.id}`
				);
			continue;
		}
		// [ℹ] get matching stage fixtures
		const stage_fixtures =
			season_fixture_arr.filter(
				({ stage_id_j }) =>
					stage_id_j === stage.id
			);
		// [ℹ] validation check
		if (stage_fixtures != undefined) {
			// [ℹ] order season fixtures (stage) by ASC dates
			stage_fixtures.sort(
				(a, b) =>
					Date.parse(a.fixture_day) -
					Date.parse(b.fixture_day)
			);
			const stage_start_date =
				stage_fixtures[0]?.fixture_day.replace(
					'T00:00:00',
					''
				);
			const stage_end_date = stage_fixtures[
				stage_fixtures.length - 1
			]?.fixture_day.replace('T00:00:00', '');
			// [ℹ] generate stage object in the rounds form
			const stage_obj: Rounds_Data = {
				name: stage?.name,
				type: 'advanced',
				s_date: stage_start_date,
				e_date: stage_end_date,
				stage_id: stage?.id
			};
			// [ℹ] skip rounds without a
			if (
				stage_obj?.s_date == undefined ||
				stage_obj?.e_date == undefined
			) {
				continue;
			}
			season_rounds_stage_mod_data.push(
				stage_obj
			);
		}
	}

	// [ℹ] merge both rounds and stages data as a single
	// [ℹ] rounds objects-array
	if (dev)
		console.log(
			`rounds length (pre-merge): ${mod_rounds.length}`
		);
	mod_rounds = mod_rounds.concat(
		season_rounds_stage_mod_data
	);
	if (dev)
		console.log(
			`rounds length (post-merge): ${mod_rounds.length}`
		);

	// [ℹ] order season fixtures by ASC dates
	mod_rounds.sort(
		(a, b) =>
			new Date(a.s_date).getTime() -
			new Date(b.s_date).getTime()
	);
	let round_count = 1;
	for await (const round_moded of mod_rounds) {
		round_moded.value = round_count;
		round_count++;
	}

	// ~~~~~~~~~~~~~~~
	// WEEKS DATA GENERATION
	// ~~~~~~~~~~~~~~~

	const mod_weeks: Weeks_Data[] = [];

	const season_start =
		season_fixture_arr[0]?.fixture_day.replace(
			'T00:00:00',
			''
		);
	const season_end = season_fixture_arr[
		season_fixture_arr.length - 1
	]?.fixture_day.replace('T00:00:00', '');
	const count_weeks: number = get_weeks_diff(
		new Date(season_start),
		new Date(season_end)
	);

	// [🐞]
	/**
    console.log(`seasonId: ${seasonId}`)
    if (seasonId.toString() == '19740') {
      console.log(`
        season_start: ${season_start}
        season_start v2: ${new Date(season_start)}
        count_weeks: ${count_weeks}
      `)
    }
  */

	for (
		let index = 0;
		index < count_weeks + 1;
		index++
	) {
		const name = index + 1;
		const s_date = new Date(season_start);
		const e_date = new Date(season_start);

		s_date.setDate(s_date.getDate() + index * 7);
		e_date.setDate(e_date.getDate() + index * 7);

		// [ℹ] hypothetical alternative to get
		// [ℹ] next-month "sunday"
		// const currentMonthDays = new Date(
		//   s_date.getFullYear(),
		//   s_date.getMonth() + 1,
		//   0
		// ).getDate();

		s_date.setDate(
			s_date.getDate() - s_date.getDay() + 1
		);
		e_date.setDate(
			e_date.getDate() - e_date.getDay() + 7
		);

		mod_weeks.push({
			name: name?.toString(),
			s_date: s_date?.toString(),
			e_date: e_date?.toString()
		});
	}

	// ~~~~~~~~~~~~~~~
	// END DATA GENERATION
	// ~~~~~~~~~~~~~~~

	seasonObj.rounds = mod_rounds;
	seasonObj.weeks = mod_weeks;
	season_week_round_ranges_map.set(
		SEASON_ID,
		seasonObj
	);

	return season_week_round_ranges_map;
}

function get_weeks_diff(
	startDate: Date,
	endDate: Date
) {
	const msInWeek = 1000 * 60 * 60 * 24 * 7;
	return Math.round(
		Math.abs(
			endDate.getTime() - startDate.getTime()
		) / msInWeek
	);
}

async function identifyFixtureWeeks(
	target_season: Tournament_Season_Fixtures_Odds
): Promise<Weeks_Data[]> {
	const newWeekArr: Weeks_Data[] = [];

	for await (const week of target_season.weeks) {
		const week_start_t = new Date(week.s_date);
		const week_end_t = new Date(week.e_date);

		const fixturesArrMatch =
			target_season.fixtures.filter(
				({ fixture_date }) =>
					new Date(fixture_date) >=
						week_start_t &&
					new Date(fixture_date) <= week_end_t
			);

		// [ℹ] fixtures exist
		if (fixturesArrMatch.length != 0) {
			newWeekArr.push(week);
		}
	}

	// [ℹ] additional array re-structuring
	// [ℹ] validation check for change
	if (
		newWeekArr.length !==
		target_season.weeks.length
	) {
		// [ℹ] re-sort array descending by "name"
		newWeekArr.sort(
			(a, b) =>
				parseInt(a.name) - parseInt(b.name)
		);

		// [ℹ] update "name" (id) in sequntial [1,2,3..]
		// [ℹ] values
		let counter = 1;
		for await (const item of newWeekArr) {
			item.name = counter.toString();
			counter++;
		}
	}

	return newWeekArr;
}
