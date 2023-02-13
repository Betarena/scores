<!-- ===============
COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { get } from '$lib/api/utils';
	import {
		app,
		auth,
		db_firestore
	} from '$lib/firebase/init';
	import { sessionStore } from '$lib/store/session';
	import {
		userBetarenaSettings,
		type Auth_Type,
		type Scores_User
	} from '$lib/store/user-settings';
	import {
		platfrom_lang_ssr,
		viewport_change
	} from '$lib/utils/platform-functions';
	import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
	import {
		fetchSignInMethodsForEmail,
		GithubAuthProvider,
		GoogleAuthProvider,
		isSignInWithEmailLink,
		sendSignInLinkToEmail,
		signInWithCustomToken,
		signInWithEmailLink,
		signInWithPopup,
		type User
	} from 'firebase/auth';
	import {
		doc,
		setDoc
	} from 'firebase/firestore';
	import { generateUsername } from 'unique-username-generator';
	// import { Web3Provider } from '@ethersproject/providers';
	// import WalletConnectProvider from "@walletconnect/web3-provider"; FIXME: not working, asked
	// import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
	// import { mainnet } from "@wagmi/core/chains";
	// import { EthereumProvider } from "@walletconnect/ethereum-provider";

	import type { REDIS_CACHE_SINGLE_auth_translation } from '$lib/models/_main_/auth/types';

	import { dlog, errlog } from '$lib/utils/debug';
	import discord_icon from './assets/discord.svg';
	import email_verify from './assets/email-verify.svg';
	import error_icon from './assets/error-alert.svg';
	import github_dark_icon from './assets/github-dark.svg';
	import github_icon from './assets/github.svg';
	import google_icon from './assets/google.svg';
	import loader_animation from './assets/lodaer-anim-2.svg';
	import logo from './assets/logo-auth.svg';
	import logo_dark from './assets/logo-dark.svg';
	import metamask_icon from './assets/metamask.svg';
	import success_icon from './assets/success-alert.svg';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	// NOTE: NO WIDGET SPECIFIC SEO or
	// NOTE: PRE-LOAD DATA REQUIRED

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

	$: actionCodeSettings.url = `${$page.url?.origin}${$page.url?.pathname}?auth_type=${auth_type}`;

	let actionCodeSettings = {
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

	// [🐞]
	let enable_logs: boolean = true;
	let dev_console_tag: string =
		'_main_ | authentication [DEV]';
	if (dev) email_input = 'migbashdev@gmail.com';

	// ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	let server_side_language = platfrom_lang_ssr(
		$page?.routeId,
		$page?.error,
		$page?.params?.lang
	);
	dlog(
		`server_side_language: ${server_side_language}`
	);

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// [ℹ] MAIN WIDGET METHOD
	async function widget_init(): Promise<REDIS_CACHE_SINGLE_auth_translation> {
		const response_auth: REDIS_CACHE_SINGLE_auth_translation =
			await get(
				`/api/hasura/_main_/auth?lang=${server_side_language}`
			);
		return response_auth;
	}

	async function login_with_google() {
		// DOC: https://firebase.google.com/docs/auth/web/google-signin
		// DOC: read (^) for access to more Google API access upon Auth
		try {
			processing = true;
			auth_service = 'google';
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider)
				.then((result) => {
					// [ℹ] user info
					const user = result?.user;
					success_auth_wrap(
						user,
						null,
						auth_service
					);
				})
				.catch((error) => {
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
				});
		} catch (error) {
			console.log(
				`❌ Google auth error: ${error}`
			);
			processing = false;
		}
	}

	async function login_with_github() {
		try {
			auth_service = 'discord';
			processing = true;
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider)
				.then((result) => {
					// [ℹ] this gives you a GitHub Access Token.
					// const credential = GithubAuthProvider.credentialFromResult(result);
					// const token = credential.accessToken;
					// [ℹ] user info
					const user = result.user;
					success_auth_wrap(
						user,
						null,
						auth_service
					);
				})
				.catch((error) => {
					processing = false;
					// [ℹ] handle errors
					const errorCode = error.code;
					const errorMessage = error.message;
					errlog(errorCode);
					errlog(errorMessage);
					// [ℹ] the email used
					const email = error.customData.email;
					// [ℹ] AuthCredential used
					const credential =
						GithubAuthProvider.credentialFromError(
							error
						);
					// [🐞]
					if (dev)
						console.log('credential', credential);
					if (dev) console.log('email', email);
					// TODO: error user-sign in
					// signInWithCredential(auth, credential)
					// .then(user => {
					//   // You can now link the pending credential from the first
					//   // error.
					//   linkWithCredential(error.credential)
					// })
					// .catch(error => log(error))
				});
		} catch (e) {
			console.log(e);
		}
	}

	async function login_with_email_link() {
		// DOC: https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
		try {
			email_error_format = false;
			processing = true;
			dlog(email_input);
			await fetchSignInMethodsForEmail(
				auth,
				email_input
			)
				.then((signInMethods) => {
					if (signInMethods.length) {
						// [ℹ] The email already exists in the Auth database. You can check the
						// [ℹ] sign-in methods associated with it by checking signInMethods array.
						// [ℹ] Show the option to sign in with that sign-in method.
						email_already_in_use = true;
					} else {
						// [ℹ] User does not exist. Ask user to sign up.
						email_already_in_use = false;
					}
				})
				.catch((error) => {
					// Some error occurred.
				});
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
			// [ℹ] cont. send email
			await sendSignInLinkToEmail(
				auth,
				email_input,
				actionCodeSettings
			)
				.then(() => {
					// [ℹ] The link was successfully sent - (custom) UI update
					processing = false;
					auth_view = false;
					if (email_already_in_use) {
						email_sent_process = true;
						sent_email_date = new Date();
						sent_email_date.setMinutes(
							sent_email_date.getMinutes() + 5
						); // [ℹ] add 5 min.
					} else {
						email_verify_process = true;
					}
					// [ℹ] store target email in localStroage() for retrival on same device
					window.localStorage.setItem(
						'emailForSignIn',
						email_input
					);
					// NOTE: listen for email deep link continued
				})
				.catch((error) => {
					// TODO: Error Authetication Handle
					const errorCode = error.code;
					const errorMessage = error.message;
				});
		} catch (e) {
			console.log(e);
		}
	}
	// [ℹ] DeepLink listener EmailLink Cont. [END]
	$: if (browser) {
		if (
			isSignInWithEmailLink(
				auth,
				window.location.href
			)
		) {
			auth_service = 'email';
			dlog('🔵 EmailLink OAuth2');
			// NOTE: apiKey, oobCode, mode, lang query param(s) passed in URL query params
			// NOTE: Additional state parameters can also be passed via URL.
			// NOTE: This can be used to continue the user's intended action before triggering
			// NOTE: the sign-in operation.
			// NOTE: Get the email if available. This should be available if the user completes
			// NOTE: the flow on the same device where they started it.
			let email = window.localStorage.getItem(
				'emailForSignIn'
			);
			dlog(email);
			if (!email) {
				// User opened the link on a different device. To prevent session fixation
				// attacks, ask the user to provide the associated email again. For example:
				email = window.prompt(
					'Please provide your email for confirmation'
				);
			}
			// [ℹ] Client SDK to parse the code from the link for you.
			signInWithEmailLink(
				auth,
				email,
				window.location.href
			)
				.then((result) => {
					auth_type = $page?.url?.searchParams
						?.get('auth_type')
						?.toString() as 'login' | 'register';
					const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`;
					dlog('🟢 EmailLink Auth');
					window.localStorage.removeItem(
						'emailForSignIn'
					);
					// NOTE: You can access the new user via result.user
					// NOTE: Additional user info profile not available via:
					// result.additionalUserInfo.profile == null
					// NOTE: You can check if the user is new or existing:
					// result.additionalUserInfo.isNewUser
					dlog(result?.user?.displayName);
					dlog(result?.user?.email);
					success_auth_wrap(
						result?.user,
						null,
						auth_service
					);
					goto(revert_url, {
						replaceState: true
					});
				})
				.catch((error) => {
					// Some error occurred, you can inspect the code: error.code
					// Common errors could be invalid email and invalid or expired OTPs.
					console.log(error);
				});
		}
	}

	async function login_with_discord() {
		// DOC: https://www.reddit.com/r/Firebase/comments/n4uv1o/sign_in_with_discord/
		// DOC: https://github.com/luizkc/firebase-discord-oauth2-example
		// DOC: https://stackoverflow.com/questions/70171124/discord-oauth2-with-firebase-functions
		// DOC: https://stackoverflow.com/questions/53992730/how-would-i-authorize-users-using-discord-oauth2-0-for-firebase-authentication-o
		try {
			processing = true;
			const callback_auth_url =
				$page?.url?.origin;
			dlog(callback_auth_url);
			const discord_outh_url = import.meta.env
				.VITE_DISCORD_OAUTH_URL;
			const final_url_nav = `${discord_outh_url}?redirect_url=${callback_auth_url}`;
			// [ℹ] initiate discord OAuth2
			goto(final_url_nav);
		} catch (error) {
			errlog(error);
			processing = false;
		}
	}
	// [ℹ] DeepLink listener Discord Cont. [END]
	$: if (browser) {
		dlog('🟠 Looking for Discord DeepLink!');
		const f_uid =
			$page.url.searchParams.get('f_uid');
		const oauth2 =
			$page.url.searchParams.get('oauth2');
		const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`;
		// [ℹ] validate user is attempting Discord OAuth2
		if (oauth2 == 'discord' && f_uid != null) {
			// [ℹ] success;
			dlog('🔵 Discord OAuth2');
			// [ℹ] clean up url from query
			goto(revert_url, { replaceState: true });
			// [ℹ] firebase sign-in
			signInWithCustomToken(auth, f_uid)
				.then((userCredential) => {
					// [ℹ] successful sign-in / login
					auth_service = 'discord';
					dlog('🟢 Success! Discord OAuth2');
					const user = userCredential?.user;
					success_auth_wrap(
						user,
						null,
						auth_service
					);
				})
				.catch((error) => {
					// TODO: complete authetication error handle
					const errorCode = error.code;
					const errorMessage = error.message;
					errlog(errorCode);
					errlog(errorMessage);
				});
		}
	}

	async function login_with_metamask() {
		// DOC: https://moralis.io/create-a-web3-firebase-login-with-metamask/
		// DOC: https://docs.moralis.io/authentication-api/integrations/firebase-nodejs
		// DOC: https://moralis.io/web3-firebase-authentication-create-a-web3-sign-in-with-moralis/
		// DOC: https://moralisweb3.github.io/firebase-extensions/service-account-converter/
		// DOC: OTHER => https://moralisweb3.github.io/Moralis-JS-SDK/demos/firebase-auth-ext/
		// DOC: https://admin.moralis.io/users
		// IMPORTANT: betarena-ios "usage" project-id
		try {
			processing = true;
			auth_service = 'wallet';
			// [ℹ] restrict only to MetaMask (original)
			// if (!provider('isMetaMask')[0]) {
			//   dlog("🔴 Moralis Auth not found!")
			//   alert('Please install the MetaMask Wallet Extension!')
			//   processing = false
			//   return
			// }

			// [ℹ] create Moralis instance
			const moralisAuth = getMoralisAuth(app);

			// [ℹ] V2 - Moralis Auth
			// const provider = await EthereumProvider.init({
			//   projectId: 'a523c408585b0f7c88a7df7a9d70dfe6', // REQUIRED your projectId
			//   chains: [mainnet.id], // REQUIRED chain ids
			// });
			// await provider.enable();
			// await signInWithMoralis(moralisAuth, {
			//   provider: new Web3Provider(provider)
			// });

			// FIXME: Create WalletConnect Provider
			// FIXME: Not Working - WalletConnectProvider error
			// const provider = new WalletConnectProvider({
			//   infuraId: "a523c408585b0f7c88a7df7a9d70dfe6",
			// });
			// await provider.enable();
			// await signInWithMoralis(moralisAuth, {
			//   provider: new Web3Provider(provider)
			// });

			// NOTE: default sign-in opt. is Metamask
			// const moralis_auth = await signInWithMoralis(moralisAuth);
			dlog('🟢 Moralis Auth');
			// success_auth_wrap(
			//   null,
			//   moralis_auth?.credentials?.user?.displayName,
			//   auth_service
			// )
		} catch (error) {
			errlog(`Moralis Auth error: ${error}`);
			processing = false;
		}
	}

	async function success_auth_wrap(
		firebase_user?: User,
		web3_wallet_addr?: string,
		auth_provider_type?: Auth_Type
	) {
		// NOTE: complete authetication
		let user_obj: Scores_User = {
			firebase_user_data: firebase_user,
			scores_user_data: {
				lang: server_side_language,
				registration_type: [],
				// NOTE: max. length - no separator - no random digits
				username: generateUsername('', 0, 10),
				register_date:
					firebase_user?.metadata?.creationTime,
				profile_photo: firebase_user?.photoURL,
				web3_wallet_addr:
					web3_wallet_addr || undefined
			}
		};
		if (web3_wallet_addr != undefined) {
			// user_obj = {
			//   // Google User TYPE
			//   phoneNumber: undefined,
			//   photoURL: undefined,
			//   providerId: undefined,
			//   uid: undefined,
			//   reload: undefined,
			//   toJSON: undefined,
			//   displayName: undefined,
			//   email: undefined,
			//   tenantId: undefined,
			//   delete: undefined,
			//   getIdToken: undefined,
			//   getIdTokenResult: undefined,
			//   refreshToken: undefined,
			//   providerData: undefined,
			//   metadata: undefined,
			//   isAnonymous: undefined,
			//   emailVerified: undefined,
			//   // Betarena User TYPE
			//   lang: undefined, // TODO:
			//   profile_photo: undefined, // TODO:
			//   register_date: undefined, // TODO:
			//   registration_type: [], // TODO:
			//   username: undefined,
			//   web3_wallet_addr: undefined
			// }
			// user_obj.web3_wallet_addr = web3_wallet_addr
		}
		// [ℹ] populate user data to firestore (DB)
		try {
			dlog(user_obj?.firebase_user_data.uid);
			dlog(typeof user_obj);
			await setDoc(
				doc(
					db_firestore,
					'betarena_users',
					user_obj?.firebase_user_data?.uid
				),
				JSON.parse(
					JSON.stringify(
						user_obj.scores_user_data
					)
				)
			);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
		// [ℹ] continue;
		userBetarenaSettings.signInUser(user_obj);
		// [ℹ] default UI/UX triggers
		$sessionStore.auth_show = false;
		processing = false;
		email_input = undefined;
		success_auth = true;
		setTimeout(() => {
			success_auth = false;
			auth_type = 'login';
		}, 1500);
	}

	function wrong_email_format() {
		email_error_format = true;
		error_auth = true;
		setTimeout(() => {
			error_auth = false;
		}, 1500);
	}

	$: if (!$sessionStore.auth_show) {
		auth_view = true;
		email_input = undefined;
		email_verify_process = false;
		email_sent_process = false;
		email_already_in_use = false;
		email_error_format = false;
	}

	// [🐞]
	// $: if (browser) {
	//   console.log(provider('isCoinbaseWallet'))
	// }

	/**
	 * Validates what Web3 wallet extension
	 * is being used for the platform
	 * @param walletType
	 */
	function providerDetect(
		walletType:
			| 'isMetaMask'
			| 'isCoinbaseWallet'
			| 'isBraveWallet'
	): [boolean, any] {
		// [ℹ] no ethereum wallet present
		if (!window.ethereum) {
			return [false, null];
			// throw new Error("No injected ethereum object.");
		}

		// [ℹ] default provider (single) assign
		let target_wallet = undefined;

		// [ℹ] multiple provider(s) check true
		if (
			Array.isArray(window.ethereum.providers)
		) {
			if (walletType == 'isMetaMask') {
				target_wallet =
					window.ethereum.providers.find(
						(provider) =>
							provider[walletType] &&
							provider?.isBraveWallet == undefined
					);
			}
			// [ℹ] alternative
			// else {
			//   target_wallet = window.ethereum.providers.find((provider) => provider[walletType])
			// }
			if (dev)
				console.log(
					`🔵 More than 1 provider identified!`,
					window.ethereum.providers.length
				);
			if (dev)
				console.log(
					'target_wallet',
					target_wallet
				);
			if (dev)
				console.log(
					'window.ethereum.providers',
					window.ethereum.providers
				);
		} else {
			if (
				walletType == 'isMetaMask' &&
				window.ethereum?.isBraveWallet ==
					undefined &&
				window.ethereum?.isMetaMask !=
					undefined &&
				window.ethereum?.isMetaMask
			) {
				target_wallet =
					window.ethereum[walletType];
			}
			// [ℹ] alternative
			// else {
			//   target_wallet = window.ethereum[walletType]
			// }
			if (dev)
				console.log(
					`🔵 1 provider identified!`,
					window.ethereum
				);
			if (dev)
				console.log(
					'target_wallet',
					target_wallet
				);
			if (dev)
				console.log(
					'window.ethereum',
					window.ethereum
				);
		}

		// [ℹ] TARGET (THIS) single provider check true
		if (target_wallet != undefined) {
			if (dev)
				console.log(
					`🟢 ${walletType} identified`
				);
			// DOC: https://stackoverflow.com/questions/69377437/metamask-conflicting-with-coinbase-wallet
			// DOC: https://stackoverflow.com/questions/72613011/whenever-i-click-on-connect-metamask-button-why-it-connects-the-coinbase-wallet
			// DOC: https://stackoverflow.com/questions/68023651/how-to-connect-to-either-metamask-or-coinbase-wallet
			// DOC: https://github.com/MetaMask/metamask-extension/issues/13622
			// NOTE: conflicting use of CoinBaseWallet & MetaMask
			// NOTE: setting MetaMask as main wallet
			// NOTE: IMPORTANT causes issues with FireFox
			// target_wallet.request({ method: 'eth_requestAccounts' });
			// NOTE: Not working
			// window.ethereum.setSelectedProvider(target_wallet);
			// window.ethereum.request({
			//   method: 'wallet_requestPermissions',
			//   params: [{ eth_accounts: {}}]
			// });
			return [true, target_wallet];
		} else {
			console.log(
				`🔴 no target wallet (${walletType}) identified`
			);
			return [false, null];
		}
	}

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

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 725;
	let mobileExclusive,
		tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});
</script>

<!-- ===============
COMPONENT HTML 
=================-->

{#await widget_init()}
	<!-- promise is pending -->
{:then WIDGET_LAZY_LOAD_DATA}
	<!-- 
  [ℹ] background backdrop fade
  -->
	{#if $sessionStore.auth_show}
		<div
			id="background-modal-blur"
			on:click={() =>
				($sessionStore.auth_show = false)}
			in:fade
		/>
	{/if}

	<!-- 
  [ℹ] auth message show box [success]
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
			<p class="w-500">
				{#if auth_type == 'login'}
					{WIDGET_LAZY_LOAD_DATA?.success_msg[0]}
				{:else}
					{WIDGET_LAZY_LOAD_DATA?.success_msg[1]}
				{/if}
			</p>
		</div>
	{/if}

	<!-- 
  [ℹ] auth message show box [error]
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
			<p class="w-500">
				{WIDGET_LAZY_LOAD_DATA?.err_msg[0]}
			</p>
		</div>
	{/if}

	<!-- 
  [ℹ] main auth widget component
  -->
	{#if $sessionStore.auth_show}
		<div
			id="widget-outer"
			class:dark-background-1={$userBetarenaSettings.theme ==
				'Dark'}
			in:fade
		>
			<!-- 
      [ℹ] processing view box
      [ℹ] HIDDEN by DEFAULT
      -->
			{#if processing}
				<div id="processing-auth-box">
					<div id="inner-processing-box">
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
      [ℹ] email verification view box
      [ℹ] HIDDEN by DEFAULT
      -->
			{#if email_verify_process}
				<div id="email-auth-verify-box">
					<!-- 
          [ℹ] close icon logo
          -->
					<img
						id="close-vector"
						class="cursor-pointer"
						src="/assets/svg/close.svg"
						alt="close-svg"
						on:click={() =>
							($sessionStore.auth_show = false)}
					/>

					<!-- 
          [ℹ] verify text
          -->
					<p
						class="
              w-500
              color-black-2
            "
						style="font-size: 20px;"
					>
						{WIDGET_LAZY_LOAD_DATA?.verification}
					</p>
					<!-- 
          [ℹ] verify email
          -->
					<p class="color-grey">
						{WIDGET_LAZY_LOAD_DATA?.verify_email}
					</p>
					<!-- 
          [ℹ] verify email icon
          -->
					<img
						id="email-verify-icon"
						src={email_verify}
						alt="Email Vector"
						title="Email Vector"
					/>
					<!-- 
          [ℹ] verify email text
          -->
					<p class="color-grey">
						{WIDGET_LAZY_LOAD_DATA
							?.email_verify_sent[0]}
						<br />
						<span class="color-black-2">
							{email_input}
						</span>
						<br />
						{WIDGET_LAZY_LOAD_DATA
							?.email_verify_sent[1]}
					</p>
					<!-- 
          [ℹ] verify email to my inbox
          -->
					<p
						class="
              color-primary
              cursor-pointer
            "
						style="margin-top: 8px;"
						on:click={() =>
							window.open('mailto:')}
					>
						{WIDGET_LAZY_LOAD_DATA?.inbox}
					</p>
					<!-- 
          [ℹ] verify no email text
          -->
					<p
						class="color-grey"
						style="margin-top: 24px;"
					>
						{WIDGET_LAZY_LOAD_DATA
							?.no_email_verify[0]}
						<span
							class="
                color-primary
                cursor-pointer
              "
							on:click={() =>
								login_with_email_link()}
						>
							{WIDGET_LAZY_LOAD_DATA
								?.no_email_verify[1]}
						</span>
					</p>
				</div>
			{/if}

			<!-- 
      [ℹ] email sent view box
      [ℹ] HIDDEN by DEFAULT
      -->
			{#if email_sent_process}
				<div id="email-auth-verify-box">
					<!-- 
          [ℹ] close icon logo
          -->
					<img
						id="close-vector"
						class="cursor-pointer"
						src="/assets/svg/close.svg"
						alt="close-svg"
						on:click={() =>
							($sessionStore.auth_show = false)}
					/>

					<!-- 
          [ℹ] verify text
          -->
					<p
						class="
              w-500
              color-black-2
            "
						style="font-size: 20px;"
					>
						Check your email
					</p>
					<!-- 
          [ℹ] verify email
          -->
					<p class="color-grey">
						Please follow the link in your email
					</p>
					<!-- 
          [ℹ] verify email icon
          -->
					<img
						id="email-verify-icon"
						src={email_verify}
						alt="Email Vector"
						title="Email Vector"
					/>
					<!-- 
          [ℹ] verify email text
          -->
					<p class="color-grey">
						An email has been sent to
						<br />
						<span class="color-black-2">
							{email_input}
						</span>
						<br />
						Please follow the link in your email to
						login.
					</p>
					<!-- 
          [ℹ] verify email to my inbox
          -->
					<p
						class="
              color-primary
              cursor-pointer
            "
						style="margin-top: 8px;"
						on:click={() =>
							window.open('mailto:')}
					>
						Go to my inbox
					</p>
					<!-- 
          [ℹ] verify no email text
          -->
					{#if allow_resend}
						<p
							class="color-grey"
							style="margin-top: 24px;"
						>
							Did not get the email?
							<span
								class="
                  color-primary
                  cursor-pointer
                "
								on:click={() =>
									login_with_email_link()}
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
      [ℹ] authetication view
      [ℹ] SHOWN by DEFAULT
      -->
			{#if auth_view}
				<!-- 
        [ℹ] close icon logo
        -->
				<img
					id="close-vector"
					class="cursor-pointer"
					src="/assets/svg/close.svg"
					alt="close-svg"
					on:click={() =>
						($sessionStore.auth_show = false)}
				/>

				<!-- 
        [ℹ] auth logo betarena
        -->
				<img
					id="auth-logo"
					src={$userBetarenaSettings.theme ==
					'Dark'
						? logo_dark
						: logo}
					alt="Betarena Logo"
					title="Betarena Logo"
					aria-label="Betarena Logo"
				/>

				<!-- 
        [ℹ] auth login/sign-up text
        -->
				<p
					id="auth-head"
					class="
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
        [ℹ] auth login/sign-up w/email-opt
        -->
				<p
					class="
            color-grey
          "
				>
					{#if auth_type == 'login'}
						{WIDGET_LAZY_LOAD_DATA?.email_msg[0]}
					{:else}
						{WIDGET_LAZY_LOAD_DATA?.email_msg[1]}
					{/if}
				</p>
				<form
					on:submit|preventDefault={() =>
						login_with_email_link()}
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
						on:invalid={() =>
							wrong_email_format()}
						autocomplete="off"
						class:error-email={email_error_format}
						required
					/>
					<!-- 
          [ℹ] error email validation format
          -->
					{#if email_error_format}
						<p
							class="color-error"
							style="margin-top: 10px;"
						>
							{WIDGET_LAZY_LOAD_DATA?.err_msg[1]}
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
          [ℹ] submit email button
          -->
					<button
						id="email-btn"
						class="
              btn-primary 
            "
						type="submit"
					>
						<p
							class="
                w-500
              "
						>
							{WIDGET_LAZY_LOAD_DATA?.email_continue}
						</p>
					</button>
				</form>

				<!-- 
        [ℹ] auth login/sign-up w/alt. OAuth2 options
        -->
				<div
					id="other-oauth-divider-box"
					class="row-space-out"
				>
					<div class="hr-box" />
					<p
						class="
              color-grey
            "
					>
						{WIDGET_LAZY_LOAD_DATA?.or}
					</p>
					<div class="hr-box" />
				</div>
				<div id="oauth-box" class="row-space-out">
					<!-- 
          [ℹ] GOOGLE 
          -->
					<button
						class="btn-auth-opt"
						on:click={() => login_with_google()}
					>
						<img
							src={google_icon}
							alt="Google Icon"
							title="Google Icon"
						/>
					</button>
					<!-- 
          [ℹ] DISCROD 
          -->
					<button
						class="btn-auth-opt"
						on:click={() => login_with_discord()}
					>
						<img
							src={discord_icon}
							alt="Discord Icon"
							title="Discord Icon"
						/>
					</button>
					<!-- 
          [ℹ] GITHUB 
          -->
					<button
						class="btn-auth-opt"
						on:click={() => login_with_github()}
					>
						<img
							src={$userBetarenaSettings.theme ==
							'Dark'
								? github_dark_icon
								: github_icon}
							alt="Github Icon"
							title="Github Icon"
						/>
					</button>
				</div>

				<!-- 
        [ℹ] auth login/sign-up w/alt. Web3
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
					class="
            row-space-center
            btn-auth-opt
          "
					on:click={() => login_with_metamask()}
				>
					<img
						src={metamask_icon}
						alt="Metamask Icon"
						title="Metamask Icon"
					/>
					<p
						class="
              w-500
              color-black-2
            "
					>
						MetaMask
					</p>
				</button>

				<!-- 
        [ℹ] auth login/sign-up w/alt. text prompt for account
        -->
				<p
					id="account-onboard-text"
					class="
            color-grey
          "
				>
					{#if auth_type == 'login'}
						{WIDGET_LAZY_LOAD_DATA?.no_account}
						<span
							class="
                color-primary
                cursor-pointer
              "
							on:click={() =>
								(auth_type = 'register')}
						>
							{WIDGET_LAZY_LOAD_DATA?.register}
						</span>
					{:else}
						{WIDGET_LAZY_LOAD_DATA?.account_exists}
						<span
							class="
                color-primary
                cursor-pointer
              "
							on:click={() =>
								(auth_type = 'login')}
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
=================-->
<style>
	/* 
  [ℹ] OTHER STYLE / CSS 
  */

	div#background-modal-blur {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 4000;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	div#auth-alert-box {
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
	div#auth-alert-box p {
		color: #ffffff;
		margin-left: 10px;
	}

	/* [ℹ] SEO WIDGET DATA */

	/* [ℹ] NO DATA WIDGET STYLE / CSS */

	/*
  [ℹ] WIDGET MAIN STYLE / CSS 
  [ℹ] NOTE: [MOBILE-FIRST]
  [ℹ] NOTE: Media Queires Followed
  */

	/* 
  widget-outer-box 
  */
	#widget-outer {
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
	div#processing-auth-box {
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
	div#processing-auth-box
		div#inner-processing-box {
		position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		top: 0;
		bottom: 0;
	}
	div#processing-auth-box
		div#inner-processing-box
		img {
		width: 48px;
		height: 48px;
	}

	div#email-auth-verify-box {
	}
	div#email-auth-verify-box
		img#email-verify-icon {
		margin: 30px 0;
	}

	img#auth-logo {
		margin-bottom: 12px;
	}

	img#close-vector {
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 400000002;
	}

	p#auth-head {
		font-size: 20px;
		margin-bottom: 5px;
	}

	/* 
  main email auth style box
  */
	input#email {
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
	input#email:hover {
		border: 1px solid #8c8c8c;
	}
	input#email:focus {
		border: 1px solid #4b4b4b;
	}
	input#email[placeholder] {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	input#email::placeholder {
		color: #cccccc;
	}
	input#email.error-email {
		border: 1px solid #ff3c3c !important;
	}
	button#email-btn {
		height: 40px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		padding: 10px 24px;
		margin-top: 12px;
	}
	button#email-btn p {
		color: #ffffff;
		font-size: 14px;
	}
	button#email-btn:hover {
		background: #f77c42;
	}

	/* 
  alternative OAuth2 style box
  */
	div#other-oauth-divider-box {
		margin: 16px 0;
	}
	div#other-oauth-divider-box div.hr-box {
		height: 1px;
		width: 100%;
		background: #cccccc;
	}
	div#other-oauth-divider-box p {
		margin: 0 12px;
	}
	div#oauth-box button.btn-auth-opt {
		padding: 12px 32px;
		background: #ffffff;
		border: 1px solid #e6e6e6 !important;
		border-radius: 60px;
		margin-right: 12px;
	}
	div#oauth-box button.btn-auth-opt:hover {
		border: 1px solid #f5620f !important;
	}
	div#oauth-box button.btn-auth-opt:last-child {
		margin-right: unset;
	}

	/* 
  alternative Web3 style box
  */
	div#web3-divider-box {
		margin: 16px 0;
	}
	div#web3-divider-box div.hr-box {
		height: 1px;
		width: 100%;
		background: #cccccc;
	}
	div#web3-divider-box p {
		margin: 0 12px;
		white-space: nowrap;
	}
	button#metamask.btn-auth-opt {
		padding: 12px 32px;
		background: #ffffff;
		border: 1px solid #e6e6e6 !important;
		border-radius: 60px;
		margin-right: 12px;
	}
	button#metamask.btn-auth-opt:hover {
		border: 1px solid #f5620f !important;
	}
	button#metamask p {
		margin-left: 12px;
		font-size: 14px;
	}

	/* 
  switch login/sign-up options style text
  */
	p#account-onboard-text {
		margin-top: 16px;
	}

	/* ====================
    [MAIN] RESPONSIVNESS 
    [TABLET] [DESKTOP]
  ==================== */

	/* 
  NOTE: TABLET [EXCLUSIVE] RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1160px) {
		/* empty */
	}

	/* 
  NOTE: TABLET && DESKTOP [SHARED] RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) {
		#widget-outer {
			width: 340px;
		}
	}

	@media only screen and (min-width: 726px) and (max-width: 865px) {
		/* empty */
	}

	/* 
  NOTE: DESKTOP [M-L] RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1160px) {
		#widget-outer {
			width: 328px;
		}
	}

	/* ====================
    [MAIN] WIDGET DARK THEME
  ==================== */

	div#widget-outer.dark-background-1 {
		background: #4b4b4b;
	}

	div#widget-outer.dark-background-1
		div#processing-auth-box {
		background: rgba(41, 41, 41, 0.8);
	}

	div#widget-outer.dark-background-1 input#email {
		background: #4b4b4b;
		border: 1px solid #737373;
	}
	div#widget-outer.dark-background-1 input#email {
		color: #ffffff;
	}
	div#widget-outer.dark-background-1
		input#email::placeholder {
		color: #737373;
	}
	div#widget-outer.dark-background-1
		input#email:hover {
		border: 1px solid #8c8c8c;
	}

	div#widget-outer.dark-background-1
		div#other-oauth-divider-box
		div.hr-box,
	div#widget-outer.dark-background-1
		div#web3-divider-box
		div.hr-box {
		background: #737373;
	}

	div#widget-outer.dark-background-1
		div#oauth-box
		button.btn-auth-opt,
	div#widget-outer.dark-background-1
		button#metamask.btn-auth-opt {
		border: 1px solid #737373 !important;
		background: #4b4b4b;
	}

	div#widget-outer.dark-background-1
		div#oauth-box
		button.btn-auth-opt:hover,
	div#widget-outer.dark-background-1
		button#metamask.btn-auth-opt:hover {
		border: 1px solid #f5620f !important;
	}
</style>
