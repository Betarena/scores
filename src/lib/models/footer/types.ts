/**
 * ... footer data from Hasura DB and 
 * ... Redis Cache;
 */
 export interface Footer_Data {
  scores_footer_translations_dev: {
      about_us: string
      betting_tips: string
      follow: string
      lang: string
      latest_news: string
      privacy: string
      subscribe_cta: string
      subscribe_newsletter: string
      terms: string
      type_email: string
  }[]
  scores_footer_links_dev: {
      about_us: string
      betting_tips: string
      latest_news: string
      privacy: string
      lang: string
      terms: string
      social_networks: Array < Array< string >>
  }[]
}