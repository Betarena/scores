<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	import { page } from '$app/stores';

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE

  //#region ➤ Svelte/SvelteKit Imports
  // IMPORTS GO HERE
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // IMPORTS GO HERE
  import { sessionStore } from '$lib/store/session';
  //#endregion ➤ Project Custom Imports

  //#region ➤ Firebase Imports
  // IMPORTS GO HERE
  //#endregion ➤ Firebase Imports

  //#region ➤ Types Imports
  // IMPORTS GO HERE
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // IMPORTS GO HERE
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { WEEK_DAYS_ABBRV_2 } from '$lib/utils/dates';
  import type { B_LS2_T } from '@betarena/scores-lib/types/livescores-v2';
  import vec_calendar_dark from './assets/calendar-dark.svg';
  import vec_calendar_sel from './assets/calendar-select.svg';
  import vec_calendar from './assets/calendar.svg';
  import vec_pulse_dot from './assets/live-dot-vector.svg';
  import LivescoresCalendarTable from './Livescores_Calendar_Table.svelte';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let numOfFixtures: number;
  export let numOfFixturesLive: number;

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA

  const today = new Date()

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

  let defaultCalendarIcon: string

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

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
      class:activeDate={new Date(item).toISOString().slice(0, 10) == $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)}
      on:click={() => $sessionStore.livescoreNowSelectedDate = new Date(item)}>
      <p
        class="
          s-14
          w-500
          color-black-2
          text-center
        "
        class:currentDate={new Date(item).toISOString().slice(0, 10) == today.toISOString().slice(0, 10)}>
        {WIDGET_T_DATA?.days[WEEK_DAYS_ABBRV_2[new Date(item).getDay()]] || ""}
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
      src={$sessionStore.livescoreShowCalendar ? vec_calendar_sel : defaultCalendarIcon} 
      alt=""
      on:click={() => $sessionStore.livescoreShowCalendar = !$sessionStore.livescoreShowCalendar}
      on:mouseover={(e) => e.currentTarget.src = vec_calendar_sel}
      on:mouseleave={(e) => {if (!$sessionStore.livescoreShowCalendar) e.currentTarget.src = defaultCalendarIcon}}
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
      All ({numOfFixtures})
    </p>
  </div>
  <div
    class="
      fixture-filter-box
      text-center
    "
    class:activeOption={$sessionStore.livescoreFixtureView == 'live'}
    on:click={() => $sessionStore.livescoreFixtureView = 'live'}>
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
    width: 40px;
  } div#livescores-dates-box > div.livescore-date-box.activeDate {
    background: var(--primary);
  } div#livescores-dates-box > div.livescore-date-box.activeDate > p {
    color: var(--white);
  }

  .currentDate {
    color: var(--primary);
  }

  div#calendar-out-box {
    position: relative;
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

  @media only screen and (min-width: 475px) {
    div#livescores-dates-box > div.livescore-date-box {
      width: 46px;
    }
  }

</style>