<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { get } from '$lib/api/utils.js';
	import { translationObject } from '$lib/utils/translation.js';

	import SeoBox from '$lib/components/SEO-Box.svelte';

	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
	import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';
	import MainLoader from './Main-Loader.svelte';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
  // import FeatBetSiteMain from './FeatBetSite-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** @description dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** @description main widget Translations data */
    WIDGET_T_DATA: B_FEATB_T = $page.data?.B_FEATB_T,
    /** @description wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** @description main widget data */
    WIDGET_DATA: B_COMP_HIGH_D,
    /** @description dynamic import variable for svelte component */
    MainMainAsDynamic: any
  ;

  $: WIDGET_T_DATA = $page.data?.B_FEATB_T;
  $: WIDGET_TITLE = WIDGET_T_DATA?.translations?.widget_title ?? translationObject?.featured_bet_site;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * 🟩 MAIN
   *
   * @description
   * 📌 main widget data loader
   *
   * ⚡️ (and) try..catch (error) handler
   *
   * ⚡️ (and) placeholder handler
   *
   * @returns
   * Target `widget` data for client, but at times not used.
   */
  async function widgetInit
  (
  ): Promise < void >
  {
		if (!browser) return;

		// await sleep(3000);

    const response = await get
    (
      `/api/data/competition/main?competition_id=${$page.data?.COMPETITION_ID}`
    ) as B_COMP_HIGH_D;

    WIDGET_DATA = response;

    // ### CHECK
    // ### for conditions when 'this' widget should not be shown.
    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // dlog(`${LV2_W_H_TAG[0]} ❌ no data available!`);
			NO_WIDGET_DATA = true;
			return;
		}
    NO_WIDGET_DATA = false;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  /**
   * @description
   * TODO: DOC:
  */
  onMount
  (
    async (
    ): Promise < void > =>
    {

      if (useDynamicImport)
      {
        MainMainAsDynamic = (await import('./Main-Main.svelte')).default;
      }

	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

<SeoBox>
  <!-- TODO: -->
</SeoBox>

<!-- [🐞] -->
<!-- <MainLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <MainLoader />
{:then data}
  <!--
  ### NOTE:
  ### promise was fulfilled
  -->

  <!--
  ### NOTE:
  ### Dynamic Svelte Component Import
  ### WARNING:
  ### Disable, if Standard Import is Enabled.
  -->
  <svelte:component
    this={MainMainAsDynamic}
    WIDGET_DATA={WIDGET_DATA}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <FeatBetSiteMain
      B_FEATB_T={WIDGET_T_DATA}
    />
  -->

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}