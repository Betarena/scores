import type {
  Auth_Translation,
  BETARENA_HASURA_auth_translations
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_auth_translation 
  extends Auth_Translation {
  lang?: string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_auth_query {
  // NOTE: translations
  auth_translations:                BETARENA_HASURA_auth_translations[]
}