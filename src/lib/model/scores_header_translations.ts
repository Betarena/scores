/**
 * PLATFORM LANGUAGE TRANSLATIONS;
*/ 
export interface Header_Translation {
    betting_tips_link: string
    bookmakers: string
    bookmakers_countries: Array < Array < string >>
    content_platform_link: string
    lang: string
    odds: string
    odds_type: Array < string >
    sign_in: string
    sports: Array < Array < string >>
    theme: string
    theme_options: Array < Array < string >>
    homepage: string
    more_sports: string
    sports_list: string
}

/**
 * PLATFORM LANGUAGE BASED HEADER LINKS; 
*/
export interface Header_Links {
    betting_tips: string
    lang: string
    latest_news: string
}

/**
 * RESPONSE - HASURA_DB for Translations
*/
export interface Header_Translation_Response {
    scores_header_translations_dev: Array < Header_Translation >
    scores_header_links_dev: Array < Header_Links >
}