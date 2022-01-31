import type { FixtureResponse, MatchVotes } from './interface-fixture';

/**
 * TV_Stations Data for the Response Values;
 */
export interface SelectedFixutre {
	date: string;
	fixture_id: number;
	game_start: string;
	lang: string;
}

/**
 * Best Players Data for the Respose Values;
 */
export interface BestPlayers_Data {
	fixture_id: number;
	game_start_date: string;
	local_team_player_1: string;
	local_team_player_1_appearances: number;
	local_team_player_1_assists: number;
	local_team_player_1_goals: number;
	local_team_player_1_image_path: string;
	local_team_player_2: string;
	local_team_player_2_appearances: number;
	local_team_player_2_assists: number;
	local_team_player_2_goals: number;
	local_team_player_2_image_path: string;
	local_team_rating_player_1: number;
	local_team_rating_player_2: number;
	visitor_team_player_1: string;
	visitor_team_player_1_appearances: number;
	visitor_team_player_1_assists: number;
	visitor_team_player_1_goals: number;
	visitor_team_player_1_image_path: string;
	visitor_team_player_2: string;
	visitor_team_player_2_appearances: number;
	visitor_team_player_2_assists: number;
	visitor_team_player_2_goals: number;
	visitor_team_player_2_image_path: string;
	visitor_team_rating_player_1: number;
	visitor_team_rating_player_2: number;
}

/**
 *
 */
export interface TranslationsResponse {
	widget_featured_match_translations: {
		assists: string;
		bookmaker: string;
		bet: string;
		fair_odds: string;
		goals: string;
		home_win: string;
		lang: string;
		market: string;
		market_name: string;
		market_type: string;
		matches: string;
		odds: string;
		place_bet: string;
		player: string;
		players: string;
		stake: string;
		rating: string;
		probability: string;
		streams: string;
		type: string;
		value_bet: string;
		vote: string;
		winnings: string;
		widget_title: string;
	}[]
}

/**
 * TV_Stations Data for the Response Values;
 */
export interface Tv_Station {
	link: string;
	img: string;
	Name: string;
	alt: string;
}

/**
 * COMPLETE FIXTURE DATA Response;
 */
export interface CompleteFixtureData_Response {
	week_fixtures_by_pk: FixtureResponse;
	widget_featured_match_best_player_by_pk: BestPlayers_Data;
	widget_featured_match_votes_by_pk: MatchVotes;
}

/**
 * RETURN - RESPONSE DATA for MATCH VOTES;
 */
export interface SelectedFixture_VoteUpdate_Response {
	update_widget_featured_match_votes_by_pk: MatchVotes;
}

/**
 * RETURN - RESPONSE DAT for FEATURED_MATCH_TRANSLATION;
 */
export interface Featured_Match_Translation_Response {
	widget_featured_match_translations: Array< TranslationsResponse >;
}

/**
 * RETURN - RESPONSE DATA for SELECTED FIXTURE ALL DATA;
 */
export interface SelectedFixture_AllData {
	widget_featured_match_selection: Array < SelectedFixutre >
}