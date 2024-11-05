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
  let { content, title, author_id } = body;
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  content = DOMPurify.sanitize(content);
  title = DOMPurify.sanitize(title);
  try
  {
    entryProfileTabAuthorArticleUpsert({
      author_id,
      lang: 'en',
      tags: [],
      seo_details: {
        twitter_card: {
          description: "",
          title: title,
          image: "",
          site: '@betarenasocial',
          image_alt: "",
        },
        opengraph: {
          description: "",
          images: [],
          locale: "en_US",
          title: title,
          type: 'website',
          url: "",
        },
        main_data: {
          canonical: "",
          description: "",
          keywords: "",
          nofollow: false,
          noindex: false,
          title
        }
      },
      data: {
        content,
        title,
        seo_title: title,
        meta_description: ""
      }
    });

    return json({ success: true });

  } catch (e)
  {
    console.log("Error: ", e);
    return json({ success: false, message: e.message });
  }

};


export const PUT: RequestHandler = async ({ request, locals }) =>
{
  if (!locals.uid) throw error(401, { message: 'Unauthorized' } as App.Error);
  const body = await request.json();
  let { content, title, author_id } = body;
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  content = DOMPurify.sanitize(content);
  title = DOMPurify.sanitize(title);
  try
  {
    entryProfileTabAuthorArticleUpsert({
      author_id,
      lang: 'en',
      tags: [],
      data: {
        content,
        title,
        seo_title: title,
        meta_description: ""
      }
    });

    return json({ success: true });

  } catch (e)
  {
    console.log("Error: ", e);
    return json({ success: false, message: e.message });
  }
};