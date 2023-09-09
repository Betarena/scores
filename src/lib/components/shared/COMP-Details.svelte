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

	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	import sessionStore from "$lib/store/session.js";
	import { removeDiacritics } from '$lib/utils/languages.js';
	import { toDecimalFix } from '$lib/utils/platform-functions.js';

	import type { B_SAP_D3 } from '@betarena/scores-lib/types/seo-pages.js';
	import type { B_COMP_HIGH_D, B_COMP_HIGH_T } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @description TODO: DOC: */
    isViewMobile: boolean,
    /** @description TODO: DOC: */
    isViewTablet: boolean,
    /** @description competition (shared) - target competition data */
    B_COMP_HIGH_D: B_COMP_HIGH_D,
    /** @description competition (shared) - target competition translations */
    WIDGET_T_DATA: B_COMP_HIGH_T
  ;

  const
    /**
     * @description
     * 📌 `this` component **main** `id` and `data-testid` prefix.
    */
    CNAME = 'shared⮕w⮕competition-details'
  ;

  let
    /** @description general page - `football` term(s) data translations */
    B_SAP_D3_SP_M: B_SAP_D3,
    /** @description TODO: DOC: */
    counterTotalPrize: number = 0,
    /** @description TODO: DOC: */
    counterTotalAnimated: boolean = true
  ;

  $: B_SAP_D3_SP_M = $page.data?.B_SAP_D3_SP_M;

  $: langUrlPrefix =
    $sessionStore?.serverLang == 'en'
      ? `/`
      : `/${$sessionStore?.serverLang}/`
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
  function countAnimation
  (
  ): void
  {
    let counts: NodeJS.Timer = setInterval(updated);
    let totalCount: number = B_COMP_HIGH_D?.competition?.data?.total_prize - B_COMP_HIGH_D?.competition?.data?.betarena_commission;

    function updated(): void
    {
      ++counterTotalPrize;
      if (counterTotalPrize >= totalCount)
      {
        clearInterval(counts);
        counterTotalAnimated = false;
      }
    }
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    () =>
    {
      countAnimation();
    }
  )

  onDestroy
  (
    () =>
    {
      // do something
    }
  )

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class="" styles                            ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<!--
COMPETITION DETAILS
-->
<div
  id="{CNAME}⮕grid-details"
  class:m-r-64={!isViewTablet}
  style="white-space: nowrap;"
>

  <!--
  COMPETITION - TYPE
  -->
  <div>

    <p
      class=
      "
      s-12
      color-black-2
      grey-v1
      "
    >
      {WIDGET_T_DATA?.title_type ?? 'Type'}
    </p>

    <p
      class=
      "
      s-16
      color-black-2
      w-500
      "
    >
      {'Single predictor'}
      <!-- {B_COMP_HIGH_D?.competition?.category_id} -->
    </p>

  </div>

  <!--
  COMPETITION - SPORT
  -->
  <a
    href={langUrlPrefix}{removeDiacritics(B_SAP_D3_SP_M?.[$sessionStore?.serverLang])}>

    <div>

      <p
        class=
        "
        s-12
        color-black-2
        grey-v1
        "
      >
        {WIDGET_T_DATA?.title_sport ?? 'Sport'}
      </p>

      <p
        class=
        "
        s-16
        color-black-2
        w-500
        "
      >
        {'Football'}
        <!-- {B_COMP_HIGH_D?.competition?.data?.sport_id} -->
      </p>

    </div>

  </a>

  <!--
  COMPETITION - ENTRY FEE
  -->
  <div>

    <p
      class=
      "
      s-12
      color-black-2
      no-wrap
      grey-v1
      "
    >
      {WIDGET_T_DATA?.title_entry_fee ?? 'Entry Fee'}
    </p>

    <p
      class=
      "
      s-16
      color-black-2
      w-500
      "
    >
      {B_COMP_HIGH_D?.competition?.data?.entry_fee ?? ''} BTA
      <span
        class=
        "
        color-grey-v2
        grey-v1
        "
      >
      (${B_COMP_HIGH_D?.competition?.data?.entry_fee ?? ''})
      </span>
    </p>

  </div>

  <!--
  COMPETITION - TOTAL PRIZE
  -->
  <div>

    <p
      class=
      "
      s-12
      color-black-2
      grey-v1
      "
    >
      {WIDGET_T_DATA?.title_total_prize ?? 'Total prize'}
    </p>

    <p
      class=
      "
      s-16
      w-500
      color-black-2
      "
    >

      {#if !counterTotalAnimated}
        {toDecimalFix((B_COMP_HIGH_D?.competition?.data?.total_prize - B_COMP_HIGH_D?.competition?.data?.betarena_commission), 2) ?? ''} BTA
      {:else}
        {toDecimalFix(counterTotalPrize, 2)} BTA
      {/if}

      <span
        class=
        "
        color-grey-v2
        grey-v1
        "
      >
        {#if !counterTotalAnimated}
          (${toDecimalFix((B_COMP_HIGH_D?.competition?.data?.total_prize - B_COMP_HIGH_D?.competition?.data?.betarena_commission), 2) ?? ''})
        {:else}
          (${toDecimalFix(counterTotalPrize, 2)})
        {/if}
      </span>

    </p>

  </div>

</div>

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

  div#shared⮕w⮕competition-details⮕grid-details
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 40px;
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  @media only screen
  and (min-width: 726px)
  {

    div#shared⮕w⮕competition-details⮕grid-details
    {
      /* 🎨 style */
      /* grid-template-columns: 1fr 1fr 1fr 1fr; */
      justify-content: space-between;
      grid-template-rows: 1fr;
      grid-auto-flow: column;
      gap: 24px 58px;
    }

  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

</style>
