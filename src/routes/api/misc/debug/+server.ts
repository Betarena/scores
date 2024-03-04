import { RequestHandler } from '@sveltejs/kit';
import { appendFileSync } from 'fs';
import { json } from '@sveltejs/kit';

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
      //
    }
  }
) satisfies RequestHandler;
