/**
 * Types for handling all of the PAGE_SEO
 * of the following pages:
 * --------------------------------------
 * ➤ homepage
 * ➤ homepage/{lang}
 * ➤ /{lang}/{sport}/{country}/{tournaments}
 * ➤ /{sport}/{country}/{tournaments}
*/

export interface Hasura_Complete_Pages_SEO {

  scores_hreflang_dev: {
    hreflang: string
    link: string
  }[]
  scores_seo_homepage_dev: {
    lang: string
    main_data: Main_Data
    twitter_card: Twitter_Data
    opengraph: Opengraph_Data
  }[]
  scores_seo_block_homepage_dev: {
    html: string
    lang: string
    title: string
  }[]
  scores_seo_tournaments_dev: {
    lang: string
    main_data: Main_Data
    opengraph: Twitter_Data
    twitter_card: Opengraph_Data
  }[]

  // [ℹ] used in the < tournaments_page_generation >
  scores_tournaments_dev: Single_Tournament_Data_Type[]

  scores_urls_dev: {
    urlsArr: string[]
  }
}

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

/**
 * Types for handling all of the PAGE_INFO
 * of the following pages:
 * --------------------------------------
 * ➤ /{lang}/{sport}/{country}/{tournaments}
 * ➤ /{sport}/{country}/{tournaments}
*/

export interface Single_Tournament_Data_Type {
  author: string
  country: string
  date: Date
  id: number
  tournament_id: number
  lang: string
  modified_date: Date
  name: string
  sport: string
  status: "published" | "draft"
  title: string
  type: string
  widgets: Array < string >
}