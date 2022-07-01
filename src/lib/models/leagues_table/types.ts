// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... ℹ DATA obtained from HASURA [!]
export interface Hasura_Complete_Leagues_Table_Type {
    scores_football_leagues: {
      country: JSON
      data: JSON
      name: string
      id: number
      season: JSON
      seasons: JSON
    }[]
    scores_football_standings: {
        id: number
        type: string
        name: string
        data: {
          // ... <here> more pontetial data is accessible;
          // ... <here> that was omitted;
          stage_name: string
          round_name: number
          league_id: number
          round_id: number
          name: string
          season_id: number
          standings: {
            data: {
              status: string
              team_id: number
              points: number
              home: {
                lost: number
                points: number
                won: number
                games_played: number
                goals_scored: number
                draw: number
                goals_against: number
              }
              round_name: number
              team_name: string
              round_id: number
              away: {
                lost: number
                points: number
                won: number
                games_played: number
                goals_scored: number
                draw: number
                goals_against: number
              }
              result: string
              overall: {
                lost: number
                points: number
                won: number
                games_played: number
                goals_scored: number
                draw: number
                goals_against: number
              }
              group_name: string
              recent_form: string
              total: {
                points: number
                goal_difference: number
              }
              group_id: string
              position: number
            }[]
          }
        }[]
    }[]
    scores_football_teams: {
        id: number
        name: string
        data: {
          legacy_id: number
          founded: number,
          country_id: number,
          twitter: string,
          national_team: boolean,
          name: string,
          venue_id: number,
          id: number,
          short_code: string,
          is_placeholder: boolean,
          current_season_id: number,
          logo_path: string
        }
    }[]
    scores_standings_home_widget_translations: {
      games: string
      lang: string
      points: string
      title: string
    }[]
    color_codes_league_standings_positions: {
      color_codes: JSON
      sports: string
    }[]
    leagues_filtered_country: {
        lang: string
        leagues: {
            league_id: number
        }[]
    }[]
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... ℹ DATA individual types for CAHCE DECLARATION [!]
export interface Single_Team_Object_Data {
  position: number
  team_logo:  string
  team_name: string
  games_played: string
  points: string
  color_code: string
}

export interface Single_League_Table_Data {
  season_league_id: string
  season_league_name: string
  season_league_logo: string
  season_league_teams: Array < Single_Team_Object_Data >
}

export interface Single_League_Table_Translations {
  lang: string
  games: string
  points: string
  title: string
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... ℹ generated best goalscorers cache object;
export interface Cache_Single_Geo_Leagues_Table_Translation_Response {
  lang: string
  top_leagues_table_data: Single_League_Table_Data[]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... ℹ generated best goalscoreres cache SEO object
export interface Cache_Single_Lang_Leagues_Table_Translation_Response {
  top_leagues_table_data: Single_League_Table_Data[]
  translations: Single_League_Table_Translations
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ... ℹ generated best goalscoreres cache SEO object
export interface Leagues_Table_SEO_Cache_Ready {
  top_leagues_table_data: Single_League_Table_Data[]
  translations: Single_League_Table_Translations[]
}