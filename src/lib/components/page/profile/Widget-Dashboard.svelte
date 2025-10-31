<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │

	import { modalStore } from './../../../store/modal.ts';
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

  import { BetarenaUserHelper } from "$lib/firebase/common";
  import session from "$lib/store/session";
  import type { IProfileTrs } from "@betarena/scores-lib/types/types.profile.js";
  import { onMount } from "svelte";
  import DashboardActivity from "./dashboard/DashboardActivity.svelte";
  import DashboardEarnings from "./dashboard/DashboardEarnings.svelte";
  import DashboardEngagement from "./dashboard/DashboardEngagement.svelte";
  import DashboardQuickActions from "./dashboard/DashboardQuickActions.svelte";
  import DashboardTopArticles from "./dashboard/DashboardTopArticles.svelte";
  import DashboardWallets from "./dashboard/DashboardWallets.svelte";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  $: translations = ($page.data.RESPONSE_PROFILE_DATA as IProfileTrs).profile;
  $: ({ viewportType } = $session);
  let timer: ReturnType<typeof setInterval>;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount(() => {
    getRates();
    return () => {
      timer && clearInterval(timer);
    };
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

  async function getRates() {
    const res = await BetarenaUserHelper.getBtaTokenPriceQuote({
      query: { strAmount: "1", strCurrency: "USD" },
      body: {},
    });
    if (res.success) {
      $session.btaUsdRate = res.success.data.intBtaEstimate;
      return;
    }

    timer = setTimeout(() => {
      getRates();
    }, 60000);
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

<div id="dashboard-widget-container" class={viewportType}>
  {#if viewportType !== "mobile"}
    <div class="title">{translations?.dashboard || "Dashboard"}</div>

    <div class="sections-wrapper">
      <div class="section-left">
        <DashboardWallets />
        <DashboardEarnings />
        <DashboardTopArticles />
      </div>
      <div class="section-right">
        <DashboardEngagement />
        <DashboardActivity />
        <DashboardQuickActions />
      </div>
    </div>
  {:else}
    <DashboardWallets />
    <DashboardEngagement />
    <DashboardEarnings />
    <DashboardTopArticles />
    <DashboardActivity />
    <DashboardQuickActions />
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
  #dashboard-widget-container {
    height: 100%;
    min-height: 500px;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--spacing-3xl, 24px);

    &:not(.mobile) {
      border-radius: 12px;
      background: var(--colors-background-bg-secondary, #232323);
      padding: var(--spacing-2xl, 20px);
      gap: var(--spacing-2xl, 20px);
      .title {
        color: var(--colors-text-text-primary-900, #fff);

        /* Text xl/Semibold */
        font-family: var(--font-family-font-family-body, Roboto);
        font-size: var(--font-size-text-xl, 20px);
        font-style: normal;
        font-weight: 600;
        line-height: var(--line-height-text-xl, 30px); /* 150% */
      }

      .sections-wrapper {
        display: flex;
        gap: var(--spacing-2xl, 20px);
        flex-wrap: wrap;

        .section-left {
          flex: 4 1 450px;
          // max-width: 637px;
          min-width: 450px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2xl, 20px);
        }
        .section-right {
          max-width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
          min-width: 265px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2xl, 20px);
        }
      }
    }
  }
</style>
