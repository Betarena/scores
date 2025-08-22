import type { ServerLoadEvent } from '@sveltejs/kit';

export const load = (async ({ locals, params, fetch }: ServerLoadEvent) => {
    const lang = locals.user.lang || params.lang || 'en';
    const data = await fetch(`/api/data/login?lang=${lang}`);
    const auth_translations = await data.json();
    return { auth_translations };
});