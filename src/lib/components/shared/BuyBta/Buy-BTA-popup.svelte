<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import { modalStore } from "$lib/store/modal.js";
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

  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { fly } from "svelte/transition";
  import IconArrowRight from "../assets/icon-arrow-right.svelte";
  import sessionStore from "$lib/store/session.js";
  import buyOptionsTranslations from "./store.js";

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
  $: data = $buyOptionsTranslations[$userBetarenaSettings.lang as string];
  $: options = [
    {
      name: data.competitions || "Competitions",
      description: data.info_competitions || "Get tokens to participate",
      link: data.link_competitions || "/competitions",
    },
    {
      name: data.presale || "Presale",
      description: data.info_presale || "Invest on BTA token presale",
      link: data.link_presale || `/u/investor/${$userBetarenaSettings.lang}`,
    },
  ];

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

<div
  in:fly={{ y: 200 }}
  class:mobile={$sessionStore.viewportType === "mobile"}
  out:fly={{ y: 200 }}
  class="wrapper"
  on:click={() => ($modalStore.show = false)}
>
  {#each options as option, i}
    <a href={option.link} class="option" title={option.description}>
      <div class="label">
        <span class="name">{option.name}</span>
        <span class="description">{option.description}</span>
      </div>
      <IconArrowRight color="var(--icon-color-light)" />
    </a>
    {#if i !== options.length - 1}
      <div class="separator" />
    {/if}
  {/each}
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
  .wrapper {
    position: fixed;

    z-index: 1000;
    border-radius: 16px 16px 0px 0px;
    max-width: 100%;
    display: inline-flex;
    background-color: var(--popup-bg-color);
    padding: 24px 16px 24px 20px;
    border-radius: 16px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;

    :global(svg) {
      width: 20px !important;
      height: 20px !important;
    }

    &.mobile {
      border-radius: 16px 16px 0px 0px;
      transform: unset;
      top: unset;
      bottom: 0;
      left: 50%;
      width: 100%;
      transform: translateX(-50%);

      .option {
        width: 100%;
      }
    }
  }

  .option {
    display: flex;
    width: 335px;
    max-width: 100%;
    justify-content: space-between;
    align-items: center;

    .label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .name {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
      }

      .description {
        font-size: 14px;
        color: var(--text-color-second-dark);
      }
    }
  }
  .separator {
    width: 100%;
    height: 1px;
    background: var(--popup-contrast-color);
  }
</style>
