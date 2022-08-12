import type { 
  BETARENA_HASURA_player_positions_translations, 
  BETARENA_HASURA_scores_football_countries, 
  BETARENA_HASURA_scores_football_leagues, 
  BETARENA_HASURA_scores_football_players, 
  BETARENA_HASURA_scores_football_seasons_details, 
  BETARENA_HASURA_scores_football_seasons_details_aggregate, 
  BETARENA_HASURA_scores_football_teams, 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_scores_widget_top_players_translations,
  TopPlayersData,
  WidgetsNoDataAvailable,
} from "$lib/models/hasura"

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_top_players_season_details_query {
  scores_football_seasons_details_aggregate:  BETARENA_HASURA_scores_football_seasons_details_aggregate
  scores_football_seasons_details:            BETARENA_HASURA_scores_football_seasons_details[]
}

export interface BETARENA_HASURA_top_players_query {
  scores_football_leagues:                    BETARENA_HASURA_scores_football_leagues[]
  scores_football_teams:                      BETARENA_HASURA_scores_football_teams[]
  scores_football_countries:                  BETARENA_HASURA_scores_football_countries[] // [❓] unecessary
  scores_football_players:                    BETARENA_HASURA_scores_football_players[]
}

export interface BETARENA_HASURA_top_players_t_query {
  scores_widget_top_players_translations:     BETARENA_HASURA_scores_widget_top_players_translations[]
  player_positions_translations:              BETARENA_HASURA_player_positions_translations[]
  scores_general_translations:                BETARENA_HASURA_scores_general_translations[]
}

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response extends TopPlayersData {
  lang?:          string
  pos_t?:         { [key: string]: string }
  pl_view_opt?:   string[]
  no_data_t?:     WidgetsNoDataAvailable
}

export interface REDIS_CACHE_SINGLE_tournaments_top_player_widget_data_response {
  league_id?:  number
  seasons?:    Tournament_Season_Top_Player[]
}

export interface Tournament_Season_Top_Player {
  season_id?:                 number
  top_players_rating?:        Top_player_ratings[]  
  top_players_goals?:         Top_player_goalscorers[]
  top_players_assists?:       Top_player_assits[]
  top_players_total_shots?:   Top_player_total_shots[]
}

export interface Tournaments_Top_player {
  rank?:           number            // [ℹ] rank         = ordered descendent
  avatar?:         string            // [ℹ] avatar       = scores_football_players         | "data:image_path"
  team_logo?:      string            // [ℹ] team logo    = scores_football_teams           | "data:team.data.logo_path"
  player_name?:    string            // [ℹ] player name  = scores_football_players         | "data:common_name"
  position?:       number            // [ℹ] position     = scores_football_players         | "data:position_id" (Use the endpoint: player_positions_translations)
}

export interface Top_player_ratings extends Tournaments_Top_player {
  rating?:         number            // [ℹ] rating       = scores_football_seasons_details | "squad:rating"
}

export interface Top_player_goalscorers extends Tournaments_Top_player {
  goals?:          number            // [ℹ] goals        = scores_football_seasons_details | "goalscorers:goals"
}

export interface Top_player_assits extends Tournaments_Top_player {
  assists?:        number            // [ℹ] assists      = scores_football_seasons_details | "assistscorers:assists"
}

export interface Top_player_total_shots extends Tournaments_Top_player {
  total_shots?:    number            // [ℹ] total shots  = scores_football_seasons_details | "squad:shots_total"
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_tournaments_top_player_widget_t_data_response extends BETARENA_HASURA_player_positions_translations 
{ }