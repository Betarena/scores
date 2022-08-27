import type { 
  BETARENA_HASURA_historic_fixtures,
  BETARENA_HASURA_historic_fixtures_aggregate,
  BETARENA_HASURA_scores_football_seasons_details, 
  BETARENA_HASURA_scores_general_translations, 
  BETARENA_HASURA_scores_widget_football_fixtures_odds_translations, 
  BETARENA_HASURA_sportsbook_details,
  FixturesOddsTranslations,
  Weekdays,
  WelcomeMonths,
  WidgetsNoDataAvailable,
} from "$lib/models/hasura"

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_fixtures_odds_query {
  historic_fixtures_dev_aggregate:                              BETARENA_HASURA_historic_fixtures_aggregate
  historic_fixtures_dev:                                        BETARENA_HASURA_historic_fixtures[]
  
  scores_football_seasons_details_dev:                          BETARENA_HASURA_scores_football_seasons_details[]
  
  scores_widget_football_fixtures_odds_translations_dev:        BETARENA_HASURA_scores_widget_football_fixtures_odds_translations[]
  scores_general_translations_dev:                              BETARENA_HASURA_scores_general_translations[]
  sportsbook_details_dev:                                       BETARENA_HASURA_sportsbook_details[]
}

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_data_response {
  league_id?:  number
  seasons?:    Tournament_Season_Fixtures_Odds[]
}

export interface REDIS_CACHE_SINGLE_tournaments_fixtures_odds_widget_t_data_response extends FixturesOddsTranslations, WelcomeMonths, Weekdays, WidgetsNoDataAvailable {
  lang: string
}

export interface Tournament_Season_Fixtures_Odds {
  season_id?: number
  rounds?:    Rounds_Data[]
  weeks?:     Weeks_Data[]
  fixtures?:  Tournament_Fixture_Odds[]
}

export interface Rounds_Data {
  name?:   string
  s_date?: string
  e_date?: string
}

export interface Weeks_Data {
  name:   string
  s_date: string
  e_date: string
}

export interface Tournament_Fixture_Odds {
  round: number             // Rounds and weeks = scores_football_seasons_details + round_data + scores_general_translations
  week: number              // Rounds and weeks = scores_football_seasons_details + round_data + scores_general_translations
  // date: string             // Day and Month = historic_fixtures + "league_id" + "time" +  scores_general_translations (Filter fixtures between dates or rounds to get fixtures day information, varies depending on the computer date and time of the end user) 
                            // [❓] whats the: historic_fixtures + "league_id" FOR ?
  
  fixture_date: string      // Fixture Date = historic_fixtures + "time" (Varies depending on the computer date and time of the end user)

  live_minute: number       // live option, from firebase (non-cache-based)  // Fixture Live Time Information (Status LIVE) = livescore_now  + ""minute": 13,"
                            // [❓] should be real-time [?] as in, without the user refreshing the app will autamtically show the fixture data is LIVE
  teams: {
    home: Fixture_Odds_Team
    away: Fixture_Odds_Team
  }

  tip_link: string          // Tip = tip_link_wp + scores_general_translations
  fixture_link: string      // Fixture Link = fixture_link_wp
  media_link: string        // media_link = historic_fixtures + media_link + "video_link"
  bet_icon?: string         // Betting Site Icon = sportsbook_details (GEO or forced header option)
                            // [❔] only 1 betting site at the moment for all fixtures of X GEO (design is wrong)
}

export interface Fixture_Odds_Team {
  name:      string   // Team Names = historic_fixtures + "home_team_name" + "away_team_name"
  score:     number   // Score = historic_fixtures + "ft_score" [❓] what is this field [complex property]
  red_cards: number   // Red Cards = historic_fixtures + "cards"
}