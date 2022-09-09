/**
 * =================================
 * Redis Cache Response 
 * [HOMEPAGE - SEO]
 * [MAIN]
 * =================================
*/
export interface Cache_Single_Homepage_SEO_Translation_Response {
  lang: string
  main_data: Main_Data
  twitter_card: Twitter_Data
  opengraph: Opengraph_Data
  hreflang: Hreflang[]
}

export interface Cache_Single_Tournaments_SEO_Translation_Response {
  lang: string
  main_data: Main_Data
  twitter_card: Twitter_Data
  opengraph: Opengraph_Data
  hreflang: Hreflang[]
}

export interface Cache_Single_Tournaments_Data_Page_Translation_Response {
  url: string
  lang: string
  data: Single_Tournament_Data_Type
  alternate_data: Single_Tournament_Data_Type[]
}

/**
 * =================================
 * HASURA DB - COMPLETE PAGE / SITEMAP / SEO GRAPHQL QUERY 
 * ================================= 
*/
export interface Hasura_Complete_Pages_SEO {

  scores_hreflang: {
    link: string
    hreflang: string
  }[]

  // [ℹ] homepage
  scores_seo_homepage: {
    lang: string

    main_data: Main_Data
    twitter_card: Twitter_Data
    opengraph: Opengraph_Data
  }[]
  // [ℹ] homepage-seo-block-widget
  // TODO: remove
  scores_seo_block_homepage: {
    lang: string

    html: string
    title: string
  }[]

  // [ℹ] tournaments-page
  scores_seo_tournaments: {
    lang: string

    main_data: Main_Data
    opengraph: Twitter_Data
    twitter_card: Opengraph_Data
  }[]
  scores_tournaments: Single_Tournament_Data_Type[]
}

/**
 * =================================
 * Individual / Single Interfaces 
 * =================================
*/
interface Main_Data {
  canonical: string,
  noindex: boolean,
  keywords: string,
  nofollow: boolean,
  title: string,
  description: string
}

interface Twitter_Data {
  canonical: string,
  noindex: boolean,
  keywords: string,
  nofollow: boolean,
  title: string,
  description: string
}

interface Opengraph_Data {
  canonical: string,
  noindex: boolean,
  keywords: string,
  nofollow: boolean,
  title: string,
  description: string
}

interface Hreflang {
  link: string
  hreflang: string
}

export interface Single_Tournament_Data_Type {
  lang: string

  author: string
  country: string
  date: Date
  id: number
  tournament_id: number
  modified_date: Date
  name: string
  sport: string
  status: "published" | "draft"
  title: string
  type: string
  widgets: Array < string >
}