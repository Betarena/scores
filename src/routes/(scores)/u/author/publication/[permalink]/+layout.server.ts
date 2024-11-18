import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import type { LayoutServerLoad } from '.svelte-kit/types/src/routes/(scores)/u/author/publication/[permalink]/$types.js';
import { getSportstackByPermalink } from '$lib/sveltekit/endpoint/sportstack.js';

export const load: LayoutServerLoad = (async ({ locals, fetch, params }) =>
{
  const uid = locals.uid
  const { permalink } = params;
  await getSportstackByPermalink(permalink);
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