import type { AuthorsAuthorsMain } from '@betarena/scores-lib/types/v8/_HASURA-0.js';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import type { PageServerLoad } from '../create/[lang=lang]/$types.js';

export const load = (({ locals, fetch }) =>
{
  const uid = locals.uid

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
}) satisfies PageServerLoad;
