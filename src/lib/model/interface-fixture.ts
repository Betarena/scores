
/**
 * INTERFACE 
 * ~~~~~~~~~~~~~
 * ... for the tv_stations of the
 * selected fixture;
*/
interface Tv_Station {
    link: string
    img: string
    Name: string
    alt: string
} 

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * ... for the value-bets part of the
 * selected fixture;
*/
export interface ValueBet {
    fair_odd: string
    stake: number
    bet: string
    is_value: boolean
    odd: number
    bookmaker: string
    image?: string
    link?: string
}

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * ... match votes for the fixture data
*/
export interface MatchVotes {
    match_id: number
    vote_draw_x: number
    vote_win_local: number
    vote_win_visitor: number
}

/**
 * INTERFACE
 * ~~~~~~~~~~~~~
 * ... for the Selected Fixture of the
 * ... response data
*/
export interface FixtureResponse {
    away_team_logo: string            // Team Away Logo;
    away_team_name: string            // Team Away Name;
    country_flag: string              // Country Flag
    fixture_day: Date                 // TimeStamp
    home_team_logo: string            // Home Team Logo;                  
    home_team_name: string            // Home Team Name;
    id: number                        // Fixture ID;
    inserted_at: Date                 // TimeStamp;
    league_name: string               // League Name;
    probabilities: {
        home: string
        away: string
        draw: string 
    }                                 // Probabliylities Data;
    round_name: string                // Round Name
    status: string                    // Status of the Game / Fixture
    time: Date                        // TimeStamp;
    tvstations: Array< Tv_Station >   // Array of TvStations
    valuebets: ValueBet               // Array of value Bets
}