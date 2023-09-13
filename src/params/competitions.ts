/**
 * @type {import('@sveltejs/kit').ParamMatcher}
 */
export function match
(
  param: string
): boolean
{

  // ### NOTE: STASH:
  // ### does not seem to be working correctly, trying to fetch from `redis`.
  /*
    const data: unknown = await get_target_hset_cache_data
    (
      RedisKeys.SAP_C_D_A6,
      'competitions'
    );

    // ### [🐞]
    console.debug
    (
      `🔹 [var] ➤ src/params/competitions.ts data : ${data}`
    );
  */

  // ### [🐞]
  console.debug
  (
    `🔹 [var] ➤ src/params/competitions.ts param : ${param}`
  );

  // ### SEE:
  // ### https://discord.com/channels/457912077277855764/1023340103071965194/threads/1086245553203068998
  const regexList: RegExp[] =
  [
    // EN
    /competitions/,
    // PT
    /competicoes/,
    // BR
    /competicoes/,
    // ES
    /competiciones/,
    // FR
    /competitions/,
    // IT
    /competizioni/,
    // SE
    /tavlingar/,
    // RO
    /competitii/
  ];

  const isMatch: boolean = regexList
  .some
  (
    rx =>
    rx.test(param)
  );

	return isMatch;
}