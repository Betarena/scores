import type {
  BETARENA_HASURA_profile_translations, Profile_Translation
} from "$lib/models/hasura"

/**
 * ==========================================
 * CACHING PERSIST - COMPLETE WIDGET REQUIRED DATA
 * ========================================== 
*/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface REDIS_CACHE_SINGLE_profile_translation extends 
  Profile_Translation {
  lang?: string
}

/**
 * ==========================================
 * HASURA DB - COMPLETE WIDGET REQUIRED DATA 
 * ========================================== 
*/

export interface BETARENA_HASURA_profile_query {
  // NOTE: translations
  profile_translations?: BETARENA_HASURA_profile_translations[]
}