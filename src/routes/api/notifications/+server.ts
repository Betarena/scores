import { entryNotificationsData } from '@betarena/scores-lib/dist/functions/v8/notifications.general.js';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) =>
{
  const url = new URL(request.url);
  const uid = url.searchParams.get('uid');
  if (!uid) return new Response('UID not provided', { status: 400 });
  try
  {
    const data = await entryNotificationsData({ uid });
    return json(data);
  } catch (error)
  {
    return new Response(error, { status: 500 });
  }
};