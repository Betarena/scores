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
import { entryProfileTabAuthorArticleUpsert } from '@betarena/scores-lib/dist/functions/v8/profile.main.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
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



export const POST: RequestHandler = async ({ request, locals }) =>
{
  if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);
  const body = await request.json();
  let { content, title, author_id, images, id, seo } = body;
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  content = DOMPurify.sanitize(content);
  title = DOMPurify.sanitize(title);
  const seoTitle = DOMPurify.sanitize(seo.title) || title;
  const seoDescription = DOMPurify.sanitize(seo.description) || "";
  const permalink = mutateStringToPermalink(title);
  const link = `https://scores.betarena.com/a/${permalink}`;
  try
  {
    await entryProfileTabAuthorArticleUpsert({
      author_id,
      lang: 'en',
      id,
      tags: [],
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
          locale: "en_US",
          title: seoTitle,
          type: 'website',
          url: link,
        },
        main_data: {
          canonical: link,
          description: seoDescription,
          keywords: "",
          nofollow: false,
          noindex: false,
          title: seoTitle
        }
      },
      data: {
        content,
        title,
        meta_description: seoDescription,
        seo_title: seoTitle
      }
    });

    return json({ success: true });

  } catch (e)
  {
    console.log("Error: ", e);
    return json({ success: false, message: e.message });
  }

};