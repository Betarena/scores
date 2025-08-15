<script lang="ts">
  import { browser } from "$app/environment";
  import CircleBg from "$lib/components/shared/backround-patterns/CircleBG.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import DropDownInput from "$lib/components/ui/DropDownInput.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Container from "$lib/components/ui/wrappers/Container.svelte";
  import { initializeRecaptcha, sendPhoneVerificationCode } from "$lib/firebase/firebase.actions";
  import userSettings from "$lib/store/user-settings";
  import { onMount } from "svelte";
  import IconPhoneVerification from "../icons/IconPhoneVerification.svelte";
  import { loginStore } from "../login-store";
  import { countries } from './CountryCodes';
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

  let phoneNumber = "";
  let isLoading = false;
  let errorMessage = "";
  let countryCodes = countries.map((c, index) => ({
    id: `${c.code}_${index}`, 
    label: `${c.name} (${c.dial_code})`, 
    dial_code: c.dial_code,
    code: c.code,
    name: c.name
  }));
  let selectedCountryCode = countryCodes.find(c => c.dial_code === "+1") || countryCodes[0];
  $: ({ recaptchaVerifier } = $loginStore);
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

  $: isValidPhone = phoneNumber.trim().length >= 10;

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  $: if (browser && countryCodes.length  && $userSettings.geoJs) {
    const user_location = $userSettings.geoJs.country_code;
    selectedCountryCode = countryCodes.find(c => c.code === user_location) || countryCodes[0];
  }

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

  function focus() {
    if (!phoneNumber && selectedCountryCode.dial_code) {
      phoneNumber = selectedCountryCode.dial_code
    }
  }

  async function sendVerificationCode() {
    if (!isValidPhone || isLoading || !recaptchaVerifier) return;

    isLoading = true;
    errorMessage = "";

    try {
      // Render reCAPTCHA
      await recaptchaVerifier.render();

      // Send verification code
      $loginStore.confirmationResult = await sendPhoneVerificationCode(
        phoneNumber,
        recaptchaVerifier
      );

      // Store phone number in login store
      $loginStore.phoneNumber = phoneNumber;

      // Move to next step
      $loginStore.currentStep += 1;
    } catch (error: any) {
      console.error("Phone verification error:", error);

      // Handle specific Firebase Auth errors
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
     try {
      if ($loginStore.recaptchaVerifier) return;
      const recaptcha = initializeRecaptcha("recaptcha-container");
      $loginStore.recaptchaVerifier = recaptcha;
    } catch (error) {
      console.error("Failed to initialize reCAPTCHA:", error);
    }
  });

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

<div class="phone-verification-step">
  <div class="logo-wrapper">
    <div class="bg"><CircleBg /></div>
    <div class="icon-wrapper">
      <IconPhoneVerification />
    </div>
  </div>
  <Container hFull={false}>
    <div class="form">
      <div class="header">
        <h2>Verify your phone number</h2>
        <p class="subtitle">A code will be sent to your phone</p>
      </div>
      <div class="form-body">
        <Input
          label="Phone number"
          inputType="tel"
          placeholder= {`${selectedCountryCode.dial_code || "+1"} (555) 000-0000`}
          bind:value={phoneNumber}
          on:focus={focus}
          required={true}
          error={!!errorMessage}
          name="phone"
        >
          <div slot="leading-text" class="country-code">
            <DropDownInput
              value={selectedCountryCode}
              options={countryCodes}
              on:change={(e) => {
                const nextCode = e.detail;
                if (phoneNumber.startsWith(selectedCountryCode.dial_code)) {
                  phoneNumber = phoneNumber.replace(selectedCountryCode.dial_code, nextCode.dial_code);
                }
                selectedCountryCode = e.detail;
              }}
              name="country-code"
              searchable={true}
              searchPlaceholder="Search country..."
              class="country-selector"
            >
              <span slot="input-option" let:option class="country-option">
                <span class="country-name">{option?.code}</span>
              </span>
              <span slot="option" let:option class="country-option">
                <span class="country-name">{option.name}</span>
                <div class="country-code">{option.dial_code}</div>
              </span>
            </DropDownInput>
          </div>
          <span slot="error">{errorMessage}</span>
          <span slot="info">Phone number to receive the code</span>
        </Input>
        <Button
          full={true}
          size="lg"
          disabled={!isValidPhone || isLoading}
          on:click={sendVerificationCode}
        >
          {isLoading ? "Sending code..." : "Send verification code"}
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
  .phone-verification-step {
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
      .icon-wrapper {
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
        gap: var(--spacing-4xl, 32px);
        align-self: stretch;
        :global(.leading-text) {
          padding: 0;
        }
        :global(.leading-text  .input-element) {
          border: none;
        }

        :global(.select-dropdown) {
          min-width: 200px;
          left: 0;
          transform: translateX(0);
        }
        .country-option {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        // :global(.country-selector) {
        //   position: relative;
        //   display: flex;
        //   align-items: center;
        //   gap: var(--spacing-xs, 4px);
        // }

        // :global(.country-selector select) {
        //   background: transparent;
        //   border: none;
        //   color: var(--colors-text-text-primary-900, #fff);
        //   font-family: var(--font-family-font-family-body, Roboto);
        //   font-size: var(--font-size-text-sm, 14px);
        //   font-weight: 500;
        //   outline: none;
        //   cursor: pointer;
        //   padding-right: var(--spacing-lg, 12px);
        // }

        // :global(.country-selector select option) {
        //   background: var(--colors-background-bg-secondary, #2a2a2a);
        //   color: var(--colors-text-text-primary-900, #fff);
        // }

        // :global(.country-selector .chevron-down) {
        //   color: var(--colors-text-text-tertiary-600, #8c8c8c);
        //   position: absolute;
        //   right: 0;
        //   pointer-events: none;
        // }
      }
    }
  }
</style>
