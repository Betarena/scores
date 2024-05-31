import { json } from '@sveltejs/kit';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () =>
{
  const res = await new _GraphQL().wrapQuery(`query {
    userguide_data
    (
      where:
      {
        id:
        {
          _eq: 3
        }
      }
    )
    {
      id
      content
    }
  }`, {})

  return json(res[0]?.userguide_data[0]?.content?.lang)
};