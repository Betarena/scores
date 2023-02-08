import { gql } from 'graphql-request';

/**
 * [ℹ] Fixtures / About Widget (#1)
 * [ℹ] TRANSLATION
*/
export const SCORES_PROFILE_TRANSLATIONS_DATA_1 = gql`
  query SCORES_PROFILE_TRANSLATIONS_DATA_1 
  (
    $lang: String!
  )
  @cached 
  (ttl: 300) 
  {
    profile_translations (
      where: {
        lang: {
          _eq: $lang
        }
      }
    ) {
      lang
      data
    }
  }
`;