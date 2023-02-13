import type {
	BETARENA_HASURA_color_codes_league_standings_positions,
	BETARENA_HASURA_leagues_filtered_country,
	BETARENA_HASURA_scores_football_leagues,
	BETARENA_HASURA_scores_football_standings,
	BETARENA_HASURA_scores_football_teams,
	BETARENA_HASURA_scores_standings_home_widget_translations
} from '../hasura';

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

export interface BETARENA_HASURA_standings_query {
	leagues_filtered_country: BETARENA_HASURA_leagues_filtered_country[];
	color_codes_league_standings_positions: BETARENA_HASURA_color_codes_league_standings_positions[];
	scores_standings_home_widget_translations: BETARENA_HASURA_scores_standings_home_widget_translations[];

	scores_football_leagues: BETARENA_HASURA_scores_football_leagues[];
	scores_football_standings: BETARENA_HASURA_scores_football_standings[];

	scores_football_teams: BETARENA_HASURA_scores_football_teams[];
}

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

export interface Cache_Single_Geo_Leagues_Table_Translation_Response {
	lang: string;
	top_leagues_table_data: Single_League_Table_Data[];
}

export interface Cache_Single_Lang_Leagues_Table_Translation_Response {
	top_leagues_table_data: Single_League_Table_Data[];
	translations: Single_League_Table_Translations;
}

export interface Leagues_Table_SEO_Cache_Ready {
	top_leagues_table_data: Single_League_Table_Data[];
	translations: Single_League_Table_Translations[];
}

/**
 * ==========================================
 * OTHER CACHE INTERFACES - COMPLETE WIDGET REQUIRED DATA
 * ==========================================
 */

export interface Single_Team_Object_Data {
	position: number;
	team_logo: string;
	team_name: string;
	games_played: string;
	points: string;
	color_code: string;
}

export interface Single_League_Table_Data {
	season_league_id: string;
	season_league_name: string;
	season_league_logo: string;
	season_league_teams: Array<Single_Team_Object_Data>;
}

export interface Single_League_Table_Translations {
	lang: string;
	games: string;
	points: string;
	title: string;
}
