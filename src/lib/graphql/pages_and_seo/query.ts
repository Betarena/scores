// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL LEAGUE LIST DATA from the DB
*/
export const GET_COMPLETE_PAGES_AND_SEO_DATA = gql`
  query GET_COMPLETE_PAGES_AND_SEO_DATA @cached(ttl: 300) {
    # IMPORTANT HREF-LANG
    scores_hreflang {
      hreflang
      link
    }
    # HOMEPAGE
    scores_seo_homepage {
      lang
      main_data
      twitter_card
      opengraph
    }
    # HOMEPAGE SEO WIDGET
    scores_seo_block_homepage {
      html
      lang
      title
    }
    # TOURNAMENTS SPECIFIC;
    scores_seo_tournaments {
      lang
      main_data
      opengraph
      twitter_card
    }
    scores_tournaments {
      author
      country
      date
      id
      tournament_id
      lang
      modified_date
      name
      sport
      status
      title
      type
      widgets
    }
    scores_football_seasons_details {
      data_stats
      default_data
      end_date
      id
      is_current_season
      league_id
      round_data
      start_date
    }
    scores_football_leagues {
      country
      data
      name
      id
      season
      seasons
    }
  }
`;