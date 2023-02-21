/**
 * [ℹ] LIVESCORES_NOW [TYPES]
 */

export interface FIREBASE_livescores_now {
	assistants?: Assistants;
	bench?: Bench;
	coaches?: Coaches;
	colors?: Colors;
	commentaries?: boolean;
	corners?: Corners;
	deleted?: boolean;
	formations?: Formations;
	id?: number;
	is_placeholder?: boolean;
	league_id?: number;
	leg?: Leg;
	lineup?: Lineup;
	localCoach?: Coach;
	localTeam?: LocalTeamClass;
	localteam_id?: number;
	neutral_venue?: boolean;
	probability?: Probability;
	referee?: Referee;
	referee_id?: number;
	round?: Round;
	round_id?: number;
	scores?: Scores;
	season_id?: number;
	stage?: Stage;
	stage_id?: number;
	standings?: WelcomeStandings;
	stats?: WelcomeStats;
	time?: Time;
	tvstations?: Tvstations;
	venue?: Venue;
	venue_id?: number;
	visitorCoach?: Coach;
	visitorTeam?: LocalTeamClass;
	visitorteam_id?: number;
	weather_report?: WeatherReport;
	winning_odds_calculated?: boolean;
	cards?: WelcomeCards;
	events?: Events;
	substitutions?: Substitutions;
	valuebet?: Valuebet;
	goals?: WelcomeGoals;
	comments?: Comments;
	other?: Other;
	winner_team_id?: number;
	group?: Group;
	group_id?: number;
}
export interface Assistants {
	first_assistant_id?: number;
	fourth_official_id?: number;
	second_assistant_id?: number;
}
export interface Bench {
	data?: BenchDatum[];
}
export interface BenchDatum {
	fixture_id?: number;
	number?: number;
	player_id?: number;
	player_name?: string;
	position?: Position;
	stats?: DatumStats;
	team_id?: number;
	type?: PurpleType;
	captain?: boolean;
	formation_position?: number;
}
export enum Position {
	A = 'A',
	D = 'D',
	Empty = '',
	G = 'G',
	M = 'M'
}
export interface DatumStats {
	cards?: StatsCards;
	goals?: StatsGoals;
	other?: { [key: string]: number };
	dribbles?: Dribbles;
	duels?: Duels;
	fouls?: Fouls;
	passing?: Passing;
	rating?: string;
	shots?: StatsShots;
}
export interface StatsCards {
	redcards?: number;
	yellowcards?: number;
	yellowredcards?: number;
}
export interface Dribbles {
	attempts?: number;
	dribbled_past?: number;
	success?: number;
}
export interface Duels {
	total?: number;
	won?: number;
}
export interface Fouls {
	committed?: number;
	drawn?: number;
}
export interface StatsGoals {
	assists?: number;
	conceded?: number;
	owngoals?: number;
	scored?: number;
	team_conceded?: number;
}
export interface Passing {
	accurate_passes?: number;
	crosses_accuracy?: number;
	key_passes?: number;
	passes?: number;
	passes_accuracy?: number;
	total_crosses?: number;
}
export interface StatsShots {
	shots_on_goal?: number;
	shots_total?: number;
}
export enum PurpleType {
	Bench = 'bench',
	Lineup = 'lineup'
}
export interface WelcomeCards {
	data?: CardsDatum[];
}
export interface CardsDatum {
	fixture_id?: number;
	id?: number;
	minute?: number;
	player_id?: number;
	player_name?: string;
	team_id?: string;
	type?: FluffyType;
	extra_minute?: number;
	result?: string;
	on_pitch?: boolean;
	player_assist_id?: number;
	player_assist_name?: string;
}
export enum FluffyType {
	Goal = 'goal',
	MissedPenalty = 'missed_penalty',
	OwnGoal = 'own-goal',
	Penalty = 'penalty',
	Substitution = 'substitution',
	Var = 'var',
	Yellowcard = 'yellowcard'
}
export interface Coaches {
	localteam_coach_id?: number;
	visitorteam_coach_id?: number;
}
export interface Colors {
	localteam?: Team;
	visitorteam?: Team;
}
export interface Team {
	color?: string;
	kit_colors?: string;
}
export interface Comments {
	data?: CommentsDatum[];
}
export interface CommentsDatum {
	comment?: string;
	fixture_id?: number;
	goal?: boolean;
	important?: boolean;
	minute?: number;
	order?: number;
	extra_minute?: number;
}
export interface Corners {
	data?: CornersDatum[];
}
export interface CornersDatum {
	comment?: string;
	fixture_id?: number;
	id?: number;
	minute?: number;
	team_id?: number;
	extra_minute?: number;
}
export interface Events {
	data?: EventsDatum[];
}
export interface EventsDatum {
	fixture_id?: number;
	id?: number;
	minute?: number;
	on_pitch?: boolean;
	player_id?: number;
	player_name?: string;
	team_id?: string;
	type?: FluffyType;
	related_player_id?: number;
	related_player_name?: string;
	injuried?: boolean;
	extra_minute?: number;
	result?: string;
	reason?: string;
	var_result?: string;
	player_assist_id?: number;
	player_assist_name?: string;
}
export interface Formations {
	localteam_formation?: string;
	visitorteam_formation?: string;
}
export interface WelcomeGoals {
	data?: GoalsDatum[];
}
export interface GoalsDatum {
	fixture_id?: number;
	id?: number;
	minute?: number;
	player_assist_id?: number;
	player_assist_name?: string;
	player_id?: number;
	player_name?: string;
	result?: string;
	team_id?: string;
	type?: FluffyType;
	extra_minute?: number;
	on_pitch?: boolean;
	reason?: string;
	related_player_id?: number;
	related_player_name?: string;
}
export interface Group {
	data?: GroupData;
}
export interface GroupData {
	id?: number;
	league_id?: number;
	name?: string;
	resource?: string;
	round_id?: number;
	round_name?: number;
	season_id?: number;
	stage_id?: number;
	stage_name?: string;
	standings?: DataStandings;
}
export interface DataStandings {
	data?: StandingsDatum[];
}
export interface StandingsDatum {
	away?: Away;
	group_id?: number;
	group_name?: string;
	home?: Away;
	overall?: Away;
	points?: number;
	position?: number;
	recent_form?: string;
	round_id?: number;
	round_name?: number;
	team_id?: number;
	team_name?: string;
	total?: Total;
	result?: string;
}
export interface Away {
	draw?: number;
	games_played?: number;
	goals_against?: number;
	goals_scored?: number;
	lost?: number;
	points?: number;
	won?: number;
}
export interface Total {
	goal_difference?: string;
	points?: number;
}
export enum Leg {
	The11 = '1/1'
}
export interface Lineup {
	data?: BenchDatum[];
}
export interface Coach {
	data?: LocalCoachData;
}
export interface LocalCoachData {
	birthcountry?: string;
	birthdate?: string;
	birthplace?: string;
	coach_id?: number;
	common_name?: string;
	country_id?: number;
	firstname?: string;
	fullname?: string;
	lastname?: string;
	nationality?: string;
	team_id?: number;
	image_path?: string;
}
export interface LocalTeamClass {
	data?: LocalTeamData;
}
export interface LocalTeamData {
	country_id?: number;
	current_season_id?: number;
	founded?: number;
	id?: number;
	is_placeholder?: boolean;
	legacy_id?: number;
	logo_path?: string;
	name?: string;
	national_team?: boolean;
	venue_id?: number;
	short_code?: string;
}
export interface Other {
	data?: OtherDatum[];
}
export interface OtherDatum {
	fixture_id?: number;
	player_id?: number;
	player_name?: string;
	team_id?: number;
	type?: FluffyType;
}
export interface Probability {
	data?: ProbabilityData;
}
export interface ProbabilityData {
	fixture_id?: number;
	predictions?: PurplePredictions;
}
export interface PurplePredictions {
	AT_over_0_5?: number;
	AT_over_1_5?: number;
	AT_under_0_5?: number;
	AT_under_1_5?: number;
	HT_over_0_5?: number;
	HT_over_1_5?: number;
	HT_under_0_5?: number;
	HT_under_1_5?: number;
	away?: number;
	btts?: number;
	correct_score?: { [key: string]: number };
	draw?: number;
	home?: number;
	over_2_5?: number;
	over_3_5?: number;
	under_2_5?: number;
	under_3_5?: number;
}
export interface Referee {
	data?: RefereeData;
}
export interface RefereeData {
	common_name?: string;
	firstname?: string;
	fullname?: string;
	id?: number;
	lastname?: string;
}
export interface Round {
	data?: RoundData;
}
export interface RoundData {
	end?: string;
	id?: number;
	league_id?: number;
	name?: number;
	season_id?: number;
	stage_id?: number;
	start?: string;
}
export interface Scores {
	localteam_score?: number;
	visitorteam_score?: number;
	ft_score?: string;
	ht_score?: string;
	et_score?: string;
	ps_score?: string;
}
export interface Stage {
	data?: StageData;
}
export interface StageData {
	has_outgroup_matches?: number;
	has_standings?: boolean;
	id?: number;
	league_id?: number;
	name?: string;
	season_id?: number;
	sort_order?: number;
	type?: DataType;
}
export enum DataType {
	GroupStage = 'Group Stage'
}
export interface WelcomeStandings {
	localteam_position?: number;
	visitorteam_position?: number;
}
export interface WelcomeStats {
	data?: StatsDatum[];
}
export interface StatsDatum {
	attacks?: Attacks;
	ball_safe?: number;
	corners?: number;
	fixture_id?: number;
	fouls?: number;
	goals?: number;
	offsides?: number;
	passes?: Passes;
	penalties?: number;
	possessiontime?: number;
	redcards?: number;
	saves?: number;
	shots?: DatumShots;
	substitutions?: number;
	tackles?: number;
	team_id?: number;
	yellowcards?: number;
	yellowredcards?: number;
	goal_attempts?: number;
	injuries?: number;
}
export interface Attacks {
	attacks?: number;
	dangerous_attacks?: number;
}
export interface Passes {
	accurate?: number;
	percentage?: number;
	total?: number;
}
export interface DatumShots {
	blocked?: number;
	insidebox?: number;
	offgoal?: number;
	ongoal?: number;
	outsidebox?: number;
	total?: number;
}
export interface Substitutions {
	data?: SubstitutionsDatum[];
}
export interface SubstitutionsDatum {
	fixture_id?: number;
	id?: number;
	minute?: number;
	player_in_id?: number;
	player_in_name?: string;
	player_out_id?: number;
	player_out_name?: string;
	team_id?: string;
	type?: TentacledType;
	injuried?: boolean;
}
export enum TentacledType {
	Subst = 'subst'
}
export interface Time {
	minute?: number;
	second?: string;
	starting_at?: StartingAt;
	status?: Status;
}
export interface StartingAt {
	date?: string;
	date_time?: string;
	time?: string;
	timestamp?: number;
	timezone?: Timezone;
}
export enum Timezone {
	UTC = 'UTC'
}
export enum Status {
	Ft = 'FT',
	HT = 'HT',
	Live = 'LIVE'
}
export interface Tvstations {
	data?: TvstationsDatum[];
}
export interface TvstationsDatum {
	fixture_id?: number;
	tvstation?: string;
}
export interface Valuebet {
	data?: ValuebetData;
}
export interface ValuebetData {
	fixture_id?: number;
	predictions?: FluffyPredictions;
}
export interface FluffyPredictions {
	bet?: string;
	bookmaker?: string;
	fair_odd?: number;
	is_value?: boolean;
	odd?: number;
	stake?: number;
}
export interface Venue {
	data?: VenueData;
}
export interface VenueData {
	address?: string;
	capacity?: number;
	city?: string;
	coordinates?: string;
	id?: number;
	image_path?: string;
	name?: string;
	surface?: Surface;
}
export enum Surface {
	Grass = 'grass'
}
export interface WeatherReport {
	clouds?: string;
	code?: Code;
	coordinates?: Coordinates;
	humidity?: string;
	icon?: string;
	pressure?: number;
	temperature?: Temperature;
	temperature_celcius?: Temperature;
	type?: string;
	updated_at?: string;
	wind?: Wind;
}
export enum Code {
	Clear = 'clear',
	Clouds = 'clouds'
}
export interface Coordinates {
	lat?: number;
	lon?: number;
}
export interface Temperature {
	temp?: number;
	unit?: Unit;
}
export enum Unit {
	Celcius = 'celcius',
	Fahrenheit = 'fahrenheit'
}
export interface Wind {
	degree?: number;
	speed?: string;
}

/**
 * [ℹ] ODDS [TYPES]
 */
export interface FIREBASE_odds {
	gameid?: number;
	markets?: { [key: string]: The1X2FTValue };
	// [ℹ] extra
	sportbook?: string;
}
export interface The1X2FTValue {
	bookmaker_deep_link?: string;
	data?: The1X2FTDatum[];
	label?: string;
	last_update?: string;
	live?: boolean;
}
export interface The1X2FTDatum {
	american?: string;
	dp3?: string;
	label?: string;
	previous?: number;
	probability?: string;
	status?: number;
	value?: number;
	total?: string;
}
