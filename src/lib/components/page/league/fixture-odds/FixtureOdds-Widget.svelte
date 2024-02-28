<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

  import sessionStore from '$lib/store/session.js';
  import { VO_W_F_STY, VO_W_F_TAG, VO_W_F_TOG, dlog } from '$lib/utils/debug.js';
  import { sleep } from '$lib/utils/platform-functions';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import FixtureOddsLoader from './FixtureOdds-Loader.svelte';
	import FixtureOddsMain from './FixtureOdds-Main.svelte';

	import type { B_FO_D, B_FO_T } from '@betarena/scores-lib/types/fixture-odds.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  let WIDGET_S_DATA: B_FO_D = $page.data?.FIXTURES_ODDS_DATA;
  let WIDGET_T_DATA: B_FO_T = $page.data?.FIXTURES_ODDS_T;
  let WIDGET_DATA: B_FO_D;
  let NO_WIDGET_DATA: boolean = true // [ℹ] default (true)

  $: WIDGET_T_DATA = $page.data?.FIXTURES_ODDS_T;
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.matches || 'Matches' : 'Matches';

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
  ): Promise < B_FO_D >
  {
		// await sleep(3000);

    WIDGET_DATA = WIDGET_S_DATA

    const if_0 =
      WIDGET_DATA == undefined
    ;
		if (if_0)
    {
      dlog(`${VO_W_F_TAG} ❌ no data available!`, VO_W_F_TOG, VO_W_F_STY);
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
  W
  -->
  <h2>{WIDGET_T_DATA?.matches}</h2>
  <!--
  FIXTURE TEAM NAMES
  -->
  {#each WIDGET_S_DATA?.seasons?.[0]?.fixtures || [] as item}
    <p>{item?.teams?.away?.name}</p>
    <p>{item?.teams?.home?.name}</p>
  {/each}
  <!--
  [ℹ] fixtures FIXTURE LINK loop
  [ℹ] fixtures TIP LINK loop
  -->
  {#each WIDGET_S_DATA?.seasons?.[0]?.fixtures || [] as item}

    {#if item?.fixture_link && item?.fixture_link?.[$sessionStore?.serverLang]}
      <a
        href={item?.fixture_link[$sessionStore?.serverLang]}
      >
        {item?.teams?.home?.name}
        vs.
        {item?.teams?.away?.name}
      </a>
    {/if}

    {#if item?.tip_link && item?.tip_link[$sessionStore?.serverLang]}
      <a
        href={item?.tip_link[$sessionStore?.serverLang]}
      >
        {item?.tip_link[$sessionStore?.serverLang]}
      </a>
    {/if}

    <!--
      {#if
        item?.media_link &&
        item?.media_link.length != 0}
        <a
          href="item?.tip_link[server_side_language]">
          {item?.media_link[0].video_link}
        </a>
      {/if}
    -->

  {/each}
</SeoBox>

<!-- [🐞] -->
<!-- <VotesLoader /> -->

<!--
[ℹ] main widget
-->
{#await widgetInit()}
  <!--
  promise is pending
  -->
  <FixtureOddsLoader />
{:then data}
  <!--
  promise was fulfilled
  -->
  {#if !NO_WIDGET_DATA}
    <FixtureOddsMain
      FIXTURES_ODDS_DATA={WIDGET_DATA}
      FIXTURES_ODDS_T={WIDGET_T_DATA}
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