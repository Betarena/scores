import type { 
  BETARENA_HASURA_color_codes_league_standings_positions,
  BETARENA_HASURA_scores_football_leagues,
  BETARENA_HASURA_scores_football_standings, 
  BETARENA_HASURA_scores_football_standings_history, 
  BETARENA_HASURA_scores_football_teams, 
  BETARENA_HASURA_scores_team_statistics, 
  BETARENA_HASURA_scores_team_statistics_history, 
  BETARENA_HASURA_scores_widget_standings_translations, 
} from "$lib/models/hasura"

/**
 * ==========================================
 * BACKEND - COMPLETE WIDGET SURGICAL REQUIRED DATA
 * ========================================== 
*/

export interface BACKEND_tournament_standings_surgical_update {
  leagueSeasons?: LeagueSeason[];
  teamsList?:     number[];
}

export interface LeagueSeason {
  leagueId?: number;
  seasonId?: number;
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_tournament_standings_query {
  scores_football_leagues_dev:                  BETARENA_HASURA_scores_football_leagues[]
  scores_football_standings_dev:                BETARENA_HASURA_scores_football_standings[]    
  scores_football_standings_history_dev:        BETARENA_HASURA_scores_football_standings_history[]

  scores_football_teams_dev:                    BETARENA_HASURA_scores_football_teams[]
  scores_team_statistics_dev:                   BETARENA_HASURA_scores_team_statistics[]
  scores_team_statistics_history_dev:           BETARENA_HASURA_scores_team_statistics_history[]
 
  scores_widget_standings_translations_dev:     BETARENA_HASURA_scores_widget_standings_translations[]
  color_codes_league_standings_positions_dev:   BETARENA_HASURA_color_codes_league_standings_positions[]
}

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Cache_Single_Tournaments_League_Standings_Translation_Data_Response extends BETARENA_HASURA_scores_widget_standings_translations 
{ }

export interface Cache_Single_Tournaments_League_Standings_Info_Data_Response {
  url?:        string
  league_id?:  number
  seasons?:    Tournament_Standing_Season[]
}

/**
 * ==========================================
 * OTHER CACHE INTERFACES - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Tournament_Standing_Season {
  season_id:      number
  total:    Standing_Team_Total_Away_Home[]
  home:     Standing_Team_Total_Away_Home[]
  away:     Standing_Team_Total_Away_Home[]
} export interface Standing_Team_Total_Away_Home {
  team_logo:     string          // >? based on history (constant)
  team_name:     string          // >? based on history (constant)
  color_code:    string          
  position?:     number          // scores_football_standings |"position" if older seasons = scores_football_standings_history
                                 // scores_football_standings |"home +""points" - Use points to determine teams position. If older seasons = scores_football_standings_history
                                 // scores_football_standings |"away +""points" - Use points to determine teams position. If older seasons = scores_football_standings_history
                                  
  points?:       number          // scores_football_standings | "overall" + "points" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "points" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "points" if older seasons = scores_football_standings_history

  games_played?: number          // scores_football_standings | "round_name" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "games_played" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "games_played" if older seasons = scores_football_standings_history

  won?:          number          // scores_football_standings |  "overall" + "won" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "won" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "won" if older seasons = scores_football_standings_history

  draw?:         number          // scores_football_standings |  "overall" + "draw" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "draw" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "draw" if older seasons = scores_football_standings_history

  lost?:         number          // scores_football_standings |  "overall" + "lost" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "lost" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "lost" if older seasons = scores_football_standings_history

  gs?:           number          // scores_football_standings |  "overall" + "goals_scored" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "home" + "goals_scored" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "goals_scored" if older seasons = scores_football_standings_history

  ga?:           number          // scores_football_standings |  "overall" + "goals_against" if older seasons = scores_football_standings_history
                                 // Goals Against = scores_football_standings | "home" + "goals_against" if older seasons = scores_football_standings_history
                                 // scores_football_standings | "away" + "goals_against" if older seasons = scores_football_standings_history

  gavg?:         number          // scores_team_statistics    |  "total" or if older seasons = scores_team_statistics_history
                                 // Goal Average = scores_team_statistics |"home" or if older seasons = scores_team_statistics_history
                                 // scores_team_statistics |"away" or if older seasons = scores_team_statistics_history

  cavg?:         number          // scores_team_statistics    |  "avg_corners" or if older seasons = scores_team_statistics_history
                                 // home: ❌
                                 // away: ❌

  ycavg?:        number           // scores_team_statistics    |  "yellow_cards_average" or if older seasons = scores_team_statistics_history (How this data point is populated on this task: https://github.com/Betarena/scores/issues/379)
                                 // home: ❌
                                 // away: ❌

  ov15?:         number          // scores_team_statistics    |  "goal_line > 1_5" or if older seasons = scores_team_statistics_history
                                 // home: ❌ 
                                 // away: ❌

  ov25?:         number          // scores_team_statistics    |  "goal_line > 2_5" or if older seasons = scores_team_statistics_history
                                 // home: ❌
                                 // away: ❌

  winP?:         number          // scores_team_statistics    |  (How this data is populated on this task: https://github.com/Betarena/scores/issues/380)

  rf?:           string          // scores_football_standings if older seasons = scores_football_standings_history
                                 // home: ❌
                                 // away: ❌
} 
