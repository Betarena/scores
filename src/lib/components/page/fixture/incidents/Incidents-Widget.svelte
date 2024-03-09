<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import IncidentsLoader from './Incidents-Loader.svelte';
  import IncidentsMain from './Incidents-Main.svelte';

	import type { B_INC_D, B_INC_T } from '@betarena/scores-lib/types/incidents.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_S_DATA: B_INC_D = $page.data?.FIXTURE_INCIDENTS
  let WIDGET_T_DATA: B_INC_T = $page.data?.FXITURE_INCIDENTS_TRANSLATION
  let WIDGET_DATA: B_INC_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_S_DATA = $page.data?.FIXTURE_INCIDENTS
  $: WIDGET_T_DATA = $page.data?.FXITURE_INCIDENTS_TRANSLATION
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'Incidents' : 'Incidents'

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

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
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
  <h2>
    {WIDGET_TITLE}
  </h2>
  <!--
  TEAM NAMES
  -->
  <p>{WIDGET_S_DATA?.home?.team_name}</p>
  <p>{WIDGET_S_DATA?.away?.team_name}</p>
  <!--
  PLAYER URLs
  -->
  {#each WIDGET_S_DATA?.players || [] as [p_id, p_d]}
    <a href="/{p_d?.urls?.[$sessionStore?.serverLang]}">
      <p>{p_d?.common_name}</p>
    </a>
  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <IncidentsLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <IncidentsLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <IncidentsMain
      FIXTURE_INCIDENTS={WIDGET_DATA}
      FXITURE_INCIDENTS_TRANSLATION={WIDGET_T_DATA}
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