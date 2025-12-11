// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format // V.8.0                                                           │
// │ ➤ Status      // 🔒 LOCKED                                                       │
// │ ➤ Author(s)   // @migbash                                                        │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Betarena (Module) ││ (Author) Article Data Endpoint                              │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📌 NOTE                                                                          │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 1. no logs allowed, including those custom 'debug' logs.                         │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

/* eslint-disable new-cap */

// #region ➤ 📦 Package Imports

import { json, type RequestEvent } from "@sveltejs/kit";
// import { dev } from '$app/environment';

import {
  entryAuthorArticleTranslation,
  entryAuthorArticleViewsIncrement,
} from "@betarena/scores-lib/dist/functions/v8/authors.articles.js";
import { entryTargetDataArticle } from "@betarena/scores-lib/dist/functions/v8/main.preload.authors.js";
import { tryCatchAsync } from "@betarena/scores-lib/dist/util/common.js";
import { postv2 } from "$lib/api/utils.js";
import { API_DATA_ERROR_RESPONSE } from "$lib/utils/debug.js";
import { BetarenaUserHelper } from "$lib/firebase/common.js";
import type {  IPageAuhtorArticleDataFinal } from "@betarena/scores-lib/types/v8/preload.authors.js";
import type {  IFirebaseFunctionArticleAccessCheck } from "@betarena/scores-lib/types/firebase/functions.js";
import * as parse5 from "parse5";
// #endregion ➤ 📦 Package Imports

// ╭──────────────────────────────────────────────────────────────────╮
// │ 🛠️ │ MAIN METHODS                                                │
// ╰──────────────────────────────────────────────────────────────────╯

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📝 (Author) Article Data Endpoint handler.
 * @param { RequestEvent } request
 *  💠 **[required]** Request Event.
 * @returns { Promise < Response > }
 *  📤 Response.
 */
export async function main(request: RequestEvent): Promise<Response> {
  return await tryCatchAsync(
    async (): Promise<Response> => {
      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| extract url query data.                                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      const queryParamPermalink = request.url.searchParams.get("permalink"),
        edit = request.url.searchParams.get("edit"),
        queryParamLanguage = request.url.searchParams.get("lang"),
        queryParamArticleId = request.url.searchParams.get("articleId");
      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET article data.                            │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamPermalink) {
        const /**
           * @description
           * 📝 Data Response.
           */
          data = await entryTargetDataArticle({
            permalinkTarget: queryParamPermalink,
            cacheCheck: false,
          }) as  IPageAuhtorArticleDataFinal & {
            article_access?: IFirebaseFunctionArticleAccessCheck["response"]["success"]["data"];
          };
        const { access_type, reward_tier_id, id } = data.article;
        if (access_type === "reward_gated" && reward_tier_id) {
          const uid = request.locals.uid || "";
          const res = (await BetarenaUserHelper.pingArticleAccessCheck({
            query: {},
            body: {
              strUid: uid,
              intArticleId: id || 0
            }
          }));
          const article_access = res.success ? res.success.data : null;
          if (article_access)
          {
            data.article_access = article_access;

          }
          const userAgent = request.request.headers.get("user-agent") || "";
          const isBot = isRequestFromBot(userAgent);

          if (!article_access?.hasAccess && data.article.data && !isBot && !edit)
          {
            data.article.data.content = await removeContentAfterTarget(data.article.data.content);
          }
        }
        // console.log('data-091', data);

        // ╭─────
        // │ NOTE: IMPORTANT
        // │ ➤ Trigger article 're-cache' and 'TTL' update
        // ╰─────
        await postv2(
          // 'https://webhook.site/a16a8324-c046-487a-a1ac-db6e1eaffed6',
          `
            http://65.109.14.126:8500/sitemap-and-preload
              ?
                ids[]=${data.article.id}
              &
                operation[]=preload-target
              &
                category[]=author_article
          `
            .replaceAll("\n", "")
            .replaceAll(" ", ""),
          {}
        );

        if (data != undefined) return json(data);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (output) fetch TARGET translation data.                        │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamLanguage) {
        const /**
           * @description
           * 📝 Data Response.
           */
          data = await entryAuthorArticleTranslation({
            language: queryParamLanguage,
            cacheCheck: true,
          }),
          /**
           * @description
           * 📝 Target data.
           */
          target = data[0].get(queryParamLanguage);
        // [🐞]
        // eslint-disable-next-line no-console
        // if (dev) console.log(target);

        if (data != undefined) return json(target);
      }

      // ╭──────────────────────────────────────────────────────────────────╮
      // │:| (default) data.                                                │
      // ╰──────────────────────────────────────────────────────────────────╯

      if (queryParamArticleId) {
        const /**
           * @description
           * 📝 Data Response.
           */
          data = await entryAuthorArticleViewsIncrement(
            Number(queryParamArticleId)
          );
        return json(null);
      }

      return json(null);
    },
    (ex: unknown): Response => {
      // [🐞]
      // eslint-disable-next-line no-console
      console.error(ex);

      return API_DATA_ERROR_RESPONSE();
    }
  );
}



/**
 * @author
 *  @izobov
 * @summary
 *  🟥 HELPER
 * @description
 *  📝 Remove content after the second paragraph without images.
 * @param { string } htmlContent
 *  💠 **[required]** HTML content string.
 * @returns { Promise < string > }
 *  📤 Modified HTML content string.
 */
export function removeContentAfterTarget(htmlContent: string): string {
  try {
    const document = parse5.parse(htmlContent) as any;

    const htmlElement = document.childNodes?.find(
      (node: any) => node.nodeName === "html"
    );
    if (!htmlElement) return htmlContent;

    const bodyElement = htmlElement.childNodes?.find(
      (node: any) => node.nodeName === "body"
    );
    if (!bodyElement) return htmlContent;

    const children = bodyElement.childNodes as any[];
    let paragraphCount = 0;
    let targetIndex = -1;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child) continue;

      if (child.nodeName === "p") {
        const hasImage =
          child.childNodes?.some((node: any) => node.nodeName === "img") ??
          false;

        if (!hasImage) {
          paragraphCount++;
          if (paragraphCount === 2) {
            targetIndex = i;
            break;
          }
        }
      }
    }

    if (targetIndex > -1) {
      for (let i = children.length - 1; i > targetIndex; i--) {
        children.splice(i, 1);
      }
    }

    let result = parse5.serialize(document);
    result = result.replace(/<\/?html[^>]*>/gi, "");
    result = result.replace(/<head[^>]*>.*?<\/head>/gis, "");
    result = result.replace(/<body[^>]*>/gi, "");
    result = result.replace(/<\/body>/gi, "");

    return result.trim();
  } catch (e) {
    console.error("Error in removeContentAfterTarget: ", e);
    return htmlContent;
  }
}

/**
 * @author
 *  @izobov
 * @summary
 *  🟥 HELPER
 * @description
 *  📝 Identify if the request is from a bot based on the user agent string.
 * @param { string } userAgent
 *  💠 **[required]** User agent string.
 * @returns { boolean }
 *  📤 True if the request is from a bot, otherwise false.
 */
function isRequestFromBot(userAgent: string): boolean {
  const botPattern = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|mj12bot|semrushbot|ahrefsbot|rogerbot|dotbot/i;
  return botPattern.test(userAgent);
}