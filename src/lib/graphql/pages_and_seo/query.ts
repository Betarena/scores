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
    scores_hreflang_dev {
      hreflang
      link
    }
    # HOMEPAGE
    scores_seo_homepage_dev {
      lang
      main_data
      twitter_card
      opengraph
    }
    # HOMEPAGE SEO WIDGET
    scores_seo_block_homepage_dev {
      html
      lang
      title
    }
    # TOURNAMENTS SPECIFIC;
    scores_seo_tournaments_dev {
      lang
      main_data
      opengraph
      twitter_card
    }
    scores_tournaments_dev {
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
    scores_football_seasons_details_dev {
      data_stats
      default_data
      end_date
      id
      is_current_season
      league_id
      round_data
      start_date
    }
    scores_football_leagues_dev {
      country
      data
      name
      id
      season
      seasons
    }
  }
`;