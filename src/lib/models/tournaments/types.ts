/**
 * =================================
 * Redis Cache Response 
 * [HOMEPAGE - SEO]
 * [MAIN]
 * =================================
*/
export interface Cache_Single_Tournaments_League_Info_SEO_Translation_Response {
  lang: string
  country: string
  name: string
}

export interface Cache_Single_Tournaments_League_Info_Data_Response {
  url: string
  lang: string
  data: League_Info
}

export interface Cache_Single_SportbookDetails_Data_Response {
  geoPos: string
  betting_site_logo?: string   // betting_site_logo =  endpoint: sportsbook_details              | column: "data" (link with no-follow)
  beting_cta_link?: string     // beting_cta_link =    endpoint: sportsbook_details              | column: "data" (link with no-follow)
}

/**
 * =================================
 * HASURA DB - COMPLETE PAGE / SITEMAP / SEO GRAPHQL QUERY 
 * ================================= 
*/
export interface Hasura_League_Info_Widget_Data_Response {
  // [ℹ] tournaments-page
  scores_tournaments_dev:               Single_Tournament_Data_Type[]
  scores_football_seasons_details_dev:  Scores_Football_Seasons_Details[]
  scores_football_leagues_dev:          Scores_Football_Leagues[]
  sportsbook_details_dev:               Sportsbook_Details[]
}

/**
 * =================================
 * Individual / Single Interfaces 
 * =================================
*/
export interface Single_Tournament_Data_Type {
  lang: string

  author: string
  country: string
  date: Date
  id: number
  tournament_id: number
  modified_date: Date
  name: string
  sport: string
  status: "published" | "draft"
  title: string
  type: string
  widgets: Array < string >
}

/**
 * =================================
 * TOURNAMENTS PAGE DATA [INTERFACES]
 * =================================
*/

export interface League_Info {
  name: string                // name =               endpoint: scores_football_leagues          | column: "name"
  country: string             // country =            endpoint: scores_football_leagues          | column: "country" (Replace by the correct translation using the general translation endpoint: "scores_general_translations"
  image_path: string          // image_path =         endpoint: scores_football_leagues          | column: "data"
  betting_site_logo?: string   // betting_site_logo =  endpoint: sportsbook_details              | column: "data" (link with no-follow)
  beting_cta_link?: string     // beting_cta_link =    endpoint: sportsbook_details              | column: "data" (link with no-follow)
  country_logo?: string        // country_logo =       endpoint: scores_football_leagues          | column: "country" (image_path)
  // [🢃] many
  seasons: SeasonDataLeagueInfo[]
}

export interface SeasonDataLeagueInfo extends SeasonElement {
  // default extend [?]       // seasons =            endpoint: scores_football_leagues         | column: "seasons"
  number_of_clubs: number     // number_of_clubs =    endpoint: scores_football_seasons_details | column: "data_stats"
  start_date: Date            // start_date =         endpoint: scores_football_seasons_details | column: "start_date"
  end_date: Date              // end_date =           endpoint: scores_football_seasons_details | column: "end_date"
}

// [ℹ] scores_football_seasons_details (_dev)
export interface Scores_Football_Seasons_Details {
  data_stats?:        DataStats;
  default_data?:      DefaultData;
  end_date?:          Date;
  id?:                number;
  is_current_season?: boolean;
  league_id?:         number;
  round_data?:        RoundDatum[];
  start_date?:        Date;
}

export interface DataStats {
  id?:                                    number;
  btts?:                                  number;
  goal_line?:                             GoalLine;
  league_id?:                             number;
  season_id?:                             number;
  updated_at?:                            Date;
  goals_scored?:                          DefeatPercentage;
  goals_conceded?:                        DefeatPercentage;
  win_percentage?:                        DefeatPercentage;
  draw_percentage?:                       number;
  number_of_clubs?:                       number;
  number_of_goals?:                       number;
  avg_player_rating?:                     number;
  defeat_percentage?:                     DefeatPercentage;
  number_of_matches?:                     number;
  number_of_redcards?:                    number;
  avg_goals_per_match?:                   number;
  season_topscorer_id?:                   number;
  goals_scored_minutes?:                  GoalsScoredMinutes;
  team_most_corners_id?:                  null;
  avg_corners_per_match?:                 number;
  number_of_yellowcards?:                 number;
  avg_redcards_per_match?:                number;
  avg_awaygoals_per_match?:               number;
  avg_homegoals_per_match?:               number;
  season_topscorer_number?:               number;
  team_most_corners_count?:               null;
  team_with_most_goals_id?:               number;
  number_of_matches_played?:              number;
  number_of_yellowredcards?:              number;
  team_most_cleansheets_id?:              number;
  avg_yellowcards_per_match?:             number;
  goal_scored_every_minutes?:             number;
  matches_both_teams_scored?:             number;
  season_assist_topscorer_id?:            null;
  team_with_most_goals_number?:           number;
  avg_yellowredcards_per_match?:          number;
  team_most_cleansheets_number?:          number;
  goalkeeper_most_cleansheets_id?:        number;
  season_assist_topscorer_number?:        null;
  team_with_most_conceded_goals_id?:      number;
  team_with_most_goals_per_match_id?:     number;
  goalkeeper_most_cleansheets_number?:    number;
  team_with_most_conceded_goals_number?:  number;
  team_with_most_goals_per_match_number?: number;
}

export interface DefeatPercentage {
  all?:  number;
  away?: number;
  home?: number;
}

export interface GoalLine {
  over?:  { [key: string]: number };
  under?: { [key: string]: number };
}

export interface GoalsScoredMinutes {
  "0-15"?:  string;
  "15-30"?: string;
  "30-45"?: string;
  "45-60"?: string;
  "60-75"?: string;
  "75-90"?: string;
}

export interface DefaultData {
  id?:               number;
  name?:             string;
  end_date?:         Date;
  league_id?:        number;
  start_date?:       Date;
  current_round_id?: number;
  current_stage_id?: number;
}

export interface RoundDatum {
  id?:        number;
  end?:       Date;
  name?:      number;
  start?:     Date;
  stage_id?:  number;
  league_id?: number;
  season_id?: number;
}

// [ℹ] scores_football_leagues (_dev)
export interface Scores_Football_Leagues {
  country?: DataClass;
  data?:    Data;
  id?:      number;
  name?:    string;
  season?:  SeasonElement;
  seasons?: SeasonElement[];
}

export interface DataClass {
  extra?:      Extra | null;
  image_path?: string;
  name?:       string;
  id?:         number;
}

export interface Extra {
  iso2?:         string;
  world_region?: string;
  iso?:          string;
  latitude?:     string;
  sub_region?:   string;
  flag?:         string;
  fifa?:         string;
  longitude?:    string;
  continent?:    string;
}

export interface Data {
  legacy_id?:         number;
  country_id?:        number;
  season?:            DataSeason;
  country?:           DataCountry;
  current_stage_id?:  number;
  is_cup?:            boolean;
  coverage?:          Coverage;
  live_standings?:    boolean;
  active?:            boolean;
  name?:              string;
  is_friendly?:       boolean;
  id?:                number;
  type?:              string;
  seasons?:           Seasons;
  current_round_id?:  null;
  current_season_id?: number;
  logo_path?:         string;
}

export interface DataCountry {
  data?: DataClass;
}

export interface Coverage {
  topscorer_assists?: boolean;
  topscorer_goals?:   boolean;
  predictions?:       boolean;
  topscorer_cards?:   boolean;
}

export interface DataSeason {
  data?: SeasonElement;
}

export interface SeasonElement {
  league_id?:         number;
  current_stage_id?:  number | null;
  name?:              string;
  id?:                number;
  is_current_season?: boolean;
  current_round_id?:  number | null;
}

export interface Seasons {
  data?: SeasonElement[];
}

// [ℹ] sportsbook_details (_dev)
export interface Sportsbook_Details {
  data?: { [key: string]: Datum };
  lang?: string;
}

export interface Datum {
  bonus?:             string;
  image?:             string;
  stars?:             string;
  title?:             string;
  position?:          string;
  bonus_code?:        string;
  information?:       string;
  review_link?:       string;
  register_link?:     string;
  bonus_description?: string;
}