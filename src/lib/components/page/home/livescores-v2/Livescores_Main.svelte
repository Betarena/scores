<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
  import { FIXTURE_LIVE_TIME_OPT } from '@betarena/scores-lib/dist/api/sportmonks';

  import { page } from '$app/stores';
  import { get } from '$lib/api/utils';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { toCorrectDate, toISOMod } from '$lib/utils/dates.js';
  import { LV2_W_H_TAG, dlog } from '$lib/utils/debug';
  import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
  import type { B_LS2_D, B_LS2_T, LS2_C_Fixture, LS2_C_League } from '@betarena/scores-lib/types/livescores-v2';

  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import LivescoresFixtureRow from './Livescores_Fixture_Row.svelte';
  import LivescoresTopRow from './Livescores_Top_Row.svelte';
  import LoaderRow from './loaders/Loader_Row.svelte';
  import NoData from '$lib/components/ui/NoData.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_LS2_D

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  let yesterday = new Date()
  let fixturesGroupByDateMap: Map <string, LS2_C_Fixture[]> = new Map();
  let fixturesGroupByDateLeagueMap: Map <number, LS2_C_Fixture[]> = new Map();
  let fixturesGroupByDateLiveLeagueMap: Map <number, Map < number, LS2_C_Fixture > > = new Map();
  let leagueMap: Map <number, LS2_C_League> = new Map();
  let nonEmptyLeaguesIds: number[] = []
  let nonEmptyLeaguesArray: LS2_C_League[] = []
  let numOfFixtures: number;
  let numOfFixturesLive: number;
  let liveLeaguesIds: number[] = []
  let isShowMore: boolean = false;
  let inProcessHistFixFetch: boolean = true

  yesterday.setDate(yesterday.getDate() - 1)

  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA;
  $: WIDGET_TITLE = WIDGET_T_DATA?.title || 'Livescores';
  $: yesterday = yesterday;
  // IMPORTANT Reactivity Deep-Value Listen(s);
  $: livescoreNowScoreboardChng = JSON.stringify([...$sessionStore?.livescore_now_scoreboard.entries()]);
  $: livescoreNowSelectedDateChng = $sessionStore?.livescoreNowSelectedDate?.toString();
  $: bookmakerChng = $userBetarenaSettings?.country_bookmaker?.toString();

  // let fixturesGroupByDateMap: Map <string, LS2_C_Fixture[]> = new Map(
  //   Object.entries(WIDGET_DATA?.fixtures_by_date)
  // ) as Map <string, LS2_C_Fixture[]>;

  // let leagueMap: Map <string, LS2_C_League> = new Map(
  //   Object.entries(WIDGET_DATA?.leagues)
  // ) as Map <string, LS2_C_League>;

  // FIXME: TODO:
  // update cache to [...V3] to use map json objects;
  function setData
  (
    data: B_LS2_D
  )
  {
    for (const fixtureDateObj of data?.fixtures_by_date)
    {
      // NOTE: key => ISO/UTC date
      fixturesGroupByDateMap.set(toISOMod(fixtureDateObj?.date), fixtureDateObj?.fixtures)
    }
    for (const league of data?.leagues)
    {
      leagueMap.set(league?.id, league)
    }
  }

  if (WIDGET_DATA) {
    setData(WIDGET_DATA)
  }

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @summary [MAIN]
   * @description method inject livscores;
   * updates the information
   * for the fixtures of current-date with
   * real-time information;
   * IMPORTANT NOTE: updates ORPHAN fixtures
   * data are absent from LIVE (DB) MAP,
   * but present in LIVE (LOCAL) MAP;
   * @returns Promise < void >
   */
  async function injectLivescoreData
  (
  ): Promise < void >
  {
    const liveFixturesMap = $sessionStore?.livescore_now_scoreboard

    const if_0 =
      fixturesGroupByDateMap.size == 0
    ;
    if (if_0)
    {
      // [🐞]
      dlog
      (
        `${LV2_W_H_TAG[0]} ❌ NO LIVE FIXTURES!`,
        LV2_W_H_TAG[1]
      );
      return
    }

    const fixtureDates =
    [
      toISOMod($sessionStore.userDate),
      toISOMod(yesterday)
    ];
    let fixtureOrphanId: number[] = []

    // for each "target-date" expected to have,
    // LIVE fixtures, loop;
    for (const targetDate of fixtureDates)
    {
      let fixturesArray = fixturesGroupByDateMap.get(targetDate)

      const if_0 =
        fixturesArray == undefined
      ;
      if (if_0) continue;

      // @ts-ignore
      fixturesArray = fixturesArray
      ?.map
      (
        (
          fixture
        ) =>
        {
          // check for presence in LIVE (FIREBASE) MAP;
          // update properties/fields;
          if (liveFixturesMap.has(fixture.id))
          {
            return {
              ...fixture,
              minute: liveFixturesMap.get(fixture.id)?.minute,
              status: liveFixturesMap.get(fixture.id)?.status,
              teams:
              {
                away: {
                  name: fixture?.teams?.away?.name,
                  red_cards: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "away")?.redcards,
                  score: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "away")?.score,
                },
                home: {
                  name: fixture?.teams?.home?.name,
                  red_cards: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "home")?.redcards,
                  score: liveFixturesMap.get(fixture.id)?.teams?.find(x => x?.type == "home")?.score,
                }
              }
            };
          }

          // check for abscence from LIVE (FIREBASE) MAP,
          // but presence in LOCAL LIVE MAP;
          // ----
          // example :-> ROMA vs JUVENTUS goes from LIVE (to) -> FT, but user returns after 30+ min,
          // and fixture is still live, but it ended a while back, and "LSV2" data is gone;
          // ----
          const if_1 =
            fixturesGroupByDateLiveLeagueMap?.has(fixture.league_id)
            && fixturesGroupByDateLiveLeagueMap?.get(fixture.league_id)?.has(fixture?.id)
            && !liveFixturesMap.has(fixture.id)
          ;
          if (if_1)
          {
            fixtureOrphanId.push(fixture.id)
          }

          return fixture
        }
      );

      fixturesGroupByDateMap.set
      (
        targetDate,
        fixturesArray
      );
    }

    // handle ORPHAN (past-LIVE) fixtures;
    const if_2 =
      fixtureOrphanId.length != 0
    ;
    if (if_2)
    {
      const data_0 = await get
      (
        `/api/data/home/livescores-v2?fixtureIds=${fixtureOrphanId.toString()}`,
        null,
        true,
        true
      ) as unknown;

      const _fixtureMap = new Map
      (
        Object.entries(data_0)
      ) as unknown as Map <string, LS2_C_Fixture>;

      // loop each ORPHAN fixture and modify new data;
      for (const targetDate of fixtureDates)
      {
        let fixturesArray = fixturesGroupByDateMap.get(targetDate)

        const if_0 =
          fixturesArray == undefined
        ;
        if (if_0) continue;

        // @ts-ignore
        fixturesArray = fixturesArray
        ?.map
        (
          (
            fixture
          ) =>
          {
            // check for presence in LIVE (FIREBASE) MAP;
            // update properties/fields;
            if (fixtureOrphanId.includes(fixture.id))
            {
              const newOrphanData = _fixtureMap.get(fixture?.id?.toString())

              return {
                ...fixture,
                minute: newOrphanData?.minute,
                status: newOrphanData?.status,
                teams:
                {
                  away: {
                    name: fixture?.teams?.away?.name,
                    red_cards: newOrphanData?.teams?.away?.red_cards,
                    score: newOrphanData?.teams?.away?.score,
                  },
                  home: {
                    name: fixture?.teams?.home?.name,
                    red_cards: newOrphanData?.teams?.home?.red_cards,
                    score: newOrphanData?.teams?.home?.score,
                  }
                }
              };
            }

            return fixture
          }
        );

        fixturesGroupByDateMap.set
        (
          targetDate,
          fixturesArray
        );
      }
    }

    // IMPORTANT
    fixturesGroupByDateMap = fixturesGroupByDateMap

    // IMPORTANT
    updateLiveInfo()
    generateLeagueFixtures()

    // ???
    // WIDGET_DATA = WIDGET_DATA;
  }

  /**
   * @summary [MAIN]
   * @description updates information on target
   * fixtures, depending on selected-date;
   * (IF) no matching date in (cache) - seek
   * from (hasura) directly;
   */
  async function targetFixtureDateData
  (
  ): Promise < void >
  {

    let targetDate = toISOMod
    (
      $sessionStore.livescoreNowSelectedDate,
      true
    );

    let targetFixturesDateGroupObj = fixturesGroupByDateMap.get(targetDate);

    const if_0 =
      targetFixturesDateGroupObj == undefined
    ;
    if (if_0)
    {

      // [🐞]
      dlog
      (
        `${LV2_W_H_TAG[0]} 🔵 seeking ${targetDate} (date) fixtures`,
        LV2_W_H_TAG[1]
      );

      inProcessHistFixFetch = true

      const hasuraFixturesDate: B_LS2_D = await get
      (
        `/api/data/home/livescores-v2/?date=${targetDate}&hasura=true`,
        null,
        true,
        true
      ) as B_LS2_D;

      setData(hasuraFixturesDate)

      targetFixturesDateGroupObj = fixturesGroupByDateMap.get(targetDate);
    }

    inProcessHistFixFetch = false
    numOfFixtures = targetFixturesDateGroupObj?.length || 0

    // extract "this" date data, league-id's;
    nonEmptyLeaguesIds = [...new Set
      (
        targetFixturesDateGroupObj
        ?.map
        (
          fixture => fixture?.league_id
        )
      )
    ];
    dlog(`nonEmptyLeaguesIds: ${nonEmptyLeaguesIds}`, LV2_W_H_TAG[1])

    // get "this" country "geo" data;
    let geo_leagueIds_reference_numb_array = getRefLeagueIdList()

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
   * @summary [MAIN]
   * @description updates the information
   * for the live-fixtures - based
   * on users (today's) local time;
   * FIXME: potential issue as we only check for TODAY's date, fixtures
   * starting late night might disappear at the ealry morning from LIVE
   * SOLVED: by check for yesterdays games also;
   */
  async function updateLiveInfo
  (
  ): Promise < void >
  {

    // [🐞]
    dlog
    (
      `${LV2_W_H_TAG[0]} (in) updateLiveInfo`,
      LV2_W_H_TAG[1]
    );

    numOfFixturesLive = 0
    fixturesGroupByDateLiveLeagueMap = new Map()

    // FIXME: DOC: adding for await ... of > for await ... of causes (double) iteration

    // FIXME: SOLVED
      // -> sometimes, fixtures from backend are not updated correclty
      // -> causing status to be delayed
      // -> need check why some dont't update (etc.)

    // for today/yesterday, get fixtures;
    let fixturesList: LS2_C_Fixture[] = []
    if (fixturesGroupByDateMap.has(toISOMod($sessionStore.userDate)))
    {
      fixturesList =
      [
        ...fixturesList,
        ...fixturesGroupByDateMap.get(toISOMod($sessionStore.userDate))
      ]
    }
    if (fixturesGroupByDateMap.has(toISOMod(yesterday)))
    {
      fixturesList =
      [
        ...fixturesList,
        ...fixturesGroupByDateMap.get(toISOMod(yesterday))
      ]
    }

    const liveFixturesList = fixturesList
    ?.filter
    (
      x =>
        FIXTURE_LIVE_TIME_OPT.includes(x?.status)
    );

    numOfFixturesLive = liveFixturesList.length
    liveLeaguesIds = liveFixturesList
    ?.map
    (
      x =>
        x?.league_id
    )
    ;
    liveLeaguesIds = [...new Set(liveLeaguesIds)]

    let geoRefIdList = getRefLeagueIdList()

    liveLeaguesIds = liveLeaguesIds
    ?.sort
    (
      (
        a,
        b
      ) =>
      {
        const index1 = geoRefIdList.indexOf(a);
        const index2 = geoRefIdList.indexOf(b);
        return (
          (index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity)
        );
      }
    );

    for (const id of liveLeaguesIds)
    {
      const leagueFixtures = liveFixturesList
      ?.filter
      (
        x =>
        x?.league_id == id
      );
      const leagueFixturesMap: Map < number, LS2_C_Fixture > = new Map()
      for (const l_fix of leagueFixtures)
      {
        leagueFixturesMap.set
        (
          l_fix?.id,
          l_fix
        )
      }
      fixturesGroupByDateLiveLeagueMap.set
      (
        id,
        leagueFixturesMap
      )
    }

    fixturesGroupByDateLiveLeagueMap = fixturesGroupByDateLiveLeagueMap

    dlog(`${LV2_W_H_TAG[0]} numOfFixturesLive ${numOfFixturesLive}`, LV2_W_H_TAG[1])
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds.length ${liveLeaguesIds.length}`, LV2_W_H_TAG[1])
    dlog(`${LV2_W_H_TAG[0]} liveLeaguesIds ${liveLeaguesIds}`, LV2_W_H_TAG[1])
  }

  /**
   * @summary [MAIN]
   * @description simple toggle for
   * show more data;
   */
  function toggleShowMore
  (
  ): void
  {
    isShowMore = !isShowMore
    generateLeagueFixtures()
  }

  /**
   * @summary [MAIN]
   * @description generates target "selected_date"
   * fixtures, and groups by leagues; Handles for
   * "showMore" toggle with extra filtering;
   * @returns void
   */
  function generateLeagueFixtures
  (
  ): void
  {
    fixturesGroupByDateLeagueMap = new Map();
    // generate "target" date fixtures;
    const validation_0 =
      fixturesGroupByDateMap.has(toISOMod($sessionStore.livescoreNowSelectedDate, true))
    ;
    if (validation_0) {
      const leagueIds = nonEmptyLeaguesArray?.map(x => x?.id)
      let fixturesList = fixturesGroupByDateMap.get(
        toISOMod(
          $sessionStore.livescoreNowSelectedDate, true))
          ?.sort((
              a,
              b
            ) =>
              toCorrectDate(a.time).getTime() - toCorrectDate(b.time).getTime()
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

  /**
   * TODO: DOC:
   * @param { number } leagueId
   * @returns { string }
   */
  function correctFlagGenerate
  (
    leagueId: number
  ): string
  {
    let targetLeagueFlag: string;

    if (leagueId == 5 || leagueId == 2)
      targetLeagueFlag = `/assets/flags/EU.svg`;
    else if (leagueMap.get(leagueId)?.iso2 != null)
      targetLeagueFlag = `/assets/flags/${leagueMap.get(leagueId)?.iso2}.svg`;
    else
      targetLeagueFlag = `/assets/flags/EN.svg`;
    ;

    return targetLeagueFlag;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr
  (
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
  function getRefLeagueIdList
  (
  ): number[]
  {

    let geo_leagueIds_reference_array = WIDGET_DATA?.leagues_geo_list
    ?.find
    (
      (
        { lang }
      ) =>
      lang == $userBetarenaSettings?.country_bookmaker
    )
    ?.leagues;

    // [🐞]
    dlog
    (
      `🔥 ${$userBetarenaSettings?.country_bookmaker}`,
      LV2_W_H_TAG[1]
    );

    const if_0 =
      geo_leagueIds_reference_array == undefined
    ;
    if (if_0)
    {
      dlog("❌ No target COUNTRY-GEO found", LV2_W_H_TAG[1])
      geo_leagueIds_reference_array = WIDGET_DATA?.leagues_geo_list
      ?.find
      (
        (
          { lang }
        ) =>
        lang == 'en'
      )?.leagues;
    }

    const geo_leagueIds_reference_numb_array = geo_leagueIds_reference_array
    ?.map
    (
      v => v.league_id
    );

    // [🐞]
    dlog
    (
      geo_leagueIds_reference_numb_array,
      LV2_W_H_TAG[1]
    )

    return geo_leagueIds_reference_numb_array;
  }

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @description
   * ➨ listens to change in "selected-date" for calendar;
   * ➨ listens to change in country-bookmaker;
  */
  $: if
  (
    livescoreNowSelectedDateChng
    || bookmakerChng
  )
  {
    // isShowMore = false
    targetFixtureDateData()
    updateLiveInfo()
  }

  /**
   * @description
   * ➨ listens to change in "livescore_now_scoreboard" data session-store;
  */
  $: if (livescoreNowScoreboardChng)
  {
    injectLivescoreData()
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
                  loading="lazy"
                  src={correctFlagGenerate(leagueId)}
                  on:error={(e) => (e.currentTarget.src = '/assets/flags/EN.svg')}
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
        <!--
        [ℹ] iterate over each non-empty-league-id's for selected_date
        -->
        {#if !fixturesGroupByDateLiveLeagueMap.size}
        <div class="fixture-row no-data">
          <NoData title={WIDGET_T_DATA.no_info?.title} text={`${WIDGET_T_DATA.no_info?.desc} ${WIDGET_T_DATA.no_info?.['sub-t']}`} />
        </div>
        {:else}
          {#each [...fixturesGroupByDateLiveLeagueMap.entries()] as [leagueId, fixtureMap]}
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
                  loading="lazy"
                  src={correctFlagGenerate(leagueId)}
                  on:error={(e) => (e.currentTarget.src = '/assets/flags/EN.svg')}
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
            [ℹ] fixtures (of league) (box)
            -->
            {#each [...fixtureMap.entries()] as [f_id, fixture]}
                <!-- <p>[🐞] {fixture?.id}</p> -->
                <LivescoresFixtureRow
                  FIXTURE_D={fixture}
                  {server_side_language}
                />
            {/each}

        {/each}
        {/if}

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

  .no-data {
    padding-top: 12px;
    padding-bottom: -8px;
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
      margin-right: 27px;
      width: 24px;
      margin-top: -2px;
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
  .dark-background-1 .no-data,
  .dark-background-1 div#show-more-box {
    border-top: 1px solid var(--dark-theme-1-shade);
  }

</style>