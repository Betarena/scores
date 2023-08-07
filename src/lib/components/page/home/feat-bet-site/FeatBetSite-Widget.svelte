<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { translationObject } from '$lib/utils/translation.js';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FeatBetSiteLoader from './FeatBetSite-Loader.svelte';

	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';

  // ### WARNING:
  // ### Disable, if Dynamic Import is Enabled.
  // import FeatBetSiteMain from './FeatBetSite-Main.svelte';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  const
    /** Dynamic import variable condition */
    useDynamicImport: boolean = true
  ;

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_FEATB_T = $page.data?.B_FEATB_T,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    /** Dynamic import variable for svelte component */
    FeatBetSiteMainDynamic: any
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
		// await sleep(3000);

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
        FeatBetSiteMainDynamic = (await import('./FeatBetSite-Main.svelte')).default;
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
  <h2> {WIDGET_T_DATA?.translations?.widget_title} </h2>
  <p>	{WIDGET_T_DATA?.translations?.title} </p>
</SeoBox>

<!-- [🐞] -->
<!-- <FeatBetSiteLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <FeatBetSiteLoader />
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
    this={FeatBetSiteMainDynamic}
    B_FEATB_T={WIDGET_T_DATA}
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