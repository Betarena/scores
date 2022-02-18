/**
 * RESPONSE - HASURA_DB for Translations
 */
export interface Header_Translation_Response {
  scores_header_translations: Array < Header_Translation > ;
  scores_header_links: Array < Header_Links > ;
  scores_header_fixtures_information: Array < Header_Sports_Info > ;
  scores_top_bar_messages: Array < Header_Top_Bar_Messages >;
}

/**
 * ... PLATFORM LANGUAGE TRANSLATIONS;
 * ... used
*/
export interface Header_Translation {
  betting_tips_link: string;
  bookmakers: string;
  bookmakers_countries: Array < Array < string >> ;
  content_platform_link: string;
  lang: string;
  odds: string;
  odds_type: Array < string > ;
  sign_in: string;
  sports: Array < Array < string >> ;
  theme: string;
  theme_options: Array < Array < string >> ;
  homepage: string;
  more_sports: string;
  sports_list: string;
}

/**
 * PLATFORM LANGUAGE BASED HEADER LINKS;
*/
export interface Header_Links {
  betting_tips: string;
  lang: string;
  latest_news: string;
}

// ... HASURA - Sports - INFO
export interface Header_Sports_Info {
  football: number
  lang: string
  other_sports: Array < Array < string >> 
}

export interface Header_Top_Bar_Messages {
  lang: string
  status: string
  message: string
}