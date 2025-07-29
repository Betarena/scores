<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import session from "$lib/store/session";
  import EmailStep from "./steps/EmailStep.svelte";
  import PasswordStep from "./steps/PasswordStep.svelte";

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
  let currentStep = 0;
  const stepMap = {
    0: EmailStep,
    1: PasswordStep,
    2: "",
    3: "",
  };

  // #endregion ➤ 📌 VARIABLES
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

<div class="login-wrapper {viewportType}">
  {#if currentStep}
    <!-- content here -->
    <div class="back-button">
      <Button type="secondary" size="sm" on:click={() => currentStep--}>
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
  <svelte:component this={stepMap[currentStep]} bind:currentStep />
  {#if currentStep}
    <div class="pagination-wrapper">
      {#each Object.keys(stepMap).slice(1) as step}
        <div class="step-tab" class:active={Number(step) === currentStep} />
      {/each}
    </div>
    <!-- content here -->
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
  .login-wrapper {
    width: 100%;
    height: 100vh;
    background: var(--colors-background-bg-primary, #1f1f1f);
    position: fixed;
    top: 0;
    left: 0;

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
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-lg, 12px);
      position: fixed;
      bottom: 35px;
      left: 0;
      z-index: 2;

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
  }
</style>
