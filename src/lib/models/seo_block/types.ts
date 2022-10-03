import type { BETARENA_HASURA_scores_seo_block_homepage } from "../hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface Cache_Single_Homepage_SEO_Block_Translation_Response {
  lang:   string
  html:   string
  title:  string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_seo_block_query {
  scores_seo_block_homepage:  BETARENA_HASURA_scores_seo_block_homepage[]
}