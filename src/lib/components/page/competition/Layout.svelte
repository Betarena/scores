<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">
  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  import { browser } from "$app/environment";
  import { goto, preloadData } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import {
    listenRealTimeScoreboardAll,
    onceRealTimeLiveScoreboard,
  } from "$lib/firebase/common.js";
  import { subscribeCompetitionsAllListen } from "$lib/graphql/graphql.common.js";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { dlog } from "$lib/utils/debug";
  import { viewport_change } from "$lib/utils/platform-functions.js";
  import { tryCatch } from "$lib/utils/miscellenous.js";
  import { generateUrlCompetition } from "$lib/utils/string.js";

  import SeoBox from "$lib/components/SEO-Box.svelte";
  import SvelteSeo from "svelte-seo";
  import Breadcrumb from "./Breadcrumb.svelte";
  import MainWidget from "./main/Main-Widget.svelte";
  import RulesWidget from "./rules/Rules-Widget.svelte";

  import type {
    B_SAP_CTP_D,
    B_SAP_CTP_T,
    B_SAP_D3,
  } from "@betarena/scores-lib/types/seo-pages.js";
  import type { Unsubscribe } from "firebase/database";
  import { initialDevice, isPWA } from "$lib/utils/device.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  const /** */
    MOBILE_VIEW = 475,
    /** */
    TABLET_VIEW = 1160;
  let /** @description TODO: DOC: */
    mobileExclusive: boolean = true,
    /** @description TODO: DOC: */
    tabletExclusive: boolean = true,
    /** @description page data availabe for `this` layout */
    B_SAP_CTP_T: B_SAP_CTP_T,
    /** @description page data availabe for `this` layout */
    B_SAP_CTP_D: B_SAP_CTP_D,
    /** @description TODO: DOC: */
    B_SAP_D3_CP_M: B_SAP_D3,
    /** @description TODO: DOC: */
    B_SAP_D3_TEAM_M: B_SAP_D3,
    /** @description TODO: DOC: */
    current_lang: string = $sessionStore?.serverLang;
  $: B_SAP_CTP_T = $page.data?.B_SAP_CTP_T;
  $: B_SAP_CTP_D = $page.data?.B_SAP_CTP_D;
  $: B_SAP_D3_CP_M = $page.data?.B_SAP_D3_CP_M;
  $: B_SAP_D3_TEAM_M = $page.data?.B_SAP_D3_TEAM_M;
  $: refresh_lang = $userBetarenaSettings?.lang;
  $: lang_intent = $sessionStore?.lang_intent;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
  function resizeAction(): void {
    [tabletExclusive, mobileExclusive] = viewport_change(
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @description
   * TODO: DOC:
   */
  function initEventListeners(): void {
    // ### NOTE:
    // ### listen to changes in 'window.resize'.
    window.addEventListener("resize", function (): void {
      resizeAction();
    });
  }

  /**
   * @summary
   * 🟥 MAIN | 🔹 HELPER
   *
   * @param
   * { string } newURL - Target new `URL` that is to be navigated to.
   */
  async function navigateToTranslation(newURL: string): Promise<void> {
    await preloadData(newURL);
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @summary
   * 🔥 REACTIVITY | IMPORTANT
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Validate change in `lang`.
   *
   * WARNING:
   * triggered by changes in:
   * - `browser`
   * - `current_lang`
   * - `refresh_lang`
   */
  $: if_R_0 = browser;
  $: if (if_R_0 && current_lang != refresh_lang) {
    // ### [🐞]
    dlog(`🚏 checkpoint [R] ➤ competitions/Layout.svelte if_R_0`, true);

    current_lang = refresh_lang;

    let newURL: string = generateUrlCompetition(current_lang, B_SAP_CTP_D);

    // ### NOTE: | STASH:
    // ### Alternative navigational options, testing.
    /*
      invalidate('/api/cache/tournaments/cache-data.json');
      prefetch(newURL); // depreceated
      preloadData(newURL)
      goto(newURL, { replaceState: true });
    */

    goto(newURL, {
      replaceState: true,
    });
  }

  /**
   * @summary
   * 🔥 REACTIVITY | IMPORTANT
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * 📌 Validate change in `lang`.
   *
   * WARNING:
   * triggered by changes in:
   * - `browser`
   * - `lang_intent`
   */
  $: if_R_1 = browser;
  $: if (if_R_1 && lang_intent) {
    // ### [🐞]
    dlog(`🚏 checkpoint [R] ➤ competitions/Layout.svelte if_R_1`, true);

    let newURL: string = generateUrlCompetition(lang_intent, B_SAP_CTP_D);

    navigateToTranslation(newURL);
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🚏 ONE-OFF CONDITIONS

  /**
   * @description
   * TODO: DOC:
   */
  [mobileExclusive, tabletExclusive] = initialDevice($sessionStore.deviceType);

  // #endregion ➤ 🚏 ONE-OFF CONDITIONS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  onMount(async (): Promise<void> => {
    resizeAction();
    initEventListeners();

    subscribeCompetitionsAllListen();

    // ### NOTE:
    // ### causes a potential delay in data retrieval,
    // ### as waits for onMount of Page & components;
    await onceRealTimeLiveScoreboard();

    let connectionRef: Unsubscribe = listenRealTimeScoreboardAll();
  });

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]
</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### SVELTE INJECTION TAGS                                                              ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
### NOTE:
### SEO META TAGS
-->
{#if B_SAP_CTP_T}
  <SvelteSeo
    title={B_SAP_CTP_T?.main_data?.title}
    description={B_SAP_CTP_T?.main_data?.description}
    keywords={B_SAP_CTP_T?.main_data?.keywords}
    noindex={tryCatch(() => JSON.parse(B_SAP_CTP_T?.main_data?.noindex)) ??
      false}
    nofollow={tryCatch(() => JSON.parse(B_SAP_CTP_T?.main_data?.nofollow)) ??
      false}
    canonical={B_SAP_CTP_T?.main_data?.canonical}
    twitter={B_SAP_CTP_T?.twitter_card}
    openGraph={B_SAP_CTP_T?.opengraph}
  />
{/if}

<!--
### NOTE:
### HREFLANG TAGS
-->
<svelte:head>
  {#each B_SAP_CTP_T?.hreflang ?? [] as item}
    {#if item?.link == null}
      <link
        rel="alternate"
        hreflang={item?.hreflang}
        href="https://scores.betarena.com/{B_SAP_D3_CP_M?.['en']}"
      />
    {:else}
      <link
        rel="alternate"
        hreflang={item?.hreflang}
        href="https://scores.betarena.com/{item?.link}/{B_SAP_D3_CP_M?.[
          item?.link
        ]}"
      />
    {/if}
  {/each}
</svelte:head>

<!--
### NOTE:
### PAGE CRITICAL SEO
-->
<SeoBox>
  <h1>
    {B_SAP_D3_TEAM_M?.[$sessionStore?.serverLang]}
    {B_SAP_CTP_D?.data?.team_name}
  </h1>
</SeoBox>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<section id="page-competitions">
  {#if !isPWA()}
    <Breadcrumb />
  {/if}

  <div
    class="
    section-grid
    "
  >
    <MainWidget />

    <RulesWidget />
  </div>
</section>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>
  section#page-competitions {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    max-width: 1430px;
    padding-top: 12px;
  }

  div.section-grid {
    /* 🛝 layout */
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
    gap: 24px;
  }
</style>
