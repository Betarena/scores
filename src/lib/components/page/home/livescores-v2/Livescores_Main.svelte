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
  export let WIDGET_T_DATA: B_LS2_T

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
    injectLivescoreData()
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
          <a 
            href="{league?.urls[server_side_language]}">
            <div
              class="
                row-space-start
                league-group
              ">
              <img
                src="https://betarena.com/images/flags/{league?.iso2}.svg" 
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
          -->
          {#if fixturesGroupByDateMap.has($sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10))}
            {#each fixturesGroupByDateMap.get($sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)) as fixture}
              {#if fixture?.league_id == league?.id}
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
      [ℹ] live-fixtures (view)
      <-conditional->
      -->
      <div
        class:display-none={$sessionStore.livescoreFixtureView == 'all'}>
        {#each liveLeagues.slice(0, limitLeaguesShow) as league}
          <!-- 
          [ℹ] league info (box)
          -->
          <a
            href="{league?.urls[server_side_language]}">
            <div
              class="
                row-space-start
                league-group
              "
              class:display-none={$sessionStore.livescoreFixtureView == 'live' && !liveLeaguesIds.includes(league?.id)}>
              <img
                src="https://betarena.com/images/flags/{league?.iso2}.svg" 
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
          FIXME: using "today" does not work, as fixtures at 23:45 (start) won't show in 15 (next day)
          -->
          {#if fixturesGroupByDateMap.has(today.toISOString().slice(0, 10))}
            {#each fixturesGroupByDateMap.get(today.toISOString().slice(0, 10)) as fixture}
              {#if fixture?.league_id == league?.id && FIXTURE_LIVE_TIME_OPT.includes(fixture?.status)}
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

  /* override */
  div.widget-component {
    overflow: unset;
  }

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

  /* DARK MODE */

  .dark-background-1 div.league-group,
  .dark-background-1 div#show-more-box {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

</style>