// ...
export interface Hasura_Complete_League_List_Type {
    scores_league_list: {
        country_id: number
        country_name: string
        image_path: string
        league_id: number
        league_name: string
        logo_path: string
        type: string
    }[]
    leagues_filtered_country: {
        lang: string
        leagues: {
            league_id: number
        }[]
    }[]
    scores_leagues_list_translations_dev: {
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
    }[]
}

// ...
export interface League_List_Cache_Ready {
    lang: string
    top_geo_leagues: {
        country_id: number
        country_name: string
        image_path: string
        league_id: number
        league_name: string
        logo_path: string
        type: string
    }[]
    all_leagues_list: {
        country_id: number
        country_name: string
        image_path: string
        league_id: number
        league_name: string
        logo_path: string
        type: string
    }[]
    unique_county_list: {
        country_id: number
        country_name: string
        image_path: string
    }[]
    translations: {
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
    }[]
}


// ... 
export interface League_List_Cache_SEO_Ready {
    all_leagues_list: {
        country_id: number
        country_name: string
        image_path: string
        league_id: number
        league_name: string
        logo_path: string
        type: string
    }[]
    unique_county_list: {
        country_id: number
        country_name: string
        image_path: string
    }[]
    translations: {
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
    }[]
}