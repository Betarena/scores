<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { browser, dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { app_m, auth } from '$lib/firebase/init';
  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings, type Scores_User } from '$lib/store/user-settings';
  import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils';
  import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth';
  import { GithubAuthProvider, GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithCustomToken, signInWithEmailLink, signInWithPopup, type User } from "firebase/auth";

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

	const dispatch = createEventDispatcher();

  // NOTE: NO WIDGET SPECIFIC SEO or PRE-LOAD DATA REQUIRED

  let email_input: string
  let processing: boolean = false;
  let email_verify_process: boolean = false;
  let auth_view: boolean = true;
  let auth_type: 'login' | 'register';
  let success_auth: boolean = false;
  let error_auth: boolean = false;
  let email_error_format: boolean = false;
  let email_already_in_use: boolean = false;

  const actionCodeSettings = {
    // [ℹ] URL / DOMAIN you want to redirect back to.
    // [ℹ] URL must be in the authorized domains list in the Firebase Console.
    url: `${$page.url?.origin}${$page.url?.pathname}`,
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
  if (dev) email_input = 'migbashdev@gmail.com'

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /*
  function close_widget() {
		dispatch('close_widget');
	}
  */

  async function login_with_google () {
    // DOC: https://firebase.google.com/docs/auth/web/google-signin
    try {
      processing = true
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      .then((result) => {
        // [ℹ] This gives you a Google Access Token & Google API
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // [ℹ] user info
        const user = result?.user;
        success_auth_wrap(user)
      })
      .catch((error) => {
        processing = false
        // TODO: Error Authetication Handle
        // [ℹ] handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email; // The email of the user's account used.
        // [ℹ] AuthCredential used
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // [🐞]
        if (dev) console.log('errorCode', errorCode)
        if (dev) console.log('errorMessage', errorMessage)
      });
    } catch (error) {
      console.log(`❌ Google auth error: ${error}`)
      processing = false
    }
  }

  async function check_email_user_exists (email_input: string) {
    
  }

  async function login_with_email_link () {
    // DOC: https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0
    try {
      email_error_format = false 
      processing = true
      // [🐞]
      if (dev) console.log('email_input', email_input)
      // await fetchSignInMethodsForEmail(
      //   auth, 
      //   email_input
      // )
      // .then((signInMethods) => {
      //   if (signInMethods.length) {
      //     // [ℹ] The email already exists in the Auth database. You can check the
      //     // [ℹ] sign-in methods associated with it by checking signInMethods array.
      //     // [ℹ] Show the option to sign in with that sign-in method.
      //     email_already_in_use = true;
      //   } else {
      //     // [ℹ] User does not exist. Ask user to sign up.
      //     email_already_in_use = false;
      //   }
      // })
      // .catch((error) => { 
      //   // Some error occurred.
      // });
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
        processing = false
        auth_view = false
        email_verify_process = true
        // [ℹ] Save the email in localStroage() for retrival on same device
        window.localStorage.setItem('emailForSignIn', email_input);
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
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // [🐞]
      if (dev) console.log("🔵 EmailLink OAuth2")
      // NOTE: apiKey, oobCode, mode, lang query param(s) passed in URL query params
      // NOTE: Additional state parameters can also be passed via URL.
      // NOTE: This can be used to continue the user's intended action before triggering
      // NOTE: the sign-in operation.
      // NOTE: Get the email if available. This should be available if the user completes
      // NOTE: the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      // [🐞]
      if (dev) console.log('email', email)
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`
        // [🐞]
        if (dev) console.log("🟢 EmailLink Auth")
        // NOTE: Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        // NOTE: You can access the new user via result.user
        // NOTE: Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // NOTE: You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
          // [🐞]
        if (dev) console.log('displayName', result?.user?.displayName)
        if (dev) console.log('email', result?.user?.email)
        success_auth_wrap(result?.user)
        goto(revert_url, { replaceState: true });
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        console.log(error);
      });
    }
  }

  // NOTE: Apple Login Discontinued - instead for GitHub
  async function login_with_github () {
    try {
      processing = true
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider)
      .then((result) => {
        // [ℹ] this gives you a GitHub Access Token. 
        // const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // [ℹ] user info
        const user = result.user;
        success_auth_wrap(user)
      }).catch((error) => {
        processing = false
        // [ℹ] handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        // [🐞]
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
        // [ℹ] the email used
        const email = error.customData.email;
        // [ℹ] AuthCredential used
        const credential = GithubAuthProvider.credentialFromError(error);
        // [🐞]
        if (dev) console.log('credential', credential)
        if (dev) console.log('email', email)
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

  async function login_with_discord () {
    // DOC: https://www.reddit.com/r/Firebase/comments/n4uv1o/sign_in_with_discord/
    // DOC: https://github.com/luizkc/firebase-discord-oauth2-example
    // DOC: https://stackoverflow.com/questions/70171124/discord-oauth2-with-firebase-functions
    // DOC: https://stackoverflow.com/questions/53992730/how-would-i-authorize-users-using-discord-oauth2-0-for-firebase-authentication-o
    try {
      processing = true
      const callback_auth_url = $page?.url?.origin
      // [🐞]
      if (dev) console.log('callback_auth_url', callback_auth_url)
      const discord_outh_url = import.meta.env.VITE_DISCORD_OAUTH_URL
      const final_url_nav = `${discord_outh_url}?redirect_url=${callback_auth_url}`
      // [ℹ] initiate discord OAuth2
      goto(final_url_nav)
    } catch (e) {
      processing = false
      console.log(e);
    }
  }
  // [ℹ] DeepLink listener Discord Cont. [END]
  $: if (browser) {
    // [🐞]
    if (dev) console.log("Testing for Discord Link!")
    const f_uid = $page.url.searchParams.get('f_uid')
    const oauth2 = $page.url.searchParams.get('oauth2')
    const revert_url = `${$page?.url?.origin}${$page?.url?.pathname}`
    // [ℹ] validate user is attempting Discord OAuth2
    if (oauth2 == 'discord' 
      && f_uid != null) {
      // [🐞]
      if (dev) console.log("🔵 Discrod OAuth2")
      goto(revert_url, { replaceState: true });
      signInWithCustomToken(auth, f_uid)
      .then((userCredential) => {
        // [ℹ] successful sign-in / login
        // [🐞]
        if (dev) console.log("🟢 Discrod OAuth2")
        const user = userCredential.user;
        success_auth_wrap(user)
      })
      .catch((error) => {
        // TODO: complete authetication error handle
        const errorCode = error.code;
        const errorMessage = error.message;
        // [🐞]
        if (dev) console.error('errorMessage', errorMessage)
        if (dev) console.error('errorCode', errorCode)
      });
    }
  }

  async function login_with_metamask () {
    // DOC: https://moralis.io/create-a-web3-firebase-login-with-metamask/
    // DOC: https://docs.moralis.io/authentication-api/integrations/firebase-nodejs
    // DOC: https://moralis.io/web3-firebase-authentication-create-a-web3-sign-in-with-moralis/
    // DOC: https://moralisweb3.github.io/firebase-extensions/service-account-converter/
    // DOC: OTHER => https://moralisweb3.github.io/Moralis-JS-SDK/demos/firebase-auth-ext/
    // DOC: https://admin.moralis.io/users
    // IMPORTANT: betarena-ios "usage" project-id
    try {
      processing = true
      // [ℹ] create Moralis instance
      const moralisAuth = getMoralisAuth(app_m);
      // NOTE: default sign-in opt. is Metamask
      const moralis_auth = await signInWithMoralis(moralisAuth);
      // [🐞]
      if (dev) console.log("🟢 Moralis Auth")
      success_auth_wrap(null, moralis_auth?.credentials?.user?.displayName)
    } catch (error) {
      // [🐞]
      console.error(`❌ Moralis auth error: ${error}`)
      processing = false;
    }
  }

  function success_auth_wrap (
    user?: User, 
    web3_wallet_addr?: string
  ) {
    // NOTE: complete authetication
    let user_obj: Scores_User = user
    // [ℹ] initiate stores
    if (user != undefined) {
      user_obj.web3_wallet_addr = undefined
    }
    if (web3_wallet_addr != undefined) {
      user_obj = {
        phoneNumber: undefined,
        photoURL: undefined,
        providerId: undefined,
        uid: undefined,
        reload: undefined,
        toJSON: undefined,
        displayName: undefined,
        email: undefined,
        tenantId: undefined,
        delete: undefined,
        getIdToken: undefined,
        getIdTokenResult: undefined,
        refreshToken: undefined,
        providerData: undefined,
        metadata: undefined,
        isAnonymous: undefined,
        emailVerified: undefined,
        web3_wallet_addr: undefined
      }
      user_obj.web3_wallet_addr = web3_wallet_addr
    }
    userBetarenaSettings.signInUser(user_obj)
    // [ℹ] default UI/UX triggers
    $sessionStore.auth_show = false
    processing = false;
    email_input = undefined;
    success_auth = true;
    setTimeout(() => {
      success_auth = false;
      auth_type = 'login'
    }, 1500)
  }

  function wrong_email_format () {
    email_error_format = true 
    error_auth = true
    setTimeout(() => {
      error_auth = false
    }, 1500)
  }

  $: if (!$sessionStore.auth_show) {
    auth_view = true
    email_input = undefined
    email_verify_process = false
    email_already_in_use = false
    email_error_format = false
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
{#if $sessionStore.auth_show}
  <div
    id='background-modal-blur'
    on:click={() => $sessionStore.auth_show = false}
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
    transition:fade>
    <img 
      src={success_icon}
      alt="Success Icon"
      title="Success Icon"
    />
    <p
      class="w-500">
      Success! User
      {#if auth_type == 'login'}
        logged in
      {:else}
        signed up
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
    transition:fade>
    <img 
      src={error_icon}
      alt="Error Icon"
      title="Error Icon"
    />
    <p
      class="w-500">
      Uh-oh! There has been an error
    </p>
  </div>
{/if}

<!-- 
[ℹ] main auth widget component
-->
{#if $sessionStore.auth_show}
  <div
    id='widget-outer'
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    in:fade>

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
        id="email-auth-verify-box">
        <!-- 
        [ℹ] close icon logo
        -->
        <img 
          id='close-vector'
          class='cursor-pointer'
          src="/assets/svg/close.svg" 
          alt="close-svg"
          on:click={() => $sessionStore.auth_show = false}
        />

        <!-- 
        [ℹ] verify text
        -->
        <p
          class="
            w-500
            color-black-2
          "
          style="font-size: 20px;">
          Verification
        </p>
        <!-- 
        [ℹ] verify email
        -->
        <p
          class="color-grey">
          Please verify your email
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
        <p
          class="color-grey">
          An email has been sent to
          <br>
          <span
            class="color-black-2">
            {email_input}
          </span>
          <br>
          Please verify your email to continue.
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
          on:click={() => window.open('mailto:')}>
          Go to my inbox
        </p>
        <!-- 
        [ℹ] verify no email text
        -->
        <p
          class="color-grey"
          style="margin-top: 24px;">
          Did not get the email? 
          <span
            class="
              color-primary
              cursor-pointer
            "
            on:click={() => login_with_email_link()}>
            Resend email
          </span>
        </p>
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
        on:click={() => $sessionStore.auth_show = false}
      />

      <!-- 
      [ℹ] auth logo betarena
      -->
      <img
        id="auth-logo"
        src={$userBetarenaSettings.theme == 'Dark' ? logo_dark : logo}
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
      <form 
        on:submit|preventDefault={() => login_with_email_link()}>
        <!-- 
        [ℹ] input email
        -->
        <input
          id='email'
          type="email"
          placeholder="email@gmail.com"
          bind:value={email_input}
          on:invalid={() => wrong_email_format()}
          autocomplete="off"
          class:error-email={email_error_format || email_already_in_use}
          required
        />
        <!-- 
        [ℹ] error email validation format
        -->
        {#if email_error_format}
          <p
            class="color-error"
            style="margin-top: 10px;">
            Wrong format
          </p>
        {/if}
        <!-- 
        [ℹ] error email validation exists
        -->
        {#if email_already_in_use}
          <p
            class="color-error"
            style="margin-top: 10px;">
            Email already in use
          </p>
        {/if}
        <!-- 
        [ℹ] submit email button
        -->
        <button
          id="email-btn"
          class="
            btn-primary 
          "
          type="submit">
          <p
            class="
              w-500
            ">
            Continue with email
          </p>
        </button>
      </form>

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
        [ℹ] GITHUB 
        -->
        <button
          class="btn-auth-opt"
          on:click={() => login_with_github()}>
          <img 
            src={$userBetarenaSettings.theme == 'Dark' ? github_dark_icon : github_icon}
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
        <p
          class="
            w-500
            color-black-2
          ">
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
              cursor-pointer
            "
            on:click={() => auth_type = 'register'}>
            Register
          </span> 
        {:else}
          Already have an account? 
          <span
            class="
              color-primary
              cursor-pointer
            "
            on:click={() => auth_type = 'login'}>
            Login
          </span> 
        {/if}
      </p>
    {/if}

  </div>
{/if}

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
  } div#auth-alert-box p {
    color: #FFFFFF;
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
    width: 85%;
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

  div#email-auth-verify-box {
  } div#email-auth-verify-box img#email-verify-icon {
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
    color: #000000;
  } input#email:hover {
    border: 1px solid #8C8C8C;
  } input#email:focus {
    border: 1px solid #4B4B4B;
  } input#email[placeholder] {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  } input#email::placeholder {
    color: #CCCCCC;
  } input#email.error-email {
    border: 1px solid #FF3C3C !important;
  }
  button#email-btn {
    height: 40px;
    width: 100%;
    background-color: #f5620f;
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
    border-radius: 8px;
    padding: 10px 24px;
    margin-top: 12px;
  } button#email-btn p {
    color: #FFFFFF;
    font-size: 14px;
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
  @media only screen and (min-width: 726px) and (max-width: 1160px)  {
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
    background: #4B4B4B;
  }

  div#widget-outer.dark-background-1 div#processing-auth-box {
    background: rgba(41, 41, 41, 0.8);
  }

  div#widget-outer.dark-background-1 input#email {
    background: #4B4B4B;
    border: 1px solid #737373;
  } div#widget-outer.dark-background-1 input#email {
    color: #FFFFFF;
  } div#widget-outer.dark-background-1 input#email::placeholder {
    color: #737373;
  }

  div#widget-outer.dark-background-1 div#other-oauth-divider-box div.hr-box,
  div#widget-outer.dark-background-1 div#web3-divider-box div.hr-box {
    background: #737373;
  }

  div#widget-outer.dark-background-1 div#oauth-box button.btn-auth-opt,
  div#widget-outer.dark-background-1 button#metamask.btn-auth-opt {
    border: 1px solid #737373 !important;
    background: #4B4B4B;
  }

</style>