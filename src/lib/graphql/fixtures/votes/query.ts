import { gql } from 'graphql-request';

/**
 * [ℹ] GET TARGET fixture votes
 * [ℹ] @param {numeric!} match_id - target fixture_id
 * [ℹ] @param {Int!} fixture_id - target fixture_id
 */
export const HASURA_FIXTURE_VOTES_DATA_0 = gql`
	query HASURA_FIXTURE_VOTES_DATA_0(
		$match_id: numeric!
		$fixture_id: Int!
	) @cached(ttl: 300) {
		historic_fixtures(
			where: { id: { _eq: $fixture_id } }
		) {
			id
			probabilities
			time
			home_team_logo
			away_team_logo
			status_j: data(path: "$.time.status")
		}

		widget_featured_match_votes(
			where: { match_id: { _eq: $match_id } }
		) {
			match_id
			vote_draw_x
			vote_win_local
			vote_win_visitor
		}
	}
`;

/**
 * [ℹ] MUTATE (UPSERT) fixture votes
 * [ℹ] @param {numeric!} match_id - target fixture_id
 * [ℹ] @param {numeric!} _1_vote - target fixture_id (1-vote)
 * [ℹ] @param {numeric!} _X_vote - target fixture_id (X-vote)
 * [ℹ] @param {numeric!} _2_vote - target fixture_id (2-vote)
 */
export const HASURA_FIXTURE_VOTES_INIT_UPDATE = gql`
	mutation HASURA_FIXTURE_VOTES_INIT_UPDATE (
		$match_id: numeric!
		$_1_vote:  numeric!
		$_X_vote:  numeric!
		$_2_vote:  numeric!
	) {

    # insert initial FIXTURE VOTES if not existsing
    # with on_conflict, update NOTHING
    insert_widget_featured_match_votes (
      on_conflict: {
        constraint: widget_featured_match_votes_pkey, 
        update_columns: [
          # NONE, ignore
        ]
      },
      objects: {
        match_id: $match_id,
        vote_draw_x: 0,
        vote_win_local: 0,
        vote_win_visitor: 0
      }
    ) {
      affected_rows
    }

    # update target FIXTURE VOTES accordingly
		update_widget_featured_match_votes_by_pk (
			pk_columns: {
        match_id: $match_id 
      }
			_inc: { 
        vote_draw_x: $_X_vote, 
        vote_win_local: $_1_vote, 
        vote_win_visitor: $_2_vote 
      }
		) {
			match_id
			vote_draw_x
			vote_win_local
			vote_win_visitor
		}
	}
`;

/**
 * [ℹ] Fixtures / VOTES Widget (#1)
 * [ℹ] TRANSLATION
 */
export const HASURA_FIXTURE_VOTES_DATA_1 = gql`
	query HASURA_FIXTURE_VOTES_DATA_1
	@cached(ttl: 300) {
		# [ℹ] unecessary to paginate
		scores_fixture_voting_translations {
			lang
			translations
		}
		scores_general_translations {
			lang
			widgets_no_data_available
		}
	}
`;
