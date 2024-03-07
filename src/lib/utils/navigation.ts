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
import { type Page } from '@sveltejs/kit';

import { routeIdPageAuthors, routeIdPageCompetition, routeIdPageCompetitionLobby, routeIdPageFixture, routeIdPageLeague, routeIdPagePlayer, routeIdPageProfile } from '$lib/constants/paths.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlogv2 } from './debug';
import { dlog } from './debug.js';
import { checkNull } from './platform-functions.js';
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
 *  💠 **[required]** Target new `selected` language.
 * @return { Promise < void > }
 */
export async function selectLanguage
(
  lang: string | NullUndef
): Promise < void >
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
  else if (routeIdPageProfile == page?.route.id)
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
  else if (routeIdPageAuthors == page?.route.id)
  {
    // [🐞]
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
     *  📣 Target NEW `url` to be navigatated to.
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
    newURL!,
    true
  );

  return;
}
