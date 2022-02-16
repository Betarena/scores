/**
 * This INTERFACE represents the data
 * structure recieved from the Real-Time DB
 * for a specific language location Featured
 * Betting Site Widget
 */
 export interface FeaturedSite {
    position: number            // ... featured betting site position in the board
    image: string               // ... featured image of betting site (large-top-3) URL
    stars: string               // ... rating given to the featured betting site
    bonus: string               // ... bonus prize money of the featured betting site;
    bonus_code: string          // ... bonus code INFO;
    bonus_description: string   // ... featured betting site dsctiption referral condition
    register_link: string       // ... `call-to-action` link for the featured betting site;
    review_link: string         // ... `link_for_review`
    title: string               // ... name of the featured betting site
    information: string         // ... INFO
}

/**
 * This it the INTERFACE that represents the data
 * structre for the response given from the parsed data
 * on the DB.
 */
export interface FinalFeaturedSiteResponseDB {
	site_data_array: Array<FeaturedSite>; // contains the array of `FeaturedSite` data from the website
	site_data_array_length: number; // lenght of the array with the number of featured sites
	title: string; // contains the `geo-locational` title name of the widget
	show_more_less: string[]; // show more less widget data translations [0] = 'showMore', [1] = 'showLess'
}

/**
 * 
*/
export interface Scores_Featured_Betting_Sites_Hasura {
    scores_featured_betting_sites_translations_dev: {
        lang: string
        translations: {
            register_cta: string
            show_more_less: Array < string >
            title: string
            widget_title: string
        }
    }[]
}

export interface Scores_Featured_Betting_Sites_Data {
    scores_featured_betting_sites_translations_dev: {
        lang: string
        translations: {
            register_cta: string
            show_more_less: Array < string >
            title: string
            widget_title: string
        }
        site_data_array: Array < FeaturedSite >
    }[]
}

export interface All_SportBook_Details_Data_Translation {
    lang: string
    translations: {
        register_cta: string
        show_more_less: Array < string >
        title: string
        widget_title: string
    }
}

export interface All_SportBook_Details_Data {
    lang: string
    translations: {
        lang: string
        translations: {
            register_cta: string
            show_more_less: Array < string >
            title: string
            widget_title: string
        }
    }[]
    data: Array < FeaturedSite >
}
//	let TABLE_GAMES: { [key: string]: LiveScoreLeague[] } = {};

export interface All_Livescores_Football{[key: string]:LiveScore_SEO_Game[]};


export interface LiveScore_SEO_Game{
    tips: { [key: string]: {
            link: string
    }};
    localteam:string;
    visitorteam:string;
    links: { [key: string]: string;}
}


export interface LiveScore_SEO_Game_Scoped_Lang{
    tip: string;
    localteam:string;
    visitorteam:string;
    link: string;
}