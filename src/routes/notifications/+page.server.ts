import type { PageServerLoad } from './$types';

export const load = (async () =>
{
  return { someData: 'someValue' };
}) satisfies PageServerLoad;