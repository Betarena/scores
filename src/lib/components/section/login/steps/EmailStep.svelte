<script lang="ts">
  import { preloadData } from "$app/navigation";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { auth } from "$lib/firebase/init";
  import session from "$lib/store/session";
  import {
    fetchSignInMethodsForEmail,
    verifyBeforeUpdateEmail,
  } from "firebase/auth";
  import { onMount } from "svelte";
  import { loginStore } from "../login-store";
  import LogoutText from "./LogoutText.svelte";

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

  let errorMessage = "";
  $: ({ email, isLogin, translations } = $loginStore);
  $: ({ viewportType } = $session);
  $: isValidEmail = email && validateEmail(email);
  let emailError = false;
  let isEmailSent = false;
  let disableButton = !email || !validateEmail(email);
  let timer;

  $: if (!email) {
    emailError = false;
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

  async function updateUserEmail() {
    disableButton = true;
    if (auth.currentUser && !auth.currentUser.email) {
      try {
        await verifyBeforeUpdateEmail(auth.currentUser, email);
        isEmailSent = true;
        disableButton = false;
      } catch (error: any) {
        console.error("Error updating email:", error);
        emailError = true;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage =
              translations["auth/invalid-email"] || "Invalid email address.";
            break;
          case "auth/email-already-in-use":
            errorMessage =
              translations["auth/email-already-in-use"] ||
              "This email is already in use.";
            break;
          case "auth/requires-recent-login":
            errorMessage =
              translations["auth/requires-recent-login"] ||
              "Please re-authenticate to update your email.";
            break;
          default:
            errorMessage =
              translations["auth/update-email-failed"] ||
              "Failed to update email. Please try again.";
        }

        disableButton = false;
      }
    }
  }

  async function continueClick() {
    if (!auth.currentUser) return;
    try {
      await auth.currentUser.getIdToken(true);
      await auth.currentUser.reload();
      if (!auth.currentUser.emailVerified) {
        errorMessage =
          translations.email_not_verified ||
          "Please verify your email before continuing. Check your inbox and click the verification link.";
        return;
      }
      if (!$loginStore.verifiedSteps.includes("email")) {
        $loginStore.verifiedSteps.push("email");
      }
      $loginStore.currentStep += 1;
    } catch (e) {
      console.error("Error fetching user data:", e);
      debugger;
    }
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
    <div class="bg">
      <CircleBg
        size={viewportType === "desktop" ? "768" : "468"}
        animation="grow"
        duration={10}
      />
    </div>
    <img src="/assets/svg/logo-betarena.svg" alt="Betarena Logo" />
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>
          {isLogin
            ? translations.welcome_back || "Welcome back"
            : translations.welcome_to_betarena || "Welcome to Betarena"}
        </h2>
        <p class="subtitle">
          {isLogin
            ? translations.enter_details || "Please enter your details."
            : translations.join_home ||
              "Join the home of sports media creators."}
        </p>
      </div>
      <div class="form-body">
        <Input
          inputType="email"
          error={emailError}
          placeholder={translations.enter_email || "Enter your email"}
          bind:value={$loginStore.email}
        >
          <span slot="error">
            {#if emailError}
              {errorMessage}
            {/if}
          </span>
        </Input>
        {#if !isEmailSent}
          <Button
            full={true}
            size="lg"
            disabled={disableButton}
            on:click={() => {
              // continueClick();
              updateUserEmail();
            }}
          >
            {translations.verify_email || "Verify email"}
          </Button>
        {:else}
          <Button
            full={true}
            size="lg"
            disabled={disableButton}
            on:click={() => {
              continueClick();
            }}
          >
            {translations.continue || "Continue"}
          </Button>
        {/if}
      </div>
    </div>
  </Container>
  {#if isEmailSent}
    <div class="quest-wrapper">
      <span class="text"
        >{translations.email_verification_sent ||
          "Verification email sent. Please check your inbox and verify the email address."}
      </span>
    </div>
  {/if}
  {#if $loginStore.isExistedUser && !$loginStore.currentStep}
    <LogoutText />
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
    &.tablet {
      .form {
        max-width: 343px;
        margin: 0 auto;
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
