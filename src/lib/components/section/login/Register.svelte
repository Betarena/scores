<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯
  import { browser } from "$app/environment";
  import { get } from "$lib/api/utils";
  import Button from "$lib/components/ui/Button.svelte";
  import StepBase from "$lib/components/ui/StepBase.svelte";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
  import { onDestroy, onMount } from "svelte";
  import { loginStore } from "./login-store";
  import LogoImg from "./LogoImg.svelte";
  import CountryStep from "./steps/CountryStep.svelte";
  import EmailStep from "./steps/EmailStep.svelte";
  import PasswordStep from "./steps/PasswordStep.svelte";
  import PhoneCodeStep from "./steps/PhoneCodeStep.svelte";
  import PhoneStep from "./steps/PhoneStep.svelte";
  import ProfileStep from "./steps/ProfileStep.svelte";
  import SportstackStep from "./steps/SportstackStep.svelte";
  import TopicsStep from "./steps/TopicsStep.svelte";
  // #endregion ➤ 📦 Package Imports

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

  $: ({ viewportType } = $session);
  $: ({ currentStep } = $loginStore);
  $: user = $userSettings.user?.scores_user_data;
  let defaultSteps = [
    EmailStep,
    PasswordStep,
    PhoneStep,
    PhoneCodeStep,
    ProfileStep,
    CountryStep,
    SportstackStep,
    TopicsStep,
  ];
  let stepMap: Record<string, typeof EmailStep> = {
    0: EmailStep,
  };

  let defaultDesktopSteps = {
    email: {
      title: "Your details",
      description: "Please provide your email",
      steps: [EmailStep],
    },
    password: {
      title: "Choose a password",
      description: "Choose a secure password",
      steps: [PasswordStep],
    },
    phone: {
      title: "Verify your phone",
      description: "Confirm your phone",
      steps: [PhoneStep, PhoneCodeStep],
    },
    profile: {
      title: "Profile",
      description: "Setting up your profile",
      steps: [ProfileStep, CountryStep, SportstackStep, TopicsStep],
    },
  };
  let desktopStepsGrouped = Object.values(defaultDesktopSteps);

  defaultSteps.forEach((component, index) => (stepMap[index] = component));

  $: if (user) {
    $loginStore.avatar = user.profile_photo || "";
    $loginStore.name = user.name || "";
  }

  $: if (browser && $loginStore.isExistedUser) {
    updateSteps();
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

  function updateSteps() {
    if (!$userSettings.user) return;
    let steps: Array<typeof PasswordStep> = [];
    let newDesktopSteps: typeof desktopStepsGrouped = [];
    let profileSteps: Array<typeof ProfileStep> = [];
    const { scores_user_data, firebase_user_data } = $userSettings.user;
    if (
      !firebase_user_data?.providerData.find(
        (provider) => provider.providerId === "password"
      )
    ) {
      // steps.push(PasswordStep);
    }
    if (
      !firebase_user_data?.phoneNumber &&
      new Date(scores_user_data?.register_date || "").valueOf() >
        new Date(2025, 7, 13).valueOf()
    ) {
      newDesktopSteps.push(defaultDesktopSteps.phone);
      steps.push(PhoneStep, PhoneCodeStep);
    }
    if (!scores_user_data?.name) {
      profileSteps.push(ProfileStep);
      steps.push(ProfileStep);
    }
    if (!scores_user_data?.country) {
      profileSteps.push(CountryStep);
      steps.push(CountryStep);
    }
    if ((scores_user_data?.subscriptions?.sportstacks?.length || 0) < 3) {
      profileSteps.push(SportstackStep);
      steps.push(SportstackStep);
    }
    if ((scores_user_data?.following?.tags?.length || 0) < 3) {
      profileSteps.push(TopicsStep);
      steps.push(TopicsStep);
    }
    if (profileSteps.length) {
      newDesktopSteps.push({
        ...defaultDesktopSteps.profile,
        steps: profileSteps,
      });
    }
    if (!steps.length) {
      history.back();
      return;
    }
    let nexSteps: Record<string, typeof EmailStep> = {};
    steps.forEach((component, index) => (nexSteps[index] = component));
    desktopStepsGrouped = newDesktopSteps;
    stepMap = { ...nexSteps };
    $loginStore.currentStep = 0;
  }

  async function getInitData() {
    const response = await get<{ data: Record<string, string>[] }>(
      "api/data/login"
    );
    if (response?.data) {
      loginStore.update((v) => ({
        ...v,
        translations: { ...response.data[0] },
        countries: { ...response.data[1] },
      }));
    }
  }

  function loginWithGoogle() {
    updateSteps();
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
    $loginStore.currentStep = 0;
    $loginStore.isLogin = false;
    getInitData();
    updateSteps();
  });

  onDestroy(() => {
    $loginStore.recaptchaVerifier?.clear();
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

<div class="login-page {viewportType}">
  <div class="desktop-side-pagination-wrapper">
    <div class="side-content">
      <div class="logo">
        <LogoImg />
      </div>
      <div class="steps-wrapper">
        {#each desktopStepsGrouped as group, step_index (step_index)}
          {@const stepsBefore = desktopStepsGrouped
            .slice(0, Number(step_index))
            .reduce((acc, curr) => acc + curr.steps.length, 0)}
          <StepBase
            title={group.title}
            step={Number(step_index) + 1}
            color="brand"
            checked={stepsBefore + group.steps.length <= currentStep}
            active={currentStep >= stepsBefore &&
              currentStep < stepsBefore + group.steps.length}
            description={group.description}
          />
        {/each}
      </div>
    </div>
  </div>

  <div class="login-wrapper {viewportType}">
    {#if currentStep}
      <div class="back-button">
        <Button
          type="secondary"
          size="sm"
          on:click={() => ($loginStore.currentStep -= 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            class="arrow"
          >
            <path
              d="M15.8333 9.99996H4.16666M4.16666 9.99996L9.99999 15.8333M4.16666 9.99996L9.99999 4.16663"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
      </div>
    {/if}
    <div class="content">
      <svelte:component
        this={stepMap[currentStep]}
        on:loginWithGoogle={loginWithGoogle}
      />
    </div>
    {#if stepMap[0] !== EmailStep || currentStep}
      <div class="pagination-wrapper">
        {#each Object.keys(stepMap) as step}
          <div class="step-tab" class:active={Number(step) === currentStep} />
        {/each}
      </div>
    {/if}

    <div id="recaptcha-container" />
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
  .login-page {
    display: flex;
    width: 100%;
    height: 100dvh;
    .desktop-side-pagination-wrapper {
      display: none;

      .side-content {
        display: flex;
        padding: var(--spacing-4xl, 32px) var(--spacing-4xl, 32px) 0
          var(--spacing-4xl, 32px);
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-8xl, 80px);
        align-self: stretch;

        .logo {
          color: var(--colors-text-text-primary_on-brand, #fbfbfb);
        }

        .steps-wrapper {
          display: flex;
          padding-right: var(--spacing-4xl, 32px);
          flex-direction: column;
          align-items: flex-start;
          align-self: stretch;
          color: var(--colors-border-border-brand_alt);

          :global(.connecter-wrapper) {
            padding-bottom: 0;
          }
        }
      }
    }
    &.desktop {
      .desktop-side-pagination-wrapper {
        display: flex;
        max-width: 440px;
        width: 440px;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex: 1 0 0;
        align-self: stretch;
        background: var(--colors-background-bg-brand-section, #232323);
      }
      :global(.container-wrapper) {
        max-width: calc(360px + 68px); // compensate inline paddings
      }
      .login-wrapper {
        .content {
          padding: var(--spacing-11xl, 160px) 0 var(--spacing-9xl, 96px) 0;
        }
      }
    }
    .login-wrapper {
      flex-grow: 1;
      height: 100%;
      max-height: 100%;
      background: var(--colors-background-bg-primary, #1f1f1f);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .content {
        flex-grow: 1;
        max-width: 100vw;
        overflow-x: hidden;
        padding: var(--spacing-6xl, 48px) 0;
      }

      .back-button {
        position: absolute;
        left: 16px;
        top: 19px;
        z-index: 2;
        :global(.button) {
          padding: var(--spacing-md, 8px);
        }
        .arrow {
          color: var(--colors-foreground-fg-quaternary-400);
        }
      }
      .pagination-wrapper {
        padding: 0 var(--container-padding-mobile, 16px);
        padding-bottom: 40px;
        width: 100%;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-lg, 12px);

        .step-tab {
          height: 8px;
          flex: 1 0 0;
          border-radius: var(--radius-full, 9999px);
          background: var(--colors-background-bg-quaternary, #525252);
          &.active {
            background: var(--colors-foreground-fg-brand-primary_alt, #d2d2d2);
          }
        }
      }

      &.tablet {
        .content {
          max-width: calc(343px + 68px); // padding compensation
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          overflow-x: hidden;
        }
        .pagination-wrapper {
          max-width: calc(343px + 68px); // padding compensation
          width: 100%;
          margin: 0 auto;
          padding-bottom: 147px;
        }
      }

      &.desktop {
        .pagination-wrapper {
          display: none;
        }
      }
    }
  }
</style>
