<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { get } from '$lib/api/utils';
	import { onMount } from 'svelte';

	import { dlog, LV2_W_H_TAG } from '$lib/utils/debug';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import LivescoresLoader from './Livescores_Loader.svelte';
// import LivescoresMain from './Livescores_Main.svelte';

	import type { B_LS2_D, B_LS2_S, B_LS2_T } from '@betarena/scores-lib/types/livescores-v2.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  let
    /** Main widget Translations data */
    WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA,
    /** Main widget SEO data */
    WIDGET_S_DATA: B_LS2_S = $page.data?.LIVESCORES_V2_SEO,
    /** Main widget data */
    WIDGET_DATA: B_LS2_D,
    /** Wether widget has or no data */
    NO_WIDGET_DATA: boolean = true,
    LivescoresMain: any
  ;

  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA;
  $: WIDGET_S_DATA = $page.data?.LIVESCORES_V2_SEO;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * TODO: DOC:
   */
  async function widgetInit
  (
  ): Promise < B_LS2_D >
  {

    if (!browser) return;

    WIDGET_DATA = await get
    (
      `/api/data/home/livescores-v2`
    ) as B_LS2_D;

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // [🐞]
      dlog
      (
        `${LV2_W_H_TAG[0]} ❌ no data available!`
      );

			NO_WIDGET_DATA = true;
      throw new Error();
		}

    NO_WIDGET_DATA = false;

    return WIDGET_DATA
  }

  // #endregion ➤ 🛠️ METHODS

 // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount
  (
    async () =>
    {
      LivescoresMain = (await import('./Livescores_Main.svelte')).default;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style from the global (app.css)
=================-->

<SeoBox>
  <!--
  WIDGET TITLE
  -->
  <h2>{WIDGET_T_DATA?.title}</h2>
  <!--
  [ℹ] fixtures & betting-tip (links)
  -->
  <div>
    {#each WIDGET_S_DATA?.fixtures || [] as item1}
      {#if item1?.fixture_url}
        <a href={item1?.fixture_url}>{item1?.fixture_url}</a>
      {/if}
      {#if item1?.tip_url}
        <a href={item1?.tip_url}>{item1?.tip_url}</a>
      {/if}
    {/each}
  </div>
  <!--
  [ℹ] leagues (links)
  -->
  <div>
    {#each WIDGET_S_DATA?.leagues || [] as item}
      {#if item?.league_url}
        <a href={item?.league_url}>{item?.league_url}</a>
      {/if}
    {/each}
  </div>
</SeoBox>

<!-- [🐞] -->
<!-- <LivescoresLoader /> -->

{#await widgetInit()}
  <!--
  ### NOTE:
  ### promise is pending
  -->
  <LivescoresLoader />
{:then data}
  <!--
  ### NOTE:
  ### promise was fulfilled
  -->
  <svelte:component this={LivescoresMain} {WIDGET_DATA}/>
  <!-- <LivescoresMain
    {WIDGET_DATA}
  /> -->
{:catch error}
  <!--
  ### NOTE:
  ### promise was rejected
  -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE) from the global (app.css)
=================-->

<style>

</style>