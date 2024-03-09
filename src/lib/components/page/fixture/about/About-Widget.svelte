<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { AB_W_F_STY, AB_W_F_TAG, AB_W_F_TOG, dlog } from '$lib/utils/debug.js';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import AboutLoader from './About-Loader.svelte';
	import AboutMain from './About-Main.svelte';

	import type { B_ABT_D, B_ABT_T } from '@betarena/scores-lib/types/about.js';
	import type { B_INC_D } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import { browser } from '$app/environment';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_ABT_D = $page.data?.FIXTURE_ABOUT
  let WIDGET_T_DATA: B_ABT_T = $page.data?.FIXTURE_ABOUT_TRANSLATION
  let WIDGET_DATA: B_ABT_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.FIXTURE_ABOUT
  $: WIDGET_T_DATA = $page.data?.FIXTURE_ABOUT_TRANSLATION
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'Statistics' : 'Statistics'

  $: deepReactListenPageChange = JSON.stringify($page?.url?.pathname);
  $: deepReactListenLangChng = JSON.stringify($sessionStore?.serverLang);

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
  ): Promise < B_INC_D >
  {
		// await sleep(3000);

    WIDGET_DATA = WIDGET_S_DATA

    const if_M_0: boolean =
      WIDGET_DATA == undefined
      || WIDGET_DATA?.seo_data == undefined
    ;
		if (if_M_0)
    {
      dlog(`${AB_W_F_TAG} ❌ no data available!`, AB_W_F_TOG, AB_W_F_STY);
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
  ;
  $: if (if_R_0 && (deepReactListenLangChng || deepReactListenPageChange))
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
  <h2>{WIDGET_T_DATA?.title}</h2>
  <!--
  SEO
  -->
  {@html WIDGET_S_DATA?.seo_data}
</SeoBox>

<!-- [🐞] -->
<!-- <AboutLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <AboutLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <AboutMain
      FIXTURE_ABOUT={WIDGET_DATA}
      FIXTURE_ABOUT_TRANSLATION={WIDGET_T_DATA}
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