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
import { invalidateAll } from '$app/navigation';
import { error, redirect, type Page } from '@sveltejs/kit';
import LZString from 'lz-string';

import { get } from '$lib/api/utils.js';
import { routeIdPageAuthors, routeIdPageCompetition, routeIdPageCompetitionLobby, routeIdPageFixture, routeIdPageLeague, routeIdPagePlayer, routeIdPageProfile, routeIdPageTags } from '$lib/constants/paths.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common';
import { PAGE_INVALID_MSG, dlogv2 } from './debug';
import { dlog } from './debug.js';
import { checkNull, tryCatch } from './miscellenous.js';
import { gotoSW } from './sveltekitWrapper.js';

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
            )
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
      return;
    case routeIdPageAuthors: {
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
      = countSlash > 1
        ? page?.url.pathname.replace(pastLang, `/${lang}/`)
        : page?.url.pathname.replace(pastLang, `/${lang}`)
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
  await gotoSW
    (
      newURL as string,
      true
    );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 🟦 HELPER
 *  - 🟥 IMPORTANT
 * @description
 *  📣 checks for `url` to be a `valid` or not.
 * @example
 *  => promiseValidUrlCheck(.., langUrl: '/es');
 *  ==> true
 *  => promiseValidUrlCheck(.., sportUrl: '/football');
 *  ==> true
 * @param { fetch } fetch
 *  💠 **[required]** `fetch(..)` instance, supplied by `sveltekit`.
 * @param { Object } opts
 *  💠 **[required]** Method `options`.
 * @param { string } opts.langUrl
 *  💠 **[required]** `lang` part of `url`.
 * @param { string } opts.sportUrl
 *  💠 **[required]** `sport` part of `url`.
 * @param { string } opts.countryUrl
 *  💠 **[required]** `country` part of `url`.
 * @param { string } opts.leagueUrl
 *  💠 **[required]** `league` part of `url`.
 * @param { string } opts.fixtureUrl
 *  💠 **[required]** `fixture` part of `url`.
 * @param { string } opts.playerUrl
 *  💠 **[required]** `player` part of `url`.
 * @param { string } opts.competitionMainUrl
 *  💠 **[required]** `competition (lobby)` part of `url`.
 * @param { string } opts.competitionUrl
 *  💠 **[required]** `competition (target)` part of `url`.
 * @param { string } opts.authorArticleUrl
 *  💠 **[required]** `auhtor (article)` part of `url`.
 * @returns { boolean }
 *  📤 A `boolean` where `true` siginifies that `url` is valid.
 */
export async function promiseValidUrlCheck
  (
    fetch: any,
    opts:
      {
        langUrl?: string,
        sportUrl?: string,
        countryUrl?: string,
        leagueUrl?: string,
        fixtureUrl?: string,
        playerUrl?: string,
        competitionMainUrl?: string,
        competitionUrl?: string,
        authorArticleUrl?: string,
        authorTagsUrl?: string
      }
  ): Promise<boolean>
{
  // ╭─────
  // │ CHECK :|: wether supplied `URL` combination is valid.
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
    ;

  // ╭─────
  // │ NOTE:
  // │ > append to string, the parts of url we wish to validate.
  // ╰─────

  let queryStr: string = '';
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

  // [🐞]
  dlogv2
    (
      'promiseValidUrlCheck(..)',
      [
        `🔹 [var] ➤ if_M_0 :|: ${if_M_0}`,
        `🔹 [var] ➤ queryStr :|: ${queryStr}`,
      ],
      true
    );

  if (!if_M_0) return false;

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
  ): Promise<any[]>
{
  const
    data: any[]
      = await Promise.all
        (
          endpoints
            .map
            (
              async (
                _url: string
              ): Promise<any> =>
              {
                const
                  // [🐞]
                  t0: number = performance.now(),
                  /**
                   * @description
                   */
                  response: Response = await fetch(_url),
                  /**
                   * @description
                   */
                  resJson: any = await response.json(),
                  // [🐞]
                  t1: number = performance.now()
                  ;

                // [🐞]
                dlogv2
                  (
                    `🏹 FETCH (GET) (preload) ${_url} `,
                    [
                      `⏱️ ${((t1 - t0) / 1000).toFixed(2)} sec`
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
      data,
      endpoints,
    );

  return data;
}
