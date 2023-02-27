<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import type { B_LS2_D, LS2_C_Fixture, LS2_C_League } from 'betarena-types/types/livescores-v2';

	import LivescoresFixtureRow from './Livescores_Fixture_Row.svelte';
//#region ➤ [MAIN] Package Imports

  import { page } from '$app/stores';
  import { get } from '$lib/api/utils';
  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import { sessionStore } from '$lib/store/session';
  import { dlog, LV2_W_T_STY, LV2_W_T_TAG, LV2_W_T_TOG } from '$lib/utils/debug';
  import { platfrom_lang_ssr } from '$lib/utils/platform-functions';

	import LivescoresTopRow from './Livescores_Top_Row.svelte';
	import LoaderRow from './loaders/Loader_Row.svelte';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_LS2_D

  const WIDGET_TITLE = 'Livescores'
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
  let limitLeaguesShow = 10;

  let inProcessHistFixFetch: boolean = false

  $sessionStore.livescoreNowSelectedDate = today

  const _today = new Date()
  _today.setDate(_today.getDate() - 3)
  const days_3_ago = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_2_ago = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_1_ago = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_0 = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_1_future = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_2_future = _today.toISOString().slice(0, 10)
  _today.setDate(_today.getDate() + 1)
  const days_3_future = _today.toISOString().slice(0, 10)

  const fixture_dates: [
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ] = [
    days_3_ago,
    days_2_ago,
    days_1_ago,
    days_0,
    days_1_future,
    days_2_future,
    days_3_future
  ]

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
      console.log('NO LIVE FIXTURES!')
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
        return fixture;
      })
      fixturesGroupByDateMap.set(targetDate, fixturesArray)
    }
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
    dlog(`${LV2_W_T_TAG} targetFixtureDateData`, LV2_W_T_TOG, LV2_W_T_STY)
    let targetDate = $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)
    // [ℹ] get matching (date) fixtures in "yyyy/MM/dd" string format
    let targetFixturesDateGroupObj = fixturesGroupByDateMap.get(new Date(targetDate).toISOString().slice(0, 10));
    console.log('🟢', targetDate)
    console.log('🟢', targetFixturesDateGroupObj)
    // [ℹ] validation;
    if (targetFixturesDateGroupObj == undefined) {
      dlog(`${LV2_W_T_TAG} 🔵 seeking fixtures ${targetDate}`, LV2_W_T_TOG, LV2_W_T_STY)
      inProcessHistFixFetch = true
      const hasuraFixturesDate: B_LS2_D = await get(`/api/hasura/home/livescores-v2/?date=${targetDate}`) as B_LS2_D
      // WIDGET_DATA.fixtures_by_date = WIDGET_DATA?.fixtures_by_date.concat(hasuraFixturesDate?.fixtures_by_date)
      // WIDGET_DATA.leagues = WIDGET_DATA?.leagues.concat(hasuraFixturesDate?.leagues) // FIXME: possible duplicates ??
      // setData() // NOTE: removes duplicates
      targetFixturesDateGroupObj = fixturesGroupByDateMap.get(new Date(targetDate).toISOString().slice(0, 10));
    }
    inProcessHistFixFetch = false
    numOfFixtures = targetFixturesDateGroupObj?.length || 0
    // [ℹ] filter non-empty leagues with fixtures (for selected-date)
    nonEmptyLeaguesIds = [...new Set(targetFixturesDateGroupObj.map(fixture => fixture?.league_id))];
    nonEmptyLeaguesArray = WIDGET_DATA.leagues.filter(function(e) {
      return nonEmptyLeaguesIds.includes(e?.id)
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
    dlog(`${LV2_W_T_TAG} updateLiveInfo (trigger)`, LV2_W_T_TOG, LV2_W_T_STY)
    numOfFixturesLive = 0
    liveLeaguesIds = []
    for await (const [date, fixturesArr] of fixturesGroupByDateMap) {
      for await (const fixture of fixturesArr) {
        if (fixture?.status == 'LIVE') {
          numOfFixturesLive++
          liveLeaguesIds.push(fixture?.league_id)
        }
      }
    }
    liveLeaguesIds = [...new Set(liveLeaguesIds)]
    liveLeagues = WIDGET_DATA.leagues.filter(function(e) {
      return liveLeaguesIds.includes(e?.id)
    });
    dlog(`${LV2_W_T_TAG} updateLiveInfo | numOfFixturesLive ${numOfFixturesLive}`, LV2_W_T_TOG, LV2_W_T_STY)
    dlog(`${LV2_W_T_TAG} updateLiveInfo | liveLeaguesIds ${liveLeaguesIds.length}`, LV2_W_T_TOG, LV2_W_T_STY)
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
   * Proceeds to update data accordingly
  */
  $: if ($sessionStore?.livescore_now) {
    console.log('CHANGED!')
    console.log($sessionStore?.livescore_now)
    injectLivescoreData()
    updateLiveInfo()
  }

  // [🐞]
  $: {
    // dlog(`${LV2_W_T_TAG} nonEmptyLeaguesIds: ${nonEmptyLeaguesIds}`, LV2_W_T_TOG, LV2_W_T_STY)
    // dlog(`${LV2_W_T_TAG} numOfFixtures: ${nonEmptyLeaguesIds}`, LV2_W_T_TOG, LV2_W_T_STY)
    // dlog(`${LV2_W_T_TAG} numOfFixturesLive: ${numOfFixturesLive}`, LV2_W_T_TOG, LV2_W_T_STY)
    // dlog(`${LV2_W_T_TAG} liveLeaguesIds: ${liveLeaguesIds}`, LV2_W_T_TOG, LV2_W_T_STY)
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
  />

  <div
    class="widget-component">

    <LivescoresTopRow 
      {numOfFixtures}
      {numOfFixturesLive}
    />

    {#if inProcessHistFixFetch}

      <div>
        {#each { length: 10 } as _, i}
          <div
            class="m-b-10"
            style="
              border-top: 1px solid var(--grey-color);
              padding-top: 20px;
              padding-bottom: 10px;
              /* margin: auto; */
              padding: 20px;
              text-align: center;
            ">
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
        class:display-none={$sessionStore.livescoreFixtureView == 'live'}>
        {#each nonEmptyLeaguesArray.slice(0, limitLeaguesShow) as league}
          <!-- 
          [ℹ] league info (box)
          -->
          <div
            class="
              row-space-start
              league-group
            ">
            <img
              src="https://betarena.com/images/flags/{league?.iso2}.svg" 
              alt=""
              class="m-r-24"
              width="24"
              height="18"
            />
            <p
              class="
                s-16
                w-500
              ">
              {league?.league_name}
            </p>
          </div>
          <!-- 
          [ℹ] fixtures (of league) (box)
          -->
          {#each fixturesGroupByDateMap.get($sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)) as fixture}
            {#if fixture?.league_id == league?.id}
              <LivescoresFixtureRow 
                FIXTURE_D={fixture}
                {server_side_language}
              />
            {/if}
          {/each}
        {/each}
      </div>

      <!-- 
      [ℹ] live-fixtures (view)
      <-conditional->
      -->
      <div
        class:display-none={$sessionStore.livescoreFixtureView == 'all'}>
        {#each liveLeagues.slice(0, limitLeaguesShow) as league}
          <!-- 
          [ℹ] league info (box)
          -->
          <div
            class="
              row-space-start
              league-group
            "
            class:display-none={$sessionStore.livescoreFixtureView == 'live' && !liveLeaguesIds.includes(league?.id)}>
            <img
              src="https://betarena.com/images/flags/{league?.iso2}.svg" 
              alt=""
              class="m-r-24"
              width="24"
              height="18"
            />
            <p
              class="
                s-16
                w-500
              ">
              {league?.league_name}
            </p>
          </div>
          <!-- 
          [ℹ] fixtures (of league) (box)
          -->
          {#each fixturesGroupByDateMap.get(today.toISOString().slice(0, 10)) as fixture}
            {#if fixture?.league_id == league?.id && fixture?.status === 'LIVE'}
              <LivescoresFixtureRow
                FIXTURE_D={fixture}
                {server_side_language}
              />
            {/if}
          {/each}
        {/each}
      </div>

      <!-- 
      [ℹ] show more button
      -->
      <div
        id="show-more-box"
        class="text-center"
        on:click={() => limitLeaguesShow == 50 ? (limitLeaguesShow = 10) : (limitLeaguesShow = 50)}>
        <p
          class="
            s-14
            w-500
            color-primary
          ">
          Check more games
        </p>
      </div>

    {/if}

  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div.league-group {
    padding: 18px 28px 10px 28px;
    border-top: 1px solid var(--grey-color);
  }

  div#show-more-box {
    padding: 26px 0 5px 0;
    border-top: 1px solid var(--grey-color);
  }

  @media only screen and (min-width: 726px) and (max-width: 1000px) {
  }

</style>