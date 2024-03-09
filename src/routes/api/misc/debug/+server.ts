import { RequestHandler, json } from '@sveltejs/kit';
import { appendFileSync } from 'fs';

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 fixture (lineup) widget main data (hasura) fallback;
 * @param { RequestEvent } req
 * @returns { Promise < unknown > }
 */
export const POST = (
  async (
    {
      request
    }
  ) =>
  {
    try
    {
      const
        body: any = await request.json(),
        jsonBody = JSON.parse(JSON.stringify(body))
      ;

      appendFileSync('./debug.log', jsonBody + '\n');

      return json(null);
    }
    catch (error)
    {
      console.error('❌', error);
      return json(null);
    }
  }
) satisfies RequestHandler;
