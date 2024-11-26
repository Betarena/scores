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
import { identifyLanguage } from '$lib/utils/server_helpers/translation.js';

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
    const { content, title, author_id, images, id, seo, tags, uid, article, text_content } = body;

    if (locals.uid !== uid) return json({ success: false, message: "Not an owner" });
    let data = article;
    const lang = await identifyLanguage(text_content);
    const seoTitle = seo.title || title;
    const seoDescription = seo.description || "";
    const permalink = mutateStringToPermalink(title);
    const link = `https://scores.betarena.com/a/${permalink}`;
    data = {
      author_id,
      lang,
      tags,
      seo_details: {
        twitter_card: {
          description: seoDescription,
          title: seoTitle,
          image: images[0] || "",
          site: '@betarenasocial',
          image_alt: "",
        },
        opengraph: {
          description: seoDescription,
          images: images.map((image: string) => ({ url: image, alt: title, width: 120, height: 120 })),
          locale: lang,
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
      }
    };

    if (id)
    {
      data.id = id;
    }


    const articleId = await entryProfileTabAuthorArticleUpsert(data);
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
    await entryProfileTabAuthorArticleDelete(id);
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
  if (uid !== locals.uid) return json({ success: false, message: "Not an owner" });
  if (!id) return json({ success: false, message: "Bad request" });
  try
  {
    await entryProfileTabAuthorArticleUpdateStatus({
      numArticleId: id,
      enumArticleNewStatus: status
    })
    return json({ success: true });

  } catch (e)
  {
    console.log("Error: ", e);
    throw error(500, { message: 'Internal server error' } as App.Error);
  }
  return new Response();
};