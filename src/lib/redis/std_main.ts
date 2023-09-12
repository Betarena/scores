/**
 * NOTE: This File Contain MAIN Methods Used
 * NOTE: to Interact with REDIS CACHE [STD-MAIN]
 */
import redis from '$lib/redis/init';
import { recordToKeyValueArray } from '$lib/utils/platform-functions.js';

// [🗃️] archive
export const live_scores_leagues = 'live_scores_leagues';
export const live_scores = 'live_scores';
export const live_scores_football_translations = 'live_scores_football_translations';
export const live_scores_football_tournaments = 'live_scores_football_tournaments';

/**
 * [HSET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_hset_cache_data
(
	key: string,
	id: string
): Promise < unknown >
{
	try
  {
		const cached: string = await redis.hget
    (
			key,
			id
		);
		if (cached) {
			const parsed: unknown = JSON.parse(cached);
			return parsed;
		}
	}
  catch (e)
  {
		console.error
    (
			`❌ uh-oh! ${key} cache error`,
			e
		);
		return;
	}
}

/**
 * [HSET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function HSET_All
(
	key: string
): Promise < unknown >
{
	try
  {
		const cached: Record<string, string> = await redis.hgetall
    (
			key
		);

		if (cached)
      return JSON.parse(JSON.stringify(recordToKeyValueArray(cached))) as unknown;
    ;
  }
  catch (e)
  {
		console.error
    (
			`❌ uh-oh! ${key} cache error`,
			e
		);
		return;
	}
}

/**
 * [SET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_set_cache_data
(
	key: string,
	id: string
): Promise < unknown >
{
	try
  {
		const cached: number = await redis.sismember
    (
			key,
			id
		);
		console.log(id, cached);
		return cached;
	}
  catch (e)
  {
		console.error(
			`❌ uh-oh! ${key} cache error`,
			e
		);
		return;
	}
}

/**
 * [STRING] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_string_cache_data
(
	key: string
): Promise<unknown>
{
	try {
		const cached: string = await redis.get(key);
		if (cached) {
			const parsed: unknown = JSON.parse(cached);
			return parsed;
		}
	} catch (e) {
		console.error(
			`❌ uh-oh! ${key} cache error`,
			e
		);
		return;
	}
}
