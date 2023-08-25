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
	import HighlightsLoader from './Highlights-Loader.svelte';

	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';
	import type { B_COMP_HIGH_D } from '@betarena/scores-lib/types/types.competition.highlights.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
  // import HighlightsGrid from './Highlights-Grid.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_FEATB_T = $page.data?.B_FEATB_T,
    /** Main widget data */
    WIDGET_DATA: [number, B_COMP_HIGH_D][],
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    HighlightsGridDynamic: any
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
      `/api/data/competition/highlights`
    ) as [number, B_COMP_HIGH_D][];

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
        HighlightsGridDynamic = (await import('./Highlights-Grid.svelte')).default;
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
<div
  id="loader-grid"
>
  {#each { length: 4 } ?? [] as item}
    <HighlightsLoader />
  {/each}
</div>

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <!-- <div>
    {#each { length: 4 } ?? [] as item}
      <HighlightsLoader />
    {/each}
  </div> -->
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
    this={HighlightsGridDynamic}
    WIDGET_DATA={new Map(WIDGET_DATA)}
  />

  <!--
  ### NOTE:
  ### Standard Svelte Component Import
  ### WARNING:
  ### Disable, if Dynamic Import is Enabled.
  -->
  <!--
    <HighlightsGrid
      WIDGET_DATA={new Map(WIDGET_DATA)}
    />
  -->

{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

  div#loader-grid
  {
    display: grid;
    height: 550px;
    gap: 20px;
    grid-template-columns: auto;
    overflow-y: hidden;
    overflow-x: scroll;
  }

  /*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 1160px)
  {

    div#loader-grid
    {
			gap: 20px;
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}

	}

</style>