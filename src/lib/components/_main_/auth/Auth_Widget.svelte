<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region Package Imports

	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { get } from '$lib/api/utils';
	import { app, auth, db_firestore } from '$lib/firebase/init';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { AU_W_TAG, dlog, dlogv2, errlog } from '$lib/utils/debug';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { getMoralisAuth, type MoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
	import { fetchSignInMethodsForEmail, GithubAuthProvider, GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithCustomToken, signInWithEmailLink, signInWithPopup, type User } from 'firebase/auth';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { generateUsername } from 'unique-username-generator';
/**
   * NOTE: pacakge firebase should be same as project global
   * @metamask/sdk/dist/browser/es/metamask-sdk; // ✅ works
   * @metamask/sdk/dist/browser/umd/metamask-sdk'; // ❌ not working
  */

  import { signInWithMoralis, type SignInWithMoralisResponse } from "@moralisweb3/client-firebase-evm-auth";

	
	import type { Auth_Type, Betarena_User, Scores_User } from '$lib/types/types.scores.js';
	import type { REDIS_CACHE_SINGLE_auth_translation } from '@betarena/scores-lib/types/auth.js';

  //#endregion Package Imports

  // #region ➤ [VARIABLES]

  const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 725;
	let mobileExclusive: boolean = false, tabletExclusive: boolean = false;

	let email_input: string;
	let processing: boolean = false;
	let email_verify_process: boolean = false;
	let email_sent_process: boolean = false;
	let allow_resend: boolean = false;
	let sent_email_date: Date = undefined;
	let dateObjDif: number;
	let auth_view: boolean = true;
	let auth_type: 'login' | 'register' = 'login';
	let auth_service: Auth_Type;
	let success_auth: boolean = false;
	let error_auth: boolean = false;
	let email_error_format: boolean = false;
	let email_already_in_use: boolean = false;

  let
    discord_icon: string,
    email_verify: string,
    error_icon: string,
    github_dark_icon: string,
    github_icon: string,
    google_icon: string,
    loader_animation: string,
    logo: string,
    logo_dark: string,
    metamask_icon: string,
    success_icon: string
  ;

  // IMPORTANT
  let actionCodeSettings =
  {
		// [ℹ] URL / DOMAIN you want to redirect back to.
		// [ℹ] URL must be in the authorized domains list in the Firebase Console.
		url: `${$page.url?.origin}${$page.url?.pathname}?auth_type=${auth_type}`,
		handleCodeInApp: true // [ℹ] This must be set true
		// dynamicLinkDomain: 'http://localhost:3050/auth'
		// iOS: {
		//   bundleId: 'com.example.ios'
		// },
		// android: {
		//   packageName: 'com.example.android',
		//   installApp: true,
		//   minimumVersion: '12'
		// },
	};

	$: actionCodeSettings.url = `${$page.url?.origin}${$page.url?.pathname}?auth_type=${auth_type}`;

  // [🐞]
	if (dev) email_input = 'migbashdev@gmail.com';

  // #endregion ➤ [VARIABLES]

  // #region ➤ [MAIN-METHODS]

  /**
   * @description
   * TODO: move to -Widget, -Main V6 structure;
  */
	async function widget_init
  (
  ): Promise < REDIS_CACHE_SINGLE_auth_translation >
  {
		const dataRes0: REDIS_CACHE_SINGLE_auth_translation = await get
    (
      `/api/hasura/_main_/auth?lang=${$sessionStore?.serverLang}`
    );
		return dataRes0;
	}

  /**
   * @summary
   * [HELPER]
   * @description
   * ➨ singal an email (login) attempt UI/UX change;
   * @returns
   * void (NaN)
  */
  function wrongEmailFormatToggle
  (
  ): void
  {
		email_error_format = true;
		error_auth = true;
		setTimeout
    (
      () =>
      {
			  error_auth = false;
		  },
      1500
    );
	}

	/**
   * @summary
   * [HELPER]
   * @description
   * ➨ validates Web3 wallet extension being used by client/user;
   * @see https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
   * @see https://stackoverflow.com/questions/72613011/whenever-i-click-on-connect-metamask-button-why-it-connects-the-coinbase-wallet
   * @see https://stackoverflow.com/questions/68023651/how-to-connect-to-either-metamask-or-coinbase-wallet
   * @see https://github.com/MetaMask/metamask-extension/issues/13622
   * [FIREFOX ISSUE]
   * @see https://github.com/Betarena/scores/issues/1021
   * @see https://github.com/MetaMask/metamask-extension/issues/3133
   * @see https://github.com/MetaMask/metamask-extension/issues/10023
   * @see https://community.metamask.io/t/metamask-cannot-be-detected-on-firefox/24705/8
	 * @param
   * a tuple of [isSuccess, walletType | null]
	 */
	function providerDetect
  (
		walletType:
			| 'isMetaMask'
			| 'isCoinbaseWallet'
			| 'isBraveWallet'
	): [ boolean, any ]
  {

		// CHECK: No Ethereum wallet detected;
		if (!window?.ethereum)
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🛑 - window.ethereum is ${window?.ethereum}`
      );

			return [
        false,
        null
      ];
      // or,
			// throw new Error("No injected ethereum object.");
		}

		let targetSelectWallet = undefined;

    // CHECK: Multiple wallets owned/opened by client/user;
    const if_M_0: boolean =
      Array.isArray(window?.ethereum?.providers)
    ;
		if (if_M_0)
    {
			if (walletType == 'isMetaMask')
      {
				targetSelectWallet =	window?.ethereum?.providers
        ?.find
        (
          (
            provider
          ) =>
          provider?.[walletType]
          && provider?.isBraveWallet == undefined
        );
			}

      // [🐞]
      dlogv2
      (
        AU_W_TAG[0],
        [
          `🟦 Multiple wallet providers identified: ${window?.ethereum?.providers?.length}`,
          `🟦 var: targetSelectWallet ${targetSelectWallet}`,
          `🟦 var: window.ethereum.providers ${window?.ethereum?.providers}`
        ]
      );

		}
    if (!if_M_0)
    {

      const if_M_0: boolean =
        walletType == 'isMetaMask'
        && window?.ethereum?.isBraveWallet == undefined
        && window?.ethereum?.isMetaMask != undefined
        && window?.ethereum?.isMetaMask
      ;
			if (if_M_0) targetSelectWallet =	window?.ethereum?.[walletType];

      // [🐞]
      dlogv2
      (
        `${AU_W_TAG[0]}`,
        [
          `🟦 Single provider identified! ${window?.ethereum}`,
          `🟦 var: targetSelectWallet ${targetSelectWallet}`,
          `🟦 var: window.ethereum ${window?.ethereum}`
        ]
      );

		}

    // EXIT;
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

    // NOTE: IMPORTANT
    // Conflicting use of CoinBaseWallet and MetaMask on client/users browser.
    // -> Setting MetaMask as main wallet!
    // WARNING: Causes issues with FireFox!
    // targetSelectWallet.request({ method: 'eth_requestAccounts' });
    // NOTE: Not working
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
   * @summary
   * [MAIN]
   * @description
   * ➨ sign-in/up user using Google OAuth2
   * @see https://firebase.google.com/docs/auth/web/google-signin
   * @returns
   * Promise < void >
  */
	async function loginGoogle
  (
  ): Promise < void >
  {
		try
    {

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 Google Auth Init`
      );

			processing = true;
			auth_service = 'google';
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider)
			?.then
      (
        (
          result
        ) =>
        {
          // [🐞]
          dlog
          (
            `${AU_W_TAG[0]} 🟢 Google Auth Success`
          );

					const user = result?.user;
					successAuthComplete
          (
						user,
						null,
						auth_service
					);
				}
      )
      .catch
      (
        (
          error
        ) =>
        {
          processing = false;
          // TODO: Error Authetication Handle
          // [ℹ] handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email; // The email of the user's account used.
          // [ℹ] AuthCredential used
          // const credential = GoogleAuthProvider.credentialFromError(error);
          errlog(errorCode);
          errlog(errorMessage);
        }
      );

		}
    catch (error)
    {
			processing = false;
      errlog(`❌ Google auth error: ${error}`)
		}
	}

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ sign-in/up user using GitHub OAuth2
   * @see https://firebase.google.com/docs/auth/web/github-auth
   * @returns
  */
	async function loginGitHub
  (
  ): Promise < void >
  {
		try
    {

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 GitHub Auth Init`
      );

			auth_service = 'github';
			processing = true;
			const provider = new GithubAuthProvider();

			await signInWithPopup(auth, provider)
      ?.then
      (
        (
          result
        ) =>
        {
          // [🐞]
          dlog
          (
            `${AU_W_TAG[0]} 🟢 GitHub Auth Success`
          );

					const user = result.user;
					successAuthComplete
          (
						user,
						null,
						auth_service
					);

				}
      )
      .catch
      (
        (
          error
        ) =>
        {
          processing = false;
          // [ℹ] handle errors
          const errorCode = error.code;
          const errorMessage = error.message;
          errlog(errorCode);
          errlog(errorMessage);
          // [ℹ] the email used
          const email = error.customData.email;
          // [ℹ] AuthCredential used
          const credential = GithubAuthProvider.credentialFromError
          (
            error
          );

          // [🐞]
          dlog
          (
            `${AU_W_TAG[0]} credential: ${credential}; email: ${email}`
          );

          // TODO: error user-sign in
          // signInWithCredential(auth, credential)
          // .then(user => {
          //   // You can now link the pending credential from the first
          //   // error.
          //   linkWithCredential(error.credential)
          // })
          // .catch(error => log(error))
        }
      );

		}
    catch (e)
    {
      errlog(`❌ GitHub Auth error: ${e}`)
		}
	}

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ sign-in/up user using Email Magic Link.
   * ➨ initiates a "deep-link" listen for user.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @returns
   *Promise < void >
  */
	async function loginEmailLink
  (
  ): Promise < void >
  {
		try
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} email_input: ${email_input}`
      );

			email_error_format = false;
			processing = true;

			await fetchSignInMethodsForEmail
      (
				auth,
				email_input
			)
      ?.then
      (
        (
          signInMethods
        ) =>
        {
          if (signInMethods.length)
          {
            // [ℹ] The email already exists in the Auth database. You can check the
            // [ℹ] sign-in methods associated with it by checking signInMethods array.
            // [ℹ] Show the option to sign in with that sign-in method.
            email_already_in_use = true;
          }
          else
          {
            // [ℹ] User does not exist. Ask user to sign up.
            email_already_in_use = false;
          }
        }
      )
      .catch
      (
        (
          error
        ) =>
        {
          // FIXME:
          // Some error occurred.
        }
      );

			// [ℹ] validation
			// if (email_already_in_use) {
			//   if (dev) console.log('🟠 Exit MagicLink')
			//   processing = false
			//   error_auth = true
			//   setTimeout(() => {
			//     error_auth = false
			//   }, 1500)
			//   return
			// }

			// cont. send email
			await sendSignInLinkToEmail
      (
				auth,
				email_input,
				actionCodeSettings
			)
      ?.then
      (
        () =>
        {
					// [ℹ] The link was successfully sent - (custom) UI update
					processing = false;
					auth_view = false;
					if (email_already_in_use)
          {
						email_sent_process = true;
						sent_email_date = new Date();
						sent_email_date.setMinutes
            (
							sent_email_date.getMinutes() + 5
						); // [ℹ] add 5 min.
					}
          else
          {
						email_verify_process = true;
					}
					// [ℹ] store target email in localStroage() for retrival on same device
					window.localStorage.setItem
          (
						'emailForSignIn',
						email_input
					);
					// NOTE: listen for email deep link continued
				}
      )
      ?.catch
      (
        (
          error
        ) =>
        {
          // TODO: Error Authetication Handle
          const errorCode = error.code;
          const errorMessage = error.message;
        }
      );

		}
    catch (e)
    {
			errlog(`❌ Email (MagicLink) Auth error: ${e}`)
		}
	}

  // TODO: DOC:
  async function checkEmailDeepLink
  (
  ): Promise < void >
  {

    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟠 Checking for EmailLink DeepLink`
    );

    const if_M_0: boolean =
      isSignInWithEmailLink
      (
				auth,
				window?.location?.href
			)
    ;
    if (!if_M_0) return;

    auth_service = 'email';

    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🔵 EmailLink OAuth2`
    );

    // NOTE: apiKey, oobCode, mode, lang query param(s) passed in URL query params
    // NOTE: Additional state parameters can also be passed via URL.
    // NOTE: This can be used to continue the user's intended action before triggering
    // NOTE: the sign-in operation.
    // NOTE: Get the email if available. This should be available if the user completes
    // NOTE: the flow on the same device where they started it.

    let email: string = window?.localStorage?.getItem
    (
      'emailForSignIn'
    );

    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} email: ${email}`
    );

    // CHECK: User opened deep-link on different device, from the created on-intent;
    if (!email)
    {
      email = window.prompt
      (
        'Please provide your email for confirmation'
      );
    }

    // [ℹ] Client SDK to parse the code from the link for you.
    signInWithEmailLink
    (
      auth,
      email,
      window.location.href
    )
		?.then
    (
      (
        result
      ) =>
      {

        auth_type = $page?.url?.searchParams
        ?.get
        (
          'auth_type'
        )
        ?.toString() as 'login' | 'register';

        const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`;

        // [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            `🟢 EmailLink Auth`,
            `🟦 var: result?.user?.displayName ${result?.user?.displayName}`,
            `🟦 var: result?.user?.email ${result?.user?.email}`
          ]
        );

        window.localStorage.removeItem
        (
          'emailForSignIn'
        );

        // NOTE: You can access the new user via result.user
        // NOTE: Additional user info profile not available via:
        // => result.additionalUserInfo.profile == null
        // NOTE: You can check if the user is new or existing:
        // => result.additionalUserInfo.isNewUser

        successAuthComplete
        (
          result?.user,
          null,
          auth_service
        );

        goto
        (
          revert_url,
          {
            replaceState: true
          }
        );

      }
    )
    .catch
    (
      (
        error

      ) =>
      {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        errlog(`❌ Email (MagicLink) Auth error: ${error}`)
      }
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ sign-in/up user using Discrod Link.
   * ➨ initiates a "deep-link" listen for user.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @returns
   * Promise < void >
  */
	async function loginDiscord
  (
  ): Promise < void >
  {
    // DOC: REF: [4]
		try
    {
			processing = true;
			const callback_auth_url = $page?.url?.origin;

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} callback_auth_url: ${callback_auth_url}`
      );

			const discord_outh_url = import.meta.env?.VITE_DISCORD_OAUTH_URL;
			const final_url_nav = `${discord_outh_url}?redirect_url=${callback_auth_url}`;

			// [ℹ] initiate discord OAuth2
			goto(final_url_nav);

		}
    catch (error)
    {
			errlog(error);
			processing = false;
		}
	}

  // TODO: DOC:
  async function checkDiscordDeepLink
  (
  ): Promise < void >
  {
    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟠 Checking for Discord DeepLink`
    );

		const f_uid: string = $page.url.searchParams.get('f_uid');
		const oauth2: string = $page.url.searchParams.get('oauth2');
		const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`;

		// [ℹ] validate user is attempting Discord OAuth2
		if (oauth2 == 'discord' && f_uid != null)
    {

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 Discord OAuth2`
      );

			// ACTION: Clean up url from queries/auth-bloat;
			goto
      (
        revert_url,
        {
          replaceState: true
        }
      );

			// [ℹ] firebase sign-in
			signInWithCustomToken
      (
        auth,
        f_uid
      )
      ?.then
      (
        (
          userCredential
        ) =>
        {
					auth_service = 'discord';

          // [🐞]
          dlog
          (
            `${AU_W_TAG[0]} 🟢 Success! Discord OAuth2'`
          );

					const user = userCredential?.user;

					successAuthComplete
          (
						user,
						null,
						auth_service
					);

				}
      )
      .catch
      (
        (
          error
        ) =>
        {
          // TODO: complete authetication error handle
          const errorCode = error.code;
          const errorMessage = error.message;
          errlog(errorCode);
          errlog(errorMessage);
        }
      );
		}
  }

  /**
   * @summary
   * IMPORTANT
   * [MAIN]
   * @description
   * ➨ sign-in/up user using Web3 MetaMask (using MoralisAPI).
   * NOTE: only MetaMask extension exlcusive.
   * @see https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
   * @returns
   * Promise < void >
  */
	async function loginMetamask
  (
  ): Promise < void >
  {
    // DOC: REF: [1]
		try
    {
			processing = true;
			auth_service = 'wallet';

      // CHECK: Mobile Device;
      const if_M_0: boolean =
        // typeof screen.orientation !== 'undefined' // ureliable;
        // navigator?.userAgentData?.mobile // ureliable;
        /Mobi/i.test(window?.navigator?.userAgent)
        && window?.ethereum == null
      ;
      if (if_M_0)
      {
        // [ℹ] navigate to MetaMask in-app browser
        // await goto('https://metamask.app.link/dapp/scores.betarena.com/?dappLogin=true') // ✅ works
        // await goto('https://metamask.app.link/dapp/http://192.168.0.28:3050/') // does not work
        // await goto('https://metamask.app.link/dapp/192.168.0.28:3050/?dappLogin=true') // does not work
        const dappUrl = $page.url.host
        const metamaskAppDeepLink = `https://metamask.app.link/dapp/${dappUrl}?metmaskAuth=true`;
        window.open(metamaskAppDeepLink, "_self");
        processing = false;
        return;
      }

      // CHECK: MetaMask is present; EXIT;
      const if_M_1: boolean =
        !providerDetect('isMetaMask')?.[0]
      ;
			if (if_M_1)
      {

        // [🐞]
			  dlog
        (
          `${AU_W_TAG[0]} 🔴 Moralis Auth not found!`
        );

			  alert
        (
          'Please install the MetaMask Wallet Extension!'
        );

			  processing = false
			  return;
			}

			const moralisAuth: MoralisAuth = getMoralisAuth(app);

      // #region ❌ [V2] - Moralis Auth [TEST]
      // FIXME: Create WalletConnect Provider
			// FIXME: ❌ Not Working
      // FIXME: WalletConnectProvider error DOC: REF: [10]
			// const provider = new WalletConnectProvider({
			//   infuraId: "a523c408585b0f7c88a7df7a9d70dfe6",
			// });
			// await provider.enable();
			// const moralis_auth = await signInWithMoralis(moralisAuth, {
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

			const moralis_auth: SignInWithMoralisResponse = await signInWithMoralis(moralisAuth);

      // [🐞]
			dlog
      (
        `${AU_W_TAG[0]} 🟢 Moralis Auth`
      );

			successAuthComplete
      (
			  moralis_auth?.credentials?.user,
			  moralis_auth?.credentials?.user?.displayName,
			  auth_service
			);

		}
    catch (error)
    {
			errlog(`Moralis Auth error: ${error}`);
			processing = false;
		}
	}

  // TODO: DOC:
  async function checkMetaMaskDeepLink
  (
  ): Promise < void >
  {
    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟠 Checking for MetaMask DeepLink!`
    );

		const metmaskAuth: string =	$page.url.searchParams.get('metmaskAuth');
		const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`;

		if (metmaskAuth == 'true')
    {
      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 MetaMask OAuth2`
      );

			// ACTION: Clean up url from queries/auth-bloat;
			goto
      (
        revert_url,
        {
          replaceState: true
        }
      );

			moralis_auth();
		}
  }

  // TODO: DOC:
  async function moralis_auth
  (
  ): Promise < void >
  {

    const moralisAuth: MoralisAuth = getMoralisAuth(app);
    const moralis_auth: SignInWithMoralisResponse = await signInWithMoralis(moralisAuth);

    // [🐞]
    dlog
    (
      `${AU_W_TAG[0]} 🟢 Moralis Auth`
    );

    successAuthComplete
    (
      moralis_auth?.credentials?.user,
      moralis_auth?.credentials?.user?.displayName,
      auth_service
    );

  }

  /**
   * @summary
   * IMPORTANT
   * [MAIN]
   * @description
   * ➨ final auth stop, updating stores + localStoreage() + UI/UX;
   * @param
   * {User} firebase_user
   * @param
   * {string} web3_wallet_addr
   * @param
   * {Auth_Type} auth_provider_type
   * @returns
   * Promise < void >
  */
	async function successAuthComplete
  (
		firebase_user?: User,
		web3_wallet_addr?: string,
		auth_provider_type?: Auth_Type
  ): Promise < void >
  {

    // [🐞]
    dlogv2
    (
      AU_W_TAG[0],
      [
        `🟦 Executing successAuthComplete`,
        firebase_user,
        web3_wallet_addr,
        auth_provider_type
      ]
    );

    // ACTION: Create / retrieve target Betarena_User
    const
    [
      BETARENA_USER,
      EXISTS
    ] = await userFirestore
    (
      firebase_user?.uid,
      firebase_user,
      web3_wallet_addr,
      auth_provider_type
    );

		let user_obj: Scores_User =
    {
			firebase_user_data: firebase_user,
			scores_user_data: BETARENA_USER
		};

		// ACTION: Populate user data to firestore (DB)
    if (!EXISTS)
    {
      await createFirestoreUser(user_obj)
    }

    // ACTION: Update UI/UX;
		userBetarenaSettings.signInUser(user_obj);
		$sessionStore.auth_show = false;
		processing = false;
		email_input = undefined;
		success_auth = true;

		setTimeout
    (
      () =>
      {
        success_auth = false;
        auth_type = 'login';
		  },
      1500
    );

    return;
	}

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ get user info (firestore);
   * ➨ if exists - return target user.
   * ➨ else, create a new instance of user for Firestore.
   * @returns
   * {Promise<[Betarena_User, boolean]>} [Betarena_User, boolean]
  */
  async function userFirestore
  (
    uid: string,
    firebase_user: User,
    web3_wallet_addr: string,
    auth_provider_type: Auth_Type
  ): Promise< [ Betarena_User, boolean ]>
  {
    try
    {
      const docRef = doc
      (
        db_firestore,
        "betarena_users",
        uid
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists())
      {
        // [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            `🟢 Target UID exists`,
            `🟦 var: docSnap ${docSnap.data()}`
          ]
        );

        // return existing firestore user-instance;
        return [docSnap.data() as Betarena_User, true]
      }
      else
      {

        // [🐞]
        dlogv2
        (
          AU_W_TAG[0],
          [
            `🔴 Target UID does not exists`,
            `🔵 Creating new Betarena_User instance`
          ]
        );

        // create new user-instance;
        const scores_user_data: Betarena_User =
        {
          lang: $sessionStore?.serverLang,
          registration_type: [auth_provider_type],
          // NOTE: max. length - no separator - no random digits
          username: generateUsername('', 0, 10),
          // [ℹ] can be null (when using web3)
          register_date: firebase_user?.metadata?.creationTime,
           // [ℹ] can be null (when using web3)
          profile_photo: firebase_user?.photoURL,
          web3_wallet_addr: web3_wallet_addr || undefined
        }

        return [scores_user_data, false]
      }
    }
    catch (e)
    {
      errlog(`❌ Error adding document: ${e}`)
    }
  }

  /**
   * @summary
   * [MAIN]
   * [HELPER]
   * @description
   * ➨ stores target (NEW) user in firestore DB;
   * @returns
   * Promise<void>
  */
  async function createFirestoreUser
  (
    user: Scores_User
  ): Promise < void >
  {
    try
    {

      // [🐞]
      dlog
      (
        `${AU_W_TAG[0]} 🔵 Persisting New User ${user?.firebase_user_data?.uid} to Firestore`
      );

      await setDoc
      (
        doc
        (
          db_firestore,
          'betarena_users',
          user?.firebase_user_data?.uid
        ),
        JSON.parse(JSON.stringify(user.scores_user_data))
      );

    }
    catch (e)
    {
      errlog(`❌ Error adding document: ${e}`)
    }
  }

  // #endregion ➤ [METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

  /**
   * @description
   * ➨ listens to incoming auth. deep-links;
  */
	$: if (browser)
  {
    checkEmailDeepLink();
    checkDiscordDeepLink();
    checkMetaMaskDeepLink();
	}

  /**
   * @description
   * ➨ listens to changes in auth. show/hide modal;
  */
  $: if (!$sessionStore.auth_show)
  {
		auth_view = true;
		email_input = undefined;
		email_verify_process = false;
		email_sent_process = false;
		email_already_in_use = false;
		email_error_format = false;
	}

  // TODO: DOC:
  ////// CLOCKDOWN TIMER EMAIL CHECk

	$: if (sent_email_date != undefined) {
		dateObjDif =
			sent_email_date.getTime() -
			Date.parse(new Date().toString());
		setInterval(() => {
			dateObjDif =
				sent_email_date.getTime() -
				Date.parse(new Date().toString());
		}, 1000);
	}
	$: countD_sec = Math.floor(
		(dateObjDif / 1000) % 60
	).toString();
	$: if (parseInt(countD_sec) < 10) {
		countD_sec = '0' + countD_sec;
	}
	$: countD_min = Math.floor(
		(dateObjDif / 1000 / 60) % 60
	).toString();
	$: if (parseInt(countD_min) < 10) {
		countD_min = '0' + countD_min;
	}
	$: if (countD_sec.includes('-')) {
		// sent_email_date = undefined
		allow_resend = true;
	} else {
		allow_resend = false;
	}

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

	onMount
  (
    async () =>
    {
      [
        tabletExclusive,
        mobileExclusive
      ] = viewport_change
      (
        TABLET_VIEW,
        MOBILE_VIEW
      );
      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            tabletExclusive,
            mobileExclusive
          ] =
          viewport_change
          (
            TABLET_VIEW,
            MOBILE_VIEW
          );
        }
      );
	  }
  );

  onMount
  (
    async () =>
    {
      discord_icon = (await import('./assets/discord.svg')).default;
      email_verify = (await import('./assets/email-verify.svg')).default;
      error_icon = (await import('./assets/error-alert.svg')).default;
      github_dark_icon = (await import('./assets/github-dark.svg')).default;
      github_icon = (await import('./assets/github.svg')).default;
      google_icon = (await import('./assets/google.svg')).default;
      loader_animation = (await import('./assets/lodaer-anim-2.svg')).default;
      logo = (await import('./assets/logo-auth.svg')).default;
      logo_dark = (await import('./assets/logo-dark.svg')).default;
      metamask_icon = (await import('./assets/metamask.svg')).default;
      success_icon = (await import('./assets/success-alert.svg')).default;
    }
  );

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

{#await widget_init()}
	<!-- promise is pending -->
{:then WIDGET_LAZY_LOAD_DATA}

	<!--
  BACKGROUND BACKDROP FADE
  -->
	{#if $sessionStore?.auth_show}
		<div
			id="background-modal-blur"
			on:click={() =>	($sessionStore.auth_show = false)}
			in:fade
		/>
	{/if}

	<!--
  AUTH MESSAGE [SUCCESS]
  -->
	{#if success_auth}

		<div
			id="auth-alert-box"
			class="row-space-start"
			transition:fade
		>

			<img
				src={success_icon}
				alt="Success Icon"
				title="Success Icon"
			/>

			<p
        class="w-500">
				{#if auth_type == 'login'}
					{WIDGET_LAZY_LOAD_DATA?.success_msg?.[0]}
				{:else}
					{WIDGET_LAZY_LOAD_DATA?.success_msg?.[1]}
				{/if}
			</p>

		</div>

	{/if}

	<!--
  AUTH MESSAGE [ERROR]
  -->
	{#if error_auth}

		<div
			id="auth-alert-box"
			class="row-space-start"
			transition:fade
		>

			<img
				src={error_icon}
				alt="Error Icon"
				title="Error Icon"
			/>

			<p
        class="w-500"
      >
				{WIDGET_LAZY_LOAD_DATA?.err_msg[0]}
			</p>

		</div>

	{/if}

	<!--
  AUTH WIDGET
  -->
	{#if $sessionStore?.auth_show}

		<div
			id="widget-outer"
			class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
			in:fade
		>

			<!--
      PROCESSING STATE
      -->
			{#if processing}

				<div
          id="processing-auth-box"
        >
					<div
            id="inner-processing-box"
          >

						<img
							src={loader_animation}
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
      EMAIL VERIFICATION STATE
      -->
			{#if email_verify_process}

        <div
          id="email-auth-verify-box"
        >

					<!--
          CLOSE ICON
          -->
					<img
						id="close-vector"
						class="cursor-pointer"
						src="/assets/svg/close.svg"
						alt="close-svg"
						on:click={() => ($sessionStore.auth_show = false)}
					/>

					<!--
          VERIFY TEXT
          -->
					<p
						class=
            "
              w-500
              color-black-2
            "
						style="font-size: 20px;"
					>
						{WIDGET_LAZY_LOAD_DATA?.verification}
					</p>

					<!--
          VERIFY EMAIL
          -->
					<p
            class="color-grey"
          >
						{WIDGET_LAZY_LOAD_DATA?.verify_email}
					</p>

					<!--
          VERIFY EMAIL ICON
          -->
					<img
						id="email-verify-icon"
						src={email_verify}
						alt="Email Vector"
						title="Email Vector"
					/>

					<!--
          VERIFY EMAIL TEXT
          -->
					<p
            class="color-grey"
          >
						{WIDGET_LAZY_LOAD_DATA?.email_verify_sent?.[0]}
						<br />

						<span
              class="color-black-2"
            >
							{email_input}
						</span>

						<br />

						{WIDGET_LAZY_LOAD_DATA?.email_verify_sent?.[1]}
					</p>

					<!--
          VERIFY EMAIL BOX
          -->
					<p
						class=
            "
              color-primary
              cursor-pointer
            "
						style="margin-top: 8px;"
						on:click={() => window.open('mailto:')}
					>
						{WIDGET_LAZY_LOAD_DATA?.inbox}
					</p>

					<!--
          VEIRFY NO EMAIL
          -->
					<p
						class="color-grey"
						style="margin-top: 24px;"
					>
						{WIDGET_LAZY_LOAD_DATA?.no_email_verify?.[0]}
						<span
							class=
              "
                color-primary
                cursor-pointer
              "
							on:click={() => loginEmailLink()}
						>
							{WIDGET_LAZY_LOAD_DATA?.no_email_verify?.[1]}
						</span>
					</p>

				</div>

			{/if}

			<!--
      EMAIL SENT STATE
      -->
			{#if email_sent_process}

				<div
          id="email-auth-verify-box"
        >

					<!--
          CLOSE ICON LOGO
          -->
					<img
						id="close-vector"
						class="cursor-pointer"
						src="/assets/svg/close.svg"
						alt="close-svg"
						on:click={() =>	($sessionStore.auth_show = false)}
					/>

					<!--
          VERIFY TEXT
          -->
					<p
						class=
            "
              w-500
              color-black-2
            "
						style="font-size: 20px;"
					>
						Check your email
					</p>

					<!--
          VERIFY EMAIL
          -->
					<p
            class="color-grey"
          >
						Please follow the link in your email
					</p>

					<!--
          VERIFY EMAIL ICON
          -->
					<img
						id="email-verify-icon"
						src={email_verify}
						alt="Email Vector"
						title="Email Vector"
					/>

					<!--
          VERIFY EMAIL TEXT
          -->
					<p
            class="color-grey"
          >
						An email has been sent to

						<br />

						<span
              class="color-black-2"
            >
							{email_input}
						</span>

						<br />

						Please follow the link in your email to	login.
					</p>

					<!--
          VERIFY EMAIL INBOX
          -->
					<p
						class=
            "
              color-primary
              cursor-pointer
            "
						style="margin-top: 8px;"
						on:click={() => window.open('mailto:')}
					>
						Go to my inbox
					</p>

					<!--
          VERIFY EMAIL TEXT
          -->
					{#if allow_resend}

						<p
							class="color-grey"
							style="margin-top: 24px;"
						>
							Did not get the email?
							<span
								class=
                "
                  color-primary
                  cursor-pointer
                "
								on:click={() => loginEmailLink()}
							>
								Resend email
							</span>
						</p>

					{:else}

						<p
							class="color-grey"
							style="margin-top: 24px;"
						>
							{countD_min}:{countD_sec} to resend option
						</p>

					{/if}

				</div>

			{/if}

			<!--
      AUTHETICATION VIEW
      -->
			{#if auth_view}

				<!--
        CLOSE ICON
        -->
				<img
					id="close-vector"
					class="cursor-pointer"
					src="/assets/svg/close.svg"
					alt="close-svg"
					on:click={() => ($sessionStore.auth_show = false)}
				/>

				<!--
        AUTH LOGO BETARENA
        -->
				<img
					id="auth-logo"
					src={$userBetarenaSettings.theme == 'Dark' ? logo_dark : logo}
					alt="Betarena Logo"
					title="Betarena Logo"
					aria-label="Betarena Logo"
				/>

				<!--
        LOGIN/SIGN-UP TEXT
        -->
				<p
					id="auth-head"
					class=
          "
            color-black-2
            w-500
          "
				>
					{#if auth_type == 'login'}
						{WIDGET_LAZY_LOAD_DATA?.login}
					{:else}
						{WIDGET_LAZY_LOAD_DATA?.sign_up}
					{/if}
				</p>

				<!--
        LOGIN/SIGN-UP TEXT WITH EMAIL
        -->
				<p
					class=
          "
            color-grey
          "
				>
					{#if auth_type == 'login'}
						{WIDGET_LAZY_LOAD_DATA?.email_msg?.[0]}
					{:else}
						{WIDGET_LAZY_LOAD_DATA?.email_msg?.[1]}
					{/if}
				</p>

				<form
					on:submit|preventDefault={() => loginEmailLink()}
				>
					<!--
          [ℹ] input email
          class:error-email={email_error_format || email_already_in_use}
          -->

					<input
						id="email"
						type="email"
						placeholder="email@gmail.com"
						bind:value={email_input}
						on:invalid={() => wrongEmailFormatToggle()}
						autocomplete="off"
						class:error-email={email_error_format}
						required
					/>

					<!--
          ERROR EMAIL VALIDATION
          -->
					{#if email_error_format}
						<p
							class="color-error"
							style="margin-top: 10px;"
						>
							{WIDGET_LAZY_LOAD_DATA?.err_msg?.[1]}
						</p>
					{/if}

					<!--
          [ℹ] error email validation exists
          {#if email_already_in_use}
            <p
              class="color-error"
              style="margin-top: 10px;">
              Email already in use
            </p>
          {/if}
          -->

					<!--
          SUBMIT EMAIL BUTTON
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
							{WIDGET_LAZY_LOAD_DATA?.email_continue}
						</p>
					</button>

				</form>

				<!--
        AUTH LOGIN/SIGN-UP 0Auth2
        -->
				<div
					id="other-oauth-divider-box"
					class="row-space-out"
				>

					<div class="hr-box" />

					<p
						class=
            "
              color-grey
            "
					>
						{WIDGET_LAZY_LOAD_DATA?.or}
					</p>

					<div class="hr-box" />

				</div>

				<div
          id="oauth-box"
          class="row-space-out"
        >

					<!--
          GOOGLE
          -->
					<button
						class="btn-auth-opt"
						on:click={() => loginGoogle()}
					>
						<img
							src={google_icon}
							alt="Google Icon"
							title="Google Icon"
						/>
					</button>

					<!--
          DISCROD
          -->
					<button
						class="btn-auth-opt"
						on:click={() => loginDiscord()}
					>
						<img
							src={discord_icon}
							alt="Discord Icon"
							title="Discord Icon"
						/>
					</button>

					<!--
          GITHUB
          -->
					<button
						class="btn-auth-opt"
						on:click={() => loginGitHub()}
					>
						<img
							src={$userBetarenaSettings.theme ==	'Dark' ? github_dark_icon : github_icon}
							alt="Github Icon"
							title="Github Icon"
						/>
					</button>

				</div>

				<!--
        AUTH LOGIN/SIGN-UP WEB-3
        -->
				<div
					id="web3-divider-box"
					class="row-space-out"
				>

					<div class="hr-box" />

					<p
						class="
              color-grey
            "
					>
						{#if auth_type == 'login'}
							{WIDGET_LAZY_LOAD_DATA?.or_web3_login}
						{:else}
							{WIDGET_LAZY_LOAD_DATA?.or_web3_signup}
						{/if}
					</p>

					<div class="hr-box" />

				</div>

				<button
					id="metamask"
					class=
          "
            row-space-center
            btn-auth-opt
          "
					on:click={() => loginMetamask()}
				>
					<img
						src={metamask_icon}
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
        AUTH LOGIN/SIGN-UP TEXT-PROMPT ACCOUNT
        -->
				<p
					id="account-onboard-text"
					class=
          "
            color-grey
          "
				>

					{#if auth_type == 'login'}

						{WIDGET_LAZY_LOAD_DATA?.no_account}
						<span
							class=
              "
                color-primary
                cursor-pointer
              "
							on:click={() => (auth_type = 'register')}
						>
							{WIDGET_LAZY_LOAD_DATA?.register}
						</span>

					{:else}

						{WIDGET_LAZY_LOAD_DATA?.account_exists}
						<span
							class=
              "
                color-primary
                cursor-pointer
              "
							on:click={() => (auth_type = 'login')}
						>
							{WIDGET_LAZY_LOAD_DATA?.login}
						</span>

					{/if}

				</p>

			{/if}

		</div>

	{/if}

	<!-- promise was fulfilled -->
{:catch error}
	<!-- promise was rejected -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/*
  other styles
  */

	div#background-modal-blur
  {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#auth-alert-box
  {
		position: fixed;
		bottom: 20px;
		width: fit-content;
		z-index: 4000;
		left: 0;
		right: 0;
		margin: auto;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		padding: 14px 18px;
		border-radius: 6px;
	}
	div#auth-alert-box p
  {
		color: #ffffff;
		margin-left: 10px;
	}

	/*
  widget-outer-box
  */
	#widget-outer
  {
		/* position */
		position: fixed;
		z-index: 10000;
		margin: auto;
		width: fit-content;
		width: 92%;
		right: 0;
		left: 0;
		bottom: 0;
		top: 0;
		height: fit-content;
		/* style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		padding: 20px;
		text-align: -webkit-center;
		overflow: hidden;
	}

	/*
  widget processing loading style
  */
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
	}
	div#processing-auth-box	div#inner-processing-box
  {
		position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		top: 0;
		bottom: 0;
	}
	div#processing-auth-box	div#inner-processing-box img
  {
		width: 48px;
		height: 48px;
	}

	/*
  div#email-auth-verify-box
  {
	}
  */
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

	/*
  main email auth style box
  */
	input#email
  {
		/* white theme/white */
		background: #ffffff;
		/* white theme/gray */
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
	}
	input#email:hover
  {
		border: 1px solid #8c8c8c;
	}
	input#email:focus
  {
		border: 1px solid #4b4b4b;
	}
	input#email[placeholder]
  {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	input#email::placeholder
  {
		color: #cccccc;
	}
	input#email.error-email
  {
		border: 1px solid #ff3c3c !important;
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
	}
	button#email-btn p
  {
		color: #ffffff;
		font-size: 14px;
	}
	button#email-btn:hover
  {
		background: #f77c42;
	}

	/*
  alternative OAuth2 style box
  */
	div#other-oauth-divider-box
  {
		margin: 16px 0;
	}
	div#other-oauth-divider-box div.hr-box
  {
		height: 1px;
		width: 100%;
		background: #cccccc;
	}
	div#other-oauth-divider-box p
  {
		margin: 0 12px;
	}
	div#oauth-box button.btn-auth-opt
  {
		padding: 12px 32px;
		background: #ffffff;
		border: 1px solid #e6e6e6 !important;
		border-radius: 60px;
		margin-right: 12px;
	}
	div#oauth-box button.btn-auth-opt:hover
  {
		border: 1px solid #f5620f !important;
	}
	div#oauth-box button.btn-auth-opt:last-child
  {
		margin-right: unset;
	}

	/*
  alternative Web3 style box
  */
	div#web3-divider-box
  {
		margin: 16px 0;
	}
	div#web3-divider-box div.hr-box
  {
		height: 1px;
		width: 100%;
		background: #cccccc;
	}
	div#web3-divider-box p
  {
		margin: 0 12px;
		white-space: nowrap;
	}
	button#metamask.btn-auth-opt
  {
		padding: 12px 32px;
		background: #ffffff;
		border: 1px solid #e6e6e6 !important;
		border-radius: 60px;
		margin-right: 12px;
	}
	button#metamask.btn-auth-opt:hover
  {
		border: 1px solid #f5620f !important;
	}
	button#metamask p
  {
		margin-left: 12px;
		font-size: 14px;
	}

	/*
  switch login/sign-up options style text
  */
	p#account-onboard-text
  {
		margin-top: 16px;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 726px)
  and (max-width: 1160px)
  {
		/* empty */
	}

	@media only screen
  and (min-width: 726px)
  {
		#widget-outer
    {
			width: 340px;
		}
	}

	@media only screen
  and (min-width: 726px)
  and (max-width: 865px)
  {
		/* empty */
	}

	@media only screen
  and (min-width: 1160px)
  {
		#widget-outer
    {
			width: 328px;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div#widget-outer.dark-background-1
  {
		background: #4b4b4b;
	}

	div#widget-outer.dark-background-1 div#processing-auth-box
  {
		background: rgba(41, 41, 41, 0.8);
	}

	div#widget-outer.dark-background-1 input#email
  {
		background: #4b4b4b;
		border: 1px solid #737373;
	}
	div#widget-outer.dark-background-1 input#email
  {
		color: #ffffff;
	}
	div#widget-outer.dark-background-1 input#email::placeholder
  {
		color: #737373;
	}
	div#widget-outer.dark-background-1 input#email:hover
  {
		border: 1px solid #8c8c8c;
	}

	div#widget-outer.dark-background-1 div#other-oauth-divider-box div.hr-box,
	div#widget-outer.dark-background-1 div#web3-divider-box	div.hr-box
  {
		background: #737373;
	}

	div#widget-outer.dark-background-1 div#oauth-box button.btn-auth-opt,
	div#widget-outer.dark-background-1 button#metamask.btn-auth-opt
  {
		border: 1px solid #737373 !important;
		background: #4b4b4b;
	}

	div#widget-outer.dark-background-1 div#oauth-box button.btn-auth-opt:hover,
	div#widget-outer.dark-background-1 button#metamask.btn-auth-opt:hover
  {
		border: 1px solid #f5620f !important;
	}

</style>