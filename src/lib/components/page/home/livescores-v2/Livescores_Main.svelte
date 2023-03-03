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
  // IMPORTS GO HERE
  import { get } from '$lib/api/utils';
  // IMPORTS GO HERE
  import { sessionStore } from '$lib/store/session';
  // IMPORTS GO HERE
  import { dlog, LV2_W_H_TAG } from '$lib/utils/debug';
  // IMPORTS GO HERE
  import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
  //#endregion ➤ Project Custom Imports

  //#region ➤ Firebase Imports
  // IMPORTS GO HERE
  //#endregion ➤ Firebase Imports

  //#region ➤ Types Imports
  // IMPORTS GO HERE
  import type { B_LS2_D, B_LS2_T, LS2_C_Fixture, LS2_C_League } from '@betarena/scores-lib/types/livescores-v2';
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // IMPORTS GO HERE
  //#endregion ➤ Assets Imports

  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { FIXTURE_LIVE_TIME_OPT } from '@betarena/scores-lib/src/api/sportmonks';
  import LivescoresFixtureRow from './Livescores_Fixture_Row.svelte';
  import LivescoresTopRow from './Livescores_Top_Row.svelte';
  import LoaderRow from './loaders/Loader_Row.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_LS2_D

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

  $: WIDGET_TITLE = WIDGET_T_DATA?.title || 'Livescores'
  
  const today = new Date()

  let fixturesGroupByDateMap = new Map<string, LS2_C_Fixture[]>()
  let leagueMap = new Map<number, LS2_C_League>()

  if (WIDGET_DATA) {
    setData()
  }

  let nonEmptyLeaguesIds: number[] = []
  let nonEmptyLeaguesArray: LS2_C_League[] = []
  let numOfFixtures: number;
  let numOfFixturesLive: number;
  let liveLeaguesIds: number[] = []
  let liveLeagues: LS2_C_League[] = []
  let isShowMore: boolean = false;

  let inProcessHistFixFetch: boolean = false

  $sessionStore.livescoreNowSelectedDate = today

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function setData() {
    // [ℹ] convert data to a Map;
    for (const fixtureDateObj of WIDGET_DATA?.fixtures_by_date) {
      fixturesGroupByDateMap.set(new Date(fixtureDateObj?.date).toISOString().slice(0, 10), fixtureDateObj?.fixtures)
    }
    for (const league of WIDGET_DATA?.leagues) {
      leagueMap.set(league?.id, league)
    }
    dlog("🔥 HERE!", true)
  }

  /**
   * @description updates the information
   * for the fixtures of current-date with
   * real-time information;
   */
  function injectLivescoreData(
  ): Promise < void > {
    
    const liveFixturesMap = $sessionStore?.livescore_now
    // [ℹ] exit;
    if (liveFixturesMap.size == 0 || fixturesGroupByDateMap.size == 0) {
      dlog(`${LV2_W_H_TAG[0]} ❌ NO LIVE FIXTURES!`)
      return
    }
    // [ℹ] iterate over each LIVE fixture
    // [ℹ] and modify data of existing;
    for (const [liveId, _fixture] of liveFixturesMap) {
      const targetDate = new Date(_fixture?.time?.starting_at?.date).toISOString().slice(0, 10)
      // [ℹ] obtain target date-group fixtures[]
      let fixturesArray = fixturesGroupByDateMap.get(targetDate)
      // [ℹ] re-assign the modified version back to original
      // [ℹ] & persist to Map
      fixturesArray = fixturesArray.map((fixture) => {
        if (liveFixturesMap.has(fixture.id)) {
          return {
            ...fixture,
            minute: liveFixturesMap.get(fixture.id)?.time?.minute,
            status: liveFixturesMap.get(fixture.id)?.time?.status,
            teams: {
              away: {
                name: fixture?.teams?.away?.name,
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[1]?.redcards,
                score: liveFixturesMap.get(fixture.id)?.scores?.visitorteam_score
              },
              home: {
                name: fixture?.teams?.home?.name,
                red_cards: liveFixturesMap.get(fixture.id)?.stats?.data[0]?.redcards,
                score: liveFixturesMap.get(fixture.id)?.scores?.localteam_score
              }
            }
          };
        }
        return fixture
      })
      fixturesGroupByDateMap.set(targetDate, fixturesArray)
    }
    // IMPORTANT
    fixturesGroupByDateMap = fixturesGroupByDateMap 
    // ???
    WIDGET_DATA = WIDGET_DATA;
  }

  /**
   * @description updates information on target
   * fixtures, depending on selected-date;
   * (IF) no matching date in (cache) - seek
   * from (hasura) directly;
   */
  async function targetFixtureDateData(
  ): Promise < void > {
    dlog(`${LV2_W_H_TAG[0]} (in) targetFixtureDateData`)
    let targetDate = $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)
    // [ℹ] get matching (date) fixtures in "yyyy/MM/dd" string format
    let targetFixturesDateGroupObj = fixturesGroupByDateMap.get(new Date(targetDate).toISOString().slice(0, 10));
    // [ℹ] validation;
    if (targetFixturesDateGroupObj == undefined) {
      dlog(`${LV2_W_H_TAG[0]} 🔵 seeking ${targetDate} (date) fixtures`)
      inProcessHistFixFetch = true
      const hasuraFixturesDate: B_LS2_D = await get(`/api/hasura/home/livescores-v2/?date=${targetDate}`) as B_LS2_D
      // WIDGET_DATA.fixtures_by_date = WIDGET_DATA?.fixtures_by_date.concat(hasuraFixturesDate?.fixtures_by_date)
      // WIDGET_DATA.leagues = WIDGET_DATA?.leagues.concat(hasuraFixturesDate?.leagues) // FIXME: possible duplicates ??
      // setData() // NOTE: removes duplicates
      fixturesGroupByDateMap.set(targetDate, hasuraFixturesDate?.fixtures_by_date[0]?.fixtures)
      targetFixturesDateGroupObj = fixturesGroupByDateMap.get(new Date(targetDate).toISOString().slice(0, 10));
    }
    inProcessHistFixFetch = false
    numOfFixtures = targetFixturesDateGroupObj?.length || 0
    // [ℹ] filter non-empty leagues with fixtures (for selected-date)
    nonEmptyLeaguesIds = [...new Set(targetFixturesDateGroupObj.map(fixture => fixture?.league_id))];
    dlog(nonEmptyLeaguesIds, true)

    // [ℹ] -> 🔵 ORDERED BY COUNTRY (GEO) POSITION 
    // [ℹ] from those league-ids (non-empty) available
    let geo_leagueIds_reference_numb_array = get_target_country_leagues_array()

    // [ℹ] -> 🔵 FEATURED [LEAGUES-ID] (Before CHECK-MORE games expand), these should have priority

    nonEmptyLeaguesArray = WIDGET_DATA.leagues.filter(function(e) {
      return nonEmptyLeaguesIds.includes(e?.id)
    });

    nonEmptyLeaguesArray = nonEmptyLeaguesArray.sort((a, b) => {       
      const index1 = geo_leagueIds_reference_numb_array.indexOf(a?.id);       
      const index2 = geo_leagueIds_reference_numb_array.indexOf(b?.id);       
      return (         
        (index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity)      
      );
    });
  }

  /**
   * @description updates the information 
   * for the live-fixtures - based 
   * on users (today's) local time;
   * FIXME: potential issue as we only check for TODAY's date, fixtures 
   * starting late night might disappear at the ealry morning from LIVE
   */
  async function updateLiveInfo(
  ): Promise < void > {
    dlog(`${LV2_W_H_TAG[0]} (in) updateLiveInfo`)
    numOfFixturesLive = 0
    liveLeaguesIds = []
    // NOTE:DOC: adding for await ... of > for await ... of causes (double) iteration
    for (let [date, fixturesArr] of fixturesGroupByDateMap) {
      for (let fixture of fixturesArr) {
        if (FIXTURE_LIVE_TIME_OPT.includes(fixture?.status)) {
          numOfFixturesLive++
          liveLeaguesIds.push(fixture?.league_id)
        }
      }
    }
    liveLeaguesIds = [...new Set(liveLeaguesIds)]
    liveLeagues = WIDGET_DATA.leagues.filter(function(e) {
      return liveLeaguesIds.includes(e?.id)
    });
    dlog(`${LV2_W_H_TAG[0]} numOfFixturesLive ${numOfFixturesLive}`)
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds.length ${liveLeaguesIds.length}`)
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds ${liveLeaguesIds}`)
  }

  function toggleShowMore() {
    isShowMore = !isShowMore
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

  /**
   * @description returns for the target
   * country_bookmaker (GEO) leagues-id's
   * order data as a number[];
   * @returns {number[]} number[]
   */
  function get_target_country_leagues_array(
  ): number[] {
    let geo_leagueIds_reference_array = 
      WIDGET_DATA?.leagues_geo_list
      .find( ({ lang }) => 
        lang == $userBetarenaSettings?.country_bookmaker
      )?.leagues
    ;
    dlog(`🔥 ${$userBetarenaSettings?.country_bookmaker}`, true)
    if (geo_leagueIds_reference_array == undefined) {
      dlog("❌ No target COUNTRY-GEO found", true)
      geo_leagueIds_reference_array = 
        WIDGET_DATA?.leagues_geo_list
        .find( ({ lang }) => 
          lang == 'en'
        )?.leagues
      ;
    }
    const geo_leagueIds_reference_numb_array = geo_leagueIds_reference_array.map(v => v.league_id)
    dlog(geo_leagueIds_reference_numb_array, true)
    return geo_leagueIds_reference_numb_array;
  }

  /**
   * @description converts a target date to an
   * ISO_string of yyyy-MM-dd format;
   * @param {Date} date
   * @returns {string} string
   */
  function convert_to_iso(
    date: Date
  ): string {
    return date.toISOString().slice(0, 10)
  }

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @description listens to changes in
   * selected date of fixture display;
   * Proceeds to update data accordingly;
  */
  $: if ($sessionStore.livescoreNowSelectedDate) {
    targetFixtureDateData()
    updateLiveInfo()
  }

  /**
   * @description listens to changes in 
   * livescores_now data session-store;
   * Proceeds to update data accordingly;
  */
  $: if ($sessionStore?.livescore_now) {
    dlog($sessionStore?.livescore_now, true)
    injectLivescoreData()
    updateLiveInfo()
  }

  /**
   * @description listens to changes in 
   * user country_bookmaker data session-store;
   * Proceeds to update data accordingly;
  */
  $: if ($userBetarenaSettings?.country_bookmaker) {
    targetFixtureDateData()
    updateLiveInfo()
  }

  // [🐞] [DEV-ONLY]
  $: {
    // dlog(`${LV2_W_H_TAG[0]} nonEmptyLeaguesIds: ${nonEmptyLeaguesIds}`)
    // dlog(`${LV2_W_H_TAG[0]} numOfFixtures: ${nonEmptyLeaguesIds}`)
    // dlog(`${LV2_W_H_TAG[0]} numOfFixturesLive: ${numOfFixturesLive}`)
    // dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds: ${liveLeaguesIds}`)
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div>
  <WidgetTitle
    {WIDGET_TITLE}
    OVERRIDE_COLOR={true}
  />

  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

    <LivescoresTopRow
      {numOfFixtures}
      {numOfFixturesLive}
    />

    {#if inProcessHistFixFetch}

      <div>
        {#each { length: 10 } as _, i}
          <div
            class="
              livescores-fixture-row-loader
            "
          >
            <LoaderRow />
          </div>
        {/each}
      </div>
      
    {:else}

      <!-- 
      [ℹ] all-fixtures (view)
      <-conditional->
      -->
      <div
        class="league-group-main"
        class:display-none={$sessionStore.livescoreFixtureView == 'live'}>
        <!-- 
        [ℹ] iterate over each non-empty-league-id's for selected_date
        -->
        {#each nonEmptyLeaguesArray as league}
          <!-- 
          [ℹ] out (main) league-date group (box)
          -->
          <div
            class="outer-league-group"
            class:display-none={!isShowMore && !WIDGET_DATA?.leagues_feat_list.includes(league?.id)}>
            <!-- 
            [ℹ] league info (box)
            -->
            <a
              href="{league?.urls[server_side_language]}">
              <div
                class="
                  row-space-start
                  league-group
                ">
                <img
                  src="{league?.iso2 ? `https://betarena.com/images/flags/${league?.iso2}.svg` : `https://www.betarena.com/images/flags/EN.svg`}"
                  on:error={(e) => (e.currentTarget.src = 'https://www.betarena.com/images/flags/EN.svg')}
                  alt=""
                  class="m-r-15"
                  width="21"
                  height="16"
                />
                <p
                  class="
                    s-14
                    w-500
                    color-black-2
                  ">
                  {league?.league_name}
                </p>
              </div>
            </a>
            <!-- 
            [ℹ] fixtures (box)
            [ℹ] (filter by) - target-league &&
            [ℹ] (filter by) - target selected date
            -->
            {#if fixturesGroupByDateMap.has(convert_to_iso($sessionStore.livescoreNowSelectedDate))}
              {#each fixturesGroupByDateMap.get(convert_to_iso($sessionStore.livescoreNowSelectedDate)).sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime()) as fixture}
                {#if fixture?.league_id == league?.id}
                  <LivescoresFixtureRow 
                    FIXTURE_D={fixture}
                    {server_side_language}
                  />
                {/if}
              {/each}
            {/if}
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] live-fixtures (view)
      <-conditional->
      -->
      <div
        class="league-group-live-main"
        class:display-none={$sessionStore.livescoreFixtureView == 'all'}>
        {#each liveLeagues as league}
          <!-- 
          [ℹ] league info (box)
          -->
          <a
            href="{league?.urls[server_side_language]}">
            <div
              class="
                row-space-start
                league-group
              ">
              <img
                src="{league?.iso2 ? `https://betarena.com/images/flags/${league?.iso2}.svg` : `https://www.betarena.com/images/flags/EN.svg`}"
                on:error={(e) => (e.currentTarget.src = 'https://www.betarena.com/images/flags/EN.svg')}
                alt=""
                class="m-r-32"
                width="24"
                height="18"
              />
              <p
                class="
                  s-16
                  w-500
                  color-black-2
                ">
                {league?.league_name}
              </p>
            </div>
          </a>
          <!-- 
          [ℹ] fixtures (of league) (box)
          FIXME: using "today" does not work, as fixtures at 23:45 (start) won't show in 15 minutes (next day)
          -->
          {#if fixturesGroupByDateMap.has(today.toISOString().slice(0, 10))}
            {#each fixturesGroupByDateMap.get(today.toISOString().slice(0, 10)) as fixture}
              {#if fixture?.league_id == league?.id && FIXTURE_LIVE_TIME_OPT.includes(fixture?.status)}
                <!-- [🐞] <p>{fixture?.id}</p> -->
                <LivescoresFixtureRow
                  FIXTURE_D={fixture}
                  {server_side_language}
                />
              {/if}
            {/each}
          {/if}
        {/each}
      </div>

      <!-- 
      [ℹ] show more/less (button)
      <-conditional->
      -->
      {#if $sessionStore.livescoreFixtureView == 'all'}
        <div
          id="show-more-box"
          class="
            m-t-10
            text-center
            cursor-pointer
          "
          on:click={() => isShowMore = !isShowMore}>
          <p
            class="
              s-14
              w-500
              color-primary
            ">
            <!-- FIXME: transaltion missing for "show-less" -->
            {!isShowMore ? (WIDGET_T_DATA?.common_expressions?.show_more || "Check more games") : "Show Less"}
          </p>
        </div>
      {/if}

    {/if}

  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* (global) override */
  div.widget-component {
    overflow: unset;
  }

  div.widget-component .league-group-main div:first-child a div.league-group,
  div.widget-component .league-group-live-main a:first-child div.league-group {
    margin-top: 0;
  }

  div.league-group {
    margin-top: 10px;
    padding: 18px 16px 10px 16px;
    border-top: 1px solid var(--grey-color);
  }

  div#show-more-box {
    padding: 26px 0 5px 0;
    border-top: 1px solid var(--grey-color);
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 475px) {
    div.league-group {
      padding: 18px 28px 10px 28px;
    } div.league-group img {
      margin-right: 32px;
      widows: 24px;
      height: 18px;
    } div.league-group img {
      font-size: 16px;
    }
  }

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
    /* empty */
  }

  /*
  =============
  DARK-THEME
  =============
  */

  .dark-background-1 div.league-group,
  .dark-background-1 div#show-more-box {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

</style>