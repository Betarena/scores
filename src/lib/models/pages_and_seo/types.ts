import type { 
  BETARENA_HASURA_scores_hreflang, 
  BETARENA_HASURA_scores_seo_block_homepage, 
  BETARENA_HASURA_scores_seo_homepage, 
  BETARENA_HASURA_scores_seo_tournaments, 
  BETARENA_HASURA_scores_tournaments 
} from "../hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Cache_Single_Homepage_SEO_Translation_Response extends BETARENA_HASURA_scores_seo_homepage {
  lang:         string
  hreflang:     BETARENA_HASURA_scores_hreflang[]
} 

export interface Cache_Single_Tournaments_SEO_Translation_Response extends BETARENA_HASURA_scores_seo_tournaments {
  lang:         string
  hreflang:     BETARENA_HASURA_scores_hreflang[]
} 

export interface Cache_Single_Tournaments_Data_Page_Translation_Response {
  url:            string
  lang:           string
  data:           BETARENA_HASURA_scores_tournaments
  alternate_data: BETARENA_HASURA_scores_tournaments[]
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Hasura_Complete_Pages_SEO {
  scores_hreflang:            BETARENA_HASURA_scores_hreflang[]
  scores_seo_block_homepage:  BETARENA_HASURA_scores_seo_block_homepage[]
  scores_seo_homepage:        BETARENA_HASURA_scores_seo_homepage[]
  scores_seo_tournaments:     BETARENA_HASURA_scores_seo_tournaments[]
  scores_tournaments:         BETARENA_HASURA_scores_tournaments[]
}

// export interface Single_Tournament_Data_Type {
//   lang: string
//   author: string
//   country: string
//   date: Date
//   id: number
//   tournament_id: number
//   modified_date: Date
//   name: string
//   sport: string
//   status: "published" | "draft"
//   title: string
//   type: string
//   widgets: Array < string >
// }