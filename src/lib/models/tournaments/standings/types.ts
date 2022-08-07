import type { 
  BETARENA_HASURA_color_codes_league_standings_positions,
  BETARENA_HASURA_scores_football_standings, 
  BETARENA_HASURA_scores_football_standings_history, 
  BETARENA_HASURA_scores_football_teams, 
  BETARENA_HASURA_scores_team_statistics, 
  BETARENA_HASURA_scores_team_statistics_history, 
  BETARENA_HASURA_scores_widget_standings_translations, 
} from "$lib/models/hasura"
import type { 
  Scores_Football_Leagues,
  Tournament_Standing_Season 
} from "../types"

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
  scores_football_leagues_dev:                  Scores_Football_Leagues[]
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