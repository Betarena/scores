/**
 * This INTERFACE represents the data
 * structure recieved from the Real-Time DB
 * for a specific language location Featured 
 * Betting Site Widget
*/
export interface FeaturedSite {
    position: number            // featured betting site position in the board
    featured_image: string      // featured image of betting site (large-top-3) URL
    image: string               // regular logo-image of betting site
    name: string                // name of the featured betting site
    rating: number              // rating given to the featured betting site
    bonus: string               // bonus prize money of the featured betting site
    description: string         // featured betting site dsctiption referral condition
    conditions: string          // featured site T&Cs
    cta_link: string            // `call-to-action` link for the featured betting site
    conditions_head: string     // heading-value of the `conditions`
}

/**
 * This it the INTERFACE that represents the data
 * structre for the response given from the parsed data
 * on the DB.
*/ 
export interface FinalFeaturedSiteResponseDB {
    site_data_array: Array< FeaturedSite >      // contains the array of `FeaturedSite` data from the website
    site_data_array_length: number              // lenght of the array with the number of featured sites
    title: string                               // contains the `geo-locational` title name of the widget
    show_more_less: string[]                    // show more less widget data translations [0] = 'showMore', [1] = 'showLess'
}

/**
 * This is the INTERFACE that represents the ata
 * structure for the response given from the parsed data
 * on the DB for the SELECTED-FIXURE-INFO-ODDS;
 * 
 * ONLY FOR `1X2FT` for NOW - FOCUSING - THERE ARE MANY OTHERS;
*/
export interface SelectedFixture_LiveOdds_Response {
    fixture_odds: {
        gameid: number
        markets: {
            "1X2FT": {
                bookmaker_deep_link: string
                data: {
                    american: number
                    label: string
                    previous: number
                    status: number
                    value: number
                }[]
            }
        }
    }
    fixture_odds_info: {
        bonus: string
        bonus_code: string
        bonus_description: string
        image: string
        information: string
        position: string
        register_link: string
        review_link: string
        stars: string
        title: string
    }
        
}