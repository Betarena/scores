import type { LayoutServerLoad } from './$types';
import { entryNotificationsTranslations } from '@betarena/scores-lib/dist/functions/v8/notifications.general.js';

export const load = (async ({ locals, parent, fetch }) =>
{
  const { langParam } = await parent();
  const uid = locals.user && JSON.parse(locals.user)["user-uid"];
  if (!uid) return {};
  return {
    notifications: await fetch('/api/notifications?uid=' + uid).then((res) => res.json()),
    tr: entryNotificationsTranslations({
      language: langParam,
      cacheCheck: true,
    })
  };
}) satisfies LayoutServerLoad;