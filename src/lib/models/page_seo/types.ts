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

  // [ℹ] used in the < tournaments_page >
  scores_seo_tournaments_dev: {
    lang: string
    main_data: Main_Data
    opengraph: Twitter_Data
    twitter_card: Opengraph_Data
  }[]
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