import { entryNotificationsData } from '@betarena/scores-lib/dist/functions/v8/notifications.general.js';
import { ITableNotificationsHistoryMutation0Out, ITableNotificationsHistoryMutation1Var, TableNotificationsHistoryMutation1 } from '@betarena/scores-lib/dist/graphql/v8/table.notifications.history.js';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { _GraphQL } from '@betarena/scores-lib/dist/classes/_graphql.js';

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

export const PUT: RequestHandler = async ({ request }) =>
{
  const url = new URL(request.url);
  const messageId: string | number = url.searchParams.get('messageId') || "";
  if (!messageId) return new Response('UID not provided', { status: 400 });
  const ids = messageId.split(',').map((id) => parseInt(id));
  const graphql = new _GraphQL();
  try
  {
    const data = await Promise.all(ids.map(id => graphql.wrapQuery<ITableNotificationsHistoryMutation1Var, ITableNotificationsHistoryMutation0Out>(TableNotificationsHistoryMutation1, { messageId: id })));
    return json(data);
  } catch (error)
  {
    return new Response(error, { status: 500 });
  }
};