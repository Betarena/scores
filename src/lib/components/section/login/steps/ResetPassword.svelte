<script lang="ts">
  import GridBg from "$lib/components/shared/backround-patterns/GridBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { auth } from "$lib/firebase/init";
  import session from "$lib/store/session";
  import { sendPasswordResetEmail } from "firebase/auth";
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
  $: ({ email, isLogin, translations } = $loginStore);
  $: ({ viewportType } = $session);
  $: disableButton = !email || !validateEmail(email);
  let emailError = false;
  let loginError = "";
  let isSent = false;

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

  function validateEmail(email: string): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email) {
      return false;
    }
    emailError = false;
    return true;
  }

  function validateOnBlur() {
    const isInvalid = validateEmail(email);
    if (!isInvalid) {
      errorMessage = "Invalid email address";
      emailError = true;
    }
  }
  async function reset() {
    try {
      disableButton = true;
      await sendPasswordResetEmail(auth, email);
      isSent = true;
      disableButton = false;
      // Show success message or navigate to another step
    } catch (e) {
      disableButton = false;
      emailError = true;
      errorMessage = e.message;
      // Handle errors
    }
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

<div class="reset-password-step {viewportType}">
  <div class="logo-wrapper">
    <div class="bg">
      <GridBg size={viewportType === "desktop" ? "768" : "468"} />
    </div>
    <div class="key-icon">
      <svg
        width="29"
        height="28"
        viewBox="0 0 29 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.3333 10.4999C20.3333 9.9028 20.1055 9.30568 19.6499 8.85008C19.1943 8.39447 18.5972 8.16667 18 8.16667M18 17.5C21.866 17.5 25 14.366 25 10.5C25 6.63401 21.866 3.5 18 3.5C14.134 3.5 11 6.63401 11 10.5C11 10.8193 11.0214 11.1336 11.0628 11.4415C11.1309 11.948 11.1649 12.2013 11.142 12.3615C11.1181 12.5284 11.0877 12.6184 11.0055 12.7655C10.9265 12.9068 10.7873 13.046 10.509 13.3243L4.54673 19.2866C4.34496 19.4884 4.24407 19.5893 4.17192 19.707C4.10795 19.8114 4.06081 19.9252 4.03224 20.0442C4 20.1785 4 20.3212 4 20.6065V22.6333C4 23.2867 4 23.6134 4.12716 23.863C4.23901 24.0825 4.41749 24.261 4.63701 24.3728C4.88657 24.5 5.21327 24.5 5.86667 24.5H8.66667V22.1667H11V19.8333H13.3333L15.1757 17.991C15.454 17.7127 15.5932 17.5735 15.7345 17.4945C15.8816 17.4123 15.9716 17.3819 16.1385 17.358C16.2987 17.3351 16.552 17.3691 17.0585 17.4372C17.3664 17.4786 17.6807 17.5 18 17.5Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <Container>
    <div class="form">
      <div class="header">
        <h2>{translations.forgot_password || "Forgot password?"}</h2>
        <p class="subtitle">
          {translations.no_worries ||
            "No worries, we’ll send you reset instructions."}
        </p>
      </div>
      <div class="form-body">
        <Input
          inputType="email"
          label={translations.email || "Email"}
          required={true}
          error={emailError || !!loginError}
          on:blur={() => validateOnBlur()}
          placeholder={translations.enter_email || "Enter your email"}
          bind:value={$loginStore.email}
        >
          <span slot="error">
            {#if emailError}
              {errorMessage}
            {/if}
          </span>
          <div slot="info">
            {#if isSent}
              <span class="success-info">
                {translations.reset_link_sent ||
                  "A reset link has been sent to your email."}
              </span>
            {/if}
          </div>
        </Input>

        {#if !isSent}
          <Button
            full={true}
            size="lg"
            disabled={disableButton}
            on:click={reset}
            >{translations.send_reset_link || "Set reset link"}</Button
          >
        {/if}
        <Button
          type="link-gray"
          size="md"
          on:click={() => {
            $loginStore.currentStep = 0;
          }}
        >
          <div class="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15.8333 10.0003H4.16663M4.16663 10.0003L9.99996 15.8337M4.16663 10.0003L9.99996 4.16699"
                stroke="currentColor"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{translations.back_to_login || "Back to log in"}</span>
          </div>
        </Button>
      </div>
    </div>
  </Container>
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
  .reset-password-step {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    position: relative;
    gap: var(--spacing-4xl, 32px);

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
      .key-icon {
        display: flex;
        z-index: 1;
        width: 56px;
        height: 56px;
        padding: 14px;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1/1;
        border-radius: var(--spacing-lg, 12px);
        border: 1px solid var(--colors-border-border-primary, #525252);
        background: var(--colors-background-bg-primary, #1f1f1f);

        /* Shadows/shadow-xs-skeuomorphic */
        box-shadow: 0 0 0 1px
            var(
              --colors-effects-shadows-shadow-skeumorphic-inner-border,
              rgba(12, 14, 18, 0.18)
            )
            inset,
          0 -2px 0 0 var(
              --colors-effects-shadows-shadow-skeumorphic-inner,
              rgba(12, 14, 18, 0.05)
            ) inset,
          0 1px 2px 0
            var(--colors-effects-shadows-shadow-xs, rgba(255, 255, 255, 0));
        color: var(--colors-foreground-fg-secondary-700);
        svg {
          width: 28px;
          height: 28px;
        }
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
      }

      .back-button {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs, 4px);

        svg {
          width: 20px;
          height: 20px;
          aspect-ratio: 1/1;
        }
      }
      .success-info {
        color: var(--colors-text-text-success-primary-600, #fff);
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
</style>
