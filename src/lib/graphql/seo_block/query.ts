import { gql } from 'graphql-request';

export const REDIS_CACHE_HOMEAPGE_SEO_BLOCK = gql`
  query REDIS_CACHE_HOMEAPGE_SEO_BLOCK @cached(ttl: 300) {
    scores_seo_block_homepage {
      html
      lang
      title
    }
  }
`;