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
    sports: Array < string >
    theme: string
    theme_options: Array < string >
    homepage: string
    more_sports: string
}

/**
 * RESPONSE - HASURA_DB for Translations
*/
export interface Header_Translation_Response {
    scores_header_translations: Array < Header_Translation >
}