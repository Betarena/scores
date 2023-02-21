/**
 * [ℹ] Redis Cache Response
 */
export interface Cache_Single_Lang_Footer_Translation_Response {
	lang: string;
	scores_footer_translations: Footer_Translation_Data;
	scores_footer_links: Footer_Links_Data;
}

/**
 * ... footer data from Hasura DB and
 * ... Redis Cache;
 */
export interface Hasura_Footer_Translation_Response {
	scores_hreflang: {
		hreflang: string;
		link: string;
	}[];
	scores_footer_translations: Footer_Translation_Data[];
	scores_footer_links: Footer_Links_Data[];
}

export interface Footer_Translation_Data {
	lang: string;

	about_us: string;
	betting_tips: string;
	follow: string;
	latest_news: string;
	privacy: string;
	subscribe_cta: string;
	subscribe_newsletter: string;
	terms: string;
	type_email: string;
}

export interface Footer_Links_Data {
	lang: string;

	about_us: string;
	betting_tips: string;
	latest_news: string;
	privacy: string;
	terms: string;
	social_networks: Array<Array<string>>;
}
