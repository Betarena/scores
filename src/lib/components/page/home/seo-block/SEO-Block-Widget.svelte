<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { page } from '$app/stores';

  import { IN_W_F_STY, IN_W_F_TAG, IN_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

  import SeoBox from '$lib/components/SEO-Box.svelte';
  import SeoBlockLoader from './SEO-Block-Loader.svelte';
  import SeoBlockMain from './SEO-Block-Main.svelte';

	import type { B_SEB_DT } from '@betarena/scores-lib/types/seo-block.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  // let WIDGET_S_DATA: B_FEATM_S = $page.data?.B_FEATM_S;
  let WIDGET_T_DATA: B_SEB_DT = $page.data?.SEO_BLOCK_DATA;
  let WIDGET_DATA: B_SEB_DT;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  // $: PAGE_DATA = $page.data?.PAGE_DATA
  // $: WIDGET_S_DATA = $page.data?.B_FEATM_S;
  $: WIDGET_T_DATA = $page.data?.SEO_BLOCK_DATA;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.title || 'Seo Block' : 'Seo Block';

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
  ): Promise < B_SEB_DT >
  {
		// await sleep(3000);

    WIDGET_DATA = WIDGET_T_DATA

    const if_M_0: boolean =
      WIDGET_DATA == undefined
    ;
		if (if_M_0)
    {
      // [🐞]
      dlog
      (
        `${IN_W_F_TAG} ❌ no data available!`,
        IN_W_F_TOG,
        IN_W_F_STY
      );
			NO_WIDGET_DATA = true;
			return;
		}

    NO_WIDGET_DATA = false;
    return WIDGET_DATA
  }

  //#endregion ➤ [METHODS]

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

  <h2>{WIDGET_T_DATA?.title}</h2>

  {@html WIDGET_T_DATA?.html}

</SeoBox>

<!-- [🐞] -->
<!-- <LeagueListLoader /> -->

<!--
MAIN WIDGET LOGIC
-->
{#await widgetInit()}

  <SeoBlockLoader />
{:then data}

  {#if !NO_WIDGET_DATA}

    <SeoBlockMain
      B_SEB_DT={WIDGET_DATA}
    />

  {/if}

{:catch error}
{/await}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

</style>