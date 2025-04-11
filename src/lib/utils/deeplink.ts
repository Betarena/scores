// ╭──────────────────────────────────────────────────────────────────────────────────╮
// │ 📌 High Order Component Overview                                                 │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ ➤ Internal Svelte Code Format :|: V.8.0                                          │
// │ ➤ Status :|: 🔒 LOCKED                                                           │
// │ ➤ Author(s) :|: @migbash                                                         │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ 📝 Description                                                                   │
// ┣──────────────────────────────────────────────────────────────────────────────────┫
// │ Main Scores Platform Deeplink Logic                                              │
// ╰──────────────────────────────────────────────────────────────────────────────────╯

// #region ➤ 📦 Package Imports

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
import { isSignInWithEmailLink, signInWithCustomToken, signInWithEmailLink } from 'firebase/auth';

import { auth } from '$lib/firebase/init.js';
import { setCookie } from '$lib/store/cookie.js';
import sessionStore from '$lib/store/session.js';
import { authWithMoralis, successAuthComplete } from './authentication.js';
import { AU_W_TAG, dlog, dlogv2, errlog } from './debug.js';

import type { Page } from '@sveltejs/kit';
import { routeIdHome } from '$lib/constants/paths.js';

// #endregion ➤ 📦 Package Imports

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Main entrypoint for `deep link` checks.
 * @return { Promise < void > }
 */
export async function mainDeepLinkCheck
(
): Promise < void >
{
  await checkEmailMagicLink();
  await checkDiscordDeepLink();
  await checkMetaMaskDeepLink();
  await checkReferralLink();
  await checkOpenAuth();
  const
    /**
     * @description
     * 📝 Data for `page`.
     */
    page = sessionStore.extract<Page>('page')
    ;
  let     /**
  * @description
  * 📝 Data for `page`.
  */
 revertUrl = `${page?.url.origin}${page?.url.pathname}`
  if (page?.route.id === routeIdHome)
  {
    const lang = sessionStore.extract<string>('lang');
      revertUrl = `/${lang === "en" ? "" : `${lang}`}`;
    goto
    (
      revertUrl,
      {
        replaceState: true
      }
    );
  }

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Validate for existance of **Email Magic Link** via `deep-link`.
 * @return { Promise < void > }
 */
async function checkEmailMagicLink
(
): Promise < void >
{
  if (!browser) return;

  // [🐞]
  dlog
  (
    `${AU_W_TAG[0]} 🟧 checkEmailMagicLink(..)`
  );

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      const if_M_0: boolean = isSignInWithEmailLink
      (
        auth,
        window.location.href
      );
      if (!if_M_0) return;

      // ╭─────
      // │ NOTE: WARNING: IMPORTANT CRITICAL
      // │ > apiKey, oobCode, mode, lang query param(s) passed in URL query params
      // │ > Additional state parameters can also be passed via URL.
      // │ > This can be used to continue the user's intended action before triggering
      // │ > the sign-in operation.
      // │ > Get the email if available. This should be available if the user completes
      // │ > the flow on the same device where they started it.
      // ╰─────

      const
        /**
         * @description
         * 📝 Data for `page`.
         */
        page = sessionStore.extract<Page>('page')
      ;

      let
        /**
         * @description
         * 📝 Retrieve `email` used for `Magic Email Deep Link` start.
         */
        email
          = window.localStorage.getItem
          (
            'emailForSignIn'
          )
      ;

      // [🐞]
      dlogv2
      (
        `${AU_W_TAG[0]} 🟦 checkEmailMagicLink(..)`,
        [
          `🔹 [var] ➤ email :|: ${email}`,
        ],
        false
      );

      // ╭─────
      // │ CHECK
      // │ > User opened deep-link on different device,
      // │ > from the created on-intent.
      // ╰─────
      if (!email)
        email = window.prompt
        (
          'Please provide your email for confirmation'
        );
      ;

      const
        /**
         * @description
         * 📝 `Client SDK` to parse the code from the link for you.
         */
        result
          = await signInWithEmailLink
          (
            auth,
            email!,
            window.location.href
          ),
        /**
         * @description
         * 📝 Target authentication `type`
         */
        authTypeSelect = page?.url.searchParams
          .get
          (
            'authTypeSelect'
          )
          ?.toString() as 'login' | 'register'
      ;

      // [🐞]
      dlogv2
      (
        AU_W_TAG[0],
        [
          '🟢 EmailLink Auth',
          `🟦 var: result?.user?.displayName ${result.user.displayName}`,
          `🟦 var: result?.user?.email ${result.user.email}`
        ]
      );

      window.localStorage.removeItem
      (
        'emailForSignIn'
      );

      // ╭─────
      // │ NOTE: WARNING: IMPORTANT CRITICAL
      // │ > You can access the new user via result.user
      // │ > Additional user info profile not available via: `result.additionalUserInfo.profile == null`
      // │ > You can check if the user is new or existing: `result.additionalUserInfo.isNewUser`
      // ╰─────

      await successAuthComplete
      (
        authTypeSelect,
        result.user,
        undefined,
        'email'
      );

      return;
    },
    (
      ex: unknown
    ): void =>
    {
      // [🐞]
      errlog(`❌ Email (MagicLink) Auth error: ${ex}`)
      return;
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Validates for `Discord Deep Link` presence.
 * @return { Promise < void > }
 */
async function checkDiscordDeepLink
(
): Promise < void >
{
  if (!browser) return;

  // [🐞]
  dlog
  (
    `${AU_W_TAG[0]} 🟧 checkDiscordDeepLink(..)`
  );

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      const
        /**
         * @description
         * 📝 Data for `page`.
         */
        page = sessionStore.extract<Page>('page'),
        /**
         * @description
         * 📝 `uid` argument.
         */
        fUid = page?.url.searchParams.get('f_uid'),
        /**
         * @description
         * 📝 `OAuth2` argument.
         */
        oauth2 = page?.url.searchParams.get('oauth2')
      ;

      // ╭─────
      // │ CHECK
      // │ > validate user is attempting Discord OAuth2.
      // ╰─────
      if (oauth2 != 'discord' || fUid == null) return;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 Discord OAuth2`
      );

      const
        userCredential
          = await signInWithCustomToken
          (
            auth
            , fUid
          )
      ;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🟢 Success! Discord OAuth2'`
      );

      await successAuthComplete
      (
        'login',
        userCredential.user,
        undefined,
        'discord',
      );

      return;
    },
    (
      ex: unknown | any
    ): void =>
    {
      const
        errorCode = ex.code,
        errorMessage = ex.message
      ;

      // [🐞]
      errlog(errorCode);
      errlog(errorMessage);
      // console.error('💀 Unhandled :: ex');

      return;
    }
  );

  return;
}

/**
 * @author
 *  @migbash
 * @summary
 *  🟥 MAIN
 * @description
 *  📣 Validates for `MetaMask Deep Link` presence.
 * @returns { Promise < void > }
 */
async function checkMetaMaskDeepLink
(
): Promise < void >
{
  if (!browser) return;

  // [🐞]
  dlog
  (
    `${AU_W_TAG[0]} 🟧 checkMetaMaskDeepLink(..)`
  );

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      const
        /**
         * @description
         * 📝 Data for `page`.
         */
        page = sessionStore.extract<Page>('page'),
        /**
         * @description
         * 📝 Data for `page`.
         */
        metmaskAuth =	page?.url.searchParams.get('metmaskAuth')
      ;

      // $sessionStore.investDepositAmountMobileWeb3 = $page.url.searchParams.get('investDepositAmount');

      if (metmaskAuth != 'true') return;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 MetaMask OAuth2`
      );

      authWithMoralis();

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
 *  📣 Deep link validation for `referral`.
 */
async function checkReferralLink
(
): Promise < void >
{
  if (!browser) return;

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      const
        /**
         * @description
         * 📝 Data for `page`.
         */
        page = sessionStore.extract<Page>('page'),
        /**
         * @description
         * 📝 Data for `page`.
         */
        referralId = page?.url.searchParams.get('referralId')
      ;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 ReferralId ${referralId}`
      );

      if (!referralId) return;

      // ╭─────
      // │ NOTE:
      // │ > store 'referralId' in cookie for 30 days.
      // ╰─────
      setCookie
      (
        'betarenaScoresCookieReferralCode'
        , referralId
        , 30
      );

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
 *  📣 Validates for an `opened` state of the `login/register` form upon page open.
 * @return { Promise < void > }
 */
async function checkOpenAuth
(
): Promise < void >
{
  if (!browser) return;

  await tryCatchAsync
  (
    async (
    ): Promise < void > =>
    {
      // [🐞]
      dlog
      (
        '🚏 checkpoint ➤ checkOpenAuth',
        true
      );

      const
        /**
         * @description
         * 📝 Data for `page`.
         */
        page = sessionStore.extract<Page>('page'),
        /**
         * @description
         * 📝 Data for `page`.
         */
        isAuthForm = page?.url.searchParams.get('authForm')
      ;

      if (isAuthForm != 'true') return;

      // ╭─────
      // │ NOTE:
      // │ > for have authetication form (modal) open instantly for users.
      // ╰─────

      // [🐞]
      dlog
      (
        '🚏 checkpoint ➤ isAuthForm == \'true\'',
        true
      );

      sessionStore.updateData
      (
        [
          ['currentModal', 'Auth_Modal']
        ]
      );

      return;
    }
  );

  return;
}
