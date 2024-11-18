import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import type { LayoutServerLoad } from '.svelte-kit/types/src/routes/(scores)/u/author/publication/[permalink]/$types.js';
import { getSportstackByPermalink } from '$lib/sveltekit/endpoint/sportstack.js';
import { preloadExitLogic } from '$lib/utils/navigation.js';
import { ERROR_CODE_UNAUTHORIZED, PAGE_UNAUTHORIZED_MSG } from '$lib/utils/debug.js';

export const load: LayoutServerLoad = (async ({ locals, fetch, params }) =>
{
  const uid = locals.uid
  const { permalink } = params;
  const current = await getSportstackByPermalink(permalink);
  if (current?.uid !== uid) preloadExitLogic(0, "/u/author/publication", ERROR_CODE_UNAUTHORIZED, PAGE_UNAUTHORIZED_MSG);
  console.log("Current: ", current)
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