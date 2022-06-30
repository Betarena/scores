// ... import necessary libraries;
import { gql } from 'graphql-request';

/**
 * Description
 * ~~~~~~~~~~~~~
 * ... get ALL of the TRANSLATIONS from the DB
 * for the website-platform
*/
export const GET_NAVBAR_DATA = gql`
	query GET_NAVBAR_DATA @cached(ttl: 300) {
		scores_header_translations {
			theme_options
			theme
			sports
			sign_in
			odds_type
			odds
			more_sports
			lang
			homepage
			betting_tips_link
			bookmakers
			bookmakers_countries
			content_platform_link
			sports_list
		}
		scores_header_links {
			betting_tips
			lang
			latest_news
		}
    scores_header_fixtures_information {
      football
      lang
      other_sports
    }
    scores_top_bar_messages {
      lang
      status
      message
    }
    scores_hreflang_dev {
      hreflang
      link
    }
	}
`;