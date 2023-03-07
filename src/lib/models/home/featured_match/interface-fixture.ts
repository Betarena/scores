import type { ScoresTournamentsUrls, Urls } from '../../hasura';
import type { SelectedFixture_LiveOdds_Response } from './firebase-real-db-interface';
import type {
  BestPlayers_Data,
  SelectedFixutre,
  TranslationsResponse
} from './response_models';

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * [ℹ] for the tv_stations of the
 * selected fixture
 */
interface Tv_Station {
	link: string;
	img: string;
	Name: string;
	alt: string;
}

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * [ℹ] for the value-bets part of the
 * selected fixture
 */
export interface ValueBet {
	fair_odd: string;
	stake: number;
	bet: string;
	is_value: boolean;
	odd: number;
	bookmaker: string;
	image?: string;
	link?: string;
}

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * [ℹ] match votes for the fixture data
 */
export interface MatchVotes {
	match_id: number;
	vote_draw_x: number;
	vote_win_local: number;
	vote_win_visitor: number;
}

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * [ℹ] for the Selected Fixture of the
 * [ℹ] response data
 */
export interface FixtureResponse {
	away_team_logo: string;
	away_team_name: string;
	country_flag: string;
	fixture_day: Date; // timeStamp
	home_team_logo: string;
	home_team_name: string;
	id: number; // fixture-id
	inserted_at: Date; // timeStamp
	league_name: string;
	probabilities: {
		home: string;
		away: string;
		draw: string;
	};
	round_name: string;
	status: string;
	time: Date; // timeStamp
	tvstations: Array<Tv_Station>; // array-of-TvStations
	valuebets: ValueBet; // array-of-value-bets
	live_odds: SelectedFixture_LiveOdds_Response; // live-odds-data
	match_votes: MatchVotes;
	best_players: BestPlayers_Data;
	// translation: Array<TranslationsResponse>;
	selected_data: SelectedFixutre;
	league_id: number;
	urls?: ScoresTournamentsUrls;
  fix_urls?: Urls;
}

/**
 * [ℹ] Featured Match Cache Interfaces
 */

export interface Cache_Single_Lang_Featured_Match_Translation_Response
	extends TranslationsResponse {
	lang: string;
}
