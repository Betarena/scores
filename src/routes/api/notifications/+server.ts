import type { RequestHandler } from './$types';
import { entryNotificationsUserMutation } from "@betarena/scores-lib/dist/functions/v8/notifications.general.js";

export const POST: RequestHandler = async ({ request }) =>
{
  const body = await request.json();

  if (!body.uid) return new Response('uid is required', { status: 400 });
  const res = await entryNotificationsUserMutation({
    ...body
  });

  if (res.error) return new Response(res.error, { status: 400 });
  return new Response('ok', { status: 200 });
};