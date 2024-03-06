<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

  // ▓ NOTE:
  // ▓ > package firebase version, should be same as the project global version
  // ▓ > @metamask/sdk/dist/browser/es/metamask-sdk; // ✅ works
  // ▓ > @metamask/sdk/dist/browser/umd/metamask-sdk'; // ❌ not working

	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { get, post } from '$lib/api/utils';
	import { app, auth, db_firestore } from '$lib/firebase/init';
	import { getCookie, setCookie } from '$lib/store/cookie.js';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { AU_W_TAG, dlog, dlogv2, errlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';
	import { getMoralisAuth, type MoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
	import { signInWithMoralis, type SignInWithMoralisResponse } from '@moralisweb3/client-firebase-evm-auth';
	import
	  {
	    GithubAuthProvider, GoogleAuthProvider, fetchSignInMethodsForEmail,
	    isSignInWithEmailLink, sendSignInLinkToEmail, signInWithCustomToken, signInWithEmailLink,
	    signInWithPopup, type ActionCodeSettings, type User, type UserCredential
	  } from 'firebase/auth';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { generateUsername } from 'unique-username-generator';

	import type { BetarenaUser, IScoreUser } from '$lib/types/types.scores.js';
	import type { IAuthType } from '@betarena/scores-lib/types/_FIREBASE_.js';
	import type { IAuthTrs } from '@betarena/scores-lib/types/auth.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME = 'global⮕w⮕auth⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 725, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /** @description 📣 email `input` */
    inputEmail: string | undefined
    /** @description 📣 widget state for toggle UI of `authentication` in progress */
    , processing: boolean = false
    /** @description 📣 widget state for toggle UI of `email` verification state */
    , emailVerifyInProgress: boolean = false
    /** @description 📣 widget state for toggle UI of `email` verification sent confirmation state */
    , emailVerificationSent: boolean = false
    /** @description 📣 widget state for toggle UI of `email` verification re-sent ability state */
    , allowResend: boolean = false
    /** @description 📣 widget state for toggle UI of `email` verification last sent verification date */
    , sentEmailDate: Date | undefined = undefined
    /** @description 📣 widget state for toggle UI of `email` verification last sent verification date difference */
    , dateObjDif: number
    /** @description 📣 widget state for toggle UI of `authentication` state */
    , authView: boolean = true
    /** @description 📣 widget state for `authentication` selection */
    , authTypeSelect: 'login' | 'register' = 'login'
    /** @augments IAuthType */
    , authServiceUsed: IAuthType
    /** @description 📣 widget state for toggle UI of success `alert` in authentication */
    , successAuth: boolean = false
    /** @description 📣 widget state for toggle UI of error `alert` in authentication */
    , errorAuth: boolean = false
    /** @description 📣 widget state for toggle UI of error in `email` input */
    , errorAuthEmailFormat: boolean = false
    /** @description 📣 widget state for toggle UI of error in `email` already in use */
    , emailAlreadyInUse: boolean = false
    /** @description 📣 widget `dynamic loaded` assets */
    , iconList: string[]
    /** @description 📣 widget `deeplink` url parameter */
    , investDepositIntent: string | null
    /** @augments ActionCodeSettings */
    , actionCodeSettings: ActionCodeSettings
    = {
      // ▓ NOTE:
      // ▓ > URL / DOMAIN you want to redirect back to.
      // ▓ > URL must be in the authorized domains list in the Firebase Console.
      url: `${$page.url.origin}${$page.url.pathname}?authTypeSelect=${authTypeSelect}`
      // ▓ NOTE:
      // ▓ > must be set true
      , handleCodeInApp: true
      // , dynamicLinkDomain: 'http://localhost:3050/auth'
      // , iOS:
      // {
      //   bundleId: 'com.example.ios'
      // },
      // android:
      // {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12'
      // },
    }
    /** @description interval value */
    , interval1: NodeJS.Timer
  ;

	$: actionCodeSettings.url = `${$page.url.origin}${$page.url.pathname}?authTypeSelect=${authTypeSelect}`;
  $: countD_sec = Math.floor((dateObjDif / 1000) % 60).toString();
	$: countD_min = Math.floor((dateObjDif / 1000 / 60) % 60).toString();

  // ▓ [🐞]
	// if (dev) inputEmail = 'migbashdev@gmail.com';

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   * TODO: move to -Widget, -Main V6 structure;
  */
  async function widgetInit
  (
  ): Promise < IAuthTrs | null >
  {
    if (!browser) return null;

    const dataRes0 = await get
    (
      `/api/hasura/_main_/auth?lang=${$sessionStore.serverLang}`
    ) as IAuthTrs;

    return dataRes0;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📣 Toggle UI of type `ERROR`.
   * @returns { void }
  */
  function wrongEmailFormatToggle
  (
  ): void
  {
    errorAuthEmailFormat = true;
    errorAuth = true;
    setTimeout
    (
      (
      ): void =>
      {
        errorAuth = false;
      },
      1500
    );
    return;
  }

	/**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  📣 validates Web3 wallet extension being used by client/user.
   * @see https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
   * @see https://stackoverflow.com/questions/72613011/whenever-i-click-on-connect-metamask-button-why-it-connects-the-coinbase-wallet
   * @see https://stackoverflow.com/questions/68023651/how-to-connect-to-either-metamask-or-coinbase-wallet
   * @see https://github.com/MetaMask/metamask-extension/issues/13622
   * @ISSUE_LOG - FIREFOX
   * @see https://github.com/Betarena/scores/issues/1021
   * @see https://github.com/MetaMask/metamask-extension/issues/3133
   * @see https://github.com/MetaMask/metamask-extension/issues/10023
   * @see https://community.metamask.io/t/metamask-cannot-be-detected-on-firefox/24705/8
	 * @param { 'isMetaMask' | 'isCoinbaseWallet' | 'isBraveWallet'} walletType
   *  **[required]** a tuple of [isSuccess, walletType | null]
   * @returns { [ boolean, any ] }
	 */
  function providerDetect
  (
    walletType: 'isMetaMask' | 'isCoinbaseWallet' | 'isBraveWallet'
  ): [ boolean, any ]
  {
    // ▓ CHECK:
    // ▓ > no ethereum wallet detected.
    if (!window.ethereum)
    {
      // ▓ [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🛑 - window.ethereum is ${window.ethereum}`
      );

      // ▓ NOTE:
      // ▓ > or, throw new Error("No injected ethereum object.");
      return [
        false
        , null
      ];
    }

    let targetSelectWallet = undefined;

    // ▓ CHECK:
    // ▓ > for multiple wallets owned/visible by client/user.
    if (Array.isArray(window.ethereum?.providers))
    {
      if (walletType == 'isMetaMask')
      {
        targetSelectWallet = window.ethereum?.providers
          ?.find
          (
            (
              provider
            ) =>
            {
              return provider?.[walletType] && provider?.isBraveWallet == undefined
            }
          )
        ;
      }

      // ▓ [🐞]
      dlogv2
      (
        AU_W_TAG[0],
        [
          `🟦 Multiple wallet providers identified: ${window.ethereum?.providers?.length}`
          ,`🟦 var: targetSelectWallet ${targetSelectWallet}`
          ,`🟦 var: window.ethereum.providers ${window.ethereum?.providers}`
        ]
      );
    }
    else
    {
      const if_M_0: boolean
        = walletType == 'isMetaMask'
        && window.ethereum?.isBraveWallet == undefined
        && window.ethereum?.isMetaMask != undefined
        && window.ethereum?.isMetaMask
      ;
      if (if_M_0) targetSelectWallet = window.ethereum?.[walletType];

      // ▓ [🐞]
      dlogv2
      (
        `${AU_W_TAG[0]}`,
        [
          `🟦 Single provider identified! ${window.ethereum}`
          ,`🟦 var: targetSelectWallet ${targetSelectWallet}`
          ,`🟦 var: window.ethereum ${window.ethereum}`
        ]
      );
    }

    // ▓ CHECK:
    // ▓ > for absent selected wallet.
    if (targetSelectWallet == undefined)
    {
      // ▓ [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔴 no target wallet (${walletType}) identified`
      );

      return [
        false
        , null
      ];
    }

    // ▓ [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟢 ${walletType} identified`
    );

    // ▓ NOTE: ▓ IMPORTANT:
    // ▓ > conflicting use of CoinBaseWallet and MetaMask on client/users browser.
    // ▓ > Setting MetaMask as main wallet.

    // ▓ WARNING:
    // ▓ > (👇) causes issues with FireFox
    // targetSelectWallet.request({ method: 'eth_requestAccounts' });

    // ▓ NOTE:
    // ▓ > (👇) Not working
    // window.ethereum.setSelectedProvider(targetSelectWallet);
    // window.ethereum.request
    // ({
    //   method: 'wallet_requestPermissions',
    //   params: [{ eth_accounts: {}}]
    // });

    return [
      true
      , targetSelectWallet
    ];
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN
   * @description
   *  📣 sign-in/sign-up user using Google OAuth2.
   * @see https://firebase.google.com/docs/auth/web/google-signin
   * @returns { Promise < void > }
  */
  async function authWithGoogle
  (
  ): Promise < void >
  {
    if (!browser) return;

    // ▓ [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🔵 Google Auth Init`
    );

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        processing = true;

        const
          provider = new GoogleAuthProvider()
          , result: UserCredential = await signInWithPopup(auth, provider)
          , user = result.user
        ;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Google Auth Success`
        );

        await successAuthComplete
        (
          user
          , undefined
          , 'google'
        );

        return;
      }
      , (
        ex: unknown | any
      ): void =>
      {
        processing = false;

        // ▓ NOTE:
        // ▓ > also available 'ex?.code', 'ex?.message', 'ex?.customData?.email'
        // ▓ NOTE:
        // ▓ > more info of AuthCredential used.
        // const credential = GoogleAuthProvider.credentialFromError(ex);

        // ▓ [🐞]
        errlog(`❌ Google auth error: ${ex}`);

        // ex :: FirebaseError: Firebase: Error (auth/account-exists-with-different-credential).

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
   *  📣 sign-in/sign-up user using GitHub OAuth2.
   * @see https://firebase.google.com/docs/auth/web/github-auth
   * @returns { Promise < void > }
  */
  async function authWithGitHub
  (
  ): Promise < void >
  {
    if (!browser) return;

    // ▓ [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🔵 GitHub Auth Init`
    );

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        processing = true;

        const
          provider = new GithubAuthProvider()
          , result: UserCredential = await signInWithPopup(auth, provider)
          , user = result.user
        ;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 GitHub Auth Success`
        );

        await successAuthComplete
        (
          user
          , undefined
          , 'github'
        );

        return;
      }
      , (
        ex: unknown | any
      ): void =>
      {
        processing = false;

        // ▓ NOTE:
        // ▓ > also available 'ex?.code', 'ex?.message', 'ex?.customData?.email'
        // ▓ NOTE:
        // ▓ > more info of AuthCredential used.
        // const credential = GoogleAuthProvider.credentialFromError(ex);

        // ▓ [🐞]
        errlog(`❌ GitHub auth error: ${ex}`);

        // ex :: FirebaseError: Firebase: Error (auth/account-exists-with-different-credential).

        return;
      }
    );

    return;
  }

  /**
   * @CUSTOM_STATE
   *  ⭐️ v8
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN
   * @description
   *  - 📣 sign-in/sign-up user using **Email Magic Link**.
   *  - 📣 initiates `magic link` event listen for user.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @returns { Promise < void > }
  */
  async function authWithEmailMagicLink
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} inputEmail: ${inputEmail}`
        );

        processing = true;
        errorAuthEmailFormat = false;

        const signInMethods = await fetchSignInMethodsForEmail
        (
          auth
          , inputEmail!
        );

        // ▓ CHECK:
        // ▓ > for existance of target email in Auth Database.
        if (signInMethods.length)
          emailAlreadyInUse = true;
        else
          emailAlreadyInUse = false;
        //

        // ▓ CHECK:
        // ▓ > for existance of email error.
        /*
          if (emailAlreadyInUse)
          {
            if (dev) console.log('🟠 Exit MagicLink')
            processing = false;
            errorAuth = true;
            setTimeout(() =>
            {
              errorAuth = false;
            }, 1500);
            return;
          }
        */

        await sendSignInLinkToEmail
        (
          auth
          , inputEmail!
          , actionCodeSettings
        );

        // ▓ NOTE:
        // ▓ > successfully sent email with 'magic link' UI state.
        processing = false;
        authView = false;

        if (emailAlreadyInUse)
        {
          emailVerificationSent = true;
          sentEmailDate = new Date();
          // ▓ NOTE:
          // ▓ > add 5 min.
          sentEmailDate.setMinutes
          (
            sentEmailDate.getMinutes() + 5
          );
        }
        else
          emailVerifyInProgress = true;
        //

        // ▓ NOTE:
        // ▓ > store target email in localStroage()
        // ▓ > for retrival on same device.
        window.localStorage.setItem
        (
          'emailForSignIn'
          , inputEmail!
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        processing = false;

        // ▓ [🐞]
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
   *  - 📣 sign-in/up user using Discrod Link.
   *  - 📣 initiates `deep link` event listen for user.
   * @returns { Promise < void > }
  */
  async function authWithDiscord
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        processing = true;

        const
          /** @description Target `callback` url */
          callbackAuthUrl: string = $page.url.origin
          /** @description Target `discord` url for `OAuth2.0` */
          , discordOAuthUrl = import.meta.env.VITE_DISCORD_OAUTH_URL
          /** @description Target `url` navigation */
          , finalUrlNav = `${discordOAuthUrl}?redirect_url=${callbackAuthUrl}`
        ;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} callbackAuthUrl: ${callbackAuthUrl}`
        );

        // ▓ NOTE:
        // ▓ > initiate discord OAuth2
        await goto(finalUrlNav);

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        processing = false;

        // ▓ [🐞]
        errlog(ex as string);

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
   *  - 📣 sign-in/up user using Web3 MetaMask (using MoralisAPI).
   *  - 📣 NOTE: only MetaMask extension exlcusive.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @returns { Promise < void > }
  */
  async function authWithMetamask
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        processing = true;

        // ▓ CHECK:
        // ▓ > mobile device.
        const if_M_0: boolean
          // typeof screen.orientation !== 'undefined' // unreliable
          // navigator?.userAgentData?.mobile // unreliable
          = /Mobi/i.test(window.navigator.userAgent)
          && window.ethereum == null
        ;
        if (if_M_0)
        {
          // ▓ NOTE:
          // ▓ > navigate to MetaMask in-app browser.
          // await goto('https://metamask.app.link/dapp/scores.betarena.com/?dappLogin=true') // ✅ works
          // await goto('https://metamask.app.link/dapp/http://192.168.0.28:3050/') // ❌ does not work
          // await goto('https://metamask.app.link/dapp/192.168.0.28:3050/?dappLogin=true') // ❌ does not work
          const
            dappUrl = $page.url.host
            , metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}?metmaskAuth=true`
          ;
          window.open(metamaskAppDeepLink, '_self');
          processing = false;
          return;
        }

        // ▓ CHECK:
        // ▓ > metaMask is NOT present, exit.
        const if_M_1: boolean
          = !providerDetect('isMetaMask')[0]
        ;
        if (if_M_1)
        {
          // ▓ [🐞]
          dlog
          (
            `${AU_W_TAG[0]} 🔴 Moralis Auth not found!`
          );

          // ▓ [🐞]
          alert
          (
            'Please install the MetaMask Wallet Extension!'
          );

          processing = false
          return;
        }

        const
          moralisAuth: MoralisAuth = getMoralisAuth(app)
          , moralisAuthInstance: SignInWithMoralisResponse = await signInWithMoralis(moralisAuth)
        ;

        // #region ❌ [V2] - Moralis Auth [TEST]

        // FIXME: Create WalletConnect Provider
        // FIXME: ❌ Not Working
        // FIXME: WalletConnectProvider error DOC: REF: [10]
        // const provider = new WalletConnectProvider({
        //   infuraId: "a523c408585b0f7c88a7df7a9d70dfe6",
        // });
        // await provider.enable();
        // const moralisAuthInstance = await signInWithMoralis(moralisAuth, {
        //   provider: new Web3Provider(provider)
        // });

        // #endregion ❌ [V2] - Moralis Auth [TEST]

        // #region MetaMask SDK - working [DISABLED]

        // const MMSDK = new MetaMaskSDK({
        //   // useDeeplink: false,
        //   // communicationLayerPreference: "socket",
        //   // enableDebug: true,
        //   // shouldShimWeb3: false,
        //   // showQRCode: true,
        // })
        // const ethereum = MMSDK.getProvider() // You can also access via window.ethereum
        // await ethereum.request({ method: 'eth_requestAccounts', params: [] })
        // // .then(r => console.log(r));
        // .then(r => alert(r));
        // - needs to be redirected back to the APP for 2nd SIGN MESSAGE...

        // #endregion MetaMask SDK - working [DISABLED]

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Moralis Auth`
        );

        await successAuthComplete
        (
          moralisAuthInstance.credentials.user
          , moralisAuthInstance.credentials.user.displayName!
          , 'wallet'
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        processing = false;

        // ▓ [🐞]
        errlog(`Moralis Auth error: ${ex}`);

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
   *  📣 Validates for `Email Magic Link` presence.
   * @returns { Promise < void > }
   */
  async function checkEmailMagicLink
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟠 Checking for EmailLink DeepLink`
        );

        const if_M_0: boolean = isSignInWithEmailLink
        (
          auth
          , window.location.href
        );
        if (!if_M_0) return;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🔵 EmailLink OAuth2`
        );

        // ▓ NOTE:
        // ▓ > apiKey, oobCode, mode, lang query param(s) passed in URL query params
        // ▓ > Additional state parameters can also be passed via URL.
        // ▓ > This can be used to continue the user's intended action before triggering
        // ▓ > the sign-in operation.
        // ▓ > Get the email if available. This should be available if the user completes
        // ▓ > the flow on the same device where they started it.

        let email = window.localStorage.getItem
        (
          'emailForSignIn'
        );

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} email: ${email}`
        );

        // ▓ CHECK:
        // ▓ > User opened deep-link on different device
        // ▓ > from the created on-intent.
        if (!email)
        {
          email = window.prompt
          (
            'Please provide your email for confirmation'
          );
        }

        const
          // ▓ NOTE:
          // ▓ > client SDK to parse the code from the link for you.
          result = await signInWithEmailLink
          (
            auth
            , email!
            , window.location.href
          )
          , revertUrl = `${$page.url.origin}${$page.url.pathname}`
        ;

        authTypeSelect = $page.url.searchParams
          .get
          (
            'authTypeSelect'
          )
          ?.toString() as 'login' | 'register'
        ;

        // ▓ [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            '🟢 EmailLink Auth'
            ,`🟦 var: result?.user?.displayName ${result.user.displayName}`
            ,`🟦 var: result?.user?.email ${result.user.email}`
          ]
        );

        window.localStorage.removeItem
        (
          'emailForSignIn'
        );

        // ▓ NOTE:
        // ▓ > You can access the new user via result.user
        // ▓ NOTE:
        // ▓ > Additional user info profile not available via: `result.additionalUserInfo.profile == null`
        // ▓ NOTE:
        // ▓ > You can check if the user is new or existing: `result.additionalUserInfo.isNewUser`

        await successAuthComplete
        (
          result.user
          , undefined
          , 'email'
        );

        await goto
        (
          revertUrl,
          {
            replaceState: true
          }
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
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
   * @returns { Promise < void > }
   */
  async function checkDiscordDeepLink
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟠 Checking for Discord DeepLink`
        );

        const
          fUid = $page.url.searchParams.get('f_uid')
          , oauth2 = $page.url.searchParams.get('oauth2')
          , revertUrl = `${$page.url.origin}${$page.url.pathname}`
        ;

        // ▓ CHECK
        // ▓ > validate user is attempting Discord OAuth2.
        if (oauth2 != 'discord' || fUid == null) return;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🔵 Discord OAuth2`
        );

        // ▓ NOTE:
        // ▓ > clean up `url` from deeplink `queries` and `authentication bloat`.
        goto
        (
          revertUrl,
          {
            replaceState: true
          }
        );

        const userCredential = await signInWithCustomToken
        (
          auth
          , fUid
        );

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Success! Discord OAuth2'`
        );

        await successAuthComplete
        (
          userCredential.user
          , undefined
          , 'discord'
        );

        return;
      }
      , (
        ex: unknown | any
      ): void =>
      {
        const
          errorCode = ex.code
          , errorMessage = ex.message
        ;

        // ▓ [🐞]
        errlog(errorCode);
        errlog(errorMessage);
        console.error('💀 Unhandled :: ex');

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

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟠 Checking for MetaMask DeepLink!`
        );

        const
          metmaskAuth =	$page.url.searchParams.get('metmaskAuth')
          , revertUrl = `${$page.url.origin}${$page.url.pathname}`
        ;

        investDepositIntent = $page.url.searchParams.get('investDepositIntent');
        $sessionStore.investDepositAmountMobileWeb3 = $page.url.searchParams.get('investDepositAmount');

        // ▓ [🐞]
        // alert($page.url);
        // alert('investDepositIntent', investDepositIntent);

        if (metmaskAuth != 'true') return;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🔵 MetaMask OAuth2`
        );

        // ▓ NOTE:
        // ▓ > clean up url from queries/auth-bloat.
        goto
        (
          revertUrl,
          {
            replaceState: true
          }
        );

        authWithMoralis();

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );

    return;
  }

  /**
   *
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
          referralId = $page.url.searchParams.get('referralId')
          , revertUrl = `${$page.url.origin}${$page.url.pathname}`
        ;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🔵 ReferralId ${referralId}`
        );

        // ▓ NOTE:
        // ▓ > clean up `url` from deeplink `queries` and `authentication bloat`.
        goto
        (
          revertUrl,
          {
            replaceState: true
          }
        );

        if (!referralId) return;

        // ▓ NOTE:
        // ▓ > store 'referralId' in cookie for 30 days.
        setCookie
        (
          'betarenaScoresCookieReferralCode'
          , referralId
          , 30
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
          console.info('❗️', '');
        else
          console.error('💀 Unhandled :: ex');
        //
        return;
      }
    );

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER | IMPORTANT
   * @description
   *  📣 Validates for an `opened` state of the `login/register` form upon page open.
   * @returns { Promise < void > }
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
        // ▓ [🐞]
        dlog
        (
          '🚏 checkpoint ➤ checkOpenAuth',
          true
        );

        const
          isAuthForm = $page.url.searchParams.get('authForm')
          , revertUrl = `${$page.url.origin}${$page.url.pathname}`
        ;

        // ▓ CHECK
        // ▓ > for have authetication form (modal) open instantly for users.
        if (isAuthForm == 'true')
        {
          // ▓ [🐞]
          dlog
          (
            '🚏 checkpoint ➤ isAuthForm == \'true\'',
            true
          );

          // ▓ NOTE:
          // ▓ > clean up url from queries/auth-bloat.
          goto
          (
            revertUrl,
            {
              replaceState: true
            }
          );

          $sessionStore.auth_show = true;
        }

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        console.error('💀 Unhandled :: ex');

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
   *  📣 Authenticates user with `Moralis Auth`.
   * @returns { Promise < void > }
   */
  async function authWithMoralis
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
          moralisAuth: MoralisAuth = getMoralisAuth(app)
          , moralisAuthInstance: SignInWithMoralisResponse = await signInWithMoralis(moralisAuth)
        ;

        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Moralis Auth`
        );

        await successAuthComplete
        (
          moralisAuthInstance.credentials.user
          , moralisAuthInstance.credentials.user.displayName!
          , authServiceUsed
        );

        // ▓ CHECK
        // > for 'deep link' of invest box.
        if (investDepositIntent == 'true')
        {
          // ▓ [🐞]
          // alert('mavigating to invest-box');

          const targetUrl = `/u/investor/${$userBetarenaSettings.lang}`;

          // ▓ [🐞]
          console.log('targetUrl', targetUrl);

          await goto
          (
            targetUrl,
            {
              replaceState: true
            }
          );
        }

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
          console.info('❗️', '');
        else
          console.error('💀 Unhandled :: ex');
        //
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
   *  - 📣 Final `authentication` step.
   *  - 📣 Updates `stores`, `localStoreage` and `UI`.
   * @param { User } firebaseUser
   *  **[required]** Target user.
   * @param { string } web3WalletAddress
   *  **[required]** Target user web3 wallet address.
   * @param { IAuthType } authProviderType
   *  **[required]** Target user authetication option used.
   * @returns { Promise < void > }
  */
  async function successAuthComplete
  (
    firebaseUser?: User
    , web3WalletAddress?: string
    , authProviderType?: IAuthType
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            '🟦 Executing successAuthComplete'
            , firebaseUser
            , web3WalletAddress
            , authProviderType
          ]
        );

        // ▓ NOTE:
        // ▓ > create/retrieve target BetarenaUser.
        const
          [
            BETARENA_USER,
            EXISTS
          ] = await userFirestore
          (
            firebaseUser?.uid!
            , firebaseUser!
            , web3WalletAddress!
            , authProviderType!
          )
        ;

        let userObject: IScoreUser
        = {
          firebase_user_data: firebaseUser
          , scores_user_data: BETARENA_USER
        };

        // ▓ NOTE:
        // ▓ > populate user data to firestore (DB)
        if (!EXISTS)
          await createFirestoreUser(userObject)
        //

        // ▓ NOTE:
        // ▓ > update UI/UX.
        userBetarenaSettings.updateData
        (
          'user-object'
          , userObject
        );

        $sessionStore.auth_show = false;
        processing = false;
        inputEmail = undefined;
        successAuth = true;

        setTimeout
        (
          () =>
          {
            successAuth = false;
            authTypeSelect = 'login';
          },
          1500
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
          console.info('❗️', '');
        else
          console.error('💀 Unhandled :: ex');
        //
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
   * @CUSTOM_TRY_CATCH
   * @description
   * - 📣 get user info (firestore);
   * - 📣 (if exists) return target user.
   * - 📣 (else) create a new instance of user for Firestore.
   * @returns { Promise < [ BetarenaUser, boolean ] > }
  */
  async function userFirestore
  (
    uid: string
    , firebaseUser: User
    , web3WalletAddress: string
    , authProviderType: IAuthType
  ): Promise < [ BetarenaUser, boolean ] | [] >
  {
    if (!browser) return [];

    return await tryCatchAsync
    (
      async (
      ): Promise < [ BetarenaUser, boolean ] > =>
      {
        const
          docRef = doc
          (
            db_firestore,
            'betarena_users',
            uid!
          )
          , docSnap = await getDoc(docRef)
        ;

        // ▓ CHECK:
        // ▓ > for existing document (user).
        if (docSnap.exists())
        {
          // ▓ [🐞]
          dlogv2
          (
            AU_W_TAG[0],
            [
              '🟢 Target UID exists'
              ,`🟦 var: docSnap ${docSnap.data()}`
            ]
          );

          return [docSnap.data() as BetarenaUser, true]
        }

        // ▓ [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            '🔴 Target UID does not exists'
            ,'🔵 Creating new BetarenaUser instance'
          ]
        );

        // ▓ NOTE:
        // ▓ > create new user-instance.
        const scoresUserData: BetarenaUser
        = {
          lang: $sessionStore.serverLang
          , registration_type: [authProviderType]
          , username: generateUsername('', 0, 10)
          , register_date: firebaseUser.metadata.creationTime
          , profile_photo: firebaseUser.photoURL
          , web3_wallet_addr: web3WalletAddress || undefined
        }

        return [
          scoresUserData
          , false
        ];
      }
      , (
        ex: unknown
      ): void =>
      {
        errlog(`❌ Error adding document: ${ex}`)

        // ▓ [🐞]
        if (ex?.toString()?.includes('TypeError: null is not an object (evaluating \'signerOrProvider.call\')'))
          console.info('❗️', '');
        else
          console.error('💀 Unhandled :: ex');
        //
        return;
      }
    ) as [ BetarenaUser, boolean ] | [];
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN
   * @description
   *  📣 Stores target (NEW) user in Firebase Firestore Database.
   * @returns { Promise < void > }
  */
  async function createFirestoreUser
  (
    user: IScoreUser
  ): Promise < void >
  {
    if (!browser) return;

    return await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        // ▓ [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🔵 Persisting New User ${user.firebase_user_data?.uid} to Firestore`
        );

        const
          cookie = getCookie
          (
            document.cookie
          )
          , cookieValue = cookie.betarenaScoresCookieReferralCode
        ;

        // ▓ CHECK:
        // ▓ > for referral cookie presence on new users.
        if (cookieValue)
        {
          user!.scores_user_data!.referredBy = cookieValue;

          // ▓ [🐞]
          console.log('📣', user!.scores_user_data!.referredBy);

          // ▓ NOTE:
          // ▓ > update referral creator with generated referral via firebase/functions.
          await post
          (
            `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}/users/data/update/referral-success`
            // 'http://127.0.0.1:5001/betarena-ios/us-central1/api/users/data/update/referral-success'
            , {
              referralId: cookieValue
              , referredNewUserUid: user.firebase_user_data?.uid
            }
          );
        }

        user!.scores_user_data!.referralID = `REF${Math.random().toString().slice(2, 7)}`;

        await setDoc
        (
          doc
          (
            db_firestore
            , 'betarena_users'
            , user.firebase_user_data?.uid!
          )
          , JSON.parse(JSON.stringify(user.scores_user_data))
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        errlog(`❌ Error adding document: ${ex}`)

        return;
      }
    ) as void;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @description
   * ➨ listens to incoming auth. deep-links;
  */
  $:
  if (browser)
  {
    checkEmailMagicLink();
    checkDiscordDeepLink();
    checkMetaMaskDeepLink();
    checkOpenAuth();
    checkReferralLink();
  }

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   *  📣 listens to changes in auth. show/hide modal;
   *
   * WARNING:
   * triggered by changes in:
   * - `` - **kicker**
   */
  $:
  if (!$sessionStore.auth_show)
  {
    authView = true;
    inputEmail = undefined;
    emailVerifyInProgress = false;
    emailVerificationSent = false;
    emailAlreadyInUse = false;
    errorAuthEmailFormat = false;
  }

  $:
  if (sentEmailDate != undefined)
  {
    dateObjDif = sentEmailDate.getTime() - Date.parse(new Date().toString());
    interval1 = setInterval
    (
      (
      ) =>
      {
        dateObjDif = (sentEmailDate!).getTime() - Date.parse(new Date().toString());
      },
      1000
    );
  }

  $:
  if (countD_sec.includes('-'))
    allowResend = true;
  else
    allowResend = false;
  //

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ) =>
    {
      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT[0],
        VIEWPORT_MOBILE_INIT[0]
      );
      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            VIEWPORT_TABLET_INIT[1],
            VIEWPORT_MOBILE_INIT[1]
          ] = viewport_change
          (
            VIEWPORT_TABLET_INIT[0],
            VIEWPORT_MOBILE_INIT[0]
          );
        }
      );

      iconList
      = [
          (await import('./assets/discord.svg')).default // [0] discord_icon
          , (await import('./assets/email-verify.svg')).default // [1] email_verify
          , (await import('./assets/error-alert.svg')).default // [2] error_icon
          , (await import('./assets/github-dark.svg')).default // [3] github_dark_icon
          , (await import('./assets/github.svg')).default // [4] github_icon
          , (await import('./assets/google.svg')).default // [5] google_icon
          , (await import('./assets/lodaer-anim-2.svg')).default // [6] loader_animation
          , (await import('./assets/logo-auth.svg')).default // [7] logo
          , (await import('./assets/logo-dark.svg')).default // [8] logo_dark
          , (await import('./assets/metamask.svg')).default // [9] metamask_icon
          , (await import('./assets/success-alert.svg')).default // [10] success_icon
        ]
      ;
    }
  );

  onDestroy
  (
    () =>
    {
      // @ts-expect-error
      clearInterval(interval1);
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class="(cursor)" styles                │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

{#await widgetInit()}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is pending                                            │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->

{:then authData}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is fulfilled                                          │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->

  <!--
  ▓ NOTE:
  ▓ > background backdrop-fade
  -->
  {#if $sessionStore.auth_show}

    <div
      id="background-modal-blur"
      on:click={() =>	{return ($sessionStore.auth_show = false)}}
      in:fade
    />

  {/if}

  <!--
  ▓ NOTE:
  ▓ > authentication message (success)
  -->
  {#if successAuth}

    <div
      id="auth-alert-box"
      class=
      "
      row-space-start
      "
      transition:fade
    >

      <img
        src={iconList[10]}
        alt="Success Icon"
        title="Success Icon"
      />

      <p
        class=
        "
        w-500
        "
      >
        {#if authTypeSelect == 'login'}
          {authData?.success_msg?.[0]}
        {:else}
          {authData?.success_msg?.[1]}
        {/if}
      </p>

    </div>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > authentication message (error)
  -->
  {#if errorAuth}

    <div
      id="auth-alert-box"
      class=
      "
      row-space-start
      "
      transition:fade
    >

      <img
        src={iconList[2]}
        alt="Error Icon"
        title="Error Icon"
      />

      <p
        class=
        "
        w-500
        "
      >
        {authData?.err_msg?.[0]}
      </p>

    </div>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > authentication main
  -->
  {#if $sessionStore.auth_show}

    <div
      id={CNAME}
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      in:fade
    >

      <!--
      ▓ NOTE:
      ▓ > processing (UI-state)
      -->
      {#if processing}

        <div
          id="processing-auth-box"
        >
          <div
            id="inner-processing-box"
          >

            <img
              src={iconList[6]}
              alt="Loader Vector"
              title="Processing..."
            />

            <p
              class="
                color-grey
              "
            >
              Processing
            </p>

          </div>
        </div>

      {/if}

      <!--
      ▓ NOTE:
      ▓ > email verification (UI-state)
      -->
      {#if emailVerifyInProgress}

        <div
          id="email-auth-verify-box"
        >

          <!--
          ▓ NOTE:
          ▓ > close icon
          -->
          <img
            id="close-vector"
            class=
            "
            cursor-pointer
            "
            src="/assets/svg/close.svg"
            alt="close-svg"
            on:click={() => {return ($sessionStore.auth_show = false)}}
          />

          <!--
          ▓ NOTE:
          ▓ > verify text
          -->
          <p
            class=
            "
            s-20
            w-500
            color-black-2
            "
          >
            {authData?.verification}
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email
          -->
          <p
            class=
            "
            color-grey
            "
          >
            {authData?.verify_email}
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email icon
          -->
          <img
            id="email-verify-icon"
            src={iconList[1]}
            alt="Email Vector"
            title="Email Vector"
          />

          <!--
          ▓ NOTE:
          ▓ > verify email text
          -->
          <p
            class=
            "
            color-grey
            "
          >
            {authData?.email_verify_sent?.[0]}
            <br />

            <span
              class=
              "
              color-black-2
              "
            >
              {inputEmail}
            </span>

            <br />

            {authData?.email_verify_sent?.[1]}
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email box
          -->
          <p
            class=
            "
            m-t-8
            color-primary
            cursor-pointer
            "
            on:click={() => {return window.open('mailto:')}}
          >
            {authData?.inbox}
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify no email box
          -->
          <p
            class=
            "
            color-grey
            m-t-25
            "
          >
            {authData?.no_email_verify?.[0]}
            <span
              class=
              "
              color-primary
              cursor-pointer
              "
              on:click={() => {return authWithEmailMagicLink()}}
            >
              {authData?.no_email_verify?.[1]}
            </span>
          </p>

        </div>

      {/if}

      <!--
      ▓ NOTE:
      ▓ > email sent (UI-state)
      -->
      {#if emailVerificationSent}

        <div
          id="email-auth-verify-box"
        >

          <!--
          ▓ NOTE:
          ▓ > close icon
          -->
          <img
            id="close-vector"
            class=
            "
            cursor-pointer
            "
            src="/assets/svg/close.svg"
            alt="close-svg"
            on:click={() =>	{return ($sessionStore.auth_show = false)}}
          />

          <!--
          ▓ NOTE:
          ▓ > verify email text
          -->
          <p
            class=
            "
            s-20
            w-500
            color-black-2
            "
          >
            Check your email
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email
          -->
          <p
            class=
            "
            color-grey
            "
          >
            Please follow the link in your email
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email icon
          -->
          <img
            id="email-verify-icon"
            src={iconList[1]}
            alt="Email Vector"
            title="Email Vector"
          />

          <!--
          ▓ NOTE:
          ▓ > verify email text
          -->
          <p
            class=
            "
            color-grey
            "
          >
            An email has been sent to

            <br />

            <span
              class=
              "
              color-black-2
              "
            >
              {inputEmail}
            </span>

            <br />

            Please follow the link in your email to	login.
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email inbox
          -->
          <p
            class=
            "
            m-t-8
            color-primary
            cursor-pointer
            "
            on:click={() => {return window.open('mailto:')}}
          >
            Go to my inbox
          </p>

          <!--
          ▓ NOTE:
          ▓ > verify email text
          -->
          {#if allowResend}

            <p
              class=
              "
              m-t-25
              color-grey
              "
            >
              Did not get the email?
              <span
                class=
                "
                color-primary
                cursor-pointer
                "
                on:click={() => {return authWithEmailMagicLink()}}
              >
                Resend email
              </span>
            </p>

          {:else}

            <p
              class=
              "
              m-t-25
              color-grey
              "
            >
              {toZeroPrefixDateStr(countD_min)}:{toZeroPrefixDateStr(countD_sec)} to resend option
            </p>

          {/if}

        </div>

      {/if}

      <!--
      ▓ NOTE:
      ▓ > authentication (UI-state)
      -->
      {#if authView}

        <!--
        ▓ NOTE:
        ▓ > close icon
        -->
        <img
          id="close-vector"
          class=
          "
          cursor-pointer
          "
          src="/assets/svg/close.svg"
          alt="close-svg"
          on:click={() => {return ($sessionStore.auth_show = false)}}
        />

        <!--
        ▓ NOTE:
        ▓ > authentication logo Betarena
        -->
        <img
          id="auth-logo"
          src={$userBetarenaSettings.theme == 'Dark' ? iconList[8] : iconList[7]}
          alt="Betarena Logo"
          title="Betarena Logo"
          aria-label="Betarena Logo"
        />

        <!--
        ▓ NOTE:
        ▓ > login/sign-up text
        -->
        <p
          id="auth-head"
          class=
          "
          color-black-2
          w-500
          "
        >
          {#if authTypeSelect == 'login'}
            {authData?.login}
          {:else}
            {authData?.sign_up}
          {/if}
        </p>

        <!--
        ▓ NOTE:
        ▓ > login/sign-up text email
        -->
        <p
          class=
          "
          color-grey
          "
        >
          {#if authTypeSelect == 'login'}
            {authData?.email_msg?.[0]}
          {:else}
            {authData?.email_msg?.[1]}
          {/if}
        </p>

        <!--
        ▓ NOTE:
        ▓ > authentication form
        -->
        <form
          on:submit|preventDefault={() => {return authWithEmailMagicLink()}}
        >
          <!--
          ▓ NOTE:
          ▓ > input email
          -->
          <input
            id="email"
            type="email"
            placeholder="email@gmail.com"
            autocomplete="off"
            class:error-email={errorAuthEmailFormat}
            required
            bind:value={inputEmail}
            on:invalid={() => {return wrongEmailFormatToggle()}}
          />

          <!--
          ▓ NOTE:
          ▓ > error email
          -->
          {#if errorAuthEmailFormat}
            <p
              class=
              "
              m-t-10
              color-error
              "
            >
              {authData?.err_msg?.[1]}
            </p>
          {/if}

          <!--
          ▓ NOTE:
          ▓ > error email validation exists
          {#if emailAlreadyInUse}
            <p
              class="color-error"
              style="margin-top: 10px;">
              Email already in use
            </p>
          {/if}
          -->

          <!--
          ▓ NOTE:
          ▓ > submit email button
          -->
          <button
            id="email-btn"
            class=
            "
            btn-primary
            "
            type="submit"
          >
            <p
              class=
              "
              w-500
              "
            >
              {authData?.email_continue}
            </p>
          </button>

        </form>

        <!--
        ▓ NOTE:
        ▓ > authentication login/sign-up OAuth2
        -->
        <div
          id="other-oauth-divider-box"
          class=
          "
          row-space-out
          "
        >

          <div class="hr-box" />

          <p
            class=
            "
            color-grey
            "
          >
            {authData?.or}
          </p>

          <div class="hr-box" />

        </div>

        <!--
        ▓ NOTE:
        ▓ > authentication box
        -->
        <div
          id="oauth-box"
          class=
          "
          row-space-out
          "
        >

          <!--
          GOOGLE
          -->
          <button
            class="btn-auth-opt"
            on:click={() => {return authWithGoogle()}}
          >
            <img
              src={iconList[5]}
              alt="Google Icon"
              title="Google Icon"
            />
          </button>

          <!--
          DISCROD
          -->
          <button
            class="btn-auth-opt"
            on:click={() => {return authWithDiscord()}}
          >
            <img
              src={iconList[0]}
              alt="Discord Icon"
              title="Discord Icon"
            />
          </button>

          <!--
          GITHUB
          -->
          <button
            class="btn-auth-opt"
            on:click={() => {return authWithGitHub()}}
          >
            <img
              src={$userBetarenaSettings.theme ==	'Dark' ? iconList[3] : iconList[4]}
              alt="Github Icon"
              title="Github Icon"
            />
          </button>

        </div>

        <!--
        ▓ NOTE:
        ▓ > authentication web3 box
        -->
        <div
          id="web3-divider-box"
          class="row-space-out"
        >

          <div class="hr-box" />

          <p
            class=
            "
            color-grey
            "
          >
            {#if authTypeSelect == 'login'}
              {authData?.or_web3_login}
            {:else}
              {authData?.or_web3_signup}
            {/if}
          </p>

          <div class="hr-box" />

        </div>

        <!--
        ▓ NOTE:
        ▓ > authentication web3 box
        -->
        <button
          id="metamask"
          class=
          "
            row-space-center
            btn-auth-opt
          "
          on:click={() => {return authWithMetamask()}}
        >
          <img
            src={iconList[9]}
            alt="Metamask Icon"
            title="Metamask Icon"
          />
          <p
            class=
            "
            w-500
            color-black-2
            "
          >
            MetaMask
          </p>
        </button>

        <!--
        ▓ NOTE:
        ▓ > authentication text-prompt account box
        -->
        <p
          id="account-onboard-text"
          class=
          "
          color-grey
          "
        >

          {#if authTypeSelect == 'login'}

            {authData?.no_account}
            <span
              class=
              "
              color-primary
              cursor-pointer
              "
              on:click={() => {return (authTypeSelect = 'register')}}
            >
              {authData?.register}
            </span>

          {:else}

            {authData?.account_exists}
            <span
              class=
              "
              color-primary
              cursor-pointer
              "
              on:click={() => {return (authTypeSelect = 'login')}}
            >
              {authData?.login}
            </span>

          {/if}

        </p>

      {/if}

    </div>

  {/if}

{:catch error}
  <!--
  ╭────────────────────────────────────────────────────────────────────────╮
  │ NOTE :|: promise is rejected                                           │
  ╰────────────────────────────────────────────────────────────────────────╯
  -->

  {error}
{/await}

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

	div#background-modal-blur
  {
    /* 📌 position */
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
    /* 🎨 style */
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#auth-alert-box
  {
    /* 📌 position */
		position: fixed;
		bottom: 20px;
		width: fit-content;
		z-index: 4000;
		left: 0;
		right: 0;
		margin: auto;
    /* 🎨 style */
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		padding: 14px 18px;
		border-radius: 6px;

    p
    {
      color: #ffffff;
      margin-left: 10px;
    }
	}

	div#global⮕w⮕auth⮕main
  {
		/* 📌 position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		width: fit-content;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
		height: fit-content;
		/* 🎨 style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
		text-align: -webkit-center;
		overflow: hidden;

    div#processing-auth-box
    {
      position: absolute;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background: rgba(255, 255, 255, 0.8);

      div#inner-processing-box
      {
        position: absolute;
        right: 0;
        left: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
        top: 0;
        bottom: 0;

        img
        {
          width: 48px;
          height: 48px;
        }
      }
    }

    div#email-auth-verify-box img#email-verify-icon
    {
      margin: 30px 0;
    }

    img#auth-logo
    {
      margin-bottom: 12px;
    }

    img#close-vector
    {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 400000002;
    }

    p#auth-head
    {
      font-size: 20px;
      margin-bottom: 5px;
    }

    input#email
    {
      background: var(--white);
      border: 1px solid #cccccc;
      box-sizing: border-box;
      border-radius: 8px;
      padding: 12px;
      width: -webkit-fill-available;
      width: -moz-available;
      height: 44px;
      outline: none;
      font-size: 14px;
      margin-top: 12px;
      color: #000000;

      &:hover
      {
        border: 1px solid #8c8c8c;
      }
      &:focus
      {
        border: 1px solid #4b4b4b;
      }
      &[placeholder]
      {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &::placeholder
      {
        color: #cccccc;
      }
      &.error-email
      {
        border: 1px solid #ff3c3c !important;
      }
    }

    button#email-btn
    {
      height: 40px;
      width: 100%;
      background-color: #f5620f;
      box-shadow: 0px 3px 8px
        rgba(212, 84, 12, 0.32);
      border-radius: 8px;
      padding: 10px 24px;
      margin-top: 12px;

      &:hover
      {
        background: #f77c42;
      }

      p
      {
        color: #ffffff;
        font-size: 14px;
      }
    }

    div#other-oauth-divider-box
    {
      margin: 16px 0;

      p
      {
        margin: 0 12px;
      }
      div.hr-box
      {
        height: 1px;
        width: 100%;
        background: #cccccc;
      }
    }

    div#oauth-box
    {
      button.btn-auth-opt
      {
        padding: 12px 32px;
        background: #ffffff;
        border: 1px solid #e6e6e6 !important;
        border-radius: 60px;
        margin-right: 12px;
      }
      button.btn-auth-opt:hover
      {
        border: 1px solid #f5620f !important;
      }
      button.btn-auth-opt:last-child
      {
        margin-right: unset;
      }
    }

    div#web3-divider-box
    {
      margin: 16px 0;

      div.hr-box
      {
        height: 1px;
        width: 100%;
        background: #cccccc;
      }
      p
      {
        margin: 0 12px;
        white-space: nowrap;
      }
    }

    button#metamask.btn-auth-opt
    {
      padding: 12px 32px;
      background: #ffffff;
      border: 1px solid #e6e6e6 !important;
      border-radius: 60px;
      margin-right: 12px;

      &:hover
      {
        border: 1px solid #f5620f !important;
      }
      p
      {
        margin-left: 12px;
        font-size: 14px;
      }
    }

    p#account-onboard-text
    {
      margin-top: 16px;
    }
  }

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	@media only screen
  and (min-width: 726px)
  {
		#global⮕w⮕auth⮕main
    {
			width: 340px;
		}
	}

	@media only screen
  and (min-width: 1160px)
  {
		#global⮕w⮕auth⮕main
    {
			width: 328px;
		}
	}

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	div#global⮕w⮕auth⮕main.dark-background-1
  {
    /* 🎨 style */
		background: var(--dark-theme-1);

    div#processing-auth-box
    {
      /* 🎨 style */
      background: rgba(41, 41, 41, 0.8);
    }

    input#email
    {
      /* 🎨 style */
      background: var(--dark-theme-1);
      border: 1px solid var(--dark-theme-1-2-shade);
      color: var(--white);

      &::placeholder
      {
        /* 🎨 style */
        color: var(--dark-theme-1-2-shade);
      }
      &:hover
      {
        /* 🎨 style */
        border: 1px solid var(--grey);
      }
    }

    div#other-oauth-divider-box div.hr-box
    , div#web3-divider-box div.hr-box
    {
      /* 🎨 style */
      background: var(--dark-theme-1-2-shade);
    }

    div#oauth-box button.btn-auth-opt
    , button#metamask.btn-auth-opt
    {
      /* 🎨 style */
      border: 1px solid var(--dark-theme-1-2-shade) !important;
      background: var(--dark-theme-1)
    }

    div#oauth-box button.btn-auth-opt:hover
    , button#metamask.btn-auth-opt:hover
    {
      /* 🎨 style */
      border: 1px solid var(--primary) !important;
    }
	}

</style>
