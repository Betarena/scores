<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import type { B_LS2_D } from 'betarena-types/types/livescores-v2';

	import { WEEK_DAYS_ABBRV } from '$lib/utils/dates';
	import LivescoresCalendarTable from './Livescores_Calendar_Table.svelte';
	import LivescoresFixtureRow from './Livescores_Fixture_Row.svelte';
//#region ➤ [MAIN] Package Imports

  import { page } from '$app/stores';
  import { get } from '$lib/api/utils';
  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import { sessionStore } from '$lib/store/session';
  import { dlog } from '$lib/utils/debug';
  import { platfrom_lang_ssr } from '$lib/utils/platform-functions';
  import vec_calendar_sel from './assets/calendar-select.svg';
  import vec_calendar from './assets/calendar.svg';
  import vec_pulse_dot from './assets/live-dot-vector.svg';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_LS2_D
  const WIDGET_TITLE = 'Livescores'
  const today = new Date()
  let nonEmptyLeaguesIds: number[] = []
  let numOfFixtures: number;
  let numOfFixturesLive: number;
  let liveLeaguesIds: number[] = []
  let showCalendar: boolean = false
  let selectedFixtureOptionStatus: 'all' | 'live' = 'all'

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

  // GET STARTING WEEK DAYS + IT'S END
  // s_date.setDate(s_date.getDate() - s_date.getDay() + 1);
  // e_date.setDate(e_date.getDate() - e_date.getDay() + 7);

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @description updates the information
   * for the fixtures of current-date with
   * real-time information;
   */
  function injectLivescoreData(
  ): Promise < void > {
    
    const liveFixturesMap = $sessionStore?.livescore_now

    // [ℹ] validate against "visible" fixtures
		const currentDate = new Date();
		const targetFixturesDateGroupObj = 
      WIDGET_DATA?.fixtures_by_date
      .find( ({ date }) => 
        new Date(date).toISOString().slice(0, 10) == currentDate.toISOString().slice(0, 10)
      )
    ;

    // [ℹ] exit;
    if (targetFixturesDateGroupObj == undefined) {
      return
    }

    const newFixturesArray = targetFixturesDateGroupObj
      ?.fixtures.map((fixture) => {
        if (liveFixturesMap.has(fixture.id)) {
          return {
            ...fixture,
            minute: liveFixturesMap.get(
              fixture.id
            )?.time?.minute,
            status: liveFixturesMap.get(
              fixture.id
            )?.time?.status,
            teams: {
              away: {
                name: fixture?.teams?.away
                  ?.name,
                red_cards: liveFixturesMap.get(
                  fixture.id
                )?.stats?.data[1]?.redcards,
                score: liveFixturesMap.get(
                  fixture.id
                )?.scores?.visitorteam_score
              },
              home: {
                name: fixture?.teams?.home
                  ?.name,
                red_cards: liveFixturesMap.get(
                  fixture.id
                )?.stats?.data[0]?.redcards,
                score: liveFixturesMap.get(
                  fixture.id
                )?.scores?.localteam_score
              }
            }
          };
        }
        return fixture;
      });

    WIDGET_DATA.fixtures_by_date
      .find( ({ date }) => 
        new Date(date).toISOString().slice(0, 10) == currentDate.toISOString().slice(0, 10)
      ).fixtures = newFixturesArray;

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
    let targetDate = $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)
    // [ℹ] filter fixtures matching selected-date matching "yyyy/MM/dd" string
    let targetFixturesDateGroupObj = 
      WIDGET_DATA?.fixtures_by_date
      .find( ({ date }) => 
        new Date(date).toISOString().slice(0, 10) == targetDate
      )
    ;
    // [ℹ] validation;
    if (targetFixturesDateGroupObj == undefined) {
      console.log(`seeking from Hasura! DATE: ${targetDate}`)
      const hasuraFixturesDate: B_LS2_D = await get(`/api/hasura/home/livescores-v2/?date=${targetDate}`) as B_LS2_D
      WIDGET_DATA.fixtures_by_date = WIDGET_DATA?.fixtures_by_date.concat(hasuraFixturesDate?.fixtures_by_date)
      WIDGET_DATA.leagues = WIDGET_DATA?.leagues.concat(hasuraFixturesDate?.leagues)
      targetFixturesDateGroupObj = 
        WIDGET_DATA?.fixtures_by_date
        .find( ({ date }) => 
          new Date(date).toISOString().slice(0, 10) == targetDate
        )
      ;
    }
    numOfFixtures = targetFixturesDateGroupObj?.fixtures?.length || 0
    // [ℹ] filter non-empty leagues with fixtures (for selected-date)
    const leaguesSet: Set<number> = new Set();
    for (const fixture of targetFixturesDateGroupObj?.fixtures) {
      leaguesSet.add(fixture?.league_id)
    }
    nonEmptyLeaguesIds = [...leaguesSet]
  }

  /**
   * @description updates the information 
   * for the live-fixtures - based 
   * on users (today's) local time;
   * FIXME: potential issue as we only check for TODAY's date, fixtures 
   * starting late night might disappear at the ealry morning from LIVE
   */
  function updateLiveInfo(
  ): void {
    // [ℹ] filter fixtures matching selected-date matching "yyyy/MM/dd" string
    const targetFixturesDateGroupObj = 
      WIDGET_DATA?.fixtures_by_date
      .find( ({ date }) => 
        new Date(date).toISOString().slice(0, 10) == today.toISOString().slice(0, 10)
      )
    ;
    // [ℹ] identify number of live fixtures
    const targetFixturesDateGroupObjLive = 
      targetFixturesDateGroupObj?.fixtures
      .filter( ({ status }) => 
        status === "LIVE"
      )
    ;
    numOfFixturesLive = targetFixturesDateGroupObjLive?.length || 0
    const liveLeaguesSet = new Set(targetFixturesDateGroupObjLive.map(f => f?.league_id))
    liveLeaguesIds = [...liveLeaguesSet]
    console.log(liveLeaguesIds)
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
    <!-- 
    [ℹ] +3/0/-3 days select (box)
    -->
    <div
      id="livescores-dates-box"
      class="
        row-space-out
      ">
      {#each fixture_dates as item}
        <div
          class="
            column-space-center
            livescore-date-box
            width-auto
          "
          class:activeDate={new Date(item).toISOString().slice(0, 10) == $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)}
          on:click={() => $sessionStore.livescoreNowSelectedDate = new Date(item)}>
          <p
            class="
              s-14
              w-500
              color-black-2
              text-center
            ">
            {WEEK_DAYS_ABBRV[new Date(item).getDay()]}
            <br/>
            <span
              class="w-500">
              {new Date(item).getDate()}
            </span>
          </p>
        </div>
      {/each}
      <!-- 
      [ℹ] calendar (feature)
      <-contents->
      [ℹ] calendar (icon)
      [ℹ] calendar (pop-up)
      -->
      <div
        id="calendar-out-box">
        <!-- 
        [ℹ] calendar (vector)
        -->
        <img 
          src={showCalendar ? vec_calendar_sel : vec_calendar} 
          alt=""
          on:click={() => showCalendar = !showCalendar}
          on:mouseover={(e) => e.target.src = vec_calendar_sel}
          on:mouseleave={(e) => {if (!showCalendar) e.target.src = vec_calendar}}
          class="cursor-pointer"
        />
        <!-- 
        [ℹ] calendar (pop-up)
        -->
        {#if showCalendar}
          <LivescoresCalendarTable />
        {/if}
      </div>
    </div>

    <!-- 
    [ℹ] filter by (all/live) fixtures
    -->
    <div
      id="fixture-filter-opt-box-outer"
      class="
        row-space-out
      ">
      <div
        class="
          fixture-filter-box
          text-center
        "
        class:activeOption={selectedFixtureOptionStatus == 'all'}
        on:click={() => selectedFixtureOptionStatus = 'all'}>
        <p
          class="
            s-14
            w-500
            color-grey
            cursor-pointer
          ">
          All ({numOfFixtures})
        </p>
      </div>
      <div
        class="
          fixture-filter-box
          text-center
        "
        class:activeOption={selectedFixtureOptionStatus == 'live'}
        on:click={() => selectedFixtureOptionStatus = 'live'}>
        <div
          id="live-filter-box">
          <p
            class="
              s-14
              w-500
              color-grey
              cursor-pointer
            ">
            Live ({numOfFixturesLive})
          </p>
          <img 
            src={vec_pulse_dot}
            alt='pulsating-dot'
            width="16"
            height="16"
          />
        </div>
      </div>
    </div>

    <!-- 
    [ℹ] today's (or selected date here)
    <-conditional->
    [ℹ] filter by LEAGUES with FIXTURES (non-empty) on SELECTED-DATE
    [ℹ] (nested) filter by FIXTURES belonging to TARGET LEAGUE (non-empty)
    [ℹ] (nested) filter by FIXTURES belonging to TARGET FIXTURE DATE (non-empty)
    -->
    <div>
      {#each WIDGET_DATA?.leagues as league}
        {#if nonEmptyLeaguesIds.includes(league?.id)}
          <!-- 
          [ℹ] league info (box)
          -->
          <div
            class="
              row-space-start
              league-group
            "
            class:display-none={selectedFixtureOptionStatus == 'live' && !liveLeaguesIds.includes(league?.id)}>
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
          {#each WIDGET_DATA?.fixtures_by_date as fixture}
            {#if selectedFixtureOptionStatus == 'all'}
              {#if new Date(fixture?.date).toISOString().slice(0, 10) == $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)}
                {#each fixture.fixtures as subItem}
                  {#if subItem?.league_id == league?.id}
                    <LivescoresFixtureRow 
                      FIXTURE_D={subItem}
                      {server_side_language}
                    />
                  {/if}
                {/each}
              {/if}
            {:else}
              {#each fixture.fixtures as subItem}
                {#if subItem?.league_id == league?.id && subItem?.status === 'LIVE'}
                  <LivescoresFixtureRow 
                    FIXTURE_D={subItem}
                    {server_side_language}
                  />
                {/if}
              {/each}
            {/if}
          {/each}
        {/if}
      {/each}
    </div>
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#livescores-dates-box {
    padding: 0 20px 20px 20px;
  } div#livescores-dates-box > div.livescore-date-box {
    padding: 7px 13px;
    border-radius: 6px;
  } div#livescores-dates-box > div.livescore-date-box.activeDate {
    background: var(--primary);
  } div#livescores-dates-box > div.livescore-date-box.activeDate > p {
    color: var(--white);
  }

  div#calendar-out-box {
    position: relative;
  } :global(div#calendar-out-box div#calendar-popup) {
    position: absolute;
    top: 105%;
    right: 0;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    z-index: 1;
  } :global(div#calendar-out-box div#calendar-popup div#calendar-date-select) {
    padding: 16px;
    border-bottom: 1px solid var(--grey-color);
  }

  div#fixture-filter-opt-box-outer {
    padding: 0 20px;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box {
    width: 100%;
    padding: 19px 0 12px 0;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box.activeOption {
    border-bottom: 1px solid var(--primary);
  } div#fixture-filter-opt-box-outer div.fixture-filter-box.activeOption p {
    color: var(--primary);
  }
  div#fixture-filter-opt-box-outer div.fixture-filter-box div#live-filter-box {
    position: relative;
    width: fit-content;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box div#live-filter-box > img {
    position: absolute;
    top: -5px;
    right: -50%;
  }

  div.league-group {
    padding: 18px 28px 10px 28px;
    border-top: 1px solid var(--grey-color);
  }

  @media only screen and (min-width: 726px) and (max-width: 1000px) {
  }

</style>