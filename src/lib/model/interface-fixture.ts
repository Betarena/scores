import type { SelectedFixture_LiveOdds_Response } from './firebase-real-db-interface';
import type { BestPlayers_Data, TranslationsResponse, SelectedFixutre } from './response_models';

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * ... for the tv_stations of the
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
 * ... for the value-bets part of the
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
 * ... match votes for the fixture data
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
 * ... for the Selected Fixture of the
 * ... response data
 */
export interface FixtureResponse {
	away_team_logo: string; // ... team-away-logo
	away_team_name: string; // ... team-away-name
	country_flag: string; // ... country-flag
	fixture_day: Date; // ... timeStamp
	home_team_logo: string; // ... home-team-logo
	home_team_name: string; // ... home-team-name
	id: number; // ... fixture-id
	inserted_at: Date; // ... timeStamp
	league_name: string; // ... league-name
	probabilities: {
		home: string;
		away: string;
		draw: string;
	}; // ... probabliylities-data
	round_name: string; // ... round-name
	status: string; // ... status-of-the-game-fixture
	time: Date; // ... timeStamp
	tvstations: Array<Tv_Station>; // ... array-of-TvStations
	valuebets: ValueBet; // ... array-of-value-bets
	live_odds: SelectedFixture_LiveOdds_Response; // ... live-odds-data
	match_votes: MatchVotes;
	best_players: BestPlayers_Data;
	translation: Array<TranslationsResponse>;
	selected_data: SelectedFixutre;
}
