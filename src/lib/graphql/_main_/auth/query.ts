import { gql } from 'graphql-request';

/** 
 * ====================
 * [ℹ] Surgical Queries
 * [ℹ] Obtained directly 
 * [ℹ] from HASURA 
 * ====================
*/

/**
 * [ℹ] GET target auth lang translation [main] [DATA]
*/
export const BETARENA_SCORES_AUTH_TRANSLATION = gql`
  query BETARENA_SCORES_AUTH_TRANSLATION
  (
    $lang: String!
  ) 
  @cached
  (ttl: 300)
  {
    auth_translations (
      where: {
        lang: {
          _eq: $lang
        }
      }
    ) {
      lang
      translation
    }
  }
`;
