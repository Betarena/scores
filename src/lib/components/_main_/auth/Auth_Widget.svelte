<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { page } from '$app/stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { app_m, auth } from '$lib/firebase/init';
  import { sessionStore } from '$lib/store/session';
  import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
  import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
  import { GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup } from "firebase/auth";

  import { browser, dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import apple_icon from './assets/apple.svg';
  import discord_icon from './assets/discord.svg';
  import email_verify from './assets/email-verify.svg';
  import google_icon from './assets/google.svg';
  import loader_animation from './assets/lodaer-anim-2.svg';
  import logo from './assets/logo-auth.svg';
  import metamask_icon from './assets/metamask.svg';
  import success_icon from './assets/success-alert.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

	const dispatch = createEventDispatcher();

  // NOTE: NO WIDGET SPECIFIC SEO or PRE-LOAD DATA REQUIRED

  let email_input: string = 'migbashdev@gmail.com'
  let processing: boolean = false;
  let email_verify_process: boolean = false;
  let auth_view: boolean = true;
  let auth_type: 'login' | 'register';
  let web3_wallet_address: string;

  const actionCodeSettings = {
    // [ℹ] URL / DOMAIN you want to redirect back to.
    // [ℹ] URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:3050',
    handleCodeInApp: true, // [ℹ] This must be set true
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
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "_main_ | authentication [DEV]";

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function close_widget() {
		dispatch('close_widget');
	}

  async function login_with_google () {
    // NOTE: https://firebase.google.com/docs/auth/web/google-signin
    try {
      processing = true
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      .then((result) => {
        // NOTE: This gives you a Google Access Token. 
        // NOTE: You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // if (dev) console.log('token', token)
        // NOTE: The signed-in user info.
        const user = result.user;
        if (dev) console.log('user', user)
        if (dev) console.log('user', user?.displayName)
        // TODO: Success Authetication Handle
        $sessionStore.user = true
        processing = false
      })
      .catch((error) => {
        // NOTE: Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email; // The email of the user's account used.
        // NOTE: The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        if (dev) console.log('errorCode', errorCode)
        if (dev) console.log('errorMessage', errorMessage)
        // TODO: Error Authetication Handle
        processing = false
      });
    } catch (error) {
      processing = false
      console.log(`❌ Google auth error: ${error}`)
    }
  }

  async function login_with_email_link () {
    // NOTE: https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
    try {
      if (dev) console.log('email_input', email_input)
      await sendSignInLinkToEmail(auth, email_input, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email_input);
        // TODO: Success Authetication Handle
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // TODO: Error Authetication Handle
      });
    } catch (e) {
      console.log(e);
    }
  }

  // NOTE: Confirm the link is a sign-in with email link.
  $: if (browser) {
    if (dev) console.log("HERE! testing for Link Email!")
    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (dev) console.log("HERE! isSignInWithEmailLink()!")
      // NOTE: apiKey, oobCode, mode, lang query param(s) passed in URL
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (dev) console.log('email', email)
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // NOTE: Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // NOTE: You can access the new user via result.user
        // NOTE: Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // NOTE: You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
        if (dev) console.log('displayName', result?.user?.displayName)
        if (dev) console.log('email', result?.user?.email)
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        console.log(error);
      });
    }
  }

  // TODO: Awaiting Enabling of APPLE SERVICE
  // NOTE: Discontinued - for GitHub
  async function login_with_apple () {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } catch (e) {
      console.log(e);
    }
  }

  // NOTE:
  // TODO: Login With Discord
  // NOTE: https://www.reddit.com/r/Firebase/comments/n4uv1o/sign_in_with_discord/
  // NOTE: https://github.com/luizkc/firebase-discord-oauth2-example
  // NOTE: https://stackoverflow.com/questions/70171124/discord-oauth2-with-firebase-functions
  // NOTE: https://stackoverflow.com/questions/53992730/how-would-i-authorize-users-using-discord-oauth2-0-for-firebase-authentication-o
  async function login_with_discord () {
    try {
      const callback_auth_url = $page?.url?.origin
      console.log('callback_auth_url', callback_auth_url)
      const discord_outh_url = import.meta.env.VITE_DISCORD_OAUTH_URL
      const final_url_nav = `${discord_outh_url}?redirect_url=${callback_auth_url}`
      goto(final_url_nav)
    } catch (e) {
      console.log(e);
    }
  }

  async function login_with_metamask () {
    // NOTE: https://moralis.io/create-a-web3-firebase-login-with-metamask/
    // NOTE: https://docs.moralis.io/authentication-api/integrations/firebase-nodejs
    // NOTE: https://moralis.io/web3-firebase-authentication-create-a-web3-sign-in-with-moralis/
    // NOTE: https://moralisweb3.github.io/firebase-extensions/service-account-converter/
    // NOTE: OTHER => https://moralisweb3.github.io/Moralis-JS-SDK/demos/firebase-auth-ext/
    // IMPORTANT: betarena-ios "usage" project-id
    processing = true
    // [ℹ] create Moralis instance
    const moralisAuth = getMoralisAuth(app_m);
    try {
      // NOTE: default sign-in is Metamask
      const moralis_auth = await signInWithMoralis(moralisAuth);
      web3_wallet_address = moralis_auth?.credentials?.user?.displayName
      $sessionStore.web3_wallet_addr = moralis_auth?.credentials?.user?.displayName
      $sessionStore.user = true
      processing = false;
    } catch (error) {
      console.error(`❌ Moralis auth error: ${error}`)
      processing = false;
    }
  }
  
  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1160;
  let mobileView = 725;
  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			if (w <= mobileView) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE LANG SVELTE
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

  let server_side_language: string = 'en';
  $: if ($page.routeId != null
    && !$page.error
  ) {
    if ($page.routeId.includes("[lang=lang]")) {
		  server_side_language = $page.params.lang;
    }
    else {
      server_side_language = 'en';
    }
	  }
  else {
    server_side_language = 'en';
  }

</script>

<!-- ===============
COMPONENT HTML 
=================-->

<!-- 
[ℹ] background backdrop fade
-->
<div
  id='background-modal-blur'
  in:fade 
/>

<!-- 
[ℹ] auth message show box
-->
<div
  id="auth-alert-box"
  class="row-space-start"
  transition:fade>
  <img 
    src={success_icon}
    alt="Success Icon"
    title="Success Icon"
  />
  Success! User logged in
</div>

<!-- 
[ℹ] main auth widget component
-->
<div
  id='widget-outer'>

  <!-- 
  [ℹ] processing view box
  [ℹ] HIDDEN by DEFAULT
  -->
  {#if processing}
    <div
      id="processing-auth-box">
      <div
        id="inner-processing-box">
        <img 
          src={loader_animation}
          alt="Loader Vector"
          title="Processing..."
        />
        <p
          class="
            color-grey
          ">
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
    <div
      id="">
      <p>Verification</p>
      <p>Please verify your email</p>
      <img 
        src={email_verify}
        alt="Email Vector"
        title="Email Vector"
      />
      <p>An email has been sent to youremail@gmail.com. Please verify your email to continue.</p>
      <p>Go to my inbox</p>
      <p>Did not get the email? Resend email</p>
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
      id='close-vector'
      class='cursor-pointer'
      src="/assets/svg/close.svg" 
      alt="close-svg"
      on:click={() => close_widget()}
    />

    <!-- 
    [ℹ] auth logo betarena
    -->
    <img 
      src={logo}
      alt="Betarena Logo"
      title="Betarena Logo"
      aria-label="Betarena Logo"
    />

    <!-- 
    [ℹ] auth login/sign-up text
    -->
    <p
      class="
        color-black-2
      ">
      {#if auth_type == 'login'}
        Login
      {:else}
        Sign Up
      {/if}
    </p>

    <!-- 
    [ℹ] auth login/sign-up w/email-opt
    -->
    <p
      class="
        color-grey
      ">
      {#if auth_type == 'login'}
        Enter your email address to login
      {:else}
        Enter your email address to sign up
      {/if}
    </p>
    <input
      type="text"
      placeholder="email@gmail.com"
      bind:value={email_input}
      id='email'
      autocomplete="off"
    />
    <button
      id="email-btn"
      class="
        btn-primary 
      "
      on:click={() => login_with_email_link()}>
      Continue with email
    </button>

    <!-- 
    [ℹ] auth login/sign-up w/alt. OAuth2 options
    -->
    <div
      id="other-oauth-divider-box"
      class="row-space-out">
      <div class="hr-box"/>
      <p
        class="
          color-grey
        ">
        Or
      </p>
      <div class="hr-box"/>
    </div>
    <div
      id="oauth-box"
      class="row-space-out">
      <!-- 
      [ℹ] GOOGLE 
      -->
      <button
        class="btn-auth-opt"
        on:click={() => login_with_google()}>
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
        on:click={() => login_with_discord()}>
        <img 
          src={discord_icon}
          alt="Discord Icon"
          title="Discord Icon"
        />
      </button>
      <!-- 
      [ℹ] APPLE 
      -->
      <button
        class="btn-auth-opt">
        <img 
          src={apple_icon}
          alt="Apple Icon"
          title="Apple Icon"
        />
      </button>
    </div>

    <!-- 
    [ℹ] auth login/sign-up w/alt. Web3
    -->
    <div
      id="web3-divider-box"
      class="row-space-out">
      <div class="hr-box"/>
      <p
        class="
          color-grey
        ">
        {#if auth_type == 'login'}
          Or login with your crypto wallet
        {:else}
          Or sign up with your crypto wallet
        {/if}
      </p>
      <div class="hr-box"/>
    </div>
    <button
      id="metamask"
      class="
        row-space-center
        btn-auth-opt
      "
      on:click={() => login_with_metamask()}>
      <img 
        src={metamask_icon}
        alt="Metamask Icon"
        title="Metamask Icon"
      />
      <p>
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
      ">
      {#if auth_type == 'login'}
        Do not have an account?
        <span
          class="
            color-primary
          "
          on:click={() => auth_type = 'register'}>
          Register
        </span> 
      {:else}
        Already have an account? 
        <span
          class="
            color-primary
          "
          on:click={() => auth_type = 'login'}>
          Login
        </span> 
      {/if}
    </p>
  {/if}

</div>

<!-- ===============
COMPONENT STYLE
=================-->

<style>
  /* [ℹ] OTHER STYLE / CSS */

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
    padding: 14px 18px;
    border-radius: 6px;
  }

  /* [ℹ] SEO WIDGET DATA */
  
  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] NOTE: [MOBILE-FIRST]
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
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: rgba(255, 255, 255, 0.8);
  } div#processing-auth-box div#inner-processing-box {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    top: 0;
    bottom: 0;
  } div#processing-auth-box div#inner-processing-box img {
    width: 48px;
    height: 48px;
  }

  img#close-vector {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 400000002;
  }

  /* 
  main email auth style box
  */
  input#email {
    /* white theme/white */
    background: #FFFFFF;
    /* white theme/gray */
    border: 1px solid #CCCCCC;;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 12px;
    width: -webkit-fill-available;
    height: 44px;
    outline: none;
    font-size: 14px;
    margin-top: 12px;
  } input#email:hover {
    border: 1px solid #8C8C8C;
  } input#email:focus {
    border: 1px solid #4B4B4B;
  } input#email[placeholder] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button#email-btn {
    height: 40px;
    width: 100%;
    background-color: #f5620f;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 8px;
    padding: 10px 24px;
    margin-top: 12px;
  }
  
  /* 
  alternative OAuth2 style box
  */
  div#other-oauth-divider-box {
    margin: 16px 0;
  } div#other-oauth-divider-box div.hr-box {
    height: 1px;
    width: 100%;
    background: #CCCCCC;
  } div#other-oauth-divider-box p {
    margin: 0 12px;
  }
  div#oauth-box button.btn-auth-opt {
    padding: 12px 32px;
    background: #FFFFFF;
    border: 1px solid #E6E6E6 !important;
    border-radius: 60px;
    margin-right: 12px;
  } div#oauth-box button.btn-auth-opt:last-child {
    margin-right: unset;
  }

  /* 
  alternative Web3 style box
  */
  div#web3-divider-box {
    margin: 16px 0;
  } div#web3-divider-box div.hr-box {
    height: 1px;
    width: 100%;
    background: #CCCCCC;
  } div#web3-divider-box p {
    margin: 0 12px;
    white-space: nowrap;
  }
  button#metamask.btn-auth-opt {
    padding: 12px 32px;
    background: #FFFFFF;
    border: 1px solid #E6E6E6 !important;
    border-radius: 60px;
    margin-right: 12px;
  } button#metamask p {
    margin-left: 12px;
  }

  /* 
  switch login/sign-up options style text
  */
  p#account-onboard-text {
    margin-top: 16px;
  }

  /* ====================
    [MAIN] RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  NOTE: TABLET [EXCLUSIVE] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1160px)  {

  }

  /* 
  NOTE: TABLET && DESKTOP [SHARED] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
  }

  @media only screen and (min-width: 726px) and (max-width: 865px) {
  }

  /* 
  NOTE: DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {
  }

  /* ====================
    [MAIN] WIDGET DARK THEME
  ==================== */

</style>