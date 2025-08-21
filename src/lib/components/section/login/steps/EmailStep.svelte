<script lang="ts">
  import { browser } from "$app/environment";
  import { preloadData } from "$app/navigation";
  import { scoresAuthStore } from "$lib/components/_main_/auth/_store";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import SocialButton from "$lib/components/ui/SocialButton.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { auth } from "$lib/firebase/init";
  import session from "$lib/store/session";
  import { successAuthComplete } from "$lib/utils/authentication";
  import { AU_W_TAG, dlog, errlog } from "$lib/utils/debug";
  import { gotoSW } from "$lib/utils/sveltekitWrapper";
  import { tryCatchAsync } from "@betarena/scores-lib/dist/util/common";
  import {
    fetchSignInMethodsForEmail,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
  } from "firebase/auth";
  import { createEventDispatcher, onMount } from "svelte";
  import { loginStore } from "../login-store";

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

  let password = "";
  let errorMessage = "";
  $: ({ email, isLogin } = $loginStore);
  $: ({ viewportType } = $session);
  $: isValidEmail = email && validateEmail(email);
  let emailError = false;
  let loginError = "";
  let disableButton = !email || !validateEmail(email);
  const dispatch = createEventDispatcher();
  let timer;

  $: if (!email) {
    emailError = false;
  }

  // Clear login error when switching between login/register modes
  $: if (isLogin !== undefined) {
    loginError = "";
  }

  // Clear login error when password changes
  $: if (password) {
    loginError = "";
  }

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

  async function validateEmail(email: string): Promise<boolean> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email) {
      disableButton = true;
      return false;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      validateOnBlur();
    }, 200);
    emailError = false;
    return true;
  }

  async function validateOnBlur() {
    if (!isValidEmail) {
      errorMessage = "Invalid email address";
      emailError = true;
      disableButton = true;
      return;
    }
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length && !isLogin) {
        errorMessage = "Email is already in use, try logging in instead.";
        emailError = true;
        disableButton = true;
        return true;
      }
    } catch {
      emailError = true;
      errorMessage = "Email validation failed";
    }
    disableButton = false;
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
  async function authenticateGoogleAuth20(
    authOpt: "google" = "google"
  ): Promise<void> {
    if (!browser) return;

    await tryCatchAsync(
      async (): Promise<void> => {
        scoresAuthStore.updateData([["globalStateAdd", "Processing"]]);

        let /**
           * @description
           * 📝 Target `provider` selected.
           */
          provider: null | GithubAuthProvider | GoogleAuthProvider = null;
        provider = new GoogleAuthProvider();
        disableButton = true;
        const result = await signInWithPopup(auth, provider),
          user = result.user;
        // [🐞]
        dlog(`${AU_W_TAG[0]} 🟢 Auth Success`);

        const /**
           * @description
           * 📝 Nested logic response.
           */
          setp0Res = await successAuthComplete(
            isLogin ? "login" : "register",
            user,
            undefined,
            authOpt
          );
        disableButton = false;
        if (!setp0Res) throw new Error();
        else scoresAuthStore.updateData([["globalStateRemove", "Processing"]]);
        $loginStore.currentStep += 1;
        dispatch("loginWithGoogle");
      },
      (ex: unknown | any): void => {
        scoresAuthStore.updateData([["globalStateRemove", "Processing"]]);

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

  function switchMode() {
    let path = isLogin ? "/register" : "/login";
    // Navigate to the new path
    gotoSW(path, true);
  }

  async function login() {
    try {
      disableButton = true;
      loginError = ""; // Clear previous errors

      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      $loginStore.isExistedUser = true;
      await successAuthComplete("login", credentials.user, undefined);
      disableButton = false;
      gotoSW("/", true);
    } catch (error: any) {
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/user-not-found":
          loginError = "No account found with this email address.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          loginError = "Invalid email or password. Please try again.";
          break;
        case "auth/invalid-email":
          loginError = "Please enter a valid email address.";
          emailError = true;
          break;
        case "auth/user-disabled":
          loginError =
            "This account has been disabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          loginError = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          loginError =
            "Network error. Please check your connection and try again.";
          break;
        case "auth/multi-factor-auth-required":
          // Handle multi-factor authentication if needed
          loginError =
            "Multi-factor authentication required. Please complete the additional verification.";
          break;
        case "auth/operation-not-allowed":
          loginError =
            "Email/password sign-in is not enabled. Please contact support.";
          break;
        case "auth/weak-password":
          loginError =
            "Password is too weak. Please choose a stronger password.";
          break;
        default:
          // Fallback for any other errors
          loginError =
            error.message || "An unexpected error occurred. Please try again.";
          console.error("Login error:", error);
      }
    }
    disableButton = false;
  }
  // #endregion ➤ 🛠️ METHODS

  onMount(() => {
    preloadData("/");
  });
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                  d       │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<div class="email-step {viewportType}">
  <div class="logo-wrapper">
    <div class="bg"><CircleBg size={viewportType === "desktop" ? "768" : "468"} animation="grow" duration={10} /></div>
    <img src="/assets/svg/logo-betarena.svg" alt="Betarena Logo" />
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>Welcome to Betarena</h2>
        <p class="subtitle">Join the home of sports media creators.</p>
      </div>
      <div class="form-body">
        <Input
          inputType="email"
          error={emailError || !!loginError}
          placeholder="Enter your email"
          bind:value={$loginStore.email}
        >
          <span slot="error">
            {#if emailError}
              {errorMessage}
            {/if}
          </span>
        </Input>
        {#if isLogin}
          <Input
            inputType="password"
            bind:value={password}
            error={!!loginError}
            placeholder="Enter your password"
          >
            <div slot="error">
              {#if loginError}
                {loginError}
              {/if}
            </div>
          </Input>
          <div class="forgot-password">
            <Checkbox title="Remember for 30 days" />
            <Button
              type="link-color"
              size="md"
              on:click={() => {
                $loginStore.currentStep += 1;
              }}>Forgot password?</Button
            >
          </div>
          <Button
            full={true}
            size="lg"
            on:click={login}
            disabled={disableButton || !email || !password}>Sign in</Button
          >
        {:else}
          <Button
            full={true}
            size="lg"
            disabled={disableButton}
            on:click={() => {
              $loginStore.currentStep += 1;
            }}>Get started</Button
          >
        {/if}
        <div class="or-wrapper">
          <div class="line" />
          <span>OR</span>
          <div class="line" />
        </div>
        <SocialButton
          company="Google"
          full={true}
          on:click={() => authenticateGoogleAuth20()}
        />
      </div>
      <div class="login-option" on:click={switchMode}>
        <span class="text"
          >{isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <span class="option">{isLogin ? "Sign up" : "Log in"} </span>
      </div>
    </div></Container
  >
  <div
    class="quest-wrapper"
    on:click={() => {
      $session.currentActiveModal = null;
      gotoSW("/", true);
    }}
  >
    <span class="text"> Skip and continue as </span>
    <div class="quest">Guest</div>
  </div>
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
  .email-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: relative;
    gap: var(--spacing-4xl, 32px);

    :global(.container-wrapper) {
      flex-grow: 0;
    }
    .logo-wrapper {
      display: flex;
      justify-content: center;
      height: max-content;
      position: relative;
      width: 100%;
      z-index: 0;
      .bg {
        position: absolute;
        z-index: 0;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
      }
      img {
        width: 48px;
        height: 48px;
      }
    }
    .form {
      position: relative;
      display: flex;
      flex-direction: column;
      z-index: 1;
      gap: var(--spacing-4xl, 32px);
      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md, 8px);
        justify-content: center;
        h2 {
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;
          margin: 0;

          /* Display xs/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-xs, 24px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-xs, 32px); /* 133.333% */
        }
        .subtitle {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: center;

          /* Text md/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-md, 24px); /* 150% */
        }
      }

      .form-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-3xl, 24px);
        align-self: stretch;

        .forgot-password {
          display: flex;
          width: 100%;
          justify-content: space-between;

          .forgot {
            color: var(--colors-text-text-brand-secondary-700, #d2d2d2);

            /* Text sm/Semibold */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          }
        }

        .or-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-md, 8px);
          align-self: stretch;

          color: var(--colors-text-text-tertiary-600, #8c8c8c);
          text-align: center;

          /* Text sm/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          .line {
            height: 1px;
            flex: 1 0 0;
            background: var(--colors-border-border-secondary, #3b3b3b);
            transform: translateY(-50%);
          }
        }
      }

      .login-option {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: var(--spacing-xs, 4px);
        align-self: stretch;
        .text {
          color: var(--colors-text-text-tertiary-600, #8c8c8c);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
        .option {
          cursor: pointer;
          color: var(--colors-text-text-brand-secondary-700, #d2d2d2);

          /* Text sm/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
        }
      }
    }

    &.desktop {
      .form {
        .header {
          gap: var(--spacing-lg, 12px);

          h2 {
            font-size: var(--font-size-display-sm, 30px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-sm, 38px); /* 126.667% */
          }
        }
      }
    }
  }
  .quest-wrapper {
    cursor: pointer;
    display: flex;
    width: 343px;
    justify-content: center;
    align-items: flex-end;
    gap: var(--spacing-xs, 4px);
    margin-top: auto;
    /* Text sm/Regular */
    font-family: var(--font-family-font-family-body, Roboto);
    font-size: var(--font-size-text-sm, 14px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-height-text-sm, 20px); /* 142.857% */
    .text {
      color: var(--colors-text-text-tertiary-600, #8c8c8c);
    }
    .quest {
      color: var(--colors-text-text-brand-secondary-700, #d2d2d2);

      /* Text sm/Semibold */
      font-weight: 600;
    }
  }
</style>
