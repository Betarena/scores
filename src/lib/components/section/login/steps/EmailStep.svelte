<script lang="ts">
  import { browser } from "$app/environment";
  import { scoresAuthStore } from "$lib/components/_main_/auth/_store";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import SocialButton from "$lib/components/ui/SocialButton.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { auth } from "$lib/firebase/init";
  import { successAuthComplete } from "$lib/utils/authentication";
  import { AU_W_TAG, dlog, errlog } from "$lib/utils/debug";
  import { tryCatchAsync } from "@betarena/scores-lib/dist/util/common";
  import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
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
  $: ({ email, isLogin } = $loginStore);
  $: ({ globalState } = $scoresAuthStore);

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
        if (!setp0Res) throw new Error();
        else scoresAuthStore.updateData([["globalStateRemove", "Processing"]]);
        return;
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

  // #endregion ➤ 🛠️ METHODS
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

<div class="email-step">
  <div class="logo-wrapper">
    <div class="bg"><CircleBg animation="ripple" duration={10}  /></div>
    <img src="/assets/svg/logo-betarena.svg" alt="Betarena Logo" />
  </div>
  <Container>
    <div class="form">
      <div class="header">
        <h2>Welcome to Betarena</h2>
        <p class="subtitle">Join the home of sports media creators.</p>
      </div>
      <div class="form-body">
        <Input
          inputType="email"
          placeholder="Enter your email"
          bind:value={$loginStore.email}
        />
        {#if isLogin}
          <Input
            inputType="password"
            bind:value={password}
            placeholder="Enter your password"
          />
          <Button full={true} size="lg" disabled={!email || !password}
            >Sing in</Button
          >
        {:else}
          <Button
            full={true}
            size="lg"
            disabled={!email}
            on:click={() => {
              $loginStore.currentStep += 1
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
      <div class="login-option" on:click={() => (isLogin = !isLogin)}>
        <span class="text"
          >{isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <span class="option">{isLogin ? "Sign up" : "Log in"} </span>
      </div>
    </div></Container
  >
</div>

<div class="quest-wrapper">
  <span class="text"> Skip and continue as </span>
  <div class="quest">Guest</div>
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
    padding: var(--spacing-6xl, 48px) 0;
    gap: var(--spacing-4xl, 32px);

    .logo-wrapper {
      display: flex;
      justify-content: center;
      height: max-content;
      position: relative;
      .bg {
        position: absolute;
        z-index: -1;
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
      display: flex;
      flex-direction: column;
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
  }
  .quest-wrapper {
    position: fixed;
    bottom: 22px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    width: 343px;
    justify-content: center;
    align-items: flex-start;
    gap: var(--spacing-xs, 4px);

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
