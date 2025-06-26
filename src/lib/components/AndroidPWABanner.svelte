<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { Button } from '$lib/components/ui/Button.svelte';
	import XClose from './ui/infomessages/x-close.svelte';
	import { fly } from 'svelte/transition';
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

  import { onMount } from "svelte";
  import { isAndroid, isPWA } from "$lib/utils/device.js";
  import userSettings from "$lib/store/user-settings.js";
  import { fly } from "svelte/transition";
  import XClose from "./ui/assets/x-close.svelte";
  import Button from "./ui/Button.svelte";
  import Icon from "$lib/components/ui/assets/Icon-app.png";
  import { page } from "$app/stores";

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

  let showInstallBanner = false;
  let showOpenAppBanner = false;

  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.betarena.scores";
  const intentUrl =
    "intent://betarena.com/#Intent;package=com.betarena.scores;scheme=https;end;";

  $: ({ theme } = $userSettings);
  $: ({app_install_translations: translation} = $page.data)

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(async () => {
    const android = isAndroid();
    if (typeof window !== "undefined" && android && !isPWA()) {
      if ("getInstalledRelatedApps" in navigator) {
        const related = await (navigator as any).getInstalledRelatedApps();
        showOpenAppBanner = related.some(
          (app) => app.id === "com.betarena.scores"
        );
        showInstallBanner = !showOpenAppBanner;
      } else {
        showInstallBanner = true;
      }
    }
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  function close() {
    showInstallBanner = false;
    showOpenAppBanner = false;
  }

  // #endregion ➤ 🛠️ METHODS
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

{#if showInstallBanner || showOpenAppBanner}
  <div
    class="pwa-banner {theme === 'Dark' ? 'dark-mode' : 'light-mode'}"
    in:fly
  >
    <button on:click={close}>
      <XClose
        size={17}
        color=" var(--colors-text-text-tertiary-600, #8c8c8c)"
      />
    </button>
    <div class="logo" style="background-image: url({Icon});" />
    <div class="text-wrapper">
      <div class="title">{translation?.title ||  "Betarena - Sports"}</div>
      <div class="description">
        {translation?.subtitle || "Latest updates on sports."}
      </div>
    </div>
    <div class="button">
      {#if showOpenAppBanner}
        <Button
          href={intentUrl}
          style="width:max-content"
          type="link-color">{translation?.open || "OPEN"} </Button
        >
      {:else}
        <Button href={playStoreUrl} blank={true} type="link-color"
          >{translation?.install || "INSTALL"} </Button
        >
      {/if}
    </div>
  </div>
{/if}

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
  .pwa-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    z-index: 9999;
    display: flex;
    height: 90px;
    padding: var(--spacing-xl, 16px) var(--container-padding-mobile, 16px);
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-lg, 12px);
    flex-shrink: 0;
    align-self: stretch;
    border-bottom: 1px solid var(--colors-border-border-primary, #525252);
    background: var(--colors-background-bg-secondary_subtle, #313131);
    color: var(--colors-text-text-tertiary-600, #8c8c8c);
    gap: var(--spacing-xl, 16px);

    button {
      background: none;
      padding: 0;
    }

    .logo {
      width: 68px;
      height: 68px;
    }

    .text-wrapper {
      // display: flex;
      // flex-d
      .title {
        color: var(--colors-text-text-secondary-700, #fbfbfb);

        /* Text md/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
      .description {
        color: var(--colors-text-text-tertiary-600, #8c8c8c);

        /* Text md/Regular */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-md, 16px);
        font-style: normal;
        font-weight: 400;
        line-height: var(--line-height-text-md, 24px); /* 150% */
      }
    }
    .button {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: end;

      :global(.link-color) {
        color: var(--colors-brand-500, #F5620F);
      }
    }
  }
</style>
