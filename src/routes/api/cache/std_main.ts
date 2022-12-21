/**
 * NOTE: This File Contain MAIN Methods Used
 * NOTE: to Interact with REDIS CACHE [STD-MAIN]
 */
import redis from '$lib/redis/init';

// [ℹ] _main_
export const navbar_cache_trans_addr = 'navbar_t';
export const footer_cache_trans_addr = 'footer_t';
export const cache_sitemap_urls_key = 'sitemap';
export const cache_homepage_seo_key = 'homepage_seo';
export const cache_tournaments_seo_key = 'tournaments_seo';
export const cache_tournaments_info_key = 'tournaments_page_info';
export const cache_fixtures_seo_key = 'fixtures_seo';
export const cache_fixtures_info_key = 'fixtures_page_info';
export const cache_sport_translations = "general_sport_translations"
export const cache_country_translations = "general_country_translations"
// [ℹ] home-page
export const best_goalscorer_cache_data_addr = 'best_goalscorer_geo';
export const best_goalscorer_cache_trans_addr = 'best_goalscorer_t';
export const featured_bet_site_cache_data_addr = 'featured_betting_sites_geo';
export const featured_bet_site_cache_trans_addr = 'featured_betting_sites_t';
export const featured_match_cache_data_addr = 'featured_match_geo';
export const featured_match_cache_trans_addr = 'featured_match_t';
export const league_list_cache_data_addr = 'league_list_geo';
export const league_list_cache_trans_addr = 'league_list_t';
export const league_tables_cache_data_addr = 'leagues_table_geo';
export const league_tables_cache_trans_addr = 'leagues_table_t';
export const live_scores_leagues = 'live_scores_leagues';
export const live_scores = 'live_scores';
export const live_scores_football_translations = 'live_scores_football_translations';
export const live_scores_football_tournaments = 'live_scores_football_tournaments';
export const seo_block_cache_trans_addr = 'seo_block_t';
// [ℹ] tournaments
export const fixture_odds_cache_data_addr = 'tour_fix_odds_data_v2'; // NOTE: for DEV new => tour_fix_odds_data_v2 | OLD => tour_fix_odds_data
export const fixture_odds_cache_trans_addr = 'tour_fix_odds_t';
export const league_info_cache_data_addr = 'league_info';
export const sportbook_details = 'sportbook_details';
export const sportbook_details_all = 'sportbook_details_all';
export const tour_standings_cache_data_addr = 'tournament_standings_data';
export const tour_standings_cache_trans_addr = 'tournament_standings_t';
export const tour_top_play_cache_data_addr = 'tournament_top_players_data';
export const tour_top_play_cache_trans_addr = 'tournament_top_player_t';
// [ℹ] fixtures-page
export const fixture_about_cache_data_addr = 'fixture_about_data';
export const fixture_about_cache_trans_addr = 'fixture_about_trans';
export const fixture_content_cache_data_addr = 'fixture_content_data';
export const fixture_content_cache_trans_addr = 'fixture_content_trans';
export const fixture_incidents_cache_data_addr = 'fixture_incidents_data';
export const fixture_incidents_cache_trans_addr = 'fixture_incidents_trans';
export const fixture_lineups_cache_data_addr = 'fixture_lineups_data';
export const fixture_lineups_cache_trans_addr = 'fixture_lineups_trans';
export const fixture_scoreboard_cache_data_addr = 'scoreboard_data';
export const fixture_scoreboard_cache_trans_addr = 'scoreboard_trans';
export const fixture_statistics_cache_data_addr = 'fixture_statistics_data';
export const fixture_statistics_cache_trans_addr = 'fixture_statistics_trans';
export const fixture_votes_cache_trans_addr = 'fixture_votes_trans';

/**
 * [HSET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_hset_cache_data(key: string, id: string): Promise<any> {
	try {
		const cached: string = await redis.hget(key, id);
		if (cached) {
			const parsed: unknown = JSON.parse(cached);
			return parsed;
		}
	} catch (e) {
		console.error(`❌ uh-oh! ${key} cache error`, e);
		return;
	}
}

/**
 * [SET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_set_cache_data(key: string, id: string): Promise<any> {
	try {
		const cached: number = await redis.sismember(key, id);
		console.log(id, cached);
		return cached;
	} catch (e) {
		console.error(`❌ uh-oh! ${key} cache error`, e);
		return;
	}
}

/**
 * [STRING] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_string_cache_data(key: string): Promise<any> {
	try {
		const cached: string = await redis.get(key);
    if (cached) {
      const parsed: any = JSON.parse(cached);
      return parsed;
    }
	} catch (e) {
		console.error(`❌ uh-oh! ${key} cache error`, e);
		return;
	}
}
