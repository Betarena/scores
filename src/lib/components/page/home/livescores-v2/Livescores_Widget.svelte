<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

  //#region ➤ Svelte/SvelteKit Imports
  // IMPORTS GO HERE
	import { page } from '$app/stores';
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
	import { get } from '$lib/api/utils';
	import { dlog, LV2_W_H_TAG } from '$lib/utils/debug';
//#endregion ➤ Project Custom Imports

  //#region ➤ Firebase Imports
  // IMPORTS GO HERE
  //#endregion ➤ Firebase Imports

  //#region ➤ Types Imports
	import type { B_LS2_D, B_LS2_T } from 'betarena-types/types/livescores-v2';
  //#endregion ➤ Types Imports

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
	import LivescoresLoader from './Livescores_Loader.svelte';
	import LivescoresMain from './Livescores_Main.svelte';

  //#region ➤ Assets Imports
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  let WIDGET_S_DATA: any = $page.data?.LIVESCORES_V2_SEO
  let WIDGET_DATA: B_LS2_D
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function widgetInit(
    // empty
  ): Promise < B_LS2_D > {
    // [ℹ] get widget data (from cache)
    WIDGET_DATA = await get(`/api/cache/home/livescores-v2`) as B_LS2_D;
    const VALID_RESPONSE =
      WIDGET_DATA == undefined
    ;
		// [ℹ] validation [#1]
		if (VALID_RESPONSE) {
      dlog(`${LV2_W_H_TAG[0]} ❌ no data available!`);
			NO_WIDGET_DATA = true;
			return;
		}
    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	let server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);
	dlog(
		`server_side_language: ${server_side_language}`
	);

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style from the global (app.css)
=================-->

<SeoBox>
  <p>
    THIS IS SEO WIDGET CONTENT
  </p>
  <div>
    {#each WIDGET_S_DATA?.fixtures as item1}
      {#if item1?.urls && item1?.urls[server_side_language]}
        <a href={item1?.urls[server_side_language]}>{item1?.id}</a>
      {/if}
      {#if item1?.tips && item1?.tips[server_side_language]}
        <a href={item1?.tips[server_side_language]}>{item1?.id}</a>
      {/if}
    {/each}
  </div>
  <div>
    {#each WIDGET_S_DATA?.leagues as item}
      {#if item?.urls && item?.urls[server_side_language]}
        <a href={item?.urls[server_side_language]}>{item?.id}</a>
      {/if}
    {/each}
  </div>
</SeoBox>

<!-- <LivescoresLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <LivescoresLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  <LivescoresMain 
    {WIDGET_DATA}
    {WIDGET_T_DATA}
  />
{:catch error}
  <!-- 
  promise was rejected 
  -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE) from the global (app.css)
=================-->

<style>

  @media only screen and (min-width: 726px) and (max-width: 1000px) {
  }

</style>