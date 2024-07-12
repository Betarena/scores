import type { LayoutServerLoad } from './$types';
import { main } from '$lib/sveltekit/load/load.author.layout.js';
import { dlogv2 } from '$lib/utils/debug.js';
import { detectPlatformLanguage } from '$lib/utils/languages.js';

export const load = (async ({ params, cookies, route, parent, fetch, depends }) =>
{
  const data = await parent();
  const { langParam } = data;
  // [🐞]
  dlogv2
    (
      '🚏 checkpoint ➤ src/routes/(authors)/a/user/[username]/+page.server.ts',
      [
        `🔹 [var] ➤ langParam :|: ${langParam}`,
      ],
      true
    );
  const translations = await main({ langParam, fetch });
  depends("author:translations");
  return {
    ...data,
    translations,
  };
}) satisfies LayoutServerLoad;


