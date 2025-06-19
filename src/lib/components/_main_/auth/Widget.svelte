<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Authentication Modal / Widget-Main                                        │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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

  // ╭─────
  // │ NOTE: WARNING: IMPORTANT CRITICAL
  // │ > package firebase version, should be same as the project global version
  // │ > @metamask/sdk/dist/browser/es/metamask-sdk; // ✅ works
  // │ > @metamask/sdk/dist/browser/umd/metamask-sdk'; // ❌ not working
  // ╰─────

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
	import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
	import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
	import
	  {
	    GithubAuthProvider,
	    GoogleAuthProvider,
	    fetchSignInMethodsForEmail,
	    sendSignInLinkToEmail,
	    signInWithPopup,
	    type ActionCodeSettings
	  } from 'firebase/auth';

	import { app, auth } from '$lib/firebase/init';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { successAuthComplete } from '$lib/utils/authentication.js';
	import { toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { AU_W_TAG, dlog, dlogv2, errlog } from '$lib/utils/debug';
	import { viewportChangeV2 } from '$lib/utils/device';
	import { scoresAuthStore } from './_store.js';

  import ModalBackdrop from '$lib/components/misc/modal/Modal-Backdrop.svelte';

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
    /**
     * @description
     * 📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME = 'global⮕w⮕auth⮕main',
    /**
     * @description
     * 📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 725, true ],
    /**
     * @description
     * 📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     * 📝 Email `input` for authentication
     */
    inputEmail: string | undefined,
    /**
     * @description
     * 📝 Dynamic loaded `asset(s)`
     */
    iconList: string[] = [],
    /**
     * @description
     * 📝 Authentication selection
     */
    authTypeSelect: 'login' | 'register' = 'login'
  ;

  $: ({ windowWidth } = $sessionStore);
  $: ({ globalState, globalStateErrors, resendEmailCountdown } = $scoresAuthStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    )
  ;
  $: authData = $page.data.authTrs as IAuthTrs | null | undefined;

  /**
   * @augments ActionCodeSettings
   */
  $: actionCodeSettings
      = {
        // ╭─────
        // │ NOTE:
        // │ > URL / DOMAIN you want to redirect back to.
        // │ > URL must be in the authorized domains list in the Firebase Console.
        // ╰─────
        url: `${$page.url.origin}${$page.url.pathname}?authTypeSelect=${authTypeSelect}`,
        // ╭─────
        // │ NOTE: IMPORTANT
        // │ > must be set true
        // ╰─────
        handleCodeInApp: true,
        /*
          dynamicLinkDomain: 'http://localhost:3050/auth',
          iOS:
          {
            bundleId: 'com.example.ios'
          },
          android:
          {
            packageName: 'com.example.android',
            installApp: true,
            minimumVersion: '12'
          },
        */
      } as ActionCodeSettings
  ;

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
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
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
   *  💠 **[required]** a tuple of [isSuccess, walletType | null]
   * @return { [ boolean, any ] }
   *  📤 Tuple of [isSuccess, walletType | null]
	 */
  function providerDetect
  (
    walletType: 'isMetaMask' | 'isCoinbaseWallet' | 'isBraveWallet'
  ): [ boolean, any ]
  {
    // ╭─────
    // │ CHECK :|: no ethereum wallet detected.
    // ╰─────
    if (!window.ethereum)
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🛑 - window.ethereum is ${window.ethereum}`
      );

      // ╭─────
      // │ NOTE:
      // │ > or, throw new Error("No injected ethereum object.");
      // ╰─────
      return [
        false,
        null
      ];
    }

    let
      /**
       * @description
       * 📝 Wallet selected by `user`.
      */
      targetSelectWallet = undefined
    ;

    // ╭─────
    // │ CHECK :|: for multiple wallets owned/visible by client/user.
    // ╰─────
    if (Array.isArray(window.ethereum?.providers))
    {
      if (walletType == 'isMetaMask')
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
      ;
      // [🐞]
      dlogv2
      (
        AU_W_TAG[0],
        [
          `🟦 Multiple wallet providers identified: ${window.ethereum?.providers?.length}`,
          `🟦 var: targetSelectWallet ${targetSelectWallet}`,
          `🟦 var: window.ethereum.providers ${window.ethereum?.providers}`
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

      // [🐞]
      dlogv2
      (
        `${AU_W_TAG[0]}`,
        [
          `🟦 Single provider identified! ${window.ethereum}`,
          `🟦 var: targetSelectWallet ${targetSelectWallet}`,
          `🟦 var: window.ethereum ${window.ethereum}`
        ]
      );
    }

    // ╭─────
    // │ CHECK :|: for absent selected wallet.
    // ╰─────
    if (targetSelectWallet == undefined)
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔴 no target wallet (${walletType}) identified`
      );

      return [
        false,
        null
      ];
    }

    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟢 ${walletType} identified`
    );

    // ╭─────
    // │ NOTE: WARNING: IMPORTANT CRITICAL
    // │ > conflicting use of CoinBaseWallet and MetaMask on client/users browser.
    // │ > Setting MetaMask as main wallet.
    // ╰─────

    // ╭─────
    // │ WARNING:
    // │ > (👇) causes issues with FireFox
    // ╰─────
    // targetSelectWallet.request({ method: 'eth_requestAccounts' });

    // ╭─────
    // │ NOTE:
    // │ > (👇) Not working
    // ╰─────
    // window.ethereum.setSelectedProvider(targetSelectWallet);
    // window.ethereum.request
    // ({
    //   method: 'wallet_requestPermissions',
    //   params: [{ eth_accounts: {}}]
    // });

    return [
      true,
      targetSelectWallet
    ];
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟥 MAIN
   * @description
   *  📣 sign-in/sign-up user using Google OAuth2 **target** `provider`.
   * @param { 'google' } authOpt
   *  💠 **[required]** Target `authentication` process.
   * @see https://firebase.google.com/docs/auth/web/google-signin
   * @return { Promise < void > }
   */
  async function authenticateGoogleAuth20
  (
    authOpt: 'google' = 'google',
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        scoresAuthStore.updateData
        (
          [
            ['globalStateAdd', 'Processing']
          ]
        );

        let
          /**
           * @description
           * 📝 Target `provider` selected.
           */
          provider: null | GithubAuthProvider | GoogleAuthProvider = null
        ;

        provider = new GoogleAuthProvider();

        const
          result
            = await signInWithPopup
            (
              auth,
              provider
            ),
          user = result.user
        ;

        // [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Auth Success`
        );

        const
          /**
           * @description
           * 📝 Nested logic response.
           */
          setp0Res
            = await successAuthComplete
            (
              authTypeSelect,
              user,
              undefined,
              authOpt
            )
        ;

        if (!setp0Res)
          throw new Error();
        else
          scoresAuthStore.updateData
          (
            [
              ['globalStateRemove', 'Processing']
            ]
          );
        ;

        return;
      },
      (
        ex: unknown | any
      ): void =>
      {
        scoresAuthStore.updateData
        (
          [
            [ 'globalStateRemove', 'Processing']
          ]
        );

        // ╭─────
        // │ NOTE: WARNING: IMPORTANT CRITICAL
        // │ > also available 'ex?.code', 'ex?.message', 'ex?.customData?.email'.
        // │ > more info of AuthCredential used.
        // │  > 'ex' :: FirebaseError: Firebase: Error (auth/account-exists-with-different-credential).
        // ╰─────
        // const credential = GoogleAuthProvider.credentialFromError(ex);

        // [🐞]
        errlog(`❌ Google auth error: ${ex}`);

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
   * @CUSTOM_STATE
   *  ⭐️ v8
   * @description
   *  - 📣 sign-in/sign-up user using **Email Magic Link**.
   *  - 📣 initiates `magic link` event listen for user.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @return { Promise < void > }
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
        // [🐞]
        dlog
        (
          `${AU_W_TAG[0]} inputEmail: ${inputEmail}`
        );

        scoresAuthStore.updateData
        (
          [
            ['globalStateAdd', 'Processing'],
            ['globalStateErrorRemove', 'ErrorAuthEmailFormat']
          ]
        );

        const
          signInMethods
            = await fetchSignInMethodsForEmail
            (
              auth,
              inputEmail!
            )
        ;

        // ╭─────
        // │ CHECK :|: for existance of target email in Auth Database.
        // ╰─────
        if (signInMethods.length)
          $scoresAuthStore.globalStateErrors.add('EmailAlreadyInUse');
        else
          $scoresAuthStore.globalStateErrors.delete('EmailAlreadyInUse');
        ;

        // ╭─────
        // │ CHECK :|: for existance of email error.
        // ╰─────
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
          auth,
          inputEmail!,
          actionCodeSettings
        );

        // ╭─────
        // │ NOTE:
        // │ > store target email in localStroage()
        // │ > for retrival on same device.
        // ╰─────
        window.localStorage.setItem
        (
          'emailForSignIn'
          , inputEmail!
        );

        // ╭─────
        // │ NOTE: :|: successfully sent email with 'magic link' UI state.
        // ╰─────
        scoresAuthStore.updateData
        (
          [
            ['globalStateRemove', 'Processing']
          ]
        );

        if ($scoresAuthStore.globalStateErrors.has('EmailAlreadyInUse'))
          scoresAuthStore.updateData
          (
            [
              ['globalStateAdd', 'ExistingEmailLoginSent']
            ]
          );
        else
          scoresAuthStore.updateData
          (
            [
              ['globalStateAdd', 'NewEmailRegisterationSent']
            ]
          );
        ;

        return;
      },
      (
        ex: unknown
      ): void =>
      {
        scoresAuthStore.updateData
        (
          [
            ['globalStateRemove', 'Processing']
          ]
        );
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
   *  - 📣 sign-in/up user using Web3 MetaMask (using MoralisAPI).
   *  - 📣 NOTE: only MetaMask extension supported.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @return { Promise < void > }
   */
  async function authenticateWithMetamask
  (
  ): Promise < void >
  {
    if (!browser) return;

    await tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        scoresAuthStore.updateData
        (
          [
            ['globalStateAdd', 'Processing']
          ]
        );

        // ╭─────
        // │ CHECK:
        // │ > mobile device.
        // ╰─────
        const if_M_0: boolean
          // ╭─────
          // │ NOTE: WARNING:
          // │ > unreliable, does not work correcrlty at times
          // ╰─────
          // typeof screen.orientation !== 'undefined'
          // navigator?.userAgentData?.mobile
          = /Mobi/i.test(window.navigator.userAgent)
          && window.ethereum == null
        ;
        if (if_M_0)
        {
          // ╭─────
          // │ CHECK:
          // │ > navigate to MetaMask in-app browser.
          // ╰─────
          // await goto('https://metamask.app.link/dapp/scores.betarena.com/?dappLogin=true') // ✅ works
          // await goto('https://metamask.app.link/dapp/http://192.168.0.28:3050/') // ❌ does not work
          // await goto('https://metamask.app.link/dapp/192.168.0.28:3050/?dappLogin=true') // ❌ does not work
          const
            dappUrl = $page.url.host,
            metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}?metmaskAuth=true`
          ;
          window.open(metamaskAppDeepLink, '_self');
          scoresAuthStore.updateData
          (
            [
              ['globalStateRemove', 'Processing']
            ]
          );
          return;
        }

        // ╭─────
        // │ CHECK:
        // │ > metaMask is NOT present, exit.
        // ╰─────
        if (!providerDetect('isMetaMask')[0])
        {
          // [🐞]
          dlog
          (
            `${AU_W_TAG[0]} 🔴 Moralis Auth not found!`
          );

          // [🐞]
          alert
          (
            'Please install the MetaMask Wallet Extension!'
          );

          scoresAuthStore.updateData
          (
            [
              ['globalStateRemove', 'Processing']
            ]
          );
          return;
        }

        const
          moralisAuth = getMoralisAuth(app),
          moralisAuthInstance = await signInWithMoralis(moralisAuth)
        ;

        // ╭─────
        // │ NOTE: TEST
        // │ > Moralis Authentication [TEST]
        // │ FIXME:
        // │ > create walletConnect provider.
        // │ > ❌ Not Working
        // │ > WalletConnectProvider error DOC: REF: [10]
        // ╰─────
        /*
          const provider = new WalletConnectProvider({
            infuraId: "a523c408585b0f7c88a7df7a9d70dfe6",
          });
          await provider.enable();
          const moralisAuthInstance = await signInWithMoralis(moralisAuth, {
            provider: new Web3Provider(provider)
          });
        */

        // ╭─────
        // │ NOTE:
        // │ > MetaMask SDK [TEST]
        // │ > 🟩 Working | Disabled
        // ╰─────
        /*
          const MMSDK = new MetaMaskSDK
          (
            {
              useDeeplink: false,
              communicationLayerPreference: "socket",
              enableDebug: true,
              shouldShimWeb3: false,
              showQRCode: true,
            }
          )
          const ethereum = MMSDK.getProvider() // You can also access via window.ethereum
          await ethereum.request({ method: 'eth_requestAccounts', params: [] })
          // .then(r => console.log(r));
          .then(r => alert(r));
          // - needs to be redirected back to the APP for 2nd SIGN MESSAGE...
        */

        // [🐞]
        dlog
        (
          `${AU_W_TAG[0]} 🟢 Moralis Auth`
        );

        await successAuthComplete
        (
          authTypeSelect,
          moralisAuthInstance.credentials.user,
          moralisAuthInstance.credentials.user.displayName!,
          'wallet'
        );

        return;
      },
      (
        ex: unknown
      ): void =>
      {
        scoresAuthStore.updateData
        (
          [
            ['globalStateRemove', 'Processing']
          ]
        );
        // [🐞]
        errlog(`❌ Moralis Auth error: ${ex}`);
        return;
      }
    );

    return;
  }

  // #endregion ➤ 🛠️ METHODS

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
      iconList = [
        (await import('./assets/discord.svg')).default, // [0] discord_icon
        (await import('./assets/email-verify.svg')).default, // [1] email_verify
        (await import('./assets/error-alert.svg')).default, // [2] error_icon
        (await import('./assets/github-dark.svg')).default, // [3] github_dark_icon
        (await import('./assets/github.svg')).default, // [4] github_icon
        (await import('./assets/google.svg')).default, // [5] google_icon
        (await import('./assets/lodaer-anim-2.svg')).default, // [6] loader_animation
        (await import('./assets/logo-auth.svg')).default, // [7] logo
        (await import('./assets/logo-dark.svg')).default, // [8] logo_dark
        (await import('./assets/metamask.svg')).default, // [9] metamask_icon
        (await import('./assets/success-alert.svg')).default // [10] success_icon
      ];
      iconList = iconList;

      scoresAuthStore.updateData
      (
        [
          ['globalStateAdd', 'AuthenticationStart']
        ]
      );

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<ModalBackdrop
  on:closeModal=
  {
    () =>
    {
      $sessionStore.currentActiveModal = null;
      return;
    }
  }
/>

<!--
╭─────
│ > authentication main
╰─────
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  in:fade
>

  <!--
  ╭─────
  │ > processing (UI-state)
  ╰─────
  -->
  {#if globalState.has('Processing')}
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

  <!--
  ╭─────
  │ > email verification (UI-state)
  ╰─────
  -->
  {:else if globalState.has('NewEmailRegisterationSent')}
    <div
      id="email-auth-verify-box"
    >

      <!--
      ╭─────
      │ > close icon
      ╰─────
      -->
      <img
        id="close-vector"
        class=
        "
        cursor-pointer
        "
        src="/assets/svg/close.svg"
        alt="close-svg"
        on:click=
        {
          () =>
          {
            $sessionStore.currentActiveModal = null;
            return;
          }
        }
      />

      <!--
      ╭─────
      │ > verify text
      ╰─────
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
      ╭─────
      │ > verify email
      ╰─────
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
      ╭─────
      │ > verify email icon
      ╰─────
      -->
      <img
        id="email-verify-icon"
        src={iconList[1]}
        alt="Email Vector"
        title="Email Vector"
      />

      <!--
      ╭─────
      │ > verify email text
      ╰─────
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
      ╭─────
      │ > verify email box
      ╰─────
      -->
      <p
        class=
        "
        m-t-8
        color-primary
        cursor-pointer
        "
        on:click=
        {
          () =>
          {
            window.open('mailto:');
            return;
          }
        }
      >
        {authData?.inbox}
      </p>

      <!--
      ╭─────
      │ > verify no email box
      ╰─────
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
          on:click=
          {
            () =>
            {
              authWithEmailMagicLink();
              return;
            }
          }
        >
          {authData?.no_email_verify?.[1]}
        </span>
      </p>

    </div>

  <!--
  ╭─────
  │ > email sent (UI-state)
  ╰─────
  -->
  {:else if globalState.has('ExistingEmailLoginSent')}
    <div
      id="email-auth-verify-box"
    >

      <!--
      ╭─────
      │ > close icon
      ╰─────
      -->
      <img
        id="close-vector"
        class=
        "
        cursor-pointer
        "
        src="/assets/svg/close.svg"
        alt="close-svg"
        on:click=
        {
          () =>
          {
            $sessionStore.currentActiveModal = null;
            return;
          }
        }
      />

      <!--
      ╭─────
      │ > verify email text
      ╰─────
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
      ╭─────
      │ > verify email
      ╰─────
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
      ╭─────
      │ > verify email icon
      ╰─────
      -->
      <img
        id="email-verify-icon"
        src={iconList[1]}
        alt="Email Vector"
        title="Email Vector"
      />

      <!--
      ╭─────
      │ > verify email text
      ╰─────
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
      ╭─────
      │ > verify email inbox
      ╰─────
      -->
      <p
        class=
        "
        m-t-8
        color-primary
        cursor-pointer
        "
        on:click=
        {
          () =>
          {
            window.open('mailto:');
            return;
          }
        }
      >
        Go to my inbox
      </p>

      <!--
      ╭─────
      │ > verify email text
      ╰─────
      -->
      {#if $scoresAuthStore.globalState.has('AllowResendEmailLogin')}

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
            on:click=
            {
              () =>
              {
                authWithEmailMagicLink();
                return;
              }
            }
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
          {
            toZeroPrefixDateStr(resendEmailCountdown?.[1] ?? 0)
          }
          :
          {
            toZeroPrefixDateStr(resendEmailCountdown?.[0] ?? 0)
          }
        </p>

      {/if}

    </div>
  {/if}

  <!--
  ╭─────
  │ > authentication (UI-state)
  ╰─────
  -->
  {#if globalState.has('AuthenticationStart')}

    <!--
    ╭─────
    │ > close icon
    ╰─────
    -->
    <img
      id="close-vector"
      class=
      "
      cursor-pointer
      "
      src="/assets/svg/close.svg"
      alt="close-svg"
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = null;
          return;
        }
      }
    />

    <!--
    ╭─────
    │ > authentication logo Betarena
    ╰─────
    -->
    <img
      id="auth-logo"
      src={$userBetarenaSettings.theme == 'Dark' ? iconList[8] : iconList[7]}
      alt="Betarena Logo"
      title="Betarena Logo"
      aria-label="Betarena Logo"
    />

    <!--
    ╭─────
    │ > login/sign-up text
    ╰─────
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
    ╭─────
    │ > login/sign-up text email
    ╰─────
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
    ╭─────
    │ > authentication form
    ╰─────
    -->
    <form
      on:submit|preventDefault=
      {
        () =>
        {
          authWithEmailMagicLink();
          return;
        }
      }
    >
      <!--
      ╭─────
      │ > input email
      ╰─────
      -->
      <input
        id="email"
        type="email"
        placeholder="email@gmail.com"
        autocomplete="off"
        class:error-email={globalStateErrors.has('ErrorAuthEmailFormat')}
        required
        bind:value={inputEmail}
        on:invalid=
        {
          () =>
          {
            // errorAuthEmailFormat = true;
            // errorAuth = true;
            // setTimeout
            // (
            //   (
            //   ) =>
            //   {
            //     errorAuth = false;
            //     return;
            //   },
            //   1500
            // );
            // return;
          }
        }
      />

      <!--
      ╭─────
      │ > error email
      ╰─────
      -->
      {#if globalStateErrors.has('ErrorAuthEmailFormat')}
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
      ╭─────
      │ > submit email button
      ╰─────
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
    ╭─────
    │ > authentication login/sign-up OAuth2
    ╰─────
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
    ╭─────
    │ > Google
    ╰─────
    -->
    <button
      id="google"
      class=
      "
      btn-auth-opt
      "
      on:click=
      {
        () =>
        {
          authenticateGoogleAuth20('google');
          return;
        }
      }
    >
      <img
        src={iconList[5]}
        alt="Google Icon"
        title="Google Icon"
      />
      <p
        class=
        "
        w-500
        color-black-2
        "
      >
        Google
      </p>
    </button>

    <!--
    ╭─────
    │ > authentication web3 box
    ╰─────
    -->
    <div
      id="web3-divider-box"
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
        {#if authTypeSelect == 'login'}
          {authData?.or_web3_login}
        {:else}
          {authData?.or_web3_signup}
        {/if}
      </p>
      <div class="hr-box" />
    </div>

    <!--
    ╭─────
    │ > authentication web3 box
    ╰─────
    -->
    <button
      id="metamask"
      class=
      "
      row-space-center
      btn-auth-opt
      "
      on:click=
      {
        () =>
        {
          authenticateWithMetamask();
          return;
        }
      }
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
    ╭─────
    │ > authentication text-prompt account box
    ╰─────
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

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	div#global⮕w⮕auth⮕main
  {
		/* 📌 position */
		position: fixed;
		z-index: 10000;
		margin: auto;
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

    button.btn-auth-opt
    {
      padding: 12px 32px;
      background: #ffffff;
      border: 1px solid #e6e6e6 !important;
      border-radius: 60px;
      margin-right: 12px;
      width: 100%;

      &:hover
      {
        border: 1px solid #f5620f;
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
			min-width: 328px;
			max-width: 328px;
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

    button.btn-auth-opt
    {
      /* 🎨 style */
      border: 1px solid var(--dark-theme-1-2-shade) !important;
      background: var(--dark-theme-1) !important;

      &:hover
      {
        /* 🎨 style */
        border: 1px solid var(--primary) !important;
      }
    }
	}

</style>
