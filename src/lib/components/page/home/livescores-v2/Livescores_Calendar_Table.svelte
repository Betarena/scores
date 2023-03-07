<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
	
  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
  
  //#region ➤ Svelte/SvelteKit Imports
  // IMPORTS GO HERE
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
//#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // IMPORTS GO HERE
  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from '$lib/store/user-settings';
// IMPORTS GO HERE
  import { monthNames, WEEK_DAYS_ABBRV_2 } from '$lib/utils/dates';
  // IMPORTS GO HERE
  import { dlog, LV2_W_H_TAG } from '$lib/utils/debug';
  import { viewport_change } from '$lib/utils/platform-functions';
  import type { B_LS2_T } from '@betarena/scores-lib/types/livescores-v2';
  import { onMount } from 'svelte';
//#endregion ➤ Project Custom Imports

  //#region ➤ Firebase Imports
  // IMPORTS GO HERE
  //#endregion ➤ Firebase Imports

  //#region ➤ Types Imports
  // IMPORTS GO HERE
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // IMPORTS GO HERE
  import vec_arrow_left_dark from './assets/arrow-left-dark.svg';
  import vec_arrow_left from './assets/arrow-left.svg';
  import vec_arrow_right_dark from './assets/arrow-right-dark.svg';
  import vec_arrow_right from './assets/arrow-right.svg';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  let numberOfMonthWeeks: number
  interface monthWeekObject {
    weekStart: number,
    weekEnd: number,
    weekDates: Date[]
  }
  let monthWeeksArray: monthWeekObject[] = []
  let tempDate = $sessionStore.livescoreNowSelectedDate;
  const _currentDate = new Date()

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @description calculates (this) month
   * dates, weeks and week-days, as well as
   * their start-end days, with overrun into
   * past-and-next month dates respectively;
   * FIXES: includes for when month has 1-1 start/end
   * for SUN days;
   * @param {Date} tDate
   */
  function calcThisMonth (
    tDate: Date
  ): void {
    let month = tDate.getMonth()
    let year = tDate.getFullYear()
    const s_date = new Date(tDate)
    const e_date = new Date(tDate)
    numberOfMonthWeeks = Math.floor(daysInMonth(month+1, year) / 5) // NOTE: should be / 7
    dlog(`${LV2_W_H_TAG[0]} daysInMonth(): ${daysInMonth(month, year) }`)
    dlog(`${LV2_W_H_TAG[0]} numberOfMonthWeeks: ${numberOfMonthWeeks}`)
    let count = 0
    // [ℹ] start counting from 1st of (selected) month
    s_date.setDate(1);
    e_date.setDate(1);
    monthWeeksArray = []
    dlog(`${LV2_W_H_TAG[0]} s_date: ${s_date.toISOString()}`)
    dlog(`${LV2_W_H_TAG[0]} s_date.getDate() : ${s_date.getDate()}`)
    dlog(`${LV2_W_H_TAG[0]} s_date.getDay() : ${s_date.getDay()}`)
    while (true) {
      // [ℹ] exit;
      if (count >= numberOfMonthWeeks) {
        break;
      }
      const startWeekCalc = 
        s_date.getDay() == 0
        && e_date.getDay() == 0
          ? (s_date.getDate() - 6)
          : (s_date.getDate() - s_date.getDay() + 1)
      const endWeekCalc = 
        s_date.getDay() == 0
        && e_date.getDay() == 0
          ? (s_date.getDate() - 0)
          : (s_date.getDate() - s_date.getDay() + 7)
      s_date.setDate(startWeekCalc);
      e_date.setDate(endWeekCalc);
      let times = 8
      let weekDates: Date[] = []
      for (let i = 1; i < times; i++){
        let weekStart = new Date(s_date)
        weekStart.setDate(s_date.getDate() - s_date.getDay() + i)
        weekDates.push(new Date(weekStart))
      }
      monthWeeksArray.push({
        weekStart: s_date.getDate(),
        weekEnd: e_date.getDate(),
        weekDates
      })
      s_date.setDate(s_date.getDate() + 7);
      e_date.setDate(e_date.getDate() + 7);
      count++
      dlog(`${LV2_W_H_TAG[0]} s_date: ${s_date.toISOString()} | s_date.getDate(): ${s_date.getDate()} | s_date.getDay(): ${s_date.getDay()} | count: ${count}`, true)
    }
    dlog(monthWeeksArray, true)
  }

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive,
		tabletExclusive: boolean = false;

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

  //#region ➤ [ONE-OFF] [METHODS] [IF]
  
  /**
   * @description calculates number of days in a target
   * month, using the 0-11 month index & target year;
   * @param {number} month
   * @param {number} year
   */
  function daysInMonth (
    month: number, 
    year: number
  ): number {
    return new Date(year, month, 0).getDate();
  }
  
  /**
   * @description updates month of temp-calendar
   * date for browsing for the user;
   * Triggers new calendar calculation of dates;
   * Without persisting to session-store;
   * @param {number} change
   * @returns {void} void
   */
  function monthChange(
    change: number
  ): void {
    dlog(`${LV2_W_H_TAG[0]} (in) monthChange`)
    tempDate.setMonth(tempDate.getMonth() + change)
    tempDate = tempDate
    calcThisMonth(tempDate)
  }

  /**
   * @description selected date function;
   * Triggers recalculation of month and updates 
   * session-store to signal new selected date;
   * @param {Date} newDate
   * @returns {void} void
   */
  function dateChange(
    newDate: Date
  ): void {
    dlog(`${LV2_W_H_TAG[0]} (in) dateChange`)
    $sessionStore.livescoreNowSelectedDate = new Date(newDate)
    tempDate = $sessionStore.livescoreNowSelectedDate
    calcThisMonth(newDate)
  }

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  $: if (browser && $sessionStore.livescoreNowSelectedDate) {
    calcThisMonth($sessionStore.livescoreNowSelectedDate)
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="background-area-close-inner"
  on:click={() => $sessionStore.livescoreShowCalendar = false}
/>

<div
  id="calendar-popup"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>
  <!--
  [ℹ] calendar select month (top-row)
  -->
  <div
    id="calendar-date-select"
    class="
      row-space-out
    ">
    <img 
      src="{$userBetarenaSettings.theme == 'Dark' ? vec_arrow_left_dark : vec_arrow_left}" 
      alt=""
      on:click={() => monthChange(-1)}
      class="cursor-pointer"
    />
    <p
      class="
        s-14
        w-500
        color-black-2
      ">
      {WIDGET_T_DATA?.months?.months[monthNames[tempDate.getMonth()]]}
      {tempDate.getFullYear()}
    </p>
    <img 
      src="{$userBetarenaSettings.theme == 'Dark' ? vec_arrow_right_dark : vec_arrow_right}" 
      alt=""
      on:click={() => monthChange(1)}
      class="cursor-pointer"
    />
  </div>
  <!-- 
  [ℹ] calendar view of (select) month
  -->
  <div
    id="calendar-inner">
    <table>
      <!-- 
      [ℹ] week days abbrev
      -->
      <tr>
        {#each WEEK_DAYS_ABBRV_2 as day}
          <th>
            <p
              class="
                s-14
                color-grey
              ">
              {WIDGET_T_DATA?.days[day] || ""}
            </p>
          </th>
        {/each}
      </tr>
      <!-- 
      [ℹ] weeks rows
      -->
      {#if numberOfMonthWeeks != undefined || numberOfMonthWeeks != 0 || monthWeeksArray.length != 0}
        {#each {length: numberOfMonthWeeks} as _,i}
          <tr>
            {#each monthWeeksArray[i].weekDates as item}
              <td
                class="
                  w-500
                  color-black-2
                  cursor-pointer
                "
                class:activeDate={item.toISOString().slice(0, 10) == $sessionStore.livescoreNowSelectedDate.toISOString().slice(0, 10)}
                class:currentDate={item.toISOString().slice(0, 10) == _currentDate.toISOString().slice(0, 10)}
                class:notViewMonth={item.getMonth() != tempDate.getMonth()}
                on:click={() => dateChange(item)}>
                {item.getDate()}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </table>
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  #background-area-close-inner {
    position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 999998;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
  }

  div#calendar-popup {
    /* p */
    position: fixed;
    z-index: 999999;
    bottom: 20px;
    right: 0;
    left: 0;
    /* s */
    background: #FFFFFF;
    width: 92.5%;
    margin: auto;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
  } div#calendar-popup div#calendar-date-select {
    padding: 16px;
    border-bottom: 1px solid var(--grey-color);
  }

  div#calendar-inner table {
    padding: 16px 0;
  } 
  div#calendar-inner table tr th, 
  div#calendar-inner table tr td {
    padding: 7px 11px;
    max-width: 48px;
    height: 32px;
    text-align: center;
  } 

  div#calendar-inner table tr td:hover {
    background-color: var(--whitev2);
    border-radius: 60px;
    color: var(--dark-theme);
  } div#calendar-inner table tr td.activeDate {
    background-color: var(--primary);
    border-radius: 60px;
    color: var(--white);
  }

  td.currentDate {
    color: var(--primary);
  }
  td.notViewMonth {
    color: var(--grey-color) !important;
  }

  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 475px) {
    div#calendar-popup {
      position: absolute;
      top: 105%;
      right: 0;
      bottom: unset;
      left: unset;
      z-index: 2;
      width: fit-content;
    }
    #background-area-close-inner {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      background-color: transparent;
    }
    div#calendar-inner table {
      padding: 16px;
    } 
  }

  /*
  =============
  DARK-THEME
  =============
  */

  div#calendar-popup.dark-background-1 {
    background-color: var(--dark-theme-1-shade) !important;
  }

  .dark-background-1 div#calendar-inner table tr td:hover {
    background-color: var(--dark-theme-1);
    border-radius: 60px;
    color: var(--white);
  }

  .dark-background-1 td.notViewMonth {
    color: var(--dark-theme-1-2-shade) !important;
  }

  div#calendar-popup.dark-background-1 div#calendar-date-select {
    border-bottom: 1px solid var(--dark-theme);
  }

</style>