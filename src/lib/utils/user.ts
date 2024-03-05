// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ > Scores Visitor/User Common Logic                                               │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { dev } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import { type Page } from '@sveltejs/kit';
import { doc, updateDoc } from 'firebase/firestore';

import { post } from '$lib/api/utils.js';
import { routeIdPageAuthors, routeIdPageCompetition, routeIdPageCompetitionLobby, routeIdPageFixture, routeIdPageLeague, routeIdPagePlayer, routeIdPageProfile } from '$lib/constants/paths.js';
import { userBalanceListen, userDataFetch } from '$lib/firebase/common.js';
import { db_firestore } from '$lib/firebase/init.js';
import { delCookie, setCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import userBetarenaSettings from '$lib/store/user-settings.js';
import { dlogv2 } from './debug';
import { dlog } from './debug.js';
import { checkNull } from './platform-functions.js';
import { gotoSW } from './sveltekitWrapper.js';

import type { IPageRouteId } from '$lib/types/types.session.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 Initialize an **authenticated** `user`.
 *  - ⚡️ Sets `user` privilige cookie.
 *  - ⚡️ Sets `user` data listeners.
 * @return { Promise < void > }
 */
export async function initUser
(
): Promise < void >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ initUser(..)',
    true
  );

  const
    uid = userBetarenaSettings.extract('uid')
  ;

  setCookie
  (
    'betarenaCookieLoggedIn',
    'true',
    30
  );

  userDataFetch
  (
    uid
  );

  userBalanceListen
  (
    uid
  );

  await post
  (
    `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}${import.meta.env.VITE_FIREBASE_FUNCTIONS_F_1}`,
    {
      user_uids: [uid]
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  - 📌 MAIN
 *  - 🟥 IMPORTANT
 * @description
 *  - 📣 Updates `user` language platform selection.
 *  - 📣 Manages platform main navigation and underlying logic.
 * @param { string } lang
 *  💠 **[required]** Target new `selected` language.
 * @param { Page } page
 *  💠 **[required]** Target page sveltekit object.
 * @returns { Promise < void > }
 */
export async function selectLanguage
(
  lang: string,
  page: Page
): Promise < void >
{
  if (sessionStore.extract('lang') == lang) return;

  userBetarenaSettings.updateData
  (
    'lang',
    lang
  );

  const
    /**
     * @description
     *  📣 Past/previous lang option.
     */
    pastLang: string
      = sessionStore.extract('lang') == 'en'
        ? '/'
        : `/${sessionStore.extract('lang')}`
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
      `🔹 [var] ➤ $page.route.id: ${page.route.id}`
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
  if (!checkNull(page.error))
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
  // │ > handle 'special' routes that self-manage navigation/translation.
  // ╰─────
  if
  (
    [
      routeIdPageLeague,
      routeIdPageFixture,
      routeIdPagePlayer,
      routeIdPageCompetitionLobby,
      routeIdPageCompetition
    ].includes(page.route.id)
  )
  {
    // [🐞]
    dlog
    (
      `🚏 checkpoint ➤ selectLanguage(..) if_M_1 page?.route?.id: ${page.route.id} [exit]`,
      true
    );

    return;
  }
  else if (routeIdPageProfile == page.route.id)
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
  else if (routeIdPageAuthors == page.route.id)
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
      'lang',
      lang
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
    countSlash: number =	page.url.pathname.split('/').length - 1
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
        ? page.url.pathname.replace(pastLang, '/')
        : page.url.pathname.replace(pastLang, '')
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
        ? page.url.pathname.replace(pastLang, `/${lang}/`)
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
      = page.url.pathname.replace(pastLang, `/${lang}`)
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
  //   'lang',
  //   lang
  // );

  // NOTE: Solution [1]
  // window.history.replaceState({}, "NewPage", newURL);
  // NOTE: Solution [2]
  await gotoSW
  (
    newURL!,
    true
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟦 HELPER
 * @description
 *  📣 Update `user` platform language preference.
 * @param { Object } opts
 *   💠 **[required]** Target method `arguments`.
 * @param { boolean } opts.isPageError
 *  💠 **[required]** Wether current page is of type `Error`.
 * @param { string | undefined | null } opts.routeId
 *  💠 **[required]** Current page `route.id`.
 * @returns { Promise < void > }
 */
export async function updateSelectLang
(
  opts:
  {
    isPageError: boolean,
    routeId: string | undefined | null,
  }
): Promise < void >
{
  const
    lang = userBetarenaSettings.extract('lang') as string | undefined | null,
    uid = userBetarenaSettings.extract('uid') as string | undefined | null
  ;

  if
  (
    opts.isPageError
    || !opts.routeId
    || !lang
    || !uid
  )
    return;
  ;

  // [🐞]
  dlogv2
  (
    '🚏 checkpoint ➤ updateSelectLang(..)',
    [
      `🔹 [var] ➤ opts.isPageError :|: ${opts.isPageError}`,
      `🔹 [var] ➤ opts.routeId :|: ${opts.routeId}`,
      `🔹 [var] ➤ lang :|: ${lang}`,
      `🔹 [var] ➤ uid :|: ${uid}`,
    ],
    true
  );

  userBetarenaSettings.updateData
  (
    'lang-user',
    lang
  );

  const
    userRef = doc
    (
      db_firestore,
      'betarena_users',
      uid,
    )
  ;

  await updateDoc
  (
    userRef,
    {
      lang
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🔹 HELPER
 * @description
 *  📣 **Logs-out** `user` from platform.
 *  - ⚡️ Toggles respective `UI` changes.
 *  - ⚡️ Deletes `cookies` for `user` privilidges.
 * @return { Promise < void > }
 */
export async function logoutUser
(
): Promise < void >
{
  // [🐞]
  dlog
  (
    '🚏 checkpoint ➤ logoutUser(..)',
    true
  );

  delCookie
  (
    'betarenaCookieLoggedIn'
  );

  const
    /**
     * @description
     *  📣 `lang` preference
     */
    userLang: string = userBetarenaSettings.extract('lang-user'),
    /**
     * @description
     *  📣 current `routeId`
     */
    currentRouteId: IPageRouteId = sessionStore.extract('routeId'),
    /**
     * @description
     *  📣 Redirect `user` to upon `logout`.
     */
    redirectLink = `/${userLang == 'en' ? '' : userLang}`
  ;

  if (currentRouteId != 'AuthorsPage')
    await gotoSW
    (
      redirectLink,
      true
    );
  ;

  userBetarenaSettings.updateData
  (
    'user-object',
    undefined
  );

  return;
}
