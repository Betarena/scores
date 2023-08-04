<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FeatBetSiteLoader from './FeatBetSite-Loader.svelte';

	import type { B_FEATB_T } from '@betarena/scores-lib/types/feat-betsite.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let
    WIDGET_T_DATA: B_FEATB_T = $page.data?.FEATURED_BETTING_SITES_WIDGET_DATA_SEO,
    NO_WIDGET_DATA: boolean = true,
    FeatBetSiteMain: any
  ;

  $: WIDGET_T_DATA = $page.data?.FEATURED_BETTING_SITES_WIDGET_DATA_SEO;
  $: WIDGET_TITLE =
    WIDGET_T_DATA != undefined
      ? WIDGET_T_DATA?.translations?.widget_title || 'Featured Betting Site'
      : 'Featured Betting Site'
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * [MAIN] [INIT]
   * @description
   * main widget data loader,
   * (and) try..catch (error) handler
   * (and) placeholder handler
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

  onMount
  (
    async () =>
    {
      FeatBetSiteMain = (await import('./FeatBetSite-Main.svelte')).default;
	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<SeoBox>
  <h2> {WIDGET_T_DATA?.translations?.widget_title} </h2>
  <p>	{WIDGET_T_DATA?.translations?.title}</p>
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
  <svelte:component this={FeatBetSiteMain} B_FEATB_T={WIDGET_T_DATA} />
  <!-- <FeatBetSiteMain
    B_FEATB_T={WIDGET_T_DATA}
  /> -->
{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

</style>