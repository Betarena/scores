<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	
  import { sessionStore } from '$lib/store/session.js';
  import { CO_W_F_STY, CO_W_F_TAG, CO_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import ContentLoader from './Content-Loader.svelte';
	import ContentMain from './Content-Main.svelte';

	import type { B_CONT_D, B_CONT_T } from '@betarena/scores-lib/types/content.js';
	
  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let WIDGET_S_DATA: B_CONT_D[] = $page.data?.FIXTURE_CONTENT
  let WIDGET_T_DATA: B_CONT_T = $page.data?.FIXTURE_CONTENT_TRANSLATION
  let WIDGET_DATA: B_CONT_D[];
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: WIDGET_S_DATA = $page.data?.FIXTURE_CONTENT
  $: WIDGET_T_DATA = $page.data?.FIXTURE_CONTENT_TRANSLATION

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

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
  ): Promise < B_CONT_D[] > 
  {
		await sleep(3000);
    
    WIDGET_DATA = WIDGET_S_DATA

    const if_M_0: boolean =
      WIDGET_DATA == undefined
      || WIDGET_DATA?.length == 0
    ;
		if (if_M_0) 
    {
      // [🐞]
      dlog
      (
        `${CO_W_F_TAG} ❌ no data available!`,
        CO_W_F_TOG, 
        CO_W_F_STY
      );
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description 
   * listens to target "language" change;
  */
  $: if_R_0 =
    browser 
    && $sessionStore?.serverLang != undefined
  ;
  $: if (if_R_0)
  {
    widgetInit()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<SeoBox>
  <!-- 
  WIDGET TITLE
  -->
  <h2>
    {WIDGET_T_DATA?.news_and_views}
  </h2>
  <!-- 
  widget-contents list
  -->
  {#each WIDGET_S_DATA || [] as item}
    <a href={item.link}>
      {item.link}
    </a>
    <h3>{item.title}</h3>
    <p>{item.excerpt}</p>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <ContentLoader /> -->

<!-- 
[ℹ] main widget
-->
{#await widgetInit()}
  <!-- 
  promise is pending 
  -->
  <ContentLoader />
{:then data}
  <!-- 
  promise was fulfilled 
  -->
  {#if !NO_WIDGET_DATA}
    <ContentMain 
      FIXTURE_CONTENT={WIDGET_DATA}
      FIXTURE_CONTENT_TRANSLATION={WIDGET_T_DATA}
    />
  {/if}
{:catch error}
  <!-- 
  promise was rejected 
  -->
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

</style>