<script lang="ts">
  import GridBg from "$lib/components/shared/backround-patterns/GridBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import {
    sendPhoneVerificationCode,
    verifyPhoneCode,
  } from "$lib/firebase/firebase.actions";
  import { successAuthComplete } from "$lib/utils/authentication";
  import { RecaptchaVerifier } from "firebase/auth";
  import { onMount } from "svelte";
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
  let length = 6; // Firebase SMS codes are typically 6 digits

  let isLoading = false;
  let errorMessage = "";
  let resentMessage = "";

  let otpInputs: HTMLInputElement[] = [];
  let currentFocus = 0;

  // #endregion ➤ 📌 VARIABLES

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
  $: value = otpInputs.map((input) => input?.value || "").join("");
  $: isValid = value.length === length;
  $: ({ confirmationResult, recaptchaVerifier } = $loginStore);

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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

  function focusInput(index: number) {
    if (otpInputs[index]) {
      otpInputs[index].focus();
      currentFocus = index;
    }
  }

  function handleInputChange(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    let inputValue = input.value;
    
    // Handle iOS SMS autofill
    if (inputValue.length > 1) {
      
      const digits = inputValue.replace(/\D/g, "").slice(0, length);
      
      for (let i = 0; i < length; i++) {
        if (otpInputs[i]) {
          otpInputs[i].value = digits[i] || "";
        }
      }
      
      const nextIndex = Math.min(digits.length, length - 1);
      focusInput(nextIndex);
      
      if (digits.length === length) {
        handleVerifyCode();
      }
      return;
    }

    const v = inputValue.replace(/\D/g, "");
    input.value = v;
    
    if (v && index < length - 1) {
      focusInput(index + 1);
    }

    // Check if code is complete
    const currentValue = otpInputs.map((inp) => inp?.value || "").join("");
    value = currentValue;
    if (currentValue.length === length) {
      handleVerifyCode();
    }
  }

  function handleKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === "Backspace") {
      const input = e.target as HTMLInputElement;
      if (!input.value && index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  }

  function handleHiddenInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const code = input.value.replace(/\D/g, '').slice(0, length);
    if (code.length >= 1) {
      for (let i = 0; i < length; i++) {
        if (otpInputs[i]) {
          otpInputs[i].value = code[i] || '';
        }
      }
      const nextIndex = Math.min(code.length - 1, length - 1);
      focusInput(nextIndex);
      
      input.value = '';
      
      if (code.length === length) {
        handleVerifyCode();
      }
    }
  }

  function handlePaste(e: ClipboardEvent, index: number) {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, length);
    if (pasted) {
      for (let i = 0; i < length; i++) {
        if (otpInputs[i]) {
          otpInputs[i].value = pasted[i] || "";
        }
      }
      const nextIndex = Math.min(pasted.length, length - 1);
      focusInput(nextIndex);

      if (pasted.length === length) {
        handleVerifyCode();
      }
    }
  }

  async function handleVerifyCode() {
    if (!isValid || isLoading || !confirmationResult || !recaptchaVerifier)
      return;

    isLoading = true;
    errorMessage = "";

    try {
     const credentials = await verifyPhoneCode(confirmationResult, value);
     successAuthComplete("login", credentials.user, undefined);
      // Phone verification successful - move to next step
      $loginStore.currentStep += 1;
    } catch (error: any) {
      console.error("Phone code verification error:", error);

      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/invalid-verification-code":
          errorMessage =
            "Invalid verification code. Please check and try again.";
          break;
        case "auth/missing-verification-code":
          errorMessage = "Please enter the verification code.";
          break;
        case "auth/code-expired":
          errorMessage =
            "Verification code has expired. Please request a new one.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          break;
        case "auth/provider-already-linked":
          errorMessage =
            "This phone number is already linked to another account.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage =
            "This phone number is already linked to another account.";
          break;
        default:
          errorMessage = "Failed to verify code. Please try again.";
      }

      // Clear the input for retry
      otpInputs.forEach((input) => {
        if (input) input.value = "";
      });
      focusInput(0);
    } finally {
      isLoading = false;
    }
  }

  async function resendCode() {
    if (isLoading) return;

    isLoading = true;
    errorMessage = "";
    resentMessage = "";

    try {
      $loginStore.confirmationResult = await sendPhoneVerificationCode(
        $loginStore.phoneNumber,
        $loginStore.recaptchaVerifier as RecaptchaVerifier
      );
      resentMessage = "The code has been resent.";
      // Clear inputs and focus first field
      otpInputs.forEach((input) => {
        if (input) input.value = "";
      });
      focusInput(0);
    } catch (error: any) {
      console.error("Phone code verification error:", error);
      switch (error.code) {
        case "auth/invalid-phone-number":
          errorMessage = "Please enter a valid phone number.";
          break;
        case "auth/missing-phone-number":
          errorMessage = "Please enter your phone number.";
          break;
        case "auth/quota-exceeded":
          errorMessage =
            "Too many verification attempts. Please try again later.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Phone authentication is not enabled. Please contact support.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        default:
          errorMessage = "Failed to send verification code. Please try again.";
      }
    } finally {
      isLoading = false;
    }
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    focusInput(0);
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
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

<div class="phone-step">
  <div class="logo-wrapper">
    <div class="bg"><GridBg /></div>
    <div class="phone-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="29"
        height="28"
        viewBox="0 0 29 28"
        fill="none"
      >
        <path
          d="M14.5 20.4166H14.5117M10.0667 25.6666H18.9333C20.2401 25.6666 20.8935 25.6666 21.3927 25.4123C21.8317 25.1886 22.1887 24.8316 22.4124 24.3926C22.6667 23.8934 22.6667 23.24 22.6667 21.9333V6.06658C22.6667 4.7598 22.6667 4.1064 22.4124 3.60727C22.1887 3.16823 21.8317 2.81127 21.3927 2.58757C20.8935 2.33325 20.2401 2.33325 18.9333 2.33325H10.0667C8.75989 2.33325 8.10649 2.33325 7.60737 2.58757C7.16832 2.81127 6.81137 3.16823 6.58766 3.60727C6.33334 4.1064 6.33334 4.7598 6.33334 6.06659V21.9333C6.33334 23.24 6.33334 23.8934 6.58766 24.3926C6.81137 24.8316 7.16832 25.1886 7.60737 25.4123C8.10649 25.6666 8.75989 25.6666 10.0667 25.6666ZM15.0833 20.4166C15.0833 20.7388 14.8222 20.9999 14.5 20.9999C14.1778 20.9999 13.9167 20.7388 13.9167 20.4166C13.9167 20.0944 14.1778 19.8333 14.5 19.8333C14.8222 19.8333 15.0833 20.0944 15.0833 20.4166Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>Check your phone</h2>
        <p class="subtitle">We sent a verification code to your phone</p>
      </div>
      <div class="form-body">
        <div class="otp-wrapper">
          <input
            type="tel"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            pattern="[0-9]{6}"
            class="otp-hidden"
            on:input={handleHiddenInputChange}
          />
          <div class="otp-box-wrapper">
            {#each Array(length) as _, i}
              <input
                bind:this={otpInputs[i]}
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength={i === 0 ? 6 : 1}
                placeholder="0"
                autocomplete={i === 0 ? "one-time-code" : "off"}
                class="otp-box {currentFocus === i ? 'current' : ''}"
                on:input={(e) => handleInputChange(e, i)}
                on:keydown={(e) => handleKeyDown(e, i)}
                on:paste={(e) => handlePaste(e, i)}
                on:focus={() => (currentFocus = i)}
              />
              {#if i === 2}
                <div class="splitter">-</div>
              {/if}
            {/each}
          </div>
          {#if errorMessage}
            <span class="error">{errorMessage}</span>
          {/if}
        </div>
        <Button
          full={true}
          size="lg"
          disabled={!isValid || isLoading}
          on:click={handleVerifyCode}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  </Container>
  <Container hFull={false}>
    <div class="support-text">
      <div class="resend-wrapper">
        <span>Didn't receive the code?</span>
        <button class="resend" disabled={isLoading} on:click={resendCode}>
          Click to resend
        </button>
      </div>
      {#if resentMessage}
        <div class="resent-message">{resentMessage}</div>
      {/if}
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
  .phone-step {
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
      .phone-icon {
        display: flex;
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

        .otp-hidden {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          height: 0;
          width: 0;
        }
        .otp-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md, 6px);

          .otp-box-wrapper {
            display: flex;
            gap: var(--spacing-md, 8px);
            height: 59px;
            justify-content: center;
            align-items: center;

            .splitter {
              color: var(--colors-text-text-placeholder_subtle, #525252);
              text-align: center;
              vertical-align: middle;

              /* Display xl/Medium */
              font-family: var(--font-family-font-family-display, Roboto);
              font-size: var(--font-size-display-xl, 60px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-display-xl, 72px); /* 120% */
              letter-spacing: -1.2px;

              display: flex;
              width: 28px;

              flex-direction: column;
              justify-content: center;
              flex-shrink: 0;
            }

            .otp-box {
              width: 46px;
              height: 46px;
              padding: var(--spacing-xxs, 2px) var(--spacing-md, 8px);
              border: none;
              outline: none;
              transition: border-color 0.2s;

              border-radius: var(--radius-lg, 10px);
              border: 1px solid var(--colors-border-border-primary, #d2d2d2);
              background: var(--colors-background-bg-primary, #fff);

              /* Shadows/shadow-xs */
              box-shadow: 0 1px 2px 0
                var(--colors-effects-shadows-shadow-xs, rgba(10, 13, 18, 0.05));

              color: var(--colors-text-text-primary-900, #000);
              caret-color: var(--colors-border-border-brand, #f5620f);

              text-align: center;

              /* Display lg/Medium */
              font-family: var(--font-family-font-family-display, Roboto);
              font-size: var(--font-size-display-lg, 48px);
              font-style: normal;
              font-weight: 500;
              line-height: var(--line-height-display-lg, 60px); /* 125% */
              letter-spacing: -0.96px;

              &:focus,
              &.current {
                border: 2px solid var(--colors-border-border-brand, #f5620f);
                background: var(--colors-background-bg-primary, #fff);
                box-shadow: 0 1px 2px 0
                    var(
                      --colors-effects-shadows-shadow-xs,
                      rgba(10, 13, 18, 0.05)
                    ),
                  0 0 0 2px var(--colors-background-bg-primary, #fff),
                  0 0 0 4px
                    var(--colors-effects-focus-rings-focus-ring, #f5620f);
              }

              &:placeholder-shown {
                color: var(--colors-text-text-placeholder_subtle, #d2d2d2);
              }

              // Убираем стрелки у input[type="number"] в Chrome/Safari
              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }

              // Убираем стрелки у input[type="number"] в Firefox
              &[type="number"] {
                appearance: textfield;
                -moz-appearance: textfield;
              }
            }
          }
          .error {
            color: var(--colors-text-text-error-primary-600, #f97066);

            /* Text sm/Regular */
            font-family: var(--Font-family-font-family-body, Roboto);
            font-size: var(--Font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
          }
        }
      }
    }
    .support-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-xs, 4px);
      align-self: stretch;

      color: var(--colors-text-text-tertiary-600, #8c8c8c);

      /* Text sm/Regular */
      font-family: var(--font-family-font-family-body, Roboto);
      font-size: var(--font-size-text-sm, 14px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-height-text-sm, 20px); /* 142.857% */

      .resend-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-xs, 4px);
      }

      .resend {
        background: none;
        border: none;
        color: var(--colors-text-text-brand-secondary-700, #d2d2d2);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        text-underline-offset: 2px;

        &:hover:not(:disabled) {
          color: var(--colors-text-text-brand-secondary-600, #b3b3b3);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .resent-message {
        color: var(--colors-text-text-success-primary-600, #12b76a);
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-sm, 14px);
        font-style: normal;
        font-weight: 500;
        line-height: var(--line-height-text-sm, 20px);
        text-align: center;
        margin-top: var(--spacing-xs, 4px);
      }
    }
  }
</style>
