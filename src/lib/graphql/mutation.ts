// ... import necessary libraries;
import { gql } from 'graphql-request'

/**
 * Description:
 * ~~~~~~~~~~~~~
 * ... UPDATING THE MATCH FIXTURES for
 * the data of the FEATURED-MATCH;
*/
export const UPDATE_MATCH_FIXTURE_VOTES = gql`
    mutation UPDATE_MATCH_FIXTURE_VOTES($match_id: numeric!, $_1_vote: numeric!, $_X_vote: numeric!, $_2_vote: numeric!) {
        update_widget_featured_match_votes_by_pk(pk_columns: {match_id: $match_id}, _inc: {vote_draw_x: $_X_vote, vote_win_local: $_1_vote, vote_win_visitor: $_2_vote}) {
            match_id
            vote_draw_x
            vote_win_local
            vote_win_visitor
        }
    }
`;