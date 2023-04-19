<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
	import { page } from '$app/stores';
	import { sessionStore } from '$lib/store/session';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { WEEK_DAYS_ABBRV_1, toCorrectDate, toISOMod } from '$lib/utils/dates';
	import type { B_LS2_T } from '@betarena/scores-lib/types/livescores-v2';
	import LivescoresCalendarTable from './Livescores_Calendar_Table.svelte';
	import vec_calendar_dark from './assets/calendar-dark.svg';
	import vec_calendar_sel_date from './assets/calendar-date-sel.svg';
	import vec_calendar_sel from './assets/calendar-select.svg';
	import vec_calendar from './assets/calendar.svg';
	import vec_pulse_dot from './assets/live-dot-vector.svg';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let numOfFixtures: number;
  export let numOfFixturesLive: number;

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

  let fixture_dates: [
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ]

  let defaultCalendarIcon: string

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @summary [MAIN] method
   * @description generates the
   * dates for the -3/+3 dates
   * from CLIENTs current timezone
   * adjusted Date object;
   * @returns NaN
   */
  function generateThisWeekDates
  (
  ) 
  {

    // NOTE: clone-copy user date correctly, without deepcopy;
    const _today = new Date($sessionStore.userDate.getTime())
    _today.setDate(_today.getDate() - 3)
    const days_3_ago = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_2_ago = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_1_ago = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_0 = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_1_future = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_2_future = toISOMod(_today, true)
    _today.setDate(_today.getDate() + 1)
    const days_3_future = toISOMod(_today, true)

    fixture_dates = [
      days_3_ago,
      days_2_ago,
      days_1_ago,
      days_0,
      days_1_future,
      days_2_future,
      days_3_future
    ]

    // console.log(fixture_dates)
  }

  generateThisWeekDates()

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  $: if ($userBetarenaSettings.theme == 'Dark') {
    defaultCalendarIcon = vec_calendar_dark
  } else {
    defaultCalendarIcon = vec_calendar
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

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
        cursor-pointer
      "
      class:activeDate={item == toISOMod($sessionStore.livescoreNowSelectedDate, true)}
      on:click={() => $sessionStore.livescoreNowSelectedDate = toCorrectDate(item, false)}>
      <p
        class="
          s-14
          w-400
          color-black-2
          text-center
        "
        class:currentDate={item == toISOMod($sessionStore.userDate, true)}>
        <!-- SEE: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off -->
        {WIDGET_T_DATA?.days[WEEK_DAYS_ABBRV_1[toCorrectDate(item).getDay()]] || ""}
        <br/>
        <span
          class="w-500">
          <!-- SEE: https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off -->
          {toCorrectDate(item, true).getDate()}
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
    id="calendar-out-box"
    class="
      text-center
      column-space-center
    "
    class:activeDate={!fixture_dates.includes(toISOMod($sessionStore.livescoreNowSelectedDate))}>
    <!-- 
    [ℹ] calendar (vector)
    -->
    <img 
      src={
        $sessionStore.livescoreShowCalendar 
        && fixture_dates.includes(toISOMod($sessionStore.livescoreNowSelectedDate)) 
        ? vec_calendar_sel 
        : !fixture_dates.includes(toISOMod($sessionStore.livescoreNowSelectedDate)) 
          ? vec_calendar_sel_date
          : defaultCalendarIcon
      } 
      alt="default alt text"
      on:mouseover={(e) => {if (fixture_dates.includes(toISOMod($sessionStore.livescoreNowSelectedDate))) e.currentTarget.src = vec_calendar_sel}}
      on:mouseleave={(e) => {if (!$sessionStore.livescoreShowCalendar && fixture_dates.includes(toISOMod($sessionStore.livescoreNowSelectedDate)) ) e.currentTarget.src = defaultCalendarIcon}}
      on:click={() => $sessionStore.livescoreShowCalendar = !$sessionStore.livescoreShowCalendar}
      class="cursor-pointer"
      width="24"
      height="24"
    />
    <!-- 
    [ℹ] calendar (pop-up)
    -->
    {#if $sessionStore.livescoreShowCalendar}
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
      cursor-pointer
    "
    class:activeOption={$sessionStore.livescoreFixtureView == 'all'}
    on:click={() => $sessionStore.livescoreFixtureView = 'all'}>
    <p
      class="
        s-14
        w-500
        color-grey
        cursor-pointer
      ">
      {WIDGET_T_DATA?.all || 'All'} 
      {#if toISOMod($sessionStore.livescoreNowSelectedDate) == toISOMod($sessionStore.userDate)}
        ({$sessionStore.fixturesTodayNum || 0})
      {:else}
        ({numOfFixtures || 0})
      {/if}
    </p>
  </div>
  <div 
    class="
      fixture-filter-box
      text-center
      cursor-pointer
    "
    class:activeOption={$sessionStore.livescoreFixtureView == 'live'}
    on:click={() => $sessionStore.livescoreFixtureView = 'live'}>
    <div
      id="live-filter-box"
    >
      <p
        class="
          s-14
          w-500
          color-grey
        ">
        {WIDGET_T_DATA?.live || 'Live'} ({numOfFixturesLive || 0})
      </p>
      {#if numOfFixturesLive != 0}
        <img 
          src={vec_pulse_dot}
          alt='pulsating-dot'
          width="16"
          height="16"
        />
      {/if}
    </div>
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#livescores-dates-box {
    padding: 0 7px 0 16px;
  } 
  div#livescores-dates-box > div.livescore-date-box,
  div#calendar-out-box {
    /* padding: 7px 13px; */
    border-radius: 6px;
    width: 40px;
    height: 56px;
  }
  div#livescores-dates-box > div.livescore-date-box.activeDate,
  div#calendar-out-box.activeDate {
    background: var(--primary);
    box-shadow: 0px 3px 8px rgba(212, 84, 12, 0.32);
  } div#livescores-dates-box > div.livescore-date-box.activeDate > p {
    color: var(--white) !important;
  }

  .currentDate {
    color: var(--primary) !important;
  }

  div#calendar-out-box {
    position: relative;
    /* padding: 16px 11px; */
  }

  div#fixture-filter-opt-box-outer {
    padding: 0 16px;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box {
    width: 100%;
    padding: 19px 0 12px 0;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box.activeOption {
    border-bottom: 1px solid var(--primary);
  } div#fixture-filter-opt-box-outer div.fixture-filter-box.activeOption p {
    color: var(--primary) !important;
  }
  div#fixture-filter-opt-box-outer div.fixture-filter-box div#live-filter-box {
    position: relative;
    width: fit-content;
  } div#fixture-filter-opt-box-outer div.fixture-filter-box div#live-filter-box > img {
    position: absolute;
    top: -5px;
    right: -50%;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (max-width: 388px) {
    div#livescores-dates-box > div.livescore-date-box,
    div#calendar-out-box {
      width: 37px;
    }
  }

  @media only screen 
    and (min-width: 475px) {
    div#livescores-dates-box {
      padding: 0 9px 0 20px;
    }
    div#fixture-filter-opt-box-outer {
      padding: 0 20px;
    } div#fixture-filter-opt-box-outer div.fixture-filter-box p {
      font-weight: 500;
    }
    div#livescores-dates-box > div.livescore-date-box,
    div#calendar-out-box {
      width: 46px;
    }
  }

  /*
  =============
  DARK-THEME
  =============
  */

</style>