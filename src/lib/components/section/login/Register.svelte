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
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import StepBase from "$lib/components/ui/StepBase.svelte";
  import { clearRecaptcha } from "$lib/firebase/firebase.actions";
  import history_store from "$lib/store/history";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
  import { gotoSW } from "$lib/utils/sveltekitWrapper";
  import { updateUserProfileData } from "$lib/utils/user";
  import type { PageData } from ".svelte-kit/types/src/routes/(scores)/[[lang=lang]]/(auth)/register/$types";
  import { onDestroy, onMount } from "svelte";
  import { loginStore } from "./login-store";
  import LogoImg from "./LogoImg.svelte";
  import CountryStep from "./steps/CountryStep.svelte";
  import LoginStep from "./steps/LoginStep.svelte";
  import PasswordStep from "./steps/PasswordStep.svelte";
  import PhoneCodeStep from "./steps/PhoneCodeStep.svelte";
  import PhoneStep from "./steps/PhoneStep.svelte";
  import ProfileStep from "./steps/ProfileStep.svelte";
  import ReadyToCreate from "./steps/ReadyToCreate.svelte";
  import ReadyToPublish from "./steps/ReadyToPublish.svelte";
  import SportstackDescriptionStep from "./steps/SportstackDescriptionStep.svelte";
  import SportstackDomainStep from "./steps/SportstackDomainStep.svelte";
  import SportstackProfileStep from "./steps/SportstackProfileStep.svelte";
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
  $: ({ currentStep, isExistedUser, verifiedSteps, recaptchaVerifier } = $loginStore);
  $: ({ scores_user_data: user } = $userSettings.user || {});
  $: ([translations] = $page.data.auth_translations.data);
  let defaultSteps = [
    LoginStep,
    PasswordStep,
    PhoneStep,
    PhoneCodeStep,
    ProfileStep,
    CountryStep,
    SportstackStep,
    TopicsStep,
    ReadyToPublish,
    SportstackDomainStep,
    SportstackProfileStep,
    SportstackDescriptionStep,
    ReadyToCreate,
  ];
  let stepMap: Record<string, typeof LoginStep> = {
    0: LoginStep,
  };

  $: defaultDesktopSteps = {
    email: {
      id: "email",
      title: translations.your_details || "Your details",
      description: translations.provide_email || "Please provide your email",
      steps: [LoginStep],
    },
    password: {
      id: "password",
      title: translations.choose_password || "Choose a password",
      description:
        translations.choose_secure_password || "Choose a secure password",
      steps: [PasswordStep],
    },
    phone: {
      title: translations.verify_phone || "Verify your phone",
      id: "phone",
      description: translations.verify_phone || "Confirm your phone",
      steps: [PhoneStep, PhoneCodeStep],
    },
    profile: {
      title: translations.profile || "Profile",
      id: "profile",
      description: translations.set_up_profile || "Setting up your profile",
      steps: [ProfileStep, CountryStep],
    },
    follow_sportstack: {
      title: translations.follow_sportstacks || "Follow Sportstacks",
      description:
        translations.follow_favorite_publications ||
        "Follow your favorite publications",
      steps: [SportstackStep],
      id: "follow_sportstack",
    },
    follow_topics: {
      title: translations.follow_topics || "Follow Topics",
      description:
        translations.follow_favorite_topics || "Follow your favorite topics",
      steps: [TopicsStep],
      id: "follow_tags",
    },
    publication: {
      title: translations.create_publication || "Create Publication",
      description:
        translations.create_publication_description ||
        "Create a new publication",
      steps: [
        ReadyToPublish,
        SportstackDomainStep,
        SportstackProfileStep,
        SportstackDescriptionStep,
        ReadyToCreate,
      ],
      id: "publication",
    },
  };
  $: desktopStepsGrouped = Object.values(defaultDesktopSteps || {});

  defaultSteps.forEach((component, index) => (stepMap[index] = component));
  $: if (user) {
    $loginStore.avatar = user.profile_photo || "";
    $loginStore.name = user.name || "";
  }

  $: if (browser && isExistedUser) {
    updateSteps();
  }

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
$: if (verifiedSteps.includes("phone")) {
  // Phone verification step is completed
  clearRecaptcha("recaptcha-container");
}


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

  async function updateSteps() {
    if (!$userSettings.user) return;
    let steps: Array<typeof PasswordStep> = [];
    let newDesktopSteps: typeof desktopStepsGrouped = [];
    let profileSteps: Array<typeof ProfileStep> = [];
    const { scores_user_data, firebase_user_data } = $userSettings.user;
    $loginStore.verifiedSteps = ["password"];
    if (
      !firebase_user_data?.providerData.find(
        (provider) => provider.providerId === "password"
      )
    ) {
      // steps.push(PasswordStep);
    }
    if (firebase_user_data && !firebase_user_data.email) {
      // newDesktopSteps.push({...defaultDesktopSteps.email, steps: [EmailStep]});
      // steps.push(EmailStep);
      $loginStore.verifiedSteps.push("email");
    } else {
      $loginStore.verifiedSteps.push("email");
    }
    if (
      !firebase_user_data?.phoneNumber &&
      new Date(scores_user_data?.register_date || "").valueOf() >
        new Date(2025, 7, 29).valueOf()
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
      newDesktopSteps.push(defaultDesktopSteps.follow_sportstack);
      steps.push(SportstackStep);
    }
    if ((scores_user_data?.following?.tags?.length || 0) < 3) {
      newDesktopSteps.push(defaultDesktopSteps.follow_topics);
      steps.push(TopicsStep);
    }
    if (profileSteps.length) {
      const phoneStepIndex = newDesktopSteps.findIndex(
        (step) => step.id === "phone"
      );
      const profileStep = {
        ...defaultDesktopSteps.profile,
        steps: profileSteps,
      };
      if (phoneStepIndex !== -1) {
        newDesktopSteps.splice(phoneStepIndex + 1, 0, profileStep);
      } else {
        newDesktopSteps.unshift(profileStep);
      }
    }
    if (!steps.length) {
      await updateUserProfileData({ verified: true });
      const history = $history_store.reverse();
      const prev_path = history.find(
        (path) => !path.includes("login") && !path.includes("register")
      );
      $session.currentActiveModal = null;
      gotoSW(prev_path || "/", true);
      return;
    }
    newDesktopSteps.push(defaultDesktopSteps.publication);
    steps.push(
      ReadyToPublish,
      SportstackDomainStep,
      SportstackProfileStep,
      SportstackDescriptionStep,
      ReadyToCreate
    );
    $loginStore.isExistedUser = true;
    let nexSteps: Record<string, typeof LoginStep> = {};
    steps.forEach((component, index) => (nexSteps[index] = component));
    desktopStepsGrouped = newDesktopSteps;
    stepMap = { ...nexSteps };
    $loginStore.currentStep = 0;
  }

  async function getInitData() {
    const data = $page.data as PageData;
    $loginStore.translations = { ...data.auth_translations.data[0] };
    $loginStore.countries = { ...data.auth_translations.data[1] };
  }

  function loginWithGoogle() {
    updateUserProfileData({ registration_type: ["google"] });
    updateSteps();
    $loginStore.currentStep = 2;
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
    clearRecaptcha("recaptcha-container");
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
  {#if viewportType === "desktop" && ![ReadyToCreate, ReadyToPublish].includes(stepMap[currentStep])}
    <div class="desktop-side-pagination-wrapper">
      <div class="side-content">
        <div
          class="logo"
          on:click={() => {
            $session.currentActiveModal = null;
            gotoSW("/", true)
          }}
        >
          <LogoImg />
        </div>
        <div class="steps-wrapper">
          {#each desktopStepsGrouped as group, step_index (step_index)}
            {@const stepsBefore = desktopStepsGrouped
              .slice(0, Number(step_index))
              .reduce((acc, curr) => acc + curr.steps.length, 0)}
            {@const isStepBeforeVerified =
              !step_index ||
              $loginStore.verifiedSteps.includes(
                desktopStepsGrouped[step_index - 1].id
              )}
            {@const isStepVerified = $loginStore.verifiedSteps.includes(
              group.id
            )}
            {@const isNotAllowedToNavigate =
              ["email", "password"].includes(group.id) && $userSettings.user}

            <StepBase
              on:click={() => {
                if (isNotAllowedToNavigate) return;
                if (
                  isStepBeforeVerified ||
                  (isStepVerified &&
                    ![LoginStep, PasswordStep].includes(group.steps[0]))
                ) {
                  $loginStore.currentStep = stepsBefore;
                }
              }}
              title={group.title}
              step={Number(step_index) + 1}
              color="brand"
              available={!isNotAllowedToNavigate &&
                (isStepBeforeVerified || isStepVerified)}
              checked={$loginStore.verifiedSteps.includes(group.id)}
              active={currentStep >= stepsBefore &&
                currentStep < stepsBefore + group.steps.length}
              description={group.description}
            />
          {/each}
        </div>
        <div class="footer">© Betarena 2025</div>
      </div>
    </div>
  {/if}

  <div class="login-wrapper {viewportType}">
    {#if viewportType !== "desktop" && currentStep && ![ReadyToPublish, ReadyToCreate].includes(stepMap[currentStep])}
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
    <div
      class="content"
      class:no-padding={[ReadyToPublish, ReadyToCreate].includes(
        stepMap[currentStep]
      )}
    >
      <svelte:component
        this={stepMap[currentStep]}
        on:loginWithGoogle={loginWithGoogle}
      />
    </div>
    {#if stepMap[0] !== LoginStep || (currentStep && ![ReadyToPublish, ReadyToCreate].includes(stepMap[currentStep]))}
      <div class="pagination-wrapper">
        {#each Object.entries(stepMap) as step, index}
          {#if ![ReadyToCreate, ReadyToPublish].includes(step[1])}
            <div
              class="step-tab"
              class:active={Number(index) === currentStep}
            />
          {/if}
        {/each}
      </div>
    {/if}
    {#if $loginStore.recaptchaVerifier !== null && [PhoneStep, PhoneCodeStep].includes(stepMap[currentStep])}
      <div id="recaptcha-container" />
    {/if}
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
    min-height: 100dvh;
    height: 100%;
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
        height: 100%;

        .logo {
          cursor: pointer;
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

        .footer {
          margin-top: auto;
          display: flex;
          height: 96px;
          padding: var(--spacing-4xl, 32px);
          justify-content: center;
          align-items: flex-end;
          align-self: stretch;

          color: var(--colors-text-text-tertiary_on-brand, #8c8c8c);

          /* Text sm/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
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
      min-height: 100dvh;
      flex-grow: 1;
      height: 100%;
      max-height: 100%;
      background: var(--colors-background-bg-primary, #1f1f1f);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .content {
        flex-shrink: 0;
        flex-grow: 1;
        max-width: 100vw;
        overflow-x: hidden;
        padding: var(--spacing-6xl, 48px) 0;

        &.no-padding {
          padding: 0;
        }
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
