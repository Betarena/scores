/**
 * NOTE: This File Contain MAIN Methods Used
 * NOTE: to Interact with REDIS CACHE [STD-MAIN]
 */
import redis from '$lib/redis/init';

/**
 * [HSET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_hset_cache_data(
	key: string,
	id: string
): Promise<unknown> {
	try {
		const cached: string = await redis.hget(
			key,
			id
		);
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

/**
 * [SET] [GET] Method
 * @param key
 * @param id
 * @returns
 */
export async function get_target_set_cache_data(
	key: string,
	id: string
): Promise<unknown> {
	try {
		const cached: number = await redis.sismember(
			key,
			id
		);
		console.log(id, cached);
		return cached;
	} catch (e) {
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
export async function get_target_string_cache_data(
	key: string
): Promise<unknown> {
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
