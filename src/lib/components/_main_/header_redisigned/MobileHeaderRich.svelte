<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
	import { userBetarenaSettings } from '$lib/store/user-settings.js';
	import AssetBetarenaLogoFull from './assets/asset-betarena-logo-full.svelte';
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
  import { page } from "$app/stores";
  import TranslationText from "$lib/components/misc/Translation-Text.svelte";

  import userBetarenaSettings from "$lib/store/user-settings.js"
  import sessionStore from "$lib/store/session.js";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import Button from "$lib/components/ui/Button.svelte";
  import { translationObject } from "$lib/utils/translation.js";
  import WalletBalance from "../../ui/WalletBalance.svelte";
  import HeaderCLang from "./Header-C-Lang.svelte";
  import HeaderCTheme from "./Header-C-Theme.svelte";
  import LogoButton from "./LogoButton.svelte";
  import { scoresNavbarStore } from "./_store.js";
  import BuyBtaButton from "$lib/components/shared/BuyBta/Buy-BTA-Button.svelte"

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
  export let mobile, tablet;
  $: ({ globalState } = $sessionStore);
  $: ({user} = $userBetarenaSettings);

  $: isPWA = globalState.has("IsPWA")
  $: isAuth = !!user;
  $: trsanslationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;

  const /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = "main⮕header";

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

  function signIn() {
    $sessionStore.currentActiveModal = "Auth_Modal";
    return;
  }

  // #endregion ➤ 🛠️ METHODS
</script>
<svelte:window
  on:click={() => {
    scoresNavbarStore.closeAllDropdowns();
  }}
/>
<div class="wrapper" id={CNAME} class:pwa={isPWA} class:mobile>
  {#if !isAuth }
      <LogoButton {mobile} {tablet} />
  {/if}
  {#if isAuth && !isPWA}
    <div class="logo-full">
      <LogoButton {mobile} {tablet} />
    </div>
  {/if}

  {#if isAuth}
      <WalletBalance />
  {/if}

  <div class="actions">
    {#if !mobile && tablet}
      <HeaderCLang />
      <HeaderCTheme />
    {/if}
    {#if !isAuth}
      <Button type="outline" on:click={signIn}>
        <TranslationText
          key={"header-txt-unkown"}
          text={trsanslationData?.scores_header_translations?.sign_in}
          fallback={translationObject.sign_in}
        />
      </Button>
    {:else}
    <BuyBtaButton popup={true} />

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
  .wrapper {
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 12px 34px;
    flex-wrap: wrap;

    &.mobile {
      padding: 20px 16px;
    }

    .logo-full {
      width: 100%;
      margin-bottom: 19px;
    }
    &.pwa {
      flex-wrap: nowrap;
    }

    .actions {
      flex-grow: 1;
      align-items: center;
      justify-content: flex-end;
      display: flex;
      gap: 24px;
    }
  }
</style>
