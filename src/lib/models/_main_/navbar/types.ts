/**
 * [ℹ] Redis Cache Single Response
 */
export interface Cache_Single_Lang_Header_Translation_Response {
	lang: string;
	langArray: string[];
	scores_header_translations: Header_Translation;
	scores_header_links: Header_Links;
	scores_header_fixtures_information: Header_Sports_Info;
	scores_top_bar_messages: Header_Top_Bar_Messages;
}

/**
 * INCOMING RESPONSE
 * HASURA_DB for Translations
 */
export interface Hasura_Header_Translation_Response {
	scores_hreflang: {
		hreflang: string;
		link: string;
	}[];
	scores_header_translations: Array<Header_Translation>;
	scores_header_links: Array<Header_Links>;
	scores_header_fixtures_information: Array<Header_Sports_Info>;
	scores_top_bar_messages: Array<Header_Top_Bar_Messages>;
}

/**
 * PLATFORM LANGUAGE TRANSLATIONS;
 */
export interface Header_Translation {
	lang: string;

	betting_tips_link: string;
	bookmakers: string;
	bookmakers_countries: Array<Array<string>>;
	content_platform_link: string;
	odds: string;
	odds_type: Array<string>;
	sign_in: string;
	sports: Array<Array<string>>;
	theme: string;
	theme_options: Array<Array<string>>;
	homepage: string;
	more_sports: string;
	sports_list: string;
}

/**
 * PLATFORM LANGUAGE BASED HEADER LINKS;
 */
export interface Header_Links {
	lang: string;

	betting_tips: string;
	latest_news: string;
}

/**
 * HASURA - Sports - INFO;
 */
export interface Header_Sports_Info {
	lang: string;

	football: number;
	other_sports: Array<Array<string>>;
}

/**
 * HASURA - Top Bar Messages - INFO;
 */
export interface Header_Top_Bar_Messages {
	lang: string;

	status: string;
	message: string;
}
