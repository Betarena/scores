<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
	
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import { get } from '$lib/api/utils';
  import { sessionStore } from '$lib/store/session.js';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { viewport_change } from '$lib/utils/platform-functions';
  import { PFIX_PP_dataInject, PFIX_PP_genLeagueFixMap } from '@betarena/scores-lib/dist/functions/func.player-fixtures.js';
  
  import arrow_left_dark from './assets/arrow-left-dark.svg';
  import arrow_left_hover from './assets/arrow-left-hover.svg';
  import arrow_left from './assets/arrow-left.svg';
  import arrow_right_dark from './assets/arrow-right-dark.svg';
  import arrow_right_hover from './assets/arrow-right-hover.svg';
  import arrow_right from './assets/arrow-right.svg';
  
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import FixturesRow from './Fixtures-Row.svelte';
	import LoaderMain from './loaders/shared/Loader-Main.svelte';

	import type { B_H_HF } from '@betarena/scores-lib/types/hasura';
	import type { B_PFIX_D, B_PFIX_T, PFIX_C_Fixture, PFIX_C_League } from '@betarena/scores-lib/types/player-fixtures';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  export let WIDGET_DATA: B_PFIX_D

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  let WIDGET_T_DATA: B_PFIX_T = $page.data?.B_PFIX_T

  $: WIDGET_T_DATA = $page.data?.B_PFIX_T
  $: PAGE_DATA = $page.data?.PAGE_DATA
  $: WIDGET_TITLE = WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.fixtures || 'Fixtures' : 'Fixtures'

  const MOBILE_VIEW = 475;
	const TABLET_VIEW = 1024;

	let mobileExclusive = false;
  let tabletExclusive = false;

  let view_page: number = 0;
  let limit: number = 10;
  let offset: number = 0;
  let loadingPrev: boolean = false;
  let hoverBtn1: boolean = false;
  let hoverBtn2: boolean = false;
  let targetFixture: B_H_HF;

  const fixtureMap: Map <string, PFIX_C_Fixture[]> = new Map(Object.entries(WIDGET_DATA?.data?.past_fixtures)) as Map <string, PFIX_C_Fixture[]>;
  let pageFixtureMap: Map <number, Map <string, PFIX_C_Fixture[]>> = new Map();
  let leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(WIDGET_DATA?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

  pageFixtureMap.set(0, fixtureMap)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ fetch past fixtures for "this" player, pagination based;
   * @returns
   * void
   */
  async function getPastFixtures
  (
  ): Promise < void > 
  {
    view_page = view_page + 1;
    if (pageFixtureMap.has(view_page)) return;
    offset = offset + 10;
    loadingPrev = true;

    const response = await get
    (
      `/api/data/players/fixtures/?player_id=${PAGE_DATA?.data?.player_id}&limit=${limit}&offset=${offset}&hasura=true`
    ) as B_PFIX_D;

    // validate: end of fixtures;
    const if_M_0 =
      response == undefined
    ;
    if (if_M_0) 
    {
      view_page = view_page - 1;
      loadingPrev = false;
      return;
    }

    const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
    const _leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(response?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

    loadingPrev = false;

    pageFixtureMap.set
    (
      view_page, 
      _fixtureMap
    );
    pageFixtureMap = pageFixtureMap;

    leagueMap = new Map([...leagueMap, ..._leagueMap])
    leagueMap = leagueMap
  }

  // [STASH]
  // -> useful RESET wigdet method data;
  /*
    async function resetFixturesData
    (
    ): Promise < void > 
    {
      pageFixtureMap = new Map();
      loadingPrev = true;

      const response = await get
      (
        `/api/data/players/fixtures/?player_id=${PAGE_DATA?.data?.player_id}&limit=${10}&offset=${0}&hasura=true`
      ) as B_PFIX_D;

      const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
      const _leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(response?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

      loadingPrev = false;

      pageFixtureMap.set
      (
        0, 
        _fixtureMap
      );
      pageFixtureMap = pageFixtureMap

      leagueMap = new Map([...leagueMap, ..._leagueMap])
      leagueMap = leagueMap
    }
  */

  /**
   * @summary
   * IMPORTANT 
   * [MAIN]
   * @description 
   * injects new "LIVE" fixture data, in which player is playing;
   * @returns 
   * void
   */
  async function validatePlayerInLineupLive 
  (
  ): Promise < void > 
  {
    const liveFixture = $sessionStore?.livescore_now_fixture_target;

    if (liveFixture == undefined) return;

    const if_M_0 =
      ((liveFixture?.lineup?.data == undefined || liveFixture?.lineup?.data?.length == 0)
      && (liveFixture?.bench?.data == undefined || liveFixture?.bench?.data?.length == 0))
      || pageFixtureMap == undefined
      || !pageFixtureMap?.has(0)
    ;
    if (if_M_0) return;

    const if_M_1 = 
      targetFixture == undefined
    ;
    if (if_M_1)
    {
      // get target fixture, and asssing to variable;
      const response = await get
      (
        `/api/data/players/fixtures/?fixture_id=${liveFixture?.id}`
      ) as B_H_HF;

      console.log
      (
        '🟢 fetching fixture',
        response
      );

      targetFixture = response;
    }

    const if_M_2 =
      !leagueMap?.has(liveFixture?.league_id?.toString())
    ;
    if (if_M_2)
    {
      // TODO:
      // get target league, and inject into MAP
    }

    // NEXT STEP;
    injectLivescoreData();
  }

  /**
   * @summary 
   * IMPORTANT 
   * [MAIN]
   * @description 
   * injects new "livescores" real-time data for "this" player;
   * @returns
   * void
   */
  function injectLivescoreData
  (
  ): void 
  {
    const liveFixture = $sessionStore?.livescore_now_fixture_target;

    const pageViewMap = pageFixtureMap.get(0)

    const if_M_0 =
      liveFixture == undefined
      || pageViewMap == undefined
    ;
    if (if_M_0) return;
    
    const playerFixList: PFIX_C_Fixture[] = []

    for (let [leagueId, fixtureList] of pageViewMap) 
    {
      const filteredFixList = fixtureList
      ?.filter
      (
        x => 
        x?.id != liveFixture?.id
      );
      playerFixList.push
      (
        ...filteredFixList
      );
    }

    const dataObj = PFIX_PP_dataInject
    (
      PAGE_DATA?.data?.player_id,
      targetFixture,
      liveFixture?.events?.data,
      liveFixture?.lineup?.data,
      liveFixture?.bench?.data,
      liveFixture
    );

    playerFixList.push
    (
      dataObj
    );

    const newMap = PFIX_PP_genLeagueFixMap
    (
      playerFixList
    );

    pageFixtureMap.set
    (
      0, 
      newMap
    );
    pageFixtureMap = pageFixtureMap;
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
   function addEventListeners
  (
  ): void
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function () 
      {
				resizeAction();
			}
		);
  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  ): void
  {
    [
      tabletExclusive, 
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @description 
   * listens to changes in livescores_now data session-store; Proceeds to update data accordingly;
  */
  $: if ($sessionStore?.livescore_now_fixture_target) 
  {
    console.log
    (
      '🔥',
      'UPDATING'
    )
    validatePlayerInLineupLive()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      resizeAction();
      addEventListeners();
    }
  );

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

<div>

  <WidgetTitle
    {WIDGET_TITLE}
  />
  
  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!-- 
    Previous / Next Buttons
    -->
    <div
      id="top-row"
      class="
        row-space-out
        m-b-15
      ">

      <!-- 
      Previous
      -->
      <button
        class="
          btn-hollow
          color-black-2
          left
        "
        on:click={() => getPastFixtures()}
        on:mouseover={() => hoverBtn1 = true}
        on:mouseout={() => hoverBtn1 = false}
        disabled={loadingPrev}
      >
        <img 
          src={hoverBtn1 == true ? arrow_left_hover : $userBetarenaSettings?.theme == "Dark" ? arrow_left_dark : arrow_left}
          width="20"
          height="20"
          alt="arrow_left"
          class="m-r-8"
          style="object-fit: contain;"
        />
        {WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.previous || 'Previous' : 'Previous'}
      </button>

      <!-- 
      Next
      -->
      {#if !(view_page == 0)}
        <button
          class="
            btn-hollow
            color-black-2
            right
          "
          on:click={() => view_page = view_page - 1}
          on:mouseover={() => hoverBtn2 = true}
          on:mouseout={() => hoverBtn2 = false}
          disabled={view_page == 0}
        >
          {WIDGET_T_DATA != undefined ? WIDGET_T_DATA?.next || 'Next' : 'Next'}
          <img 
            src={hoverBtn2 == true ? arrow_right_hover : $userBetarenaSettings?.theme == "Dark" ? arrow_right_dark : arrow_right}
            width="20"
            height="20"
            alt="arrow_right"
            class="m-l-8"
            style="object-fit: contain;"
          />
        </button>
      {/if}

    </div>
    
    <!-- 
    Loader (inner)
    -->
    {#if loadingPrev}
      <div
        style="padding: 0 20px;">
        <LoaderMain />
      </div>
    {/if}
    
    <!-- 
    Fixtures List
    -->
    {#if !loadingPrev}
      <div
        id="fixtures-list-box">
        {#each [...pageFixtureMap.entries()] as [key, page_data]}
          {#if key == view_page}
            <!-- [🐞] 
            <p>
              Page {key}
            </p>
            -->
            {#each [...page_data.entries()].reverse() as [key, fixtures]}
              <!-- 
              League (group)
              -->
              <a 
                href={`/${leagueMap.get(key.split('_')[0])?.urls[$sessionStore?.serverLang]}`}>
                <div
                  class="
                    row-space-start
                    m-t-15
                    m-b-15
                    league-group-box
                  ">
                  <img 
                    src={leagueMap.get(key.split('_')[0])?.icon}
                    alt=""
                    width="24"
                    height="24"
                    class="
                      m-r-24
                      league-img
                    "
                  />
                  <p
                    class="
                      color-black-2
                      s-16
                      w-500
                    ">
                    {leagueMap.get(key.split('_')[0])?.name}
                  </p>
                </div>
              </a>
              <!-- 
              Fixtures List
              -->
              {#each fixtures as item}
                <FixturesRow 
                  fixture={item} 
                />
              {/each}
            {/each}
          {/if}
        {/each}
      </div>
    {/if}

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#top-row
  {
    padding: 0 20px;
  }

  div.league-group-box
  {
    padding-left: 28px;
  }

  /* o */
  button.btn-hollow:hover
  {
    border: 1px solid var(--primary) !important;
  }

  /* o */
  button.btn-hollow.left
  {
    padding: 12px 16px 12px 10px ;
  }
  /* o */
  button.btn-hollow.right
  {
    padding: 12px 10px 12px 16px ;
  }

  img.league-img
  {
    width: auto;
    max-height: 100%;
    object-fit: fill;
  }

  div#fixtures-list-box
  {

  } div#fixtures-list-box a:first-child div.league-group-box
  {
    border: none;
    padding-top: 0;
    margin-top: 0;
  } div#fixtures-list-box a div.league-group-box
  {
    border-top: 1px solid var(--grey-color);
    padding-top: 18px;
  } 


  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
  and (min-width: 726px) 
  and (max-width: 1000px)
  {
  }

  /*
  =============
  DARK-THEME
  =============
  */

  div.dark-background-1 div#fixtures-list-box a:first-child div.league-group-box
  {
    border: none;
  } div.dark-background-1 div#fixtures-list-box a div.league-group-box
  {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

  div.dark-background-1 button.btn-hollow
  {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
  /* o */
  div.dark-background-1 button.btn-hollow:hover
  {
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }

</style>