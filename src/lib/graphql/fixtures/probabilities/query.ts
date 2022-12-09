import { gql } from 'graphql-request';

/** 
 * ====================
 * [ℹ] Surgical Queries
 * [ℹ] HASURA DIRECT
 * ====================
*/

/**
 * [ℹ] GET Target Fixture - 
 * [ℹ] Probabilities [DATA]
*/
export const REDIS_CACHE_FIXTURE_PROBABILITIES_0 = gql`
  query REDIS_CACHE_FIXTURE_PROBABILITIES_0
  (
    $fixture_id: Int!
  ) 
  @cached
  (ttl: 300)
  {
    historic_fixtures (
      where: {
        id: {
          _eq: $fixture_id
        }
      }
    ) {
      id
      league_id
      season_id
      time
      probabilities
    }
  }
`;

/**
 * [ℹ] GET Target Fixture - 
 * [ℹ] Probabilities [TRANSLATE]
*/
export const REDIS_CACHE_FIXTURE_PROBABILITIES_1 = gql`
  query REDIS_CACHE_FIXTURE_PROBABILITIES_1
  (
    $lang: String!
  ) 
  @cached
  (ttl: 300)
  {
    scores_general_translations (
      where: {
        lang: {
          _eq: $lang
        }
      } 
    ) {
      lang
      countries
      widgets_no_data_available
      weekdays
      months
    }
    scores_fixture_probabilities_translations (
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