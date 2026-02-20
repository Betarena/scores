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
import { _Redis } from '@betarena/scores-lib/dist/classes/_redis.js';
import * as RedisKeys from '@betarena/scores-lib/dist/constant/redis.js';

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



export const POST: RequestHandler = async ({ request, locals }) =>
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

    console.log(`[POST /article] upsert start | id=${id} (type=${typeof id}) | uid=${uid}`);
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
    purgeArticleCache('upsert', articleId);
    return json({ success: true, id: articleId });

  } catch (e)
  {
    console.log("Error: ", e);
    return json({ success: false, message: e instanceof Error ? e.message : String(e) });
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

export const PUT: RequestHandler = async ({ locals, request }) =>
{
  if (!locals.uid) return json({ success: false, message: "Unauthorized" });
  const body = await request.json();
  const { id, uid, status } = body;
  console.log(`[PUT /article] received | id=${id} (type=${typeof id}) | status=${status} | uid=${uid} | locals.uid=${locals.uid}`);
  if (uid !== locals.uid) return json({ success: false, message: "Not an owner" });
  if (!id) return json({ success: false, message: "Bad request" });
  try
  {
    const permalink = await entryProfileTabAuthorArticleUpdateStatus({
      numArticleId: id,
      enumArticleNewStatus: status
    });

    // Invalidate stale article data in Redis so the next read falls back to Hasura with fresh status
    try { await new _Redis().rHDEL(RedisKeys.SAP_C_D_A27, [String(id)]); }
    catch (e) { console.error(`[PUT /article] Redis HDEL failed | id=${id}`, e); }

    if (permalink) purgeArticleCache(status, id);
    return json({ success: true, permalink });

  } catch (e)
  {
    console.error(`[PUT /article] error | id=${id} | status=${status}`, e);
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
};

async function purgeArticleCache(context: string, articleId: number): Promise<void>
{
  try
  {
    // Warm Redis cache and purge Cloudflare edge cache — both handled by the cache service.
    // PURGE_ORIGINS is configured on the cache server so it purges CF automatically.
    await fetch(
      `http://65.109.14.126:8500/sitemap-and-preload?ids[]=${articleId}&operation[]=preload-target&category[]=author_article`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
    );
    console.log(`[cache] context=${context} articleId=${articleId} warmed`);
  }
  catch (e)
  {
    console.error(`[cache] failed context=${context} articleId=${articleId}`, e);
  }
}