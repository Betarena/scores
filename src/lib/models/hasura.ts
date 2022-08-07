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


/**
 * [ℹ] HASURA: scores_football_leagues (&_dev)
*/
export interface BETARENA_HASURA_scores_football_leagues {
  country?: ScoresFootballLeaguesDataClass;
  data?:    Data;
  id?:      number;
  name?:    string;
  season?:  ScoresFootballLeaguesSeasonElement;
  seasons?: ScoresFootballLeaguesSeasonElement[];
} export interface ScoresFootballLeaguesDataClass {
  extra?:      Extra | null;
  image_path?: string;
  name?:       string;
  id?:         number;
} export interface ScoresFootballLeaguesExtra {
  iso2?:         string;
  world_region?: string;
  iso?:          string;
  latitude?:     string;
  sub_region?:   string;
  flag?:         string;
  fifa?:         string;
  longitude?:    string;
  continent?:    string;
} export interface ScoresFootballLeaguesData {
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
} export interface ScoresFootballLeaguesDataCountry {
  data?: DataClass;
} export interface ScoresFootballLeaguesCoverage {
  topscorer_assists?: boolean;
  topscorer_goals?:   boolean;
  predictions?:       boolean;
  topscorer_cards?:   boolean;
} export interface ScoresFootballLeaguesDataSeason {
  data?: SeasonElement;
} export interface ScoresFootballLeaguesSeasonElement {
  league_id?:         number;
  current_stage_id?:  number | null;
  name?:              string;
  id?:                number;
  is_current_season?: boolean;
  current_round_id?:  number | null;
} export interface ScoresFootballLeaguesSeasons {
  data?: SeasonElement[];
}

/**
 * [ℹ] HASURA: scores_football_seasons_details_aggregate (&_dev)
*/
export interface BETARENA_HASURA_scores_football_seasons_details_aggregate {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}

/**
 * [ℹ] HASURA: scores_football_seasons_details (&_dev)
*/
export interface BETARENA_HASURA_scores_football_seasons_details {
  data_stats?:        SeasonDetailsDataStats;
  default_data?:      SeasonDetailsDefaultData;
  end_date?:          Date;
  id?:                number;
  is_current_season?: boolean;
  league_id?:         number;
  round_data?:        SeasonDetailsRoundDatum[];
  start_date?:        Date;
  goalscorers?:       SeasonDetailsGoalscorers[];
  assistscorers?:     SeasonDetailsAssistscorers[];
  squad?:             SeasonDetailsSquad[];
} export interface SeasonDetailsDataStats {
  id?:                                    number;
  btts?:                                  number;
  goal_line?:                             GoalLine;
  league_id?:                             number;
  season_id?:                             number;
  updated_at?:                            Date;
  goals_scored?:                          SeasonDetailsDefeatPercentage;
  goals_conceded?:                        SeasonDetailsDefeatPercentage;
  win_percentage?:                        SeasonDetailsDefeatPercentage;
  draw_percentage?:                       number;
  number_of_clubs?:                       number;
  number_of_goals?:                       number;
  avg_player_rating?:                     number;
  defeat_percentage?:                     SeasonDetailsDefeatPercentage;
  number_of_matches?:                     number;
  number_of_redcards?:                    number;
  avg_goals_per_match?:                   number;
  season_topscorer_id?:                   number;
  goals_scored_minutes?:                  SeasonDetailsGoalsScoredMinutes;
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
} export interface SeasonDetailsDefeatPercentage {
  all?:  number;
  away?: number;
  home?: number;
} export interface SeasonDetailsGoalLine {
  over?:  { [key: string]: number };
  under?: { [key: string]: number };
} export interface SeasonDetailsGoalsScoredMinutes {
  "0-15"?:  string;
  "15-30"?: string;
  "30-45"?: string;
  "45-60"?: string;
  "60-75"?: string;
  "75-90"?: string;
} export interface SeasonDetailsDefaultData {
  id?:               number;
  name?:             string;
  end_date?:         Date;
  league_id?:        number;
  start_date?:       Date;
  current_round_id?: number;
  current_stage_id?: number;
} export interface SeasonDetailsRoundDatum {
  id?:        number;
  end?:       Date;
  name?:      number;
  start?:     Date;
  stage_id?:  number;
  league_id?: number;
  season_id?: number;
} export interface SeasonDetailsGoalscorers {
  type?:          string;
  goals?:         number;
  team_id?:       number;
  position?:      number;
  stage_id?:      number;
  player_id?:     number;
  season_id?:     number;
  team_name?:     string;
  player_name?:   null;
  penalty_goals?: number;
} export interface SeasonDetailsAssistscorers {
  type?:        string;
  assists?:     number;
  team_id?:     number;
  position?:    number;
  stage_id?:    number;
  player_id?:   number;
  season_id?:   number;
  team_name?:   string;
  player_name?: null;
} export interface SeasonDetailsSquad {
  id?:                number;
  name?:              string;
  squad?:             SeasonDetailsSquadSub;
  founded?:           number | null;
  twitter?:           null;
  logoPath?:          null;
  venue_id?:          number | null;
  legacy_id?:         number | null;
  country_id?:        number;
  short_code?:        null | string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number | null;
} export interface SeasonDetailsSquadSub {
  data?: SeasonDetailsSquadDatum[];
} export interface SeasonDetailsSquadDatum {
  duels?:                SeasonDetailsSquadDuels;
  fouls?:                SeasonDetailsSquadFouls;
  goals?:                number;
  saves?:                null;
  shots?:                SeasonDetailsSquadShots;
  blocks?:               null;
  number?:               number | null;
  passes?:               SeasonDetailsSquadPasses;
  rating?:               string | null;
  assists?:              number;
  captain?:              number;
  crosses?:              SeasonDetailsSquadCrosses;
  injured?:              boolean;
  lineups?:              number;
  minutes?:              number;
  tackles?:              null;
  dribbles?:             SeasonDetailsSquadDribbles;
  hit_post?:             null;
  owngoals?:             null;
  redcards?:             number;
  penalties?:            SeasonDetailsSquadPenalties;
  player_id?:            number;
  yellowred?:            number;
  appearences?:          number;
  cleansheets?:          null;
  dispossesed?:          null;
  player_name?:          null | string;
  position_id?:          number;
  yellowcards?:          number;
  interceptions?:        null;
  substitute_in?:        number;
  substitute_out?:       number;
  inside_box_saves?:     null;
  substitutes_on_bench?: number;
} export interface SeasonDetailsSquadCrosses {
  total?:    null;
  accurate?: null;
} export interface SeasonDetailsSquadDribbles {
  success?:       null;
  attempts?:      null;
  dribbled_past?: null;
} export interface SeasonDetailsSquadDuels {
  won?:   null;
  total?: null;
} export interface SeasonDetailsSquadFouls {
  drawn?:     null;
  committed?: null;
} export interface SeasonDetailsSquadPasses {
  total?:      null;
  accuracy?:   null;
  key_passes?: null;
} export interface SeasonDetailsSquadPenalties {
  won?:       null;
  saves?:     null;
  missed?:    null;
  scores?:    null;
  committed?: null;
} export interface SeasonDetailsSquadShots {
  shots_total?:      null;
  shots_on_target?:  null;
  shots_off_target?: null;
}

/**
 * [ℹ] HASURA: sportsbook_details (&_dev)
*/
export interface BETARENA_HASURA_sportsbook_details {
  data?: { [key: string]: Sportbook };
  lang?: string;
} export interface Sportbook {
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

/**
 * [ℹ] HASURA: scores_widget_league_info_translations (&_dev)
*/
export interface BETARENA_HASURA_scores_widget_league_info_translations {
  data?: DataLang;
  lang?: string;
} export interface DataLang {
  stats?:     string;
  teams?:     string;
  content?:   string;
  overview?:  string;
  following?: string;
}

/**
 * [ℹ] HASURA: scores_league_list (&_dev)
*/
export interface BETARENA_HASURA_scores_league_list {
  country_id:     number
  country_name:   string
  image_path:     string
  league_id:      number
  league_name:    string
  logo_path:      string
  type:           string
}

/**
 * [ℹ] HASURA: leagues_filtered_country (&_dev)
*/
export interface BETARENA_HASURA_leagues_filtered_country {
  lang: string
  leagues: {
    league_id: number
  }[]
}

/**
 * [ℹ] HASURA: scores_leagues_list_translations (&_dev)
*/
export interface BETARENA_HASURA_scores_leagues_list_translations {
  lang: string
  translations: {
    search_form: string
    top_leagues: string
    leagues_by_country: string
    widget_title: string
    competitions_results: string
    countries_results: string
    full_list: string
    no_results: string
    hide: string
  }
}

/**
 * [ℹ] HASURA: scores_tournaments (&_dev)
*/
export interface BETARENA_HASURA_scores_tournaments {
  author?:        ScoresTournamentsAuthor;
  country?:       string;
  date?:          Date;
  id?:            number;
  lang?:          ScoresTournamentsLang;
  modified_date?: Date;
  name?:          string;
  sport?:         ScoresTournamentsSport;
  status?:        ScoresTournamentsStatus;
  title?:         ScoresTournamentsTitle;
  tournament_id?: number;
  type?:          ScoresTournamentsType;
  widgets?:       any[];
  urls?:          ScoresTournamentsUrls;
} export enum ScoresTournamentsAuthor {
  Betarena = "Betarena",
} export enum ScoresTournamentsLang {
  Br = "br",
  En = "en",
  Es = "es",
  It = "it",
  Pt = "pt",
  Ro = "ro",
} export enum ScoresTournamentsSport {
  Calcio = "calcio",
  Football = "football",
  Fotbal = "fotbal",
  Futebol = "futebol",
  Fútbol = "Fútbol",
} export enum ScoresTournamentsStatus {
  Draft = "draft",
  Published = "published",
} export enum ScoresTournamentsTitle {
  EnDirecto = "en directo",
  LiveScore = "live score",
  Resultados = "resultados",
  ResultadosAoVivo = "resultados ao vivo",
  RezultateLive = "Rezultate Live",
} export enum ScoresTournamentsType {
  CupInternational = "cup_international",
  Domestic = "domestic",
  DomesticCup = "domestic_cup",
  International = "international",
} export interface ScoresTournamentsUrls {
  br?: string;
  en?: string;
  es?: string;
  it?: string;
  pt?: string;
  ro?: string;
}