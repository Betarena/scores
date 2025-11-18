// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Overview                                                           │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Code Format   // V.8.0                                                         │
// │ ➤ Status        // 🔒 LOCKED                                                     │
// │ ➤ Author(s)     // @migbash                                                      │
// │ ➤ Maintainer(s) // @migbash                                                      │
// │ ➤ Created on    // <date-created>                                                │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ │: Server Hooks (a.k.a SvelteKit Middleware)                                     │
// │ │: NOTE: | WARNING:                                                              │
// │ │: only applicable to 'load(..)' lifecycle logic in +page[.server].ts files      │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ │: 🔗 read-more :: https://kit.svelte.dev/docs/hooks#server-hooks                │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { convertLocaleToLang, mapLangToLocaleAuthor } from '$lib/constants/instance.js';
import { getCookie } from '$lib/store/cookie.js';
import { sequence } from '@sveltejs/kit/hooks';
import parserAccLang from 'accept-language-parser';
import chalk from 'chalk';
import cookie from 'cookie';
import fs from 'fs-extra';
import LZString from 'lz-string';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { config } from '$lib/constants/config.js';
import { dlog, errlog, ERROR_CODE_INVALID, log_v3, PAGE_INVALID_MSG } from '$lib/utils/debug';
import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
import { parseObject, stringToObject } from '$lib/utils/string.2.js';

import type { IBetarenaUserCookie } from '$lib/types/types.cookie.js';
import type { Handle, HandleServerError } from '@sveltejs/kit';

// #endregion ➤ 📦 Package Imports

// #region ➤ 💠 MISCELLANEOUS

// [🐞]
dlog
(
  '🚏 checkpoint [H] ➤ src/hooks.server.ts'
);

const
  /**
   * @description
   * 📝 __filename constant.
   */
  __filename = fileURLToPath(import.meta.url),
  // ╭─────
  // │ NOTE:
  // │ |: destructure assignment
  // ╰─────
  [
    __dirname,
    mapHeadLinkCache,
    objConfigModule,
  ] = [
    dirname(__filename),
    new Map(),
    config.objApp.objComponentConfiguration.get('src/hooks.server.ts')!
  ]
;

// #endregion ➤ 💠 MISCELLANEOUS

// #region ➤ 🛠️ METHODS

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📝 Custom `Error` handle logic.
 * @param input
 *  💠 **ALWAYS** `_inherited_types_`
 * @returns { HandleServerError }
 */
const customErrorHandler: HandleServerError = async (
  {
    error,
    event
  }
): Promise < App.Error > =>
{
  const
    /**
     * @description
     * 📝 Error message.
     */
    objError: App.Error
      = {
        message: 'Whoops!',
        errorId: 'x1',
      }
  ;

  // ╭─────
  // │ NOTE:
  // │ |: Skip unwanted logging bloat of 'error', if 'error' is due to 'Not found' page.
  // ╰─────
  if (error instanceof Error && error.message.includes('Not found:'))
    // [🐞]
    errlog
    (
      `🚏 checkpoint ➤ Hooks | src/hooks.server.ts customErrorHandler(..)\n${error.message}`,
    );
  else
    // [🐞]
    errlog
    (
      `🚏 checkpoint ➤ Hooks | src/hooks.server.ts customErrorHandler(..)\n${error}\n${parseObject(event)}`,
    );
  ;

  // [🐞]
  // eslint-disable-next-line no-console
  // console.trace(error);

  if (event.route.id == null)
  {
    objError.message = PAGE_INVALID_MSG;
    objError.errorId = ERROR_CODE_INVALID.toString();
  }

  return objError;
}

// #endregion ➤ 🛠️ METHODS

// #region ➤ 🔄 LIFECYCLE - [HOOKS]

export const handle: Handle = sequence
(
  async (
    {
      event,
      resolve,
    }
  ): Promise < Response > =>
  {
    // [🐞]
    log_v3
    (
      {
        strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // START',
        msgs:
        [
          `🔹 [var] ➤ event.url :: ${event.url}`,
          `${parseObject(event.locals) != '{}' ? `🔹 [var] ➤ event.locals :: ${parseObject(event.locals)}` : '[EMPTY]'}`,
          `${parseObject(event.request.headers) != '{}' ? `🔹 [var] ➤ event.request.headers :: ${parseObject(event.request.headers)}` : '[EMPTY]'}`,
        ],
      }
    );

    // if (event.url.pathname == '/api/misc/debug')
    //   return await resolve(event);
    // else if (event.url.pathname == '/api/data/main.config' && event.url.searchParams.has('type') && event.url.searchParams.get('type') === 'hooks.server')
    //   return await resolve(event);
    // ;

    // #region ➤ 🛠️ METHODS

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📝 Helper to validate visitor cookie.
     * @global mapHeaders
     * @global cookies
     * @global event
     * @global objUserDefaultCookie
     * @global dataRes20
     * @returns { void }
     */
    function _helperValidateVisitor
    (
    ): void
    {
      const
        /**
         * @description
         * 📝 obtaining 'accept-language' from request headers.
         */
        listLanguages
          = parserAccLang.parse(mapHeaders.get('accept-language') ?? '')
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) :: _helperValidateVisitor(..) // INSIGHT',
          msgs:
          [
            `🔹 [var] ➤ listLanguages :: ${parseObject(listLanguages)}`,
            `🔹 [var] ➤ cookies :: ${parseObject(cookies)}`,
            // `🔹 [var] ➤ dataRes20 :: ${parseObject(dataRes20)}`,
          ],
        }
      );

      // ╭─────
      // │ CHECK:
      // │ |: [0] for EXISTING visitor, RE-SET cookie values.
      // ╰─────
      if (cookies.betarenaScoresCookie)
      {
        // @ts-expect-error :: <?>
        event.locals.user = stringToObject<IBetarenaUserCookie>(cookies.betarenaScoresCookie);
        event.locals.user.state = 'IsAnonymousReturning';
        event.locals.setState!.add('IsAnonymousReturning');
      }
      // ╭─────
      // │ CHECK:
      // │ |: [1] for NEW visitor, set default values.
      // ╰─────
      else
      {
        // [🐞]
        log_v3
        (
          {
            strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // [1] - user cookie not found, setting cookie',
            msgs: [],
          }
        );

        event.locals.user = {
          uid: null,
          lang: 'en',
          theme: 'Dark',
          // ╭─────
          // │ NOTE: WIP
          // │ |: attempt to identify user IP from 'request',
          // │ |: to preload data from 'server'.
          // ╰─────
          /*
            originIP:
              event.request.headers['x-forwarded-for']
              || event.request.socket.remoteAddress
              || null
            originIP: clientAddress,
            geoPos:
              !prerendering
                ? (await getUserLocationFromIP(clientAddress))
                : '',
          */
        };

        // ╭─────
        // │ CHECK:
        // │ |: [1] for root page (/) access request, set 'lang' from 'accept-language' header,
        // ╰─────
        if (event.url.pathname === '/' && event.route.id === '/(scores)/[[lang=lang]]')
        {
          event.locals.user.state = 'IsAnonymousNew';
          event.locals.setState!.add('IsAnonymousNew');
          if (listLanguages.length > 0 && listLanguages[0].code && listLanguages[0].region)
            event.locals.user.lang = convertLocaleToLang(`${listLanguages[0].code}-${listLanguages[0].region}`);
          else
            event.locals.user.lang = 'en';
          ;
        }
        // ╭─────
        // │ CHECK:
        // │ |: [2] for other page access request, set 'lang' from URL param or default to 'en'.
        // ╰─────
        else
        {
          event.locals.user.state = 'IsAnonymousNewBurner';
          event.locals.setState!.add('IsAnonymousNewBurner');
          event.locals.user.lang = event.params.lang ?? 'en';

          if (event.url.searchParams.get('lang'))
            event.locals.user.lang = event.url.searchParams.get('lang') ?? 'en';
          ;
        }
      }

      // ╭─────
      // │ CHECK:
      // │ |: [0] for AUTHENTICATED user, update 'locals' values.
      // ╰─────
      if (cookies.betarenaCookieLoggedIn)
      {
        event.locals.uid = event.locals.user.uid;
        event.locals.user.state = 'IsBetarenaUser';
        event.locals.setState!.add('IsBetarenaUser');
      }

      return;
    }

    /**
     * @author
     *  @migbash
     * @description
     *  📝 Helper inject metadata into 'locals'.
     * @returns { Promise < void > }
     */
    async function _helperInjectMetaData
    (
    ): Promise < void >
    {
      return;

      // const
      //   /**
      //    * @description
      //    * 📝 fetch 'main.config' data.
      //    */
      //   dataRes2 = await event.fetch
      //     (
      //       `/api/data/main.config?type=hooks.server`
      //     ),
      //   /**
      //    * @description
      //    * 📝 fetch 'main.config' data (v2).
      //    */
      //   dataRes20 = (await dataRes2.json())
      // ;
    }

    /**
     * @author
     *  @migbash
     * @description
     *  📝 Helper set response headers.
     * @global dataRes0
     * @global event
     * @returns { void }
     */
    function _helperSetHeaders
    (
    ): void
    {
      const
        // ╭─────
        // │ NOTE:
        // │ |: destructure assignment
        // ╰─────
        [
          isCondition1,
        ] = [
          (objConfigModule.isHeadersCookieEnabled && cookies.betarenaScoresCookie == null),
        ]
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: '🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // _helperSetHeaders(..) INSIGHT',
          msgs:
          [
            `🔹 [var] ➤ cookies :: ${parseObject(cookies)}`,
            `🔹 [var] ➤ event.locals.user :: ${parseObject(event.locals.user)}`,
            `🔹 [var] ➤ isCondition1 (set cookie) :: ${isCondition1}`,
          ],
        }
      );

      // ╭─────
      // │ NOTE:
      // │ |: (re)set cookie.
      // ╰─────
      if (isCondition1)
        dataRes0.headers.set
        (
          'Set-Cookie',
          cookie.serialize
          (
            'betarenaScoresCookie',
            parseObject(event.locals.user),
            {
              path: '/',
              // httpOnly: true,
              /* ─── 1 week ─── */
              maxAge: 60 * 60 * 24 * 7
            }
          )
        );
      ;

      return;
    }

    /**
     * @author
     *  @migbash
     * @summary
     *  🔹 HELPER
     * @description
     *  📝 Helper log metrics.
     * @returns { void }
     */
    function _helperHooksPerformanceMetrics
    (
    ): void
    {
      let
        /**
         * @description
         * 📝 Execution time.
         */
        strExecutionTime = ((performance.now() - t0) / 1000).toFixed(5)
      ;

      if (parseFloat(strExecutionTime) > (objConfigModule.intPerformanceThresholdMs ?? 1))
        strExecutionTime = chalk.bgRed(`⚠️ ${strExecutionTime} sec`);
      else
        strExecutionTime = `${strExecutionTime} sec`;
      ;

      // [🐞]
      log_v3
      (
        {
          strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // END (${strExecutionTime})`,
          msgs:
          [
            `🔹 [var] ➤ event.url :: ${event.url}`,
            `${parseObject(event.locals) != '{}' ? `🔹 [var] ➤ event.locals :: ${parseObject(event.locals)}` : '[EMPTY]'}`,
            // ╭─────
            // │ NOTE:
            // │ |: additional helpful logging.
            // ╰─────
            // `🔹 [var] ➤ event.route.id :: ${event.route.id}`,
            // `🔹 [var] ➤ event :: ${event.request.headers.get('accept-language')}`,
          ],
        }
      );
    }

    /**
     * @author
     *  @migbash
     * @summary
     *  ♦️ MAIN
     *  🔹 HELPER
     * @description
     *  📝 Helper to transform page chunk.
     * @param { object } _
     *
     * @param { string } _.html
     *
     * @param { boolean } _.done
     *
     * @return { string }
     *  📤 Mutated final HTML string
     */
    function _helperTransformPageChunk
    (
      {
        html,
        done,
      }:
      {
        html: string;
        done: boolean;
      }
    ): string
    {
      // [🐞]
      log_v3
      (
        {
          strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // transformPageChunk INSIGHT`,
          msgs:
          [
            // `🔹 [var] ➤ html :: ${html}`,
            `🔹 [var] ➤ html.length :: ${html.length}`,
            `🔹 [var] ➤ done :: ${done}`,
          ],
        }
      );

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 🏗️ │ CRITICAL INJECTION                                                          │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      // ╭─────
      // │ NOTE: IMPORTANT CRITICAL
      // │ |: rutime injection :: stylesheets for A/B testing
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.stylesheets.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.stylesheets.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.stylesheets.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.stylesheets.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT CRITICAL
      // │ |: rutime injection :: fonts for A/B testing
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.fonts.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.fonts.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.fonts.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.fonts.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ ⛩️ │ 3RD-PARTY INJECTION                                                         │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (GOOGLE-TAG-MANAGER)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.googleTagManager.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.googleTagManager.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.googleTagManager.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.googleTagManager.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (TWITTER)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.twitter.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.twitter.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.twitter.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.twitter.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (POSTHOG)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.posthog.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.posthog.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.posthog.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.posthog.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (LINKEDIN)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.linkedin.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.linkedin.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.linkedin.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.linkedin.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (FACEBOOK)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.facebook.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.facebook.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.facebook.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.facebook.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: rutime injection :: 3RD-PARTY for A/B testing (INTERCOM)
      // ╰─────
      if (objConfigModule.objHtmlHeadABTestingInjection?.intercom.isEnabled)
        html = html
          ?.replace
          (
            objConfigModule.objHtmlHeadABTestingInjection.intercom.strHtmlHeadForInjection,
            (
              _string
            ) =>
            {
              return objConfigModule.objHtmlHeadABTestingInjection.intercom.objLoadingOptions
                [
                  objConfigModule.objHtmlHeadABTestingInjection.intercom.strLoadingType
                ] ?? ''
              ;
            }
          )
      ;

      // ╭──────────────────────────────────────────────────────────────────────────────────╮
      // │ 🚄 │ PERFORMANCE                                                                 │
      // ╰──────────────────────────────────────────────────────────────────────────────────╯

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: inline CSS/JS to reduce number of HTTP requests
      // ╰─────
      if (objConfigModule?.objHtmlHeadABTestingInjection?.isInjectionEnabled)
        html = html
          .replaceAll
          (
            /<link\b[^>]*?\bhref\s*=\s*["']([^"']+)["'][^>]*>/g,
            // /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/g, # ➤ ❌ does not capture the '.js' link tags
            // /<link\b(?=[^>]*\bhref="[^"]*")[^>]*>/g, # ➤ ❌ does not capture href value
            // /<link.*href=\"(.*?)\".*>$/g, # ➤ ??? unknown issue
            (
              _substring: string,
              href: string,
            ) =>
            {
              let
                // ╭─────
                // │ NOTE:
                // │ |: validate href path
                // ╰─────
                [
                  hrefValid,
                  injectionType,
                ] = [
                  href,
                  'style',
                ]
              ;

              // ╭─────
              // │ CHECK:
              // │ |: for '<script>/<style>' injection, or skip parsing.
              // ╰─────
              if (_substring.includes('as="script"'))
                injectionType = 'script'
              else if (_substring.includes('rel="stylesheet"'))
                injectionType = 'style';
              else if (_substring.includes('.html'))
                injectionType = 'html';
              else
                return _substring;
              ;

              // ╭─────
              // │ CHECK:
              // │ |: for given 'hrefs' path, adjust for correct path
              // ╰─────
              if (hrefValid.includes('../../_app'))
                hrefValid = hrefValid.replace('../../', '../../client/');
              else if (hrefValid.includes('/_app'))
                hrefValid = hrefValid
                  .replace('/_app', '../../client/_app')
                ;
              else if (!hrefValid.includes('/_app'))
                hrefValid = `../../client/${hrefValid}`;
              ;

              hrefValid = hrefValid
                .replace(/\.{3,}/g, '..')
              ;

              const
                // ╭─────
                // │ NOTE:
                // │ |: determine if inlining of CSS should be compressed or not
                // ╰─────
                [
                  isCondition1,
                  isCondition2,
                  isCondition3,
                ] = [
                  // ╭─────
                  // │ CHECK:
                  // │ |: for inlining of certain 'hrefs'
                  // ╰─────
                  (
                    [...objConfigModule.objHtmlHeadABTestingInjection.setInjectionLinkHrefExclude]
                      .some(_value => href.includes(_value))
                  ),
                  // ╭─────
                  // │ CHECK:
                  // │ |: for inlining of HTML templates
                  // ╰─────
                  (
                    href.endsWith('.html')
                  ),
                  // ╭─────
                  // │ CHECK:
                  // │ |: for 'compression' of inlined 'hrefs'
                  // ╰─────
                  (
                    objConfigModule?.objHtmlHeadABTestingInjection.isInjectionCompressed
                    && ![...objConfigModule.objHtmlHeadABTestingInjection.setInjectionCompressedExclude]
                      .some(_value => href.includes(_value))
                  ),
                ]
              ;

              // [🐞]
              log_v3
              (
                {
                  strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts // (step) isInjectionEnabled INSIGTH`,
                  msgs:
                  [
                    `🔹 [var] ➤ href :: ${href}`,
                    `🔹 [var] ➤ hrefValid :: ${hrefValid}`,
                    `🔹 [var] ➤ mapHeadLinkCache.size :: ${mapHeadLinkCache.size}`,
                    // `🔹 [var] ➤ _substring :: ${_substring}`,
                    `🔹 [var] ➤ __dirname :: ${__dirname}`,
                    `🔹 [var] ➤ isCondition1 (skip inline) :: ${isCondition1}`,
                    `🔹 [var] ➤ isCondition2 (inline raw html) :: ${isCondition2}`,
                    `🔹 [var] ➤ isCondition3 (inline & compress) :: ${isCondition3}`,
                  ]
                }
              );

              if (isCondition1)
                return ``;
              ;

              // ╭─────
              // │ CHECK:
              // │ |: for, injectable-override presence in local memory-cache
              // ╰─────
              if (!mapHeadLinkCache.has(href))
                mapHeadLinkCache.set
                (
                  href,
                  fs.readFileSync
                  (
                    `${__dirname}/${hrefValid}`,
                    'utf8'
                  )
                );
              ;

              let
                /**
                 * @description
                 * 📝 inlined string content.
                 */
                strInlined = mapHeadLinkCache.get(href) as string
              ;

              // ╭─────
              // │ NOTE: WARNING:
              // │ |: disabled for now, causes issues with CSS parsing
              // ╰─────
              // if (objConfigModule.objHtmlHeadABTestingInjection.isInjectionInlineSingleLineEnabled && !isCondition2)
              //   strInlined = strInlined.replace
              //     (
              //       /\s+/g,
              //       ''
              //     )
              //   ;
              // ;

              // ╭─────
              // │ CHECK:
              // │ |: for, desired inlining injection
              // ╰─────
              if (isCondition2)
                return `
                  <!-- inlined HTML-TEMPLATE for ${href} -->
                  ${strInlined}
                `;
              else if (isCondition3)
                return `
                  <!-- inlined COMPRESSED ${injectionType} for ${href} -->
                  <script>
                    (
                      () =>
                      {
                        const compressed = ${LZString.compress(strInlined)};
                        const decompressed = LZString.decompress(compressed);
                        const style = document.createElement('style');
                        style.textContent = decompressed;
                        document.head.appendChild(style);
                      }
                    )();
                  </script>
                `;
              else
                return `
                  <!-- inlined ${injectionType} for ${href} -->
                  <${injectionType}>
                    ${strInlined}
                  </${injectionType}>
                `;
              ;
            }
          )
        ;
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: loop over ALL '<img src="*">' tags found in 'preloaded' data & inject as 'preload' links.
      // ╰─────
      if (objConfigModule?.objHtmlHeadABTestingInjection?.isInjectionImagePreload)
        for (const element of html?.matchAll(/\\u003Cimg[^>]+src=\\["']([^\\"'>]+)[\\"']/g))
        {
          // [🐞]
          log_v3
          (
            {
              strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts // (step) isInjectionImagePreload INSIGTH`,
              msgs:
              [
                `🔹 [var] ➤ element[1] :: ${element[1]}`,
              ]
            }
          );

          html = html
            .replace
            (
              `</head>`,
              `
                <link rel="preload" as="image" href="${element[1]}" fetchpriority="high">
              </head>
              `
            )
          ;
        }
      ;

      // ╭─────
      // │ NOTE: IMPORTANT
      // │ |: set correct 'lang' attribute in <html lang="...">
      // ╰─────
      html = html
        .replace
        (
          '%lang%',
          (event.locals.strLocaleOverride ?? mapLangToLocaleAuthor.get(methodRes0) ?? 'en-US')
        )
      ;

      return html;
    }

    // #endregion ➤ 🛠️ METHODS

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [1]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes before calling 'endpoint'                                          │
    // │ |: - Executes after 'layout.server.ts'                                           │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    const
      // [🐞]
      t0 = performance.now(),
      // ╭─────
      // │ NOTE:
      // │ |: destruct object
      // ╰─────
      {
        request:
        {
          headers: mapHeaders
        }
      } = event,
      /**
       * @description
       *  📝 obtaining cookies from request headers.
       */
      cookies
        = getCookie
        (
          mapHeaders.get('cookie')
        )
    ;

    event.locals.setState = new Set();
    event.locals.metadata ??= { domain: 'betarena.com' };

    _helperValidateVisitor();
    // await _helperInjectMetaData();

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [2]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes 'endpoint'                                                         │
    // │ |: - Executes after 'layout.server.ts'                                           │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    const
      /**
       * @description
       * 📝 Method Response (0)
       */
      methodRes0
        = platfrom_lang_ssr
        (
          event.route.id,
          // @ts-expect-error
          // ╭─────
          // │ FIXME:
          // │ > event.error does not exist in a hook
          // ╰─────
          event.error,
          event.params.lang,
        ),
      /**
       * @description
       *  📝 new with response of <html lang...>
       * @see https://github.com/sveltejs/kit/issues/3091
       */
      dataRes0
        = await resolve
        (
          event,
          {
            transformPageChunk:
            (
              {
                html,
                done,
              }
            ): string =>
            {
              return _helperTransformPageChunk
              (
                {
                  html,
                  done,
                }
              );
            },
            preload:
            (
              {
                type,
                path
              }
            ): boolean =>
            {
              // [🐞]
              log_v3
              (
                {
                  strGroupName: `🚏 checkpoint ➤ Hooks | src/hooks.server.ts handle(..) // preload INSIGHT`,
                  msgs:
                  [
                    `🔹 [var] ➤ type :: ${type}`,
                    `🔹 [var] ➤ path :: ${path}`,
                  ],
                }
              );

              return config.objApp.objComponentConfiguration.get('src/hooks.server.ts')?.isPreload ?? true;
            }
          }
        )
    ;

    // ╭──────────────────────────────────────────────────────────────────────────────────╮
    // │ 🔄 LIFECYCLE - [3]                                                               │
    // ┣──────────────────────────────────────────────────────────────────────────────────┫
    // │ |: - Executes 'endpoint'                                                         │
    // ╰──────────────────────────────────────────────────────────────────────────────────╯

    _helperSetHeaders();
    _helperHooksPerformanceMetrics();

    return dataRes0;
  }
);

// ╭─────
// │ NOTE:
// │ │: using Sentry with Custom Error Handler.
// ╰─────
export const handleError: HandleServerError = customErrorHandler;

// #endregion ➤ 🔄 LIFECYCLE - [HOOKS]
