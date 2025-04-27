import { getSportstackByPermalink } from '$lib/sveltekit/endpoint/sportstack.js';
import { ERROR_CODE_UNAUTHORIZED, PAGE_UNAUTHORIZED_MSG } from '$lib/utils/debug.js';
import { preloadExitLogic } from '$lib/utils/navigation.js';
import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = (async ({ locals, fetch, params }) =>
{
  const
    {
      uid
    } = locals
  ;

  const { permalink } = params;

  const current = await getSportstackByPermalink(permalink);

  if (current?.sportstacks.uid !== uid) preloadExitLogic(0, "/u/author/publication", ERROR_CODE_UNAUTHORIZED, PAGE_UNAUTHORIZED_MSG);

  async function getSportsTacks(uid?: string)
  {
    if (!uid) return [];
    const response = await fetch(`/api/data/author/sportstack?user=${uid}`);
    const data = await response.json() as { sportstacks: AuthorsAuthorsMain[]; };
    return data.sportstacks;
  }

  return {
    sportstacks: getSportsTacks(uid)
  };
}) satisfies LayoutServerLoad;