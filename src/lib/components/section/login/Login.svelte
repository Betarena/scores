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
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session";
  import userSettings from "$lib/store/user-settings";
  import { onMount } from "svelte";
  import { loginStore } from "./login-store";
  import EmailStep from "./steps/EmailStep.svelte";
  import ResetPassword from "./steps/ResetPassword.svelte";
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
    ResetPassword
  ];
  let stepMap: Record<string, typeof EmailStep> = {
    0: EmailStep,
    1: ResetPassword
  };

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯
  onMount(() => {
    $loginStore.currentStep = 0;
    $loginStore.isLogin = true;
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
      />
    </div>
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
    height: 100vh;

    &.desktop {
      :global(.container-wrapper) {
        max-width: calc(360px + 68px); // compensate inline paddings
      }
    }
  }
  .login-wrapper {
    flex-grow: 1;
    height: 100%;
    max-height: 100vh;
    background: var(--colors-background-bg-primary, #1f1f1f);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      flex-grow: 1;
      max-width: 100vw;
      overflow-x: hidden;
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
</style>
