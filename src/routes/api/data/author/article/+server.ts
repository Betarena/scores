// ╭──────────────────────────────────────────────────────────────────╮
// │ 📑 DESCRIPTION                                                   │
// │ :|: Author Article Data Endpoint                                 │
// ╰──────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package

// ╭──────────────────────────────────────────────────────────────────╮
// │ NOTE:                                                            │
// │ Please add inside 'this' region the 'imports' that are required  │
// │ by 'this' .svelte file is ran.                                   │
// │ IMPORTANT                                                        │
// │ Please, structure the imports as follows:                        │
// │ 1. svelte/sveltekit, external imports                            │
// │ 2. project-internal files and logic                              │
// │ 5. type(s) imports(s)                                            │
// ╰──────────────────────────────────────────────────────────────────╯

import dotenv from 'dotenv';

import { main } from '$lib/sveltekit/endpoint/author.article.js';
import { error, RequestHandler, json } from '@sveltejs/kit';
import { entryProfileTabAuthorArticleDelete, entryProfileTabAuthorArticleUpdateStatus, entryProfileTabAuthorArticleUpsert } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

// #endregion ➤ 📦 Package

// ╭─────
// │ IMPORTANT
// │ Loads environment secrets
// ╰─────
dotenv.config();

export async function GET
  (
    request
  )
{
  return await main
    (
      request
    );
}



export const POST: RequestHandler = async ({ request, locals, url }) =>
{
  try
  {
    if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);
    const body = await request.json();
    const { content, title, author_id, id, seo, tags, uid, locale, access_type, reward_tier_id } = body;
    const image = (body.image || {}) as { src: string; width: number; height: number };
    if (locals.uid !== uid) return json({ success: false, message: "Not an owner" });

    const { lang, iso } = locale;
    const seoTitle = seo.title || title;
    const seoDescription = seo.description || "";
    const permalink = mutateStringToPermalink(title);
    const link = `https://betarena.com/a/${permalink}`;

    const articleId = await entryProfileTabAuthorArticleUpsert({
      author_id,
      lang,
      tags,
      id,
      seo_details: {
        twitter_card: {
          description: seoDescription,
          title: seoTitle,
          image: image.src || "",
          site: '@betarenasocial',
          image_alt: image.src?.split('/').pop() || "",
        },
        opengraph: {
          description: seoDescription,
          images: body.image? [{ url: image.src, alt: title, width: image.width, height: image.height }]: [],
          locale: iso,
          title: seoTitle,
          type: 'website',
          url: link,
        },
        main_data: {
          canonical: link,
          description: seoDescription,
          keywords: tags.join(", "),
          nofollow: false,
          noindex: false,
          title: seoTitle
        }
      },
      data: {
        content,
        title,
        meta_description: seoDescription,
        seo_title: seoTitle,
      },
      access_type,
      reward_tier_id
    });
    await warmCacheAndPurge(articleId, url.origin);
    return json({ success: true, id: articleId });

  } catch (e)
  {
    console.log("Error: ", e);
    return json({ success: false, message: e.message });
  }

};


export const DELETE: RequestHandler = async ({ request, locals }) =>
{
  if (!locals.uid) return json({ success: false, message: "Unauthorized" });
  const body = await request.json();
  const { id, uid } = body;
  if (!id || !uid) return json({ success: false, message: "Bad request" });
  if (locals.uid !== uid) return json({ success: false, message: "Not an owner" });
  try
  {
    await entryProfileTabAuthorArticleDelete([id]);
    return json({ success: true });

  } catch (e)
  {
    console.log("Error: ", e);
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
};

export const PUT: RequestHandler = async ({ locals, request, url }) =>
{
  if (!locals.uid) return json({ success: false, message: "Unauthorized" });
  const body = await request.json();
  const { id, uid, status } = body;
  if (uid !== locals.uid) return json({ success: false, message: "Not an owner" });
  if (!id) return json({ success: false, message: "Bad request" });
  try
  {
    const permalink = await entryProfileTabAuthorArticleUpdateStatus({
      numArticleId: id,
      enumArticleNewStatus: status
    });
    if (permalink) await warmCacheAndPurge(id, url.origin);
    return json({ success: true, permalink });

  } catch (e)
  {
    console.log("Error: ", e);
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
  return new Response();
};

/**
 * @description
 *  📝 Calls the cache service to warm Redis and purge Cloudflare edge cache.
 *  The cache service handles both steps internally after the Redis write.
 */
async function warmCacheAndPurge(articleId: number, origin: string): Promise<void>
{
  try
  {
    await fetch(
      `http://65.109.14.126:8500/sitemap-and-preload?ids[]=${articleId}&operation[]=preload-target&category[]=author_article&purgeOrigins[]=${encodeURIComponent(origin)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
    );
  }
  catch (e)
  {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[cache-warm] failed articleId=${articleId} error=${message}`);
  }
}