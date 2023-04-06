<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
  import { FIXTURE_LIVE_TIME_OPT } from '@betarena/scores-lib/dist/api/sportmonks';

  import { page } from '$app/stores';
  import { get } from '$lib/api/utils';
  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { convert_to_iso } from '$lib/utils/dates.js';
  import { dlog, LV2_W_H_TAG } from '$lib/utils/debug';
  import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
  import type { B_LS2_D, B_LS2_T, LS2_C_Fixture, LS2_C_League } from '@betarena/scores-lib/types/livescores-v2';

  import WidgetTitle from '$lib/components/Widget-Title.svelte';
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
  
  let yesterday = new Date()

  yesterday.setDate(yesterday.getDate() - 1)
  $: yesterday = yesterday

  let fixturesGroupByDateMap: Map <string, LS2_C_Fixture[]> = new Map();
  let fixturesGroupByDateLeagueMap: Map <number, LS2_C_Fixture[]> = new Map();
  let leagueMap: Map <number, LS2_C_League> = new Map();

  // let fixturesGroupByDateMap: Map <string, LS2_C_Fixture[]> = new Map(
  //   Object.entries(WIDGET_DATA?.fixtures_by_date)
  // ) as Map <string, LS2_C_Fixture[]>;

  // let leagueMap: Map <string, LS2_C_League> = new Map(
  //   Object.entries(WIDGET_DATA?.leagues)
  // ) as Map <string, LS2_C_League>;

  // TEMPORARY
  // FIXME:TODO: update cache to [...V3] to use map json objects;
  async function setData(data: B_LS2_D) {
    for await (const fixtureDateObj of data?.fixtures_by_date) {
      fixturesGroupByDateMap.set(convert_to_iso(new Date(fixtureDateObj?.date + 'Z')), fixtureDateObj?.fixtures)
    }
    for await (const league of data?.leagues) {
      leagueMap.set(league?.id, league)
    }
  }
  if (WIDGET_DATA) {
    setData(WIDGET_DATA)
  }

  let nonEmptyLeaguesIds: number[] = []
  let nonEmptyLeaguesArray: LS2_C_League[] = []
  let numOfFixtures: number;
  let numOfFixturesLive: number;
  let liveLeaguesIds: number[] = []
  let liveLeagues: LS2_C_League[] = []
  let isShowMore: boolean = false;
  let inProcessHistFixFetch: boolean = true

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // map key -> new Date(fixtureDateObj?.date + 'Z').toISOString().slice(0, 10)

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
      dlog(`${LV2_W_H_TAG[0]} ❌ NO LIVE FIXTURES!`, LV2_W_H_TAG[1])
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
    dlog(`${LV2_W_H_TAG[0]} (in) targetFixtureDateData`, LV2_W_H_TAG[1])

    // new updated date;
    let targetDate = convert_to_iso(
      $sessionStore.livescoreNowSelectedDate
    )
    // [ℹ] get matching (date) fixtures in "yyyy/MM/dd" string format
    let targetFixturesDateGroupObj = fixturesGroupByDateMap.get(targetDate);
    
    // [ℹ] validation;
    if (targetFixturesDateGroupObj == undefined) {
      dlog(`${LV2_W_H_TAG[0]} 🔵 seeking ${targetDate} (date) fixtures`, LV2_W_H_TAG[1])
      inProcessHistFixFetch = true
      // get target date fixtures;
      const hasuraFixturesDate: B_LS2_D = await get(
        `/api/hasura/home/livescores-v2/?date=${targetDate}`
      ) as B_LS2_D
      // merge maps;
      await setData(hasuraFixturesDate)
      // extract "this" date data;
      targetFixturesDateGroupObj = fixturesGroupByDateMap.get(targetDate);
    }
    
    inProcessHistFixFetch = false
    numOfFixtures = targetFixturesDateGroupObj?.length || 0

    // extract "this" date data, league-id's;
    nonEmptyLeaguesIds = [...new Set(targetFixturesDateGroupObj
      ?.map(fixture => fixture?.league_id))
    ];
    dlog(`nonEmptyLeaguesIds: ${nonEmptyLeaguesIds}`, LV2_W_H_TAG[1])

    // get "this" country "geo" data;
    let geo_leagueIds_reference_numb_array = get_target_country_leagues_array()
    
    // keep only "this" date league-id's;
    nonEmptyLeaguesArray = [...leagueMap.values()]
      ?.filter(function(e) {
      return nonEmptyLeaguesIds.includes(e?.id)
    });

    // keep only "league-id's", present in target "geo" list;
    nonEmptyLeaguesArray = nonEmptyLeaguesArray.sort((a, b) => {       
      const index1 = geo_leagueIds_reference_numb_array.indexOf(a?.id);       
      const index2 = geo_leagueIds_reference_numb_array.indexOf(b?.id);       
      return (         
        (index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity)      
      );
    });

    generateLeagueFixtures()
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
    dlog(`${LV2_W_H_TAG[0]} (in) updateLiveInfo`, LV2_W_H_TAG[1])
    numOfFixturesLive = 0
    liveLeaguesIds = []
    // NOTE:DOC: adding for await ... of > for await ... of causes (double) iteration
    console.log('fixturesGroupByDateMap', fixturesGroupByDateMap)
    for (let [date, fixturesArr] of fixturesGroupByDateMap) {
      for (let fixture of fixturesArr) {
        // FIXME:
        // -> sometimes, fixtures from backend are not updated correclty
        // -> causing status to be delayed
        const validation_0 =
          FIXTURE_LIVE_TIME_OPT.includes(fixture?.status)
          && (convert_to_iso($sessionStore.userDate) == date
            || convert_to_iso(yesterday) == date)
        ;
        if (validation_0) {
          numOfFixturesLive++
          liveLeaguesIds.push(fixture?.league_id)
        }
      }
    }
    liveLeaguesIds = [...new Set(liveLeaguesIds)]
    liveLeagues = [...leagueMap.values()]
      ?.filter(function(x) {
      return liveLeaguesIds.includes(x?.id)
    });
    dlog(`${LV2_W_H_TAG[0]} numOfFixturesLive ${numOfFixturesLive}`, LV2_W_H_TAG[1])
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds.length ${liveLeaguesIds.length}`, LV2_W_H_TAG[1])
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds ${liveLeaguesIds}`, LV2_W_H_TAG[1])
  }

  function toggleShowMore() {
    isShowMore = !isShowMore
    generateLeagueFixtures()
  }

  function generateLeagueFixtures() {
    fixturesGroupByDateLeagueMap = new Map();
    // generate "target" date fixtures;
    const validation_0 =
      fixturesGroupByDateMap.has(convert_to_iso($sessionStore.livescoreNowSelectedDate))
    ;
    if (validation_0) {
      const leagueIds = nonEmptyLeaguesArray?.map(x => x?.id)
      let fixturesList = fixturesGroupByDateMap.get(
        convert_to_iso(
          $sessionStore.livescoreNowSelectedDate))
          ?.sort((
              a,
              b
            ) => 
              new Date(a.time).getTime() - new Date(b.time).getTime()
            )
          ?.filter(
              x => 
              leagueIds.includes(
                x?.league_id
              )
            )
      // filter by featured leagues only;
      const validation_1 =
        !isShowMore
      ;
      if (validation_1) {
        fixturesList = fixturesList
          ?.filter(
            x => 
            WIDGET_DATA?.leagues_feat_list.includes(
              x?.league_id
            )
          )
      }
      // group fixtures for "this" date, by league
      for (const item of nonEmptyLeaguesArray) {
        const leagueFixtures = fixturesList
          ?.filter(
            x => 
            x?.league_id == item?.id
          )
        ;
        const validation_01 =
          leagueFixtures?.length == 0
        ;
        if (validation_01) continue;
        fixturesGroupByDateLeagueMap.set(item?.id, leagueFixtures)
      }
    }
    fixturesGroupByDateLeagueMap = fixturesGroupByDateLeagueMap
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
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
    dlog(`🔥 ${$userBetarenaSettings?.country_bookmaker}`, LV2_W_H_TAG[1])
    if (geo_leagueIds_reference_array == undefined) {
      dlog("❌ No target COUNTRY-GEO found", LV2_W_H_TAG[1])
      geo_leagueIds_reference_array = 
        WIDGET_DATA?.leagues_geo_list
        .find( ({ lang }) => 
          lang == 'en'
        )?.leagues
      ;
    }
    const geo_leagueIds_reference_numb_array = geo_leagueIds_reference_array.map(v => v.league_id)
    dlog(geo_leagueIds_reference_numb_array, LV2_W_H_TAG[1])
    return geo_leagueIds_reference_numb_array;
  }

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @description listens to changes in
   * selected date of fixture display;
   * Proceeds to update data accordingly;
  */
  $: if ($sessionStore.livescoreNowSelectedDate) {
    isShowMore = false
    targetFixtureDateData()
    updateLiveInfo()
  }

  /**
   * @description listens to changes in 
   * livescores_now data session-store;
   * Proceeds to update data accordingly;
  */
  $: if ($sessionStore?.livescore_now) {
    dlog($sessionStore?.livescore_now, LV2_W_H_TAG[1])
    injectLivescoreData()
    updateLiveInfo()
  }

  /**
   * @description listens to changes in 
   * user country_bookmaker data session-store;
   * Proceeds to update data accordingly;
   * NOTE: copy of if ($sessionStore.livescoreNowSelectedDate) [...]
  */
  $: if ($userBetarenaSettings?.country_bookmaker) {
    isShowMore = false
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

    <!-- 
    Loader
    -->
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
    {/if}
    
    <!-- 
    Main Fixtures Show
    -->
    {#if !inProcessHistFixFetch}

      <!-- 
      [ℹ] all-fixtures (view)
      -->
      <div
        class="league-group-main"
        class:display-none={$sessionStore.livescoreFixtureView == 'live'}>
        <!-- 
        [ℹ] iterate over each non-empty-league-id's for selected_date
        -->
        {#each [...fixturesGroupByDateLeagueMap.entries()] as [leagueId, fixturesList]}
          <!-- 
          [ℹ] out (main) league-date group (box)
          -->
          <div
            class="outer-league-group"
          >
            <!-- 
            [ℹ] league info (box)
            -->
            <a
              href="{leagueMap.get(leagueId)?.urls[server_side_language].replace('https://scores.betarena.com','')}">
              <div
                class="
                  row-space-start
                  league-group
                ">
                <img
                  src="{leagueMap.get(leagueId)?.iso2 ? `https://betarena.com/images/flags/${leagueMap.get(leagueId)?.iso2}.svg` : `https://www.betarena.com/images/flags/EN.svg`}"
                  on:error={(e) => (e.currentTarget.src = 'https://www.betarena.com/images/flags/EN.svg')}
                  alt="default alt text"
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
                  {leagueMap.get(leagueId)?.league_name}
                </p>
              </div>
            </a>
            <!-- 
            [ℹ] fixtures (box)
            [ℹ] (filter by) - target-league &&
            [ℹ] (filter by) - target selected date
            -->
            {#each fixturesList as fixture}
              <!-- <p>[🐞] {fixture?.id}</p> -->
              <LivescoresFixtureRow 
                FIXTURE_D={fixture}
                {server_side_language}
              />
            {/each}
          </div>
        {/each}
      </div>

      <!-- 
      [ℹ] live-fixtures (view)
      -->
      <div
        class="league-group-live-main"
        class:display-none={$sessionStore.livescoreFixtureView == 'all'}>
        {#each liveLeagues as league}
          <!-- 
          [ℹ] league info (box)
          -->
          <a
            href="{league?.urls[server_side_language].replace('https://scores.betarena.com','')}">
            <div
              class="
                row-space-start
                league-group
              ">
              <img
                src="{league?.iso2 ? `https://betarena.com/images/flags/${league?.iso2}.svg` : `https://www.betarena.com/images/flags/EN.svg`}"
                on:error={(e) => (e.currentTarget.src = 'https://www.betarena.com/images/flags/EN.svg')}
                alt="default alt text"
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
          [ℹ] fixtures (of league) (box)
          FIXME: using "today" does not work, as fixtures at 23:45 (start) won't show in 15 minutes (next day)
          SOLVED adding a check for games still happening yesterday;
          -->
          {#if fixturesGroupByDateMap.has(convert_to_iso(yesterday))}
            {#each fixturesGroupByDateMap.get(convert_to_iso(yesterday)) as fixture}
              {#if fixture?.league_id == league?.id && FIXTURE_LIVE_TIME_OPT.includes(fixture?.status)}
                <!-- [🐞] <p>{fixture?.id}</p> -->
                <LivescoresFixtureRow
                  FIXTURE_D={fixture}
                  {server_side_language}
                />
              {/if}
            {/each}
            {#each fixturesGroupByDateMap.get(convert_to_iso($sessionStore.userDate)) as fixture}
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
      -->
      {#if $sessionStore.livescoreFixtureView == 'all'}
        <div
          id="show-more-box"
          class="
            m-t-10
            text-center
            cursor-pointer
          "
          on:click={() => toggleShowMore()}
        >
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
  } div.league-group img {
    /* border: 1px solid rgba(0, 0, 0, 0.1); */
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1));
    border-radius: 1.5px;
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
    } div.league-group p {
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