<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	
  import { page } from '$app/stores';
  import { get } from '$lib/api/utils';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  import type { B_H_HF } from '@betarena/scores-lib/types/hasura';
  import type { B_PFIX_D, B_PFIX_T, PFIX_C_Fixture, PFIX_C_League, PFIX_Player } from '@betarena/scores-lib/types/player-fixtures';
  import { onMount } from 'svelte';
  import arrow_left_dark from './assets/arrow-left-dark.svg';
  import arrow_left_hover from './assets/arrow-left-hover.svg';
  import arrow_left from './assets/arrow-left.svg';
  import arrow_right_dark from './assets/arrow-right-dark.svg';
  import arrow_right_hover from './assets/arrow-right-hover.svg';
  import arrow_right from './assets/arrow-right.svg';
  
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import { sessionStore } from '$lib/store/session.js';
	import type { B_SAP_PP_D } from '@betarena/scores-lib/types/seo-pages.js';
	import FixturesRow from './Fixtures-Row.svelte';
	import LoaderMain from './loaders/shared/Loader-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PFIX_D

  let WIDGET_T_DATA: B_PFIX_T = $page.data?.B_PFIX_T
  $: WIDGET_T_DATA = $page.data?.B_PFIX_T

  let PAGE_DATA: B_SAP_PP_D = $page.data?.PAGE_DATA
  $: PAGE_DATA = $page.data?.PAGE_DATA

  let WIDGET_TITLE = 'Fixtures'

  let pageFixtureMap: Map <number, Map <string, PFIX_C_Fixture[]>> = new Map();
  const fixtureMap: Map <string, PFIX_C_Fixture[]> = new Map(Object.entries(WIDGET_DATA?.data?.past_fixtures)) as Map <string, PFIX_C_Fixture[]>;
  let leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(WIDGET_DATA?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

  pageFixtureMap.set(0, fixtureMap)

  let view_page: number = 0;
  let limit: number = 10;
  let offset: number = 0;
  let loadingPrev: boolean = false;
  let liveFixtureId: number;
  let liveTriggerMade: boolean = false;

  let hoverBtn1: boolean = false;
  let hoverBtn2: boolean = false;

  console.log(fixtureMap)
  console.log(leagueMap)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function getPastFixtures() {
    view_page = view_page + 1;
    if (pageFixtureMap.has(view_page)) return;
    offset = offset + 10;
    loadingPrev = true;
    const response = await get(
      `/api/data/players/fixtures/?player_id=${PAGE_DATA?.data?.player_id}&limit=${limit}&offset=${offset}&hasura=true`
    ) as B_PFIX_D;
    // validate: end of fixtures;
    const validation_0 =
      response == undefined
    ;
    if (validation_0) {
      view_page = view_page - 1;
      loadingPrev = false;
      return;
    }
    const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
    const _leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(response?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;
    loadingPrev = false;
    pageFixtureMap.set(view_page, _fixtureMap)
    pageFixtureMap = pageFixtureMap
    leagueMap = new Map([...leagueMap, ..._leagueMap])
    leagueMap = leagueMap
  }

  async function resetFixturesData() {
    pageFixtureMap = new Map();
    loadingPrev = true;
    const response = await get(
      `/api/data/players/fixtures/?player_id=${PAGE_DATA?.data?.player_id}&limit=${10}&offset=${0}&hasura=true`
    ) as B_PFIX_D;
    const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
    const _leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(response?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;
    loadingPrev = false;
    pageFixtureMap.set(0, _fixtureMap)
    pageFixtureMap = pageFixtureMap
    leagueMap = new Map([...leagueMap, ..._leagueMap])
    leagueMap = leagueMap
  }

  /**
   * @summary [HELPER] method
   * @description checks wether player is currently
   * playing in any of the live fixtures;
   * @returns NaN
   */
  function validatePlayerInLineupLive () {

    const liveFixturesMap = $sessionStore?.livescore_now

    // iterate over livescores map fixtures
    // looking for one where target player is playing;
    for (const [liveId, fixtureData] of liveFixturesMap) {
      // validate player in lineup (exist)
      const validation_00 =
         fixtureData?.lineup?.data == undefined
      ;
      if (validation_00) continue;
      // get lineup ids of players in lineup
      const mergeLineupBench = [
        ...fixtureData?.lineup?.data,
        ...fixtureData?.bench?.data
      ]
      const lineupIdsList = mergeLineupBench
        ?.map(x => x?.player_id)
      ;
      const validation_0 =
        lineupIdsList.includes(PAGE_DATA?.data?.player_id)
        && pageFixtureMap.get(0) != undefined
      ;
      if (validation_0) {

        console.log('🔵 Player is Playing!');
        liveFixtureId = liveId;
        let fixtureNotExists: boolean = true;

        // iterate over 1st page (map) (latest) fixtures
        for (const [leagueId, fixtureList] of pageFixtureMap.get(0)) {
          // obtain target fixture in
          const targetFixture = fixtureList
            ?.find(
                x => 
                x?.id == liveId
              )
          ;
          const validation_1 =
            targetFixture != undefined
          ;
          if (validation_1) {
            console.log("🔴 Fixture is present")
            fixtureNotExists = false;
          }
        }
        
        // -> if fixture is not found inside the Map-Object, inject it (somehow);
        // -> to prevent constant infinite requests, have a single onMount toggle to stop more reuests and nullification;
        // -> best to just call the PAGE1 fixtures endpoint again and nullify all previous MapData;
        const validation_2 =
          !fixtureNotExists
          && !liveTriggerMade
        ;
        if (validation_2) {
          console.log("🔴 Re-populating Fixtures for Player from Hasura")
          // TODO:
          resetFixturesData()
          // Re-populate data;
          liveTriggerMade = true;
        }

        // otherwise, inject livescores data
        const validation_3 =
          !fixtureNotExists
          && liveTriggerMade
        ;
        if (validation_3) {
          console.log("🔵 Injecting data!");
          injectLivescoreData()
        }

      }
    }

  }

  /**
   * @summary [MAIN] method
   * @description updates the information
   * for the fixtures of current-player with
   * real-time information in those he 
   * is active/playing;
   * @returns Promise < void >
   */
  function injectLivescoreData(
  ) {

    const liveFixture = $sessionStore?.livescore_now.get(liveFixtureId)
    const pageViewMap = pageFixtureMap.get(0)

    const validation_0 =
      liveFixture == undefined
      || pageViewMap == undefined
    ;
    if (validation_0) return;

    // iterate over 1st page (map) (latest) fixtures
    for (let [leagueId, fixtureList] of pageViewMap) {
      // -> update target fixture data periodically with target player ID data events and what not;

      fixtureList = fixtureList.map(
        (fixture) => {
        if (fixture?.id == liveFixtureId) {

          const mergeLineupBench = [
            ...liveFixture?.lineup?.data,
            ...liveFixture?.bench?.data
          ]

          const player_data: PFIX_Player =
            mergeLineupBench == null 
            || mergeLineupBench.length == 0
              ? null
              : mergeLineupBench
                /* find target PLAYER_ID [lineups] */
                ?.filter(x => x.player_id == PAGE_DATA?.data?.player_id)
                /* extract target player, with target data */
                ?.map(p => ({
                  player_id: p.player_id,
                  player_name: p.player_name || null,
                  rating: p?.stats?.rating || null,
                  captain: p?.captain || false,
                  events: undefined
                })
              )[0]
          ;
          // reset default player.events;
          player_data.events = {
            injured: false,
            yeallow_card: null,
            red_card: null,
            goals: null,
            penalty: null,
            substitution: null
          }
          // loop through player events;
          for (const event of liveFixture?.events?.data) {
            if (player_data.player_id == event.player_id) {
              if (event.type == 'yellowcard') {
                player_data.events.yeallow_card =
                  player_data.events.yeallow_card == null
                    ? 1
                    : player_data.events.yeallow_card + 1
                ;
              }
              if (event.type == 'redcard') {
                player_data.events.red_card = 1;
              }
              if (event.type == 'goal') {
                player_data.events.goals =
                  player_data.events.goals == null
                    ? 1
                    : player_data.events.goals + 1
                ;
              }
              if (event.type == 'penalty') {
                player_data.events.penalty =
                  player_data.events.penalty == null
                    ? 1
                    : player_data.events.penalty + 1
                ;
              }
            }
            if (player_data.player_id == event.related_player_id) {
              if (event.injuried) {
                player_data.events.injured = true;
              }
              if (event.type == 'substitution') {
                player_data.events.substitution = event;
              }
            }
          }

          return {
            // id
            // league_id
            // time
            // fixture_day
            // urls
            // tips
            ...fixture,
            minute: liveFixture?.time?.minute,
            status: liveFixture?.time?.status,
            teams: {
              away: {
                name: fixture?.teams?.away?.name,
                score: liveFixture?.scores?.visitorteam_score
              },
              home: {
                name: fixture?.teams?.home?.name,
                score: liveFixture?.scores?.localteam_score
              }
            },
            player: player_data
          };
        }
        return fixture
      })
      pageViewMap.set(
        leagueId, 
        fixtureList
      )
    }
    pageFixtureMap.set(0, pageViewMap)
    pageFixtureMap = pageFixtureMap;
  }

  $: console.log(pageFixtureMap)
  $: console.log(leagueMap)

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  /**
   * @description listens to changes in 
   * livescores_now data session-store;
   * Proceeds to update data accordingly;
  */
  $: if ($sessionStore?.livescore_now) {
    // dlog($sessionStore?.livescore_now, LV2_W_H_TAG[1])
    validatePlayerInLineupLive()
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

<!-- 
[ℹ] example comment
-->
<div>

  <WidgetTitle
    {WIDGET_TITLE}
    OVERRIDE_COLOR={false}
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
                href={`/${leagueMap.get(key.split('_')[0])?.urls[server_side_language]}`}>
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

  div#top-row {
    padding: 0 20px;
  }

  div.league-group-box {
    padding-left: 28px;
  }

  /* o */
  button.btn-hollow:hover {
    border: 1px solid var(--primary) !important;
  }

  /* o */
  button.btn-hollow.left {
    padding: 12px 16px 12px 10px ;
  }
  /* o */
  button.btn-hollow.right {
    padding: 12px 10px 12px 16px ;
  }

  img.league-img {
    width: auto;
    max-height: 100%;
    object-fit: fill;
  }

  div#fixtures-list-box {

  } div#fixtures-list-box a:first-child div.league-group-box {
    border: none;
    padding-top: 0;
    margin-top: 0;
  } div#fixtures-list-box a div.league-group-box {
    border-top: 1px solid var(--grey-shade);
    padding-top: 18px;
  } 


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

  div.dark-background-1 div#fixtures-list-box a:first-child div.league-group-box {
    border: none;
  } div.dark-background-1 div#fixtures-list-box a div.league-group-box {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

  div.dark-background-1 button.btn-hollow {
    border: 1px solid var(--dark-theme-1-2-shade) !important;
  }
  /* o */
  div.dark-background-1 button.btn-hollow:hover {
    border: 1px solid var(--primary) !important;
    color: var(--primary) !important;
  }

</style>