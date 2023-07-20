<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import { sessionStore } from '$lib/store/session';
  import { userBetarenaSettings } from '$lib/store/user-settings';
  import { MONTH_NAMES_ABBRV, WEEK_DAYS_ABBRV_2, toISOMod } from '$lib/utils/dates';
  import { LV2_W_H_TAG, dlog, dlogv2 } from '$lib/utils/debug';

  import vec_arrow_left_dark from '../assets/calendar/arrow-left-dark.svg';
  import vec_arrow_left from '../assets/calendar/arrow-left.svg';
  import vec_arrow_right_dark from '../assets/calendar/arrow-right-dark.svg';
  import vec_arrow_right from '../assets/calendar/arrow-right.svg';

  import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  interface monthWeekObject
  {
    weekStart: number,
    weekEnd: number,
    weekDates: Date[]
  }

  let
    numberOfMonthWeeks: number,
    monthWeeksArray: monthWeekObject[] = [],
    tempDate: Date = $sessionStore?.userTxHistDateSelect,
    last7Days: string[] = [],
    B_SAP_D2: B_SAP_D2 = $page.data?.B_SAP_D2
  ;

  $: B_SAP_D2 = $page.data?.B_SAP_D2;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @description
   * calculates (this) month
   * dates, weeks and week-days, as well as
   * their start-end days, with overrun into
   * past-and-next month dates respectively;
   * FIXES: includes for when month has 1-1 start/end
   * for SUN days;
   * @param
   * { Date } tDate
   */
  function calcThisMonth
  (
    tDate: Date
  ): void
  {
    let month: number = tDate.getMonth();
    let year: number = tDate.getFullYear();

    const s_date = new Date(tDate);
    const e_date = new Date(tDate);

    numberOfMonthWeeks = Math.floor(daysInMonth(month+1, year) / 5) // NOTE: should be / 7

    let count: number = 0;

    // ### NOTE:
    // ### Start counting from 1st of (selected) month.
    s_date.setDate(1);
    e_date.setDate(1);

    monthWeeksArray = [];

    // [🐞]
    dlogv2
    (
			LV2_W_H_TAG[0],
			[
				`daysInMonth(): ${daysInMonth(month, year) }`,
				`numberOfMonthWeeks: ${numberOfMonthWeeks}`,
				`s_date: ${s_date.toISOString()}`,
				`s_date.getDate() : ${s_date.getDate()}`,
        `s_date.getDay() : ${s_date.getDay()}`
			],
			LV2_W_H_TAG[1],
			LV2_W_H_TAG[2]
		);

    while (true)
    {
      // ### Exit;
      if (count >= numberOfMonthWeeks) break;

      const startWeekCalc: number =
        s_date.getDay() == 0
        && e_date.getDay() == 0
          ? (s_date.getDate() - 6)
          : (s_date.getDate() - s_date.getDay() + 1)
      ;

      const endWeekCalc: number =
        s_date.getDay() == 0
        && e_date.getDay() == 0
          ? (s_date.getDate() - 0)
          : (s_date.getDate() - s_date.getDay() + 7)
      ;

      s_date.setDate(startWeekCalc);
      e_date.setDate(endWeekCalc);

      let times: number = 8;
      let weekDates: Date[] = [];

      for (let i = 1; i < times; i++)
      {
        let weekStart: Date = new Date(s_date);
        weekStart.setDate(s_date.getDate() - s_date.getDay() + i);
        weekDates.push(new Date(weekStart));
      }

      monthWeeksArray.push
      (
        {
          weekStart: s_date.getDate(),
          weekEnd: e_date.getDate(),
          weekDates
        }
      );

      s_date.setDate(s_date.getDate() + 7);
      e_date.setDate(e_date.getDate() + 7);
      count++;

      // [🐞]
      dlogv2
      (
        LV2_W_H_TAG[0],
        [
          `s_date: ${s_date.toISOString()}`,
          `s_date.getDate() : ${s_date.getDate()}`,
          `s_date.getDay() : ${s_date.getDay()}`,
          `count: ${count}`
        ],
        LV2_W_H_TAG[1],
        LV2_W_H_TAG[2]
      );
    }

    // [🐞]
    dlog
    (
      monthWeeksArray,
      true
    );

  }

  /**
   * @description
   * calculates number of days in a target
   * month, using the 0-11 month index & target year;
   * @param
   * { number } month
   * @param
   * { number } year
   */
  function daysInMonth
  (
    month: number,
    year: number
  ): number
  {
    return new Date(year, month, 0).getDate();
  }

  /**
   * @description
   * updates month of temp-calendar
   * date for browsing for the user;
   * Triggers new calendar calculation of dates;
   * Without persisting to session-store;
   * @param
   * { number } change
   * @returns
   * { void } void
   */
  function monthChange
  (
    change: number
  ): void
  {
    // [🐞]
    dlog
    (
      `${LV2_W_H_TAG[0]} (in) monthChange`
    );

    tempDate.setMonth(tempDate.getMonth() + change);
    tempDate = tempDate;

    calcThisMonth
    (
      tempDate
    );
  }

  /**
   * @description
   * Selected date function.
   * Triggers recalculation of month and updates
   * session-store to signal new selected date;
   * @param
   * { Date } newDate
   * @returns
   * { void } void
   */
  function dateChange
  (
    newDate: Date
  ): void
  {
    // [🐞]
    dlog
    (
      `${LV2_W_H_TAG[0]} (in) dateChange`
    );

    $sessionStore.userTxHistDateSelect = new Date(newDate);
    tempDate = $sessionStore.userTxHistDateSelect;
    identifyLastWeekDays();
    calcThisMonth
    (
      newDate
    );
  }

  /**
   * @description
   * TODO: DOC:
   */
  function identifyLastWeekDays
  (
  ): void
  {
    last7Days = [];

    for (let i = 0; i < 7; i++)
    {
      const _tempDate = new Date();
      _tempDate.setDate
      (
        $sessionStore.userTxHistDateSelect.getDate() - i
      );
      last7Days.push
      (
        toISOMod(_tempDate)
      );
    }

    // ### NOTE:
    // ### Sort in descending order.
    last7Days
    .sort
    (
      (
        a,
        b
      ) =>
        new Date(b).getTime()
        -	new Date(a).getTime()
    );

    $sessionStore.userTxHistFilterDateRange =
    {
      from: new Date(last7Days[last7Days?.length - 1]),
      to: new Date(last7Days[0])
    };

    // [🐞]
    // console.debug
    // (
    //   last7Days
    // );
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if (browser && $sessionStore.userTxHistDateSelect)
  {
    identifyLastWeekDays();
    calcThisMonth
    (
      $sessionStore.userTxHistDateSelect
    );
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="profile/widget/calendar-pop-up/backdrop"
  on:click={() => $sessionStore.userTxShowCalendar = false}
/>

<div
  id="profile/widget/calendar-pop-up/outer"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

  <!--
  CALENDAR - TOP ROW MONTH SELECT
  -->
  <div
    id="calendar-date-select"
    class=
    "
      row-space-out
    "
  >

    <img
      src={$userBetarenaSettings.theme == 'Dark' ? vec_arrow_left_dark : vec_arrow_left}
      alt="default alt text"
      on:click={() => monthChange(-1)}
      class="cursor-pointer"
    />

    <p
      class=
      "
        s-14
        w-500
        color-black-2
      "
    >
      {B_SAP_D2.months_abbreviation?.[MONTH_NAMES_ABBRV?.[tempDate?.getMonth()]]}
      {tempDate.getFullYear()}
    </p>

    <img
      src={$userBetarenaSettings.theme == 'Dark' ? vec_arrow_right_dark : vec_arrow_right}
      alt="default alt text"
      on:click={() => monthChange(1)}
      class="cursor-pointer"
    />

  </div>

  <!--
  CALENDAR - MAIN BODY MONTH DATE SELECT
  -->
  <div
    id="profile/widget/calendar-pop-up/inner"
  >
    <table>

      <!--
      WEEK DAYS ABBREV.
      -->
      <thead>
        <tr>
          {#each WEEK_DAYS_ABBRV_2 as day}
            <th>
              <p
                class=
                "
                s-14
                color-grey
                "
              >
                {day}
              </p>
            </th>
          {/each}
        </tr>
      </thead>

      <!--
      WEEK ROWS
      -->
      <tbody>
        {#if ![undefined, 0].includes(numberOfMonthWeeks) || monthWeeksArray.length != 0}
          {#each {length: numberOfMonthWeeks} as _,i}
            <tr>
              {#each monthWeeksArray[i].weekDates as item}
                <!-- [🐞] -->
                <!-- {console.log(item)} -->
                <td
                  class=
                  "
                  w-500
                  color-black-2
                  cursor-pointer
                  "
                  class:currentDate={toISOMod(item) == toISOMod($sessionStore.userDate)}
                  class:notViewMonth={item.getMonth() != tempDate.getMonth()}
                  class:startSnake={toISOMod(item) == toISOMod($sessionStore.userTxHistDateSelect)}
                  class:middleSnake={last7Days.includes(toISOMod(item))}
                  class:endSnake={last7Days?.[last7Days?.length - 1] == toISOMod(item)}
                  on:click={() => dateChange(item)}
                >
                  {item?.getDate()}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>

    </table>
  </div>

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#profile\/widget\/calendar-pop-up\/backdrop
  {
    /* 📌 position */
    position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 999998;
    /* 🛝 layout */
		height: 100%;
		width: 100%;
    /* 🎨 style */
		background: rgba(0, 0, 0, 0.5);
  }

  div#profile\/widget\/calendar-pop-up\/outer
  {
    /* 📌 position */
    position: fixed;
    z-index: 999999;
    bottom: 20px;
    right: 0;
    left: 0;
    /* 🛝 layout */
    width: 92.5%;
    /* 🎨 style */
    background: #FFFFFF;
    margin: auto;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
  }
  div#profile\/widget\/calendar-pop-up\/outer div#calendar-date-select
  {
    /* 🎨 style */
    padding: 16px;
    border-bottom: 1px solid var(--grey-color);
  }

  div#profile\/widget\/calendar-pop-up\/inner table
  {
    /* 🎨 style */
		border-collapse: collapse;
    margin: 16px;
    /* `padding` does not work with 'border-collapse:'*/
    /* padding: 16px 0; */
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr th,
  div#profile\/widget\/calendar-pop-up\/inner table tr td
  {
    /* 🛝 layout */
    max-width: 48px;
    height: 32px;
    /* 🎨 style */
    padding: 7px 11px;
    text-align: center;
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td:hover
  {
    /* 🎨 style */
    background-color: var(--whitev2);
    border-radius: 60px;
    color: var(--dark-theme);
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td.startSnake
  {
    /* 🎨 style */
    background-color: var(--primary);
    border-radius: 0 60px 60px 0;
    color: var(--white);
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td.middleSnake
  {
    /* 🎨 style */
    background-color: var(--primary);
    color: var(--white);
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td.endSnake
  {
    /* 🎨 style */
    background-color: var(--primary);
    color: var(--white);
    border-radius: 60px 0 0 60px;
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td.currentDate
  {
    color: var(--primary);
  }
  div#profile\/widget\/calendar-pop-up\/inner table tr td.notViewMonth
  {
    color: var(--grey-color) !important;
  }

  /*
  =============
  📱 RESPONSIVNESS
  =============
  */

  @media only screen
  and (min-width: 475px)
  {
    div#profile\/widget\/calendar-pop-up\/outer
    {
      position: absolute;
      top: 105%;
      right: 0;
      bottom: unset;
      left: unset;
      z-index: 2;
      /* 🛝 layout */
      width: fit-content;
    }
    div#profile\/widget\/calendar-pop-up\/backdrop
    {
      /* 📌 position */
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* 🛝 layout */
      height: 100%;
      width: 100%;
      z-index: 1;
      /* 🎨 style */
      background-color: transparent;
    }
    div#profile\/widget\/calendar-pop-up\/inner table
    {
      /* 🎨 style */
      padding: 16px;
    }
  }

  /*
  =============
  🌒 DARK-THEME
  =============
  */

  div#profile\/widget\/calendar-pop-up\/outer.dark-background-1
  {
    background-color: var(--dark-theme-1-shade) !important;
  }

  div#profile\/widget\/calendar-pop-up\/outer.dark-background-1 div#profile\/widget\/calendar-pop-up\/inner table tr td:hover
  {
    background-color: var(--dark-theme-1);
    border-radius: 60px;
    color: var(--white);
  }

  div#profile\/widget\/calendar-pop-up\/outer.dark-background-1 div#profile\/widget\/calendar-pop-up\/inner table tr td.notViewMonth
  {
    color: var(--dark-theme-1-2-shade) !important;
  }

  div#profile\/widget\/calendar-pop-up\/outer.dark-background-1 div#calendar-date-select
  {
    border-bottom: 1px solid var(--dark-theme);
  }

</style>