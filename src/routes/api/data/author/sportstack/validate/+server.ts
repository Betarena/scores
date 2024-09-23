import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { entryProfileTabAuthorValidateSportstackUsername } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';

export const POST: RequestHandler = async ({ request }) =>
{
  try
  {

    const body = await request.text();
    const parsedBody = JSON.parse(body);
    const hasMatch = await entryProfileTabAuthorValidateSportstackUsername({ username: parsedBody.name })
    return json({ isValid: !hasMatch });
  } catch (e)
  {
    return json({ isValid: false });
  }
};