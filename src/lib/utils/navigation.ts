// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Navigation Logic                                                        │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { dev } from '$app/environment';
import { goto, invalidate, invalidateAll } from '$app/navigation';
import { error, redirect, type Page } from '@sveltejs/kit';
import LZString from 'lz-string';

import { get } from '$lib/api/utils.js';
import { routeIdAuthorProfile, routeIdAuthorSubscribers, routeIdContent, routeIdPageAuthors, routeIdPageCompetition, routeIdPageCompetitionLobby, routeIdPageFixture, routeIdPageLeague, routeIdPagePlayer, routeIdPageProfile, routeIdPageProfileArticleCreation, routeIdPageProfileAuthorCreate, routeIdPageProfileEditArticle, routeIdPageProfilePublication, routeIdPageTags, routeIdSportstack } from '$lib/constants/paths.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common';
import { PAGE_INVALID_MSG, dlogv2 } from './debug';
import { dlog } from './debug.js';
import { checkNull, tryCatch } from './miscellenous.js';
import { gotoSW } from './sveltekitWrapper.js';

import type { IPermalinkValidationResponse } from '$lib/types/types.response.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  - 📌 MAIN
 *  - 🟥 IMPORTANT
 * @description
 *  - 📣 [1] Updates platform **language** selection.
 *  - 📣 [2] Manages platform **navigation** for correct **language** switch.
 * @param { string | NullUndef } lang
 *  💠 **[required]** New `selected` language.
 * @return { Promise < void > }
 */
export async function selectLanguage
(
  lang: string | NullUndef
): Promise<void>
{
  if (sessionStore.extract('lang') == lang || !lang) return;

  userBetarenaSettings.updateData
  (
    [
      ['lang', lang]
    ]
  );

  const
    /**
     * @description
     *  📣 Past/previous lang option.
     */
    pastLang: string
      = sessionStore.extract('lang') == 'en'
        ? '/'
        : `/${sessionStore.extract('lang')}`,
    /**
     * @description
     * 📝 Data for `page`
     */
    page = sessionStore.extract<Page>('page')
    ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ selectLanguage(..)',
    [
      `🔹 [var] ➤ $userBetarenaSettings.lang: ${userBetarenaSettings.extract('lang-user')}`,
      `🔹 [var] ➤ $sessionStore?.serverLang: ${sessionStore.extract('lang')}`,
      `🔹 [var] ➤ lang: ${lang}`,
      `🔹 [var] ➤ pastLang: ${pastLang}`,
      `🔹 [var] ➤ $page.route.id: ${page?.route.id}`
    ],
    true
  );

  // ╭─────
  // │ NOTE:
  // │ > Update <html {lang}> in platform <DOCTYPE>.
  // ╰─────
  document.documentElement.setAttribute
  (
    'lang',
    (lang == 'br' ? 'pt-BR' : lang)
  );

  // ╭─────
  // │ CHECK
  // │ > on 'error', navigate back to homepage.
  // ╰─────
  if (!checkNull(page?.error))
  {
    const
      targetUrl: string
        = lang == 'en'
          ? '/'
          : `/${lang}`
      ;

    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ selectLanguage(..) [x0]',
      [
        `🔹 [var] ➤ targetUrl :|: ${targetUrl}`,
      ],
      true
    );

    if (dev) return;

    await gotoSW
    (
      targetUrl
    );

    return;
  }

  // ╭─────
  // │ CHECK
  // │ > handle 'special' routes that already self-manage navigation
  // ╰─────
  if
  (
    [
      routeIdPageLeague,
      routeIdPageFixture,
      routeIdPagePlayer,
      routeIdPageCompetitionLobby,
      routeIdPageCompetition
    ].includes(page?.route.id ?? '')
  )
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ selectLanguage(..) if_M_1 page?.route?.id: ${page?.route.id} [exit]`,
      true
    );

    return;
  }

  switch (page?.route.id)
  {
    case routeIdPageProfile:
    case routeIdPageProfilePublication:
    case routeIdPageProfileArticleCreation:
    case routeIdPageProfileEditArticle:
    case routeIdPageProfileAuthorCreate:
  {
    const
      pastLangV2: string
              = pastLang == '/'
                ? '/en'
                : pastLang,
      tempUrl: string = `${page.url.pathname}/`,
      newURL: string = tempUrl
        .replace
        (
          `${pastLangV2}/`,
          `/${lang}`
      ) + page.url.search
            ;

    // [🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ selectLanguage(..) [x1]',
      [
        `🔹 [var] ➤ pastLangV2 :|: ${pastLangV2}`,
        `🔹 [var] ➤ tempUrl :|: ${tempUrl}`,
        `🔹 [var] ➤ newURL :|: ${newURL}`,
      ],
      true
    );

    await gotoSW
    (
      newURL,
      true
    );

    return;
  }
    case routeIdContent: {
      const newUrl = lang === 'en' ? '/' : `/${lang}`;
      // [🐞]
      dlogv2(
        '🚏 checkpoint ➤ selectLanguage(..) [x1]',
        [`🔹 [var] ➤ newURL :|: ${newUrl}`],
        true
      );
      sessionStore.updateData([['lang', lang]]);
      goto(newUrl, { replaceState: true });
      break;
    }
    case routeIdAuthorProfile:
    case routeIdAuthorSubscribers:
    case routeIdSportstack:
      //[🐞]
      dlogv2
        (
          '🚏 checkpoint ➤ selectLanguage(..) [x2]',
          [
          ],
          true
        );

      sessionStore.updateData
        (
          [
            ['lang', lang]
          ]
        );
      invalidate("author:translations")
      return
    case routeIdPageTags:

    //[🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ selectLanguage(..) [x2]',
      [
      ],
      true
    );

    sessionStore.updateData
    (
      [
        ['lang', lang]
      ]
    );
      invalidateAll();

    return;
  case routeIdPageAuthors:
  {
    //[🐞]
    dlogv2
    (
      '🚏 checkpoint ➤ selectLanguage(..) [x2]',
      [
      ],
      true
    );

    invalidateAll();

    sessionStore.updateData
    (
      [
        ['lang', lang]
      ]
    );

    return;
  }
  default: break;
  }

  // ╭─────
  // │ NOTE:
  // │ > continue standard navigation switch.
  // ╰─────

  const
    /**
     * @description
     *  📣 count number of slashes URL.
     */
    countSlash: number = (page?.url.pathname.split('/')?.length ?? 0) - 1
    ;

  let
    /**
     * @description
     *  📣 NEW `url` to be navigatated to.
     */
    newURL: string | undefined
    ;

  // ╭─────
  // │ NOTE:
  // │ > maybe [?]
  // ╰─────
  // prefetch(`/`);

  // ╭─────
  // │ CHECK
  // │ > for 'EN' naviagtion.
  // ╰─────
  if (lang == 'en' && pastLang != '/')
    // ╭─────
    // │ NOTE:
    // │ > replace path-name accordingly for 'EN', first occurance.
    // ╰─────
    newURL
      = countSlash == 1
        ? page?.url.pathname.replace(pastLang, '/')
        : page?.url.pathname.replace(pastLang, '')
    ;
  // ╭─────
  // │ CHECK
  // │ > for incoming from an 'EN' (/) route.
  // ╰─────
  else if (lang != 'en' && pastLang == '/')
    // ╭─────
    // │ NOTE:
    // │ > replace path-name accordingly for "<lang>" - first occurance.
    // ╰─────
    newURL
       = page?.url.pathname !== '/'
        ? page?.url.pathname.replace(pastLang, `/${lang}/`)
        : page.url.pathname.replace(pastLang, `/${lang}`)
    ;
  // ╭─────
  // │ CHECK
  // │ > for incoming from an 'non-EN' (/<lang>) route.
  // ╰─────
  else if (lang != 'en' && pastLang != '/')
    // ╭─────
    // │ NOTE:
    // │ > replace path-name accordingly for "<lang>" - first occurance.
    // ╰─────
    newURL
      = page?.url.pathname.replace(pastLang, `/${lang}`)
    ;
  ;

  // ╭─────
  // │ NOTE:
  // │ > update URL breadcrumb.
  // ╰─────

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ selectLanguage(..) [x3]',
    [
      `🔹 [var] ➤ newURL :|: ${newURL}`,
    ],
    true
  );

  // sessionStore.updateData
  // (
  //   [
  //     ['lang', lang]
  //   ]
  // );

  // ╭─────
  // │ NOTE:
  // │ > Solution [1]
  // ╰─────
  // window.history.replaceState({}, "NewPage", newURL);
  // ╭─────
  // │ NOTE:
  // │ > Solution [2]
  // ╰─────
  if (typeof newURL == 'string')
  {

    await gotoSW
    (
      newURL,
      true
    );
  }

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📝 Validate for target `url` to be a `valid` AND/OR a `redirect`.
 * @example
 * [1]─────────────────────────────────────────────────────────────────────────────
 *  promiseValidUrlCheck
 *  (
 *    langUrl: '/es'
 *  );
 *  ↳ DESCRIPTION :: Validates link for `lang` only, as well as checks for it being a redirect.
 * [2]─────────────────────────────────────────────────────────────────────────────
 *  promiseValidUrlCheck
 *  (
 *    langUrl: '/football'
 *  );
 *  ↳ DESCRIPTION :: Validates link for `football` only, as well as checks for it being a redirect.
 * [X]─────────────────────────────────────────────────────────────────────────────
 * @param { fetch } fetch
 *  ❔ **OPTIONAL** | `fetch(..)` instance, supplied by `sveltekit`.
 * @param { Object } opts
 *  ❔ **OPTIONAL** | Method options.
 * @param { string } opts.langUrl
 *  ❔ **OPTIONAL** | `lang` part of `url`.
 * @param { string } opts.sportUrl
 *  ❔ **OPTIONAL** | `sport` part of `url`.
 * @param { string } opts.countryUrl
 *  ❔ **OPTIONAL** | `country` part of `url`.
 * @param { string } opts.leagueUrl
 *  ❔ **OPTIONAL** | `league` part of `url`.
 * @param { string } opts.fixtureUrl
 *  ❔ **OPTIONAL** | `fixture` part of `url`.
 * @param { string } opts.playerUrl
 *  ❔ **OPTIONAL** | `player` part of `url`.
 * @param { string } opts.competitionMainUrl
 *  ❔ **OPTIONAL** | `competition (lobby)` part of `url`.
 * @param { string } opts.competitionUrl
 *  ❔ **OPTIONAL** | `competition (target)` part of `url`.
 * @param { string } opts.authorArticleUrl
 *  ❔ **OPTIONAL** | `auhtor (article)` part of `url`.
 * @param { string } opts.authorTagsUrl
 *  ❔ **OPTIONAL** | `auhtor (tags)` part of `url`.
 * @param { string } opts.authorUrl
 *  ❔ **OPTIONAL** | `auhtor (profile)` part of `url`.
 * @returns { IPermalinkValidationResponse }
 *  📤 | Return `object`, indicating the (1) validity and (2) redirect nature of the `url`.
 */
export async function promiseValidUrlCheck
(
  fetch: any,
  opts:
  {
    langUrl?: string;
    sportUrl?: string;
    countryUrl?: string;
    leagueUrl?: string;
    fixtureUrl?: string;
    playerUrl?: string;
    competitionMainUrl?: string;
    competitionUrl?: string;
    authorArticleUrl?: string;
    authorTagsUrl?: string;
    authorUrl?: string;
  }
): Promise < IPermalinkValidationResponse >
{
  // ╭─────
  // │ CHECK:
  // │ |: wether supplied `URL` combination is valid.
  // ╰─────
  const if_M_0
    // ╭─────
    // │ CHECK :|: for 'lang'.
    // ╰─────
    = (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl)
    // ╭─────
    // │ CHECK :|: for 'sport'.
    // ╰─────
    || (opts.langUrl && opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl)
    // ╭─────
    // │ CHECK :|: for 'country'.
    // ╰─────
    || (opts.langUrl && opts.sportUrl && opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'league'.
    // ╰─────
    || (opts.langUrl && opts.sportUrl && opts.countryUrl && opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'fixture'.
    // ╰─────
    || (opts.langUrl && opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'player'.
    // ╰─────
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'competitions (lobby)'.
    // ╰─────
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && opts.competitionMainUrl && !opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'competition'.
    // ╰─────
    || (opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && opts.competitionMainUrl && opts.competitionUrl)
    // ╭─────
    // │ CHECK :|: for 'author (article)'.
    // ╰─────
    || (!opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl && opts.authorArticleUrl)
    // ╭─────
    // │ CHECK :|: for 'author (tags)'.
    // ╰─────
    || (!opts.langUrl && !opts.sportUrl && !opts.countryUrl && !opts.leagueUrl && !opts.fixtureUrl && !opts.playerUrl && !opts.competitionMainUrl && !opts.competitionUrl && !opts.authorArticleUrl && opts.authorTagsUrl)
    // ╭─────
    // │ CHECK :|: for 'author (profile)'.
    // ╰─────
    || opts.authorUrl
  ;

  // ╭─────
  // │ NOTE:
  // │ |: append to string, the parts of url we wish to validate.
  // ╰─────
  let queryStr = '';

  if (opts.langUrl) queryStr += `?langUrl=${opts.langUrl}`;
  if (opts.sportUrl) queryStr += `&sportUrl=${opts.sportUrl}`;
  if (opts.countryUrl) queryStr += `&countryUrl=${opts.countryUrl}`;
  if (opts.leagueUrl) queryStr += `&leagueUrl=${opts.leagueUrl}`;
  if (opts.fixtureUrl) queryStr += `&fixtureUrl=${opts.fixtureUrl}`;
  if (opts.playerUrl) queryStr += `&playerUrl=${opts.playerUrl}`;
  if (opts.competitionMainUrl) queryStr += `&competitionMainUrl=${opts.competitionMainUrl}`;
  if (opts.competitionUrl) queryStr += `&competitionUrl=${opts.competitionUrl}`;
  if (opts.authorArticleUrl) queryStr += `?authorArticleUrl=/${opts.authorArticleUrl}`;
  if (opts.authorTagsUrl) queryStr += `?authorTagUrl=/${opts.authorTagsUrl}`;
  if (opts.authorUrl) queryStr += `?authorUrl=/${opts.authorUrl}`;

  // [🐞]
  dlogv2
  (
    'promiseValidUrlCheck(..) // INSIGHT',
    [
      `🔹 [var] ➤ if_M_0 :|: ${if_M_0}`,
      `🔹 [var] ➤ queryStr :|: ${queryStr}`,
    ],
    true
  );

  if (!if_M_0)
    return { isValid: false, objRedirect: { isRedirect: false, strRedirectUrl: null } };
  ;

  const
    /**
     * @description
     */
    response: any
      = await get
      (
        `/api/data/main/seo-pages${queryStr}`,
        fetch,
        true,
        false
      )
  ;

  return response;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - [🐞]
 * @description
 *  📣 validates number of `null | undefined` data points in data Array[].
 * @example
 *  => [[object Object], [object Object], undefined]
 *  ==> console.log('error at position 2'):
 * @param { unknown[] } data
 *  💠 **[required]** `list` of `items`.
 * @param { string[] } urls
 *  💠 **[required]** `list` of respective `urls`.
 * @returns { void }
 */
export function preloadInvelidDataDebug
(
  data: unknown[],
  urls: string[]
): void
{
  tryCatchAsync
  (
    (): void =>
    {
      const
        /**
         * @description
         *  📝 Helper function to get indexes of `null` data points.
         * @param { any[] } arr
         *  💠 **[required]** `list` of `items`.
         * @param { unknown } item
         *  💠 **[required]** `item` to search for.
         * @return { number[] }
         */
        indexesOf:
          (
            // eslint-disable-next-line no-unused-vars
            arr: any[],
            // eslint-disable-next-line no-unused-vars
            item: unknown
          ) => number[]
          = (
            arr: any[],
            item: unknown
          ) =>
          {
            return arr.reduce
            (
              (
                accumulator,
                currentVal,
                currentIndex
              ) =>
              {
                return (
                  currentVal === item
                    && accumulator.push(currentIndex),
                  accumulator
                )
              },
              []
            )
          },
        /**
         * @description
         * 📝 List of `null` data points.
         */
        nullList: number[]
          = indexesOf
          (
            data,
            null
          )
      ;

      if (nullList.length == 0)
        // [🐞]
        dlog
        (
          '🚏 checkpoint ➤ preloadInvelidDataDebug 🟩',
          true
        );
      ;

      // ╭─────
      // │ CHECK :|: for `null` data fetched.
      // ╰─────
      if (nullList.length > 0)
      {
        // [🐞]
        dlog
        (
          `🚏 checkpoint ➤ preloadInvelidDataDebug 🟥 (position): ${nullList}`,
          true
        );
        // ╭─────
        // │ NOTE: :|: list URLs responsible for `null` data points.
        // ╰─────
        for (const i of nullList)
          // eslint-disable-next-line no-console
          console.log
          (
            `\t🚩 ${urls[i]}`
          );
        ;
      }

      return;
    }
  );
  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Handle of `load` lifecypcle for `exit` condition in `.server.ts/.ts`.
 * @param { number } t0
 *  💠 **[required]** timer for 'debug'.
 * @param { stirng } pageTag
 *  💠 **[required]** Page tag name
 * @param { number } exitCode
 *  💠 **[required]** Page exit code
 * @param { string } [exitReason]
 *  💠 [optional] Message for reason on page 'exit'/'error'
 * @returns { void }
 */
export function preloadExitLogic
(
  t0: number,
  pageTag: string,
  exitCode: number,
  exitReason?: string
): void
{
  const
    // [🐞]
    t1: number = performance.now()
    ;

  // [🐞]
  dlog
  (
    `${pageTag} ${((t1 - t0) / 1000).toFixed(2)} sec`,
    true
  );

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw error
  (
    exitCode,
    {
      errorId: 'x1',
      message: exitReason ?? PAGE_INVALID_MSG
    }
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣 Handle of `load` for `.server.ts/.ts` files `redirect`.
 * @param { string } redirectToUrl
 *  💠 **[required]** Redirect url
 * @returns { void }
 */
export function preloadRedirect
(
  redirectToUrl: string
): void
{
  throw redirect
  (
    302,
    redirectToUrl
  );
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - IMPORTANT
 * @description
 *  📣 `fetch` data from `list` of urls, and returns results.
 * @param { string[] } endpoints
 *  💠 **[required]** `List` of urls to fetch.
 * @param { fetch } fetch
 *  💠 **[required]** `fetch` instance.
 * @returns { Promise < any[] > }
 *  📤 `List` of data loaded
 */
export async function promiseUrlsPreload
(
  endpoints: string[],
  fetch: any,
): Promise < any[] >
{
  const
    /**
     * @description
     * 📝 Data response.
     */
    dataRes0: any[]
      = await Promise.all
      (
        endpoints
          .map
          (
            async (
              _url: string
            ): Promise < any > =>
            {
              const
                // [🐞]
                t0: number = performance.now(),
                /**
                   * @description
                   */
                response: Response = await fetch(_url)
              ;

              let
                /**
                 * @description
                 */
                resJson: any = await response.json()
              ;

              // ╭─────
              // │ NOTE:
              // │ |: Continued legacy support for 'success' data.
              // ╰─────
              if (resJson?.success)
                resJson = resJson.success.data;
              ;

              // [🐞]
              dlogv2
              (
                `🏹 FETCH (GET) (preload) ${_url} `,
                [
                  `⏱️ ${((performance.now() - t0) / 1000).toFixed(2)} sec`
                ],
                true,
                undefined,
                false
              );

              // ╭─────
              // │ NOTE: IMPORTANT
              // │ > decompress 'lz-string' encoded payload.
              // ╰─────
              if (_url.includes('decompress'))
                return tryCatch(() => { return JSON.parse(LZString.decompress(resJson?.data)) });
              ;

              return resJson;
            }
          )
      )
  ;

  // [🐞]
  preloadInvelidDataDebug
  (
    dataRes0,
    endpoints,
  );

  return dataRes0;
}
