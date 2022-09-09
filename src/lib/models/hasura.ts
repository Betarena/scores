/**
 * [ℹ] HASURA: scores_football_standings (&)
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
 * [ℹ] HASURA: scores_football_standings_history (&)
*/

export interface BETARENA_HASURA_scores_football_standings_history {
  id?:        number;
  data?:      StandingsDatum[];
  name?:      string;
  season_id?: number;
  type?:      string;
}

/**
 * [ℹ] HASURA: scores_team_statistics (&)
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
 * [ℹ] HASURA: scores_team_statistics_history (&)
 * [ℹ] based-of: scores_team_statistics (&)
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
 * [ℹ] HASURA: scores_widget_standings_translations (&)
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
 * [ℹ] HASURA: scores_football_teams (&)
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
 * [ℹ] HASURA: color_codes_league_standings_positions (&)
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
 * [ℹ] HASURA: scores_football_countries (&)
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
 * [ℹ] HASURA: scores_football_players (&)
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
 * [ℹ] HASURA: scores_widget_top_players_translations (&)
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
 * [ℹ] HASURA: player_positions_translations (&)
*/
export interface BETARENA_HASURA_player_positions_translations {
  lang?:     string;
  position?: { [key: string]: string };
}

/**
 * [ℹ] HASURA: scores_general_translations (&)
*/
export interface BETARENA_HASURA_scores_general_translations {
  lang?:                      string;
  countries?:                 { [key: string]: string };
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
 * [ℹ] HASURA: scores_football_leagues (&)
*/
export interface BETARENA_HASURA_scores_football_leagues {
  country?: ScoresFootballLeaguesDataClass;
  data?:    Data;
  id?:      number;
  name?:    string;
  season?:  ScoresFootballLeaguesSeasonElement;
  seasons?: ScoresFootballLeaguesSeasonElement[];
} export interface ScoresFootballLeaguesDataClass {
  extra?:      ScoresFootballLeaguesExtra | null;
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
  season?:            ScoresFootballLeaguesDataSeason;
  country?:           ScoresFootballLeaguesDataCountry;
  current_stage_id?:  number;
  is_cup?:            boolean;
  coverage?:          ScoresFootballLeaguesCoverage;
  live_standings?:    boolean;
  active?:            boolean;
  name?:              string;
  is_friendly?:       boolean;
  id?:                number;
  type?:              string;
  seasons?:           ScoresFootballLeaguesSeasons;
  current_round_id?:  null;
  current_season_id?: number;
  logo_path?:         string;
} export interface ScoresFootballLeaguesDataCountry {
  data?: ScoresFootballLeaguesDataClass;
} export interface ScoresFootballLeaguesCoverage {
  topscorer_assists?: boolean;
  topscorer_goals?:   boolean;
  predictions?:       boolean;
  topscorer_cards?:   boolean;
} export interface ScoresFootballLeaguesDataSeason {
  data?: ScoresFootballLeaguesSeasonElement;
} export interface ScoresFootballLeaguesSeasonElement {
  league_id?:         number;
  current_stage_id?:  number | null;
  name?:              string;
  id?:                number;
  is_current_season?: boolean;
  current_round_id?:  number | null;
} export interface ScoresFootballLeaguesSeasons {
  data?: ScoresFootballLeaguesSeasonElement[];
}

/**
 * [ℹ] HASURA: scores_football_seasons_details_aggregate (&)
*/
export interface BETARENA_HASURA_scores_football_seasons_details_aggregate {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}

/**
 * [ℹ] HASURA: scores_football_seasons_details (&)
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
 * [ℹ] HASURA: sportsbook_details (&)
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
 * [ℹ] HASURA: scores_widget_league_info_translations (&)
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
 * [ℹ] HASURA: scores_league_list (&)
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
 * [ℹ] HASURA: leagues_filtered_country (&)
*/
export interface BETARENA_HASURA_leagues_filtered_country {
  lang: string
  leagues: {
    league_id: number
  }[]
}

/**
 * [ℹ] HASURA: scores_leagues_list_translations (&)
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
 * [ℹ] HASURA: scores_tournaments (&)
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

/**
 * [ℹ] HASURA: scores_standings_home_widget_translations (&)
*/
export interface BETARENA_HASURA_scores_standings_home_widget_translations {
  games: string
  lang: string
  points: string
  title: string
}

/**
 * [ℹ] HASURA: historic_fixtures_aggregate (&)
*/
export interface BETARENA_HASURA_historic_fixtures_aggregate {
  aggregate?: Aggregate;
} export interface Aggregate {
  totalCount?: number;
}

/**
 * [ℹ] HASURA: historic_fixtures (&)
*/
export interface BETARENA_HASURA_historic_fixtures {
  id?:              number;
  fixture_day?:     string;
  league_name?:     string;
  country_flag?:    string;
  home_team_logo?:  string;
  away_team_logo?:  string;
  away_team_name?:  string;
  status?:          Status;
  tvstations?:      any[];
  inserted_at?:     string;
  time?:            string;
  home_team_name?:  string;
  round_name?:      string;
  data?:            WelcomeData;
  league_id?:       number;
  probabilities?:   Probabilities | null;
  valuebets?:       null;
  tip_link_wp?:     null;
  fixture_link_wp?: null;
  media_link?:      null;
} export interface WelcomeData {
  id?:                      number;
  leg?:                     Leg;
  time?:                    Time;
  bench?:                   Bench;
  cards?:                   GoalsClass;
  goals?:                   GoalsClass;
  other?:                   Bench;
  pitch?:                   null;
  round?:                   Round;
  stage?:                   Stage;
  stats?:                   DataStats;
  venue?:                   Venue;
  colors?:                  Colors | null;
  events?:                  Events;
  league?:                  League;
  lineup?:                  Bench;
  scores?:                  Scores;
  coaches?:                 Coaches;
  corners?:                 Corners;
  deleted?:                 boolean;
  details?:                 null;
  comments?:                Bench;
  group_id?:                null;
  round_id?:                number;
  shootout?:                Bench;
  stage_id?:                number;
  venue_id?:                number | null;
  league_id?:               number;
  localTeam?:               LocalTeamClass;
  season_id?:               number;
  sidelined?:               Bench;
  standings?:               Standings;
  assistants?:              Assistants;
  attendance?:              null;
  formations?:              Formations;
  referee_id?:              number | null;
  tvstations?:              Bench;
  probability?:             Probability;
  visitorTeam?:             LocalTeamClass;
  aggregate_id?:            null;
  commentaries?:            boolean;
  localteam_id?:            number;
  neutral_venue?:           boolean;
  substitutions?:           Bench;
  is_placeholder?:          boolean;
  visitorteam_id?:          number;
  weather_report?:          WeatherReport | null;
  winner_team_id?:          number | null;
  winning_odds_calculated?: boolean;
  referee?:                 Referee;
  localCoach?:              Coach;
  visitorCoach?:            Coach;
} export interface Assistants {
  first_assistant_id?:  null;
  fourth_official_id?:  null;
  second_assistant_id?: null;
} export interface Bench {
  data?: BenchDatum[];
} export interface BenchDatum {
  posx?:                null;
  posy?:                null;
  type?:                DatumType;
  stats?:               DatumStats;
  number?:              null;
  captain?:             null;
  team_id?:             number;
  position?:            Position;
  player_id?:           number;
  fixture_id?:          number;
  player_name?:         string;
  formation_position?:  number | null;
  additional_position?: null;
} export enum Position {
  A = "A",
  D = "D",
  G = "G",
  M = "M",
} export interface DatumStats {
  cards?:    StatsCards;
  duels?:    Duels;
  fouls?:    Fouls;
  goals?:    Goals;
  other?:    { [key: string]: number | null };
  shots?:    StatsShots;
  rating?:   null;
  passing?:  Passing;
  dribbles?: Dribbles;
} export interface StatsCards {
  redcards?:       number;
  yellowcards?:    number;
  yellowredcards?: number;
} export interface Dribbles {
  success?:       null;
  attempts?:      null;
  dribbled_past?: null;
} export interface Duels {
  won?:   null;
  total?: null;
} export interface Fouls {
  drawn?:     null;
  committed?: null;
} export interface Goals {
  scored?:        number;
  assists?:       number;
  conceded?:      number;
  owngoals?:      number;
  team_conceded?: number;
} export interface Passing {
  passes?:           null;
  key_passes?:       null;
  total_crosses?:    null;
  accurate_passes?:  null;
  passes_accuracy?:  null;
  crosses_accuracy?: null;
} export interface StatsShots {
  shots_total?:   null;
  shots_on_goal?: null;
} export enum DatumType {
  Bench = "bench",
  Lineup = "lineup",
} export interface GoalsClass {
  data?: CardsDatum[];
} export interface CardsDatum {
  id?:                 number;
  type?:               string;
  minute?:             number;
  reason?:             null;
  team_id?:            string;
  on_pitch?:           null;
  player_id?:          number;
  fixture_id?:         number;
  player_name?:        string;
  extra_minute?:       number | null;
  player_assist_id?:   null;
  player_assist_name?: null;
  result?:             string;
} export interface Coaches {
  localteam_coach_id?:   number | null;
  visitorteam_coach_id?: number | null;
} export interface Colors {
  localteam?:   Team;
  visitorteam?: Team;
} export interface Team {
  color?:      string;
  kit_colors?: string;
} export interface Corners {
  data?: CornersDatum[];
} export interface CornersDatum {
  id?:           number;
  minute?:       number;
  comment?:      string;
  team_id?:      number;
  fixture_id?:   number;
  extra_minute?: null;
} export interface Events {
  data?: EventsDatum[];
} export interface EventsDatum {
  id?:                  number;
  type?:                string;
  minute?:              number;
  reason?:              null;
  result?:              null | string;
  team_id?:             string;
  injuried?:            null;
  on_pitch?:            boolean;
  player_id?:           number;
  fixture_id?:          number;
  var_result?:          null;
  player_name?:         string;
  extra_minute?:        number | null;
  related_player_id?:   null;
  related_player_name?: null;
} export interface Formations {
  localteam_formation?:   null;
  visitorteam_formation?: null;
} export interface League {
  data?: LeagueData;
} export interface LeagueData {
  id?:                number;
  name?:              string;
  type?:              PurpleType;
  active?:            boolean;
  is_cup?:            boolean;
  coverage?:          Coverage;
  legacy_id?:         number | null;
  logo_path?:         string;
  country_id?:        number;
  is_friendly?:       boolean;
  live_standings?:    boolean;
  current_round_id?:  number | null;
  current_stage_id?:  number | null;
  current_season_id?: number;
} export interface Coverage {
  predictions?:       boolean;
  topscorer_cards?:   boolean;
  topscorer_goals?:   boolean;
  topscorer_assists?: boolean;
} export enum PurpleType {
  Domestic = "domestic",
} export enum Leg {
  The11 = "1/1",
} export interface Coach {
  data?: LocalCoachData;
} export interface LocalCoachData {
  team_id?:      number;
  coach_id?:     number;
  fullname?:     string;
  lastname?:     string;
  birthdate?:    null | string;
  firstname?:    string;
  birthplace?:   null;
  country_id?:   number;
  image_path?:   null;
  common_name?:  string;
  nationality?:  string;
  birthcountry?: string;
} export interface LocalTeamClass {
  data?: LocalTeamData;
} export interface LocalTeamData {
  id?:                number;
  name?:              string;
  founded?:           number | null;
  twitter?:           null;
  venue_id?:          number | null;
  legacy_id?:         number | null;
  logo_path?:         string;
  country_id?:        number;
  short_code?:        null | string;
  national_team?:     boolean;
  is_placeholder?:    boolean;
  current_season_id?: number;
} export interface Probability {
  data?: ProbabilityData;
} export interface ProbabilityData {
  fixture_id?:  number;
  predictions?: Probabilities;
} export interface Probabilities {
  away?:          number;
  btts?:          number;
  draw?:          number;
  home?:          number;
  over_2_5?:      number;
  over_3_5?:      number;
  under_2_5?:     number;
  under_3_5?:     number;
  AT_over_0_5?:   number;
  AT_over_1_5?:   number;
  HT_over_0_5?:   number;
  HT_over_1_5?:   number;
  AT_under_0_5?:  number;
  AT_under_1_5?:  number;
  HT_under_0_5?:  number;
  HT_under_1_5?:  number;
  correct_score?: { [key: string]: number };
} export interface Referee {
  data?: RefereeData;
} export interface RefereeData {
  id?:          number;
  fullname?:    string;
  lastname?:    string;
  firstname?:   string;
  common_name?: string;
} export interface Round {
  data?: RoundData;
} export interface RoundData {
  id?:        number;
  end?:       string;
  name?:      number;
  start?:     string;
  stage_id?:  number;
  league_id?: number;
  season_id?: number;
} export interface Scores {
  et_score?:              null;
  ft_score?:              null | string;
  ht_score?:              null | string;
  ps_score?:              null;
  localteam_score?:       number;
  visitorteam_score?:     number;
  localteam_pen_score?:   null;
  visitorteam_pen_score?: null;
} export interface Stage {
  data?: StageData;
} export interface StageData {
  id?:                   number;
  name?:                 string;
  type?:                 FluffyType;
  league_id?:            number;
  season_id?:            number;
  sort_order?:           number;
  has_standings?:        boolean;
  has_outgroup_matches?: number;
} export enum FluffyType {
  GroupStage = "Group Stage",
} export interface Standings {
  localteam_position?:   number | null;
  visitorteam_position?: number | null;
} export interface DataStats {
  data?: StatsDatum[];
} export interface StatsDatum {
  fouls?:          null;
  goals?:          number;
  saves?:          null;
  shots?:          DatumShots;
  passes?:         null;
  attacks?:        Attacks;
  corners?:        number;
  tackles?:        null;
  team_id?:        number;
  injuries?:       null;
  offsides?:       null;
  redcards?:       number;
  throw_in?:       null;
  ball_safe?:      null;
  free_kick?:      null;
  goal_kick?:      null;
  penalties?:      number;
  fixture_id?:     number;
  yellowcards?:    number;
  goal_attempts?:  null;
  substitutions?:  number;
  possessiontime?: null;
  yellowredcards?: null;
} export interface Attacks {
  attacks?:           number;
  dangerous_attacks?: number;
} export interface DatumShots {
  total?:      number;
  ongoal?:     number;
  blocked?:    null;
  offgoal?:    number;
  insidebox?:  null;
  outsidebox?: null;
} export interface Time {
  minute?:       number | null;
  second?:       null;
  status?:       Status;
  added_time?:   null;
  injury_time?:  null;
  starting_at?:  StartingAt;
  extra_minute?: null;
} export interface StartingAt {
  date?:      string;
  time?:      string;
  timezone?:  Timezone;
  date_time?: string;
  timestamp?: number;
} export enum Timezone {
  UTC = "UTC",
} export enum Status {
  Ft = "FT",
  NS = "NS",
  Tba = "TBA",
} export interface Venue {
  data?: VenueData;
} export interface VenueData {
  id?:          number;
  city?:        string;
  name?:        string;
  address?:     null | string;
  surface?:     string;
  capacity?:    number;
  image_path?:  null | string;
  coordinates?: string;
} export interface WeatherReport {
  code?:                string;
  icon?:                string;
  type?:                string;
  wind?:                Wind;
  clouds?:              string;
  humidity?:            string;
  pressure?:            number;
  updated_at?:          string;
  coordinates?:         Coordinates;
  temperature?:         Temperature;
  temperature_celcius?: Temperature;
} export interface Coordinates {
  lat?: number;
  lon?: number;
} export interface Temperature {
  temp?: number;
  unit?: string;
} export interface Wind {
  speed?:  string;
  degree?: number;
} export interface MediaLinkWelcome {
  id?:             number;
  date?:           string;
  league?:         string;
  country?:        string;
  thumbnail?:      string;
  teams_name?:     MediaLinkTeamsName;
  video_link?:     string;
  video_title?:    string;
  video_subtitle?: string;
} export interface MediaLinkTeamsName {
  local?:   string;
  visitor?: string;
}


/**
 * [ℹ] HASURA: scores_widget_football_fixtures_odds_translations (&)
*/
export interface BETARENA_HASURA_scores_widget_football_fixtures_odds_translations {
  lang?:         string;
  translations?: FixturesOddsTranslations;
} export interface FixturesOddsTranslations {
  tip?:     string;
  odds?:    string;
  week?:    string;
  round?:   string;
  matches?: string;
}


/**
 * [ℹ] HASURA: scores_livescore_football_translations (&)
*/
export interface BETARENA_HASURA_scores_livescore_football_translations {
  lang?:       string;
  status_abv?: Array<string[]>;
}


/**
 * [ℹ] HASURA: widget_league_info_translations (&)
*/
export interface BETARENA_HASURA_widget_league_info_translations {
  lang?: string;
  data?: WidgetLeagueInfo2Data;
} export interface WidgetLeagueInfo2Data {
  clubs?:                 string;
  goals?:                 string;
  league_info?:           string;
  average_goals?:         string;
  win_percentage?:        string;
  average_player_rating?: string;
}