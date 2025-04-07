import type { LayoutServerLoad } from './$types';
import { main } from '$lib/sveltekit/load/load.author.layout.js';
import { dlogv2 } from '$lib/utils/debug.js';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, fetch, depends, params, url }) =>
{
  if (params.lang && url.pathname !== `/${params.lang}`)
  {
    throw redirect(301, `/${params.lang}`);
  }

  if (!params.lang && url.pathname !== '/')
  {
    throw redirect(301, '/');
  }
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


