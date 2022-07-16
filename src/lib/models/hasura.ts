/**
 * [ℹ] HASURA: scores_football_standings (&_dev)
*/
export interface BETARENA_HASURA_scores_football_standings {
  data?: WelcomeDatum[];
  id?:   number;
  name?: string;
  type?: string;
} export interface WelcomeDatum {
  stage_name?: string;
  round_name?: number;
  league_id?:  number;
  round_id?:   number;
  name?:       string;
  season_id?:  number;
  standings?:  Standings;
  resource?:   string;
  id?:         number;
  type?:       string;
  stage_id?:   number;
} export interface Standings {
  data?: StandingsDatum[];
} export interface StandingsDatum {
  status?:      null;
  team_id?:     number;
  points?:      number;
  home?:        Away;
  round_name?:  number;
  team_name?:   string;
  round_id?:    number;
  away?:        Away;
  result?:      null | string;
  overall?:     Away;
  group_name?:  null;
  recent_form?: string;
  total?:       Total;
  group_id?:    null;
  position?:    number;
} export interface Away {
  lost?:          number;
  points?:        number;
  won?:           number;
  games_played?:  number;
  goals_scored?:  number;
  draw?:          number;
  goals_against?: number;
} export interface Total {
  points?:          number;
  goal_difference?: string;
}

/**
 * [ℹ] HASURA: scores_football_standings_history (&_dev)
*/

export interface BETARENA_HASURA_scores_football_standings_history {
  id?:        number;
  data?:      StandingsDatum[];
  name?:      string;
  season_id?: number;
  type?:      string;
}

/**
 * [ℹ] HASURA: scores_team_statistics (&_dev)
*/
export interface BETARENA_HASURA_scores_team_statistics {
  average_goals?:        AverageGoals;
  average_yellow_cards?: number;
  data?:                 Datum[];
  name?:                 string;
  team_id?:              number;
  winning_probability?:  null;
} export interface AverageGoals {
  away?:  number;
  home?:  number;
  total?: number;
} export interface Datum {
  win?:                            AverageGoals;
  btts?:                           number;
  draw?:                           AverageGoals;
  lost?:                           AverageGoals;
  fouls?:                          number;
  attacks?:                        number;
  tackles?:                        number;
  team_id?:                        number;
  offsides?:                       number;
  redcards?:                       number;
  stage_id?:                       number;
  goal_line?:                      GoalLine;
  goals_for?:                      AverageGoals;
  penalties?:                      Penalties;
  season_id?:                      number;
  avg_corners?:                    string;
  clean_sheet?:                    AverageGoals;
  yellowcards?:                    number;
  goals_against?:                  AverageGoals;
  shots_blocked?:                  number;
  total_corners?:                  number;
  failed_to_score?:                AverageGoals;
  scoring_minutes?:                Minute[];
  shots_on_target?:                number;
  shots_off_target?:               number;
  avg_player_rating?:              number;
  dangerous_attacks?:              number;
  avg_fouls_per_game?:             string;
  avg_first_goal_scored?:          AvgFirstGoal;
  goals_conceded_minutes?:         Minute[];
  avg_first_goal_conceded?:        AvgFirstGoal;
  avg_goals_per_game_scored?:      AverageGoals;
  avg_goals_per_game_conceded?:    AverageGoals;
  avg_player_rating_per_match?:    number;
  avg_shots_on_target_per_game?:   string;
  avg_shots_off_target_per_game?:  string;
  avg_ball_possession_percentage?: string;
} export interface AvgFirstGoal {
  away?:  string;
  home?:  string;
  total?: string;
} export interface GoalLine {
  over?:  { [key: string]: Over };
  under?: { [key: string]: Over };
} export interface Over {
  away?: number;
  home?: number;
} export interface Minute {
  period?: Period[];
} export interface Period {
  count?:      number;
  minute?:     string;
  percentage?: number;
} export interface Penalties {
  scored?:   number;
  awarded?:  number;
  conceded?: number;
}

/**
 * [ℹ] HASURA: scores_team_statistics_history (&_dev)
 * [ℹ] based-of: scores_team_statistics (&_dev)
*/
export interface BETARENA_HASURA_scores_team_statistics_history {
  average_goals?:        AverageGoals;
  average_yellow_cards?: number;
  data?:                 Datum[];
  name?:                 string;
  season_id?:            number;
  team_id?:              number;
}

/**
 * [ℹ] HASURA: scores_widget_standings_translations (&_dev)
*/
export interface BETARENA_HASURA_scores_widget_standings_translations {
  lang?:         string;
  translations?: Translations;
} export interface Translations {
  d?:           string;
  l?:           string;
  w?:           string;
  ga?:          string;
  gf?:          string;
  pld?:         string;
  pts?:         string;
  "1.5+"?:      string;
  "2.5+"?:      string;
  away?:        string;
  cavg?:        string;
  gavg?:        string;
  home?:        string;
  prob?:        string;
  team?:        string;
  yavg?:        string;
  table?:       string;
  total?:       string;
  tooltips?:    { [key: string]: Tooltip };
  standings?:   string;
  recent_form?: string;
} export interface Tooltip {
  title?:       string;
  description?: string;
}

/**
 * [ℹ] HASURA: scores_football_teams (&_dev)
*/
export interface BETARENA_HASURA_scores_football_teams {
  data?: Data;
  id?:   number;
  name?: string;
} export interface Data {
  legacy_id?:         number | null;
  founded?:           number;
  country_id?:        number;
  twitter?:           null | string;
  national_team?:     boolean;
  name?:              string;
  venue_id?:          number;
  id?:                number;
  short_code?:        string;
  is_placeholder?:    boolean;
  current_season_id?: number;
  logo_path?:         string;
}

/**
 * [ℹ] HASURA: color_codes_league_standings_positions (&_dev)
*/
export interface BETARENA_HASURA_color_codes_league_standings_positions {
  color_codes?: ColorCodes;
  sports?:      string;
} export interface ColorCodes {
  Final?:                               string;
  "1st Phase"?:                         string;
  "2nd Phase"?:                         string;
  Promotion?:                           string;
  "Next Round"?:                        string;
  Relegation?:                          string;
  "Semi-finals"?:                       string;
  "Final Series"?:                      string;
  "Promotion Group"?:                   string;
  "Relegation Round"?:                  string;
  "Championship Round"?:                string;
  "Promotion Play-off"?:                string;
  "UEFA Europa League"?:                string;
  "Possible Relegation"?:               string;
  "Relegation Play-off"?:               string;
  "CONMEBOL Libertadores"?:             string;
  "CONMEBOL Sudamericana"?:             string;
  "Championship Play-off"?:             string;
  "UEFA Champions League"?:             string;
  "UEFA Europa League Qualifiers"?:     string;
  "CONMEBOL Libertadores Qualifiers"?:  string;
  "CONMEBOL Sudamericana Qualifiers"?:  string;
  "UEFA Champions League Qualifiers"?:  string;
  "UEFA Conference League Play-offs"?:  string;
  "UEFA Conference League Qualifiers"?: string;
}

/**
 * [ℹ] HASURA: scores_football_countries (&_dev)
*/
export interface BETARENA_HASURA_scores_football_countries {
  id?:   number;
  data?: FootballCountriesData;
  name?: string;
} export interface FootballCountriesData {
  id?:         number;
  name?:       string;
  extra?:      FootballCountriesExtra;
  image_path?: string;
} export interface FootballCountriesExtra {
  iso?:          string;
  fifa?:         string;
  flag?:         string;
  iso2?:         string;
  latitude?:     string;
  continent?:    string;
  longitude?:    string;
  sub_region?:   string;
  world_region?: string;
}

/**
 * [ℹ] HASURA: scores_football_players (&_dev)
*/
export interface BETARENA_HASURA_scores_football_players {
  data?:        FootballPlayersData;
  player_id?:   number;
  common_name?: string;
  nationality?: string;
} export interface FootballPlayersData {
  height?:       null | string;
  weight?:       null | string;
  team_id?:      number | null;
  fullname?:     string;
  lastname?:     string;
  birthdate?:    string;
  firstname?:    string;
  player_id?:    number;
  birthplace?:   string;
  country_id?:   number;
  image_path?:   string;
  common_name?:  string;
  nationality?:  string;
  position_id?:  number;
  birthcountry?: string;
  display_name?: string;
  team?:         FootballPlayersTeam;
} export interface FootballPlayersTeam {
  data?: FootballPlayersTeamData;
} export interface FootballPlayersTeamData {
  id?:                number;
  name?:              string;
  founded?:           number;
  twitter?:           string;
  venue_id?:          number;
  legacy_id?:         number;
  logo_path?:         string;
  country_id?:        number;
  short_code?:        string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number;
}

/**
 * [ℹ] HASURA: scores_widget_top_players_translations (&_dev)
*/
export interface BETARENA_HASURA_scores_widget_top_players_translations {
  lang?: string;
  data?: TopPlayersData;
} export interface TopPlayersData {
  goals?:          string;
  player?:         string;
  rating?:         string;
  assists?:        string;
  top_players?:    string;
  total_shots?:    string;
  show_more_less?: string[];
}

/**
 * [ℹ] HASURA: player_positions_translations (&_dev)
*/
export interface BETARENA_HASURA_player_positions_translations {
  lang?:     string;
  position?: { [key: string]: string };
}

/**
 * [ℹ] HASURA: scores_general_translations (&_dev)
*/
export interface BETARENA_HASURA_scores_general_translations {
  lang?:                      string;
  countries?:                 { [key: string]: string }[];
  widgets_no_data_available?: WidgetsNoDataAvailable;
  weekdays?:                  Weekdays;
  months?:                    WelcomeMonths;
} export interface WelcomeMonths {
  months?:              MonthsMonths;
  months_abbreviation?: MonthsAbbreviation;
} export interface MonthsMonths {
  May?:       string;
  July?:      string;
  June?:      string;
  April?:     string;
  March?:     string;
  August?:    string;
  January?:   string;
  October?:   string;
  December?:  string;
  February?:  string;
  November?:  string;
  September?: string;
  Setembro?:  string;
} export interface MonthsAbbreviation {
  Apr?: string;
  Aug?: string;
  Dec?: string;
  Feb?: string;
  Jan?: string;
  Jul?: string;
  Jun?: string;
  Mar?: string;
  May?: string;
  Nov?: string;
  Oct?: string;
  Sep?: string;
  Set?: string;
} export interface Weekdays {
  friday?:    string;
  monday?:    string;
  sunday?:    string;
  tuesday?:   string;
  saturday?:  string;
  thursday?:  string;
  wednesday?: string;
} export interface WidgetsNoDataAvailable {
  no_info?:      string;
  no_info_desc?: string;
}

export interface BETARENA_HASURA_scores_football_seasons_details_aggregate {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}