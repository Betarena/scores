import type { LayoutServerLoad } from './$types';
import { entryNotificationsData, entryNotificationsTranslations } from '@betarena/scores-lib/src/functions/v8/notifications.general.js';

export const load = (async ({ locals, parent }) =>
{
  const { langParam } = await parent();
  const uid = locals.user && JSON.parse(locals.user)["user-uid"];
  if (!uid) return {};
  const data = await entryNotificationsData({ uid });
  return {
    notifications: data,
    tr: entryNotificationsTranslations({
      language: langParam,
      cacheCheck: true,
    })
  };
}) satisfies LayoutServerLoad;