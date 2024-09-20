import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { entryProfileTabAuthorValidateSportstackUsername } from '@betarena/scores-lib/src/functions/v8/profile.main.js';

export const POST: RequestHandler = async ({ request }) =>
{
  try
  {

    const body = await request.text();
    const parsedBody = JSON.parse(body);
    const isValid = await entryProfileTabAuthorValidateSportstackUsername({ username: parsedBody.name })
    return json({ isValid });
  } catch (e)
  {
    return json({ isValid: false });
  }
};