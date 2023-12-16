<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  import { onDestroy, onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { toDecimalFix } from '$lib/utils/platform-functions.js';

	import type { B_H_INVEST_WIDGET_Data } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { B_PROF_D } from '@betarena/scores-lib/types/profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    /** @inheritdoc */
    WIDGET_DATA: B_PROF_D
  ;

  /**
   * @description
  */
  interface IRoundData
  {
    title: string;
    data:
    {
      row_title: string;
      value: string;
    }[]
  }

  type WidgetState = 'InviteOnly' | 'ToBeAnnounced' | 'Ready State' | 'CountdownWithDefinedDate' | 'In Progress' | 'CountdownToFinish' | 'Ended';

  const
    /** @description 📌 `this` component **main** `id` and `data-testid` prefix. */
    CNAME = 'profile⮕w⮕investround⮕main'
  ;

  let
    /** @description 📣 investor number difference */
    widgetState: WidgetState = 'ToBeAnnounced'
    /** @description 📣 investor number difference */
    , numDateDiffStart: number = 0
    /** @description 📣 investor number difference */
    , numDateDiffEnd: number = 0
    /** @description 📣 investor data (map) */
    , mapInvestorData: Map < string, B_H_INVEST_WIDGET_Data > = new Map
    (
      WIDGET_DATA?.investor
    ) as Map < string, B_H_INVEST_WIDGET_Data >
    /** @description TODO: */
    , roundData: IRoundData[] =
    [
      {
        title: 'Token Information'
        , data:
        [
          {
            row_title: 'Name'
            , value: mapInvestorData?.get('round')?.values?.name ?? '-'
          }
          , {
            row_title: 'Symbol'
            , value: mapInvestorData?.get('round')?.values?.symbol ?? '-'
          }
          , {
            row_title: 'Available'
            , value: mapInvestorData?.get('round')?.values?.available ?? '-'
          }
        ]
      }
      , {
        title: 'Pre-sale'
        , data:
        [
          {
            row_title: 'Start Date'
            , value: mapInvestorData?.get('round')?.values?.start_date ?? '-'
          }
          , {
            row_title: 'End Date'
            , value: mapInvestorData?.get('round')?.values?.end_date ?? '-'
          }
        ]
      }
      , {
        title: 'Investment Details'
        , data:
        [
          {
            row_title: 'Minimum Buy Amount'
            , value: mapInvestorData?.get('round')?.values?.min_buy ?? '-'
          }
          , {
            row_title: 'Raising Platform'
            , value: mapInvestorData?.get('round')?.values?.chain ?? '-'
          }
          , {
            row_title: 'Type'
            , value: mapInvestorData?.get('round')?.values?.type ?? '-'
          }
          , {
            row_title: 'Accepted Currencies'
            , value: mapInvestorData?.get('round')?.values?.currencies ?? '-'
          }
        ]
      }
    ]
    /** @description TODO: */
	  , datePercentageDiff: number = 0
    /** @description TODO: `mapInvestorData?.get('round')?.values?.start_date` || 12/08/2023 */
    , dateRoundStart = mapInvestorData?.get('round')?.values?.start_date
    /** @description TODO: `mapInvestorData?.get('round')?.values?.end_date` || 12/08/2023  */
    , dateRoundEnd = mapInvestorData?.get('round')?.values?.end_date
    /** @description interval for `countdown` */
    , interval1: NodeJS.Timer
  ;

  $: countDownSecToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / 1000) % 60).toString());
	$: countDownMinToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / 1000 / 60) % 60).toString());
	$: countDownHourToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / (1000 * 60 * 60)) % 24).toString());
	$: countDownTestHourToStart = Math.floor(numDateDiffStart / (1000 * 60 * 60));

  $: countDownSecToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / 1000) % 60).toString());
	$: countDownMinToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / 1000 / 60) % 60).toString());
	$: countDownHourToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / (1000 * 60 * 60)) % 24).toString());
	$: countDownTestHourToEnd = Math.floor(numDateDiffEnd / (1000 * 60 * 60));

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * @description
   *  📣 looming `start-date` check
   *
   * WARNING:
   * triggered by changes in:
   * - `numDateDiffStart`
   * - `countDownTestHourToStart`
   */
  $: if_R_000 =
    numDateDiffStart == null
    || numDateDiffEnd == null
  $: if_R_0 =
    countDownTestHourToStart <= 23
    && countDownTestHourToStart >= 0
    && numDateDiffStart > 0
  ;
  $: if_R_1 =
    countDownTestHourToEnd <= 23
    && countDownTestHourToEnd >= 0
    && numDateDiffEnd > 0
  ;
  $: if_R_3=
    countDownTestHourToEnd < 23
    && numDateDiffEnd < 0
  ;
	$:
  if (if_R_000) widgetState = 'ToBeAnnounced'
	else if (if_R_0) widgetState = 'CountdownWithDefinedDate';
	else if (if_R_1) widgetState = 'CountdownToFinish';
  else if (if_R_3) widgetState = 'Ended';

  // $: console.log('countDownTestHourToStart', countDownTestHourToStart)
  // $: console.log('countDownTestHourToEnd', countDownTestHourToEnd)
  // $: console.log('widgetState', widgetState)

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and as part of the 'lifecycle' of svelteJs,          ◼️
  // ### as soon as 'this' .svelte file is ran.                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  onMount
  (
    async (
    ): Promise < void > =>
    {
      // NOTE: accepts '12/9/2023' <=> MM/dd/YYYY
      numDateDiffStart = toCorrectDate(dateRoundStart, false).getTime() - new Date().getTime();
      numDateDiffEnd = toCorrectDate(dateRoundEnd, false).getTime() - new Date().getTime();

      const
        // @ts-ignore
        dateRoundDiff = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - toCorrectDate(dateRoundStart, false).getTime()) / 86400000)
        // @ts-ignore
        , dateDeltaDiffDays = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - new Date().getTime()) / 86400000)
      ;

      datePercentageDiff = 100 - (dateDeltaDiffDays / dateRoundDiff) * 100;
      if (datePercentageDiff > 100) datePercentageDiff = 100;
      if (isNaN(datePercentageDiff)) datePercentageDiff = 0;

      interval1 = setInterval
      (
        () =>
        {
          numDateDiffStart = toCorrectDate(dateRoundStart, false).getTime() - new Date().getTime();
          numDateDiffEnd = toCorrectDate(dateRoundEnd, false).getTime() - new Date().getTime();

          const
            // @ts-ignore
            dateRoundDiff = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - toCorrectDate(dateRoundStart, false).getTime()) / 86400000)
            // @ts-ignore
            , dateDeltaDiffDays = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - new Date().getTime()) / 86400000)
          ;

          datePercentageDiff = 100 - (dateDeltaDiffDays / dateRoundDiff) * 100;
          if (datePercentageDiff > 100) datePercentageDiff = 100
          if (isNaN(datePercentageDiff)) datePercentageDiff = 0;
        },
        1000
      );

      return;
    }
  );

  onDestroy
  (
    () =>
    {
      // @ts-expect-error
      clearInterval(interval1);
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<div
  id="{CNAME}"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓ NOTE:
  ▓ > top box (parent)
  -->
  <div
    id="{CNAME}⮕top-row"
    class=
    "
    row-space-out
    "
  >

    <!--
    ▓ NOTE:
    ▓ > round data
    -->
    <div>

      <!--
      ▓ NOTE:
      ▓ > round number
      -->
      <p
        class=
        "
        s-24
        color-black-2
        w-500
        "
      >
        {'Round 1'}
      </p>

      <!--
      ▓ NOTE:
      ▓ > presale text
      -->
      {#if ['ToBeAnnounced', 'CountdownWithDefinedDate', 'CountdownToFinish'].includes(widgetState)}
        <span
          class=
          "
          s-14
          color-grey
          w-400
          m-t-5
          "
        >
          {#if widgetState == 'CountdownWithDefinedDate'}
            Presale starts in
          {:else}
            Presale ends in
          {/if}
        </span>
      {/if}

    </div>

    <!--
    ▓ NOTE:
    ▓ > countdown (parent)
    -->
    {#if ['CountdownWithDefinedDate', 'CountdownToFinish'].includes(widgetState)}

      <!--
      ▓ NOTE:
      ▓ > countdown (parent)
      -->
      <div
        id="countdown-box-parent"
      >

        <!--
        ▓ NOTE:
        ▓ > countdown (hours)
        -->
        <div
          class=
          "
          countdown-box-child
          "
        >
          <p
            class=
            "
            s-16
            w-500
            color-black-2
            "
          >
            {widgetState == 'CountdownWithDefinedDate' ? countDownHourToStart : countDownHourToEnd}h
          </p>
        </div>

        <!--
        ▓ NOTE:
        ▓ > countdown (minutes)
        -->
        <div
          class=
          "
          countdown-box-child
          "
        >
          <p
            class=
            "
            s-16
            w-500
            color-black-2
            "
          >
            {widgetState == 'CountdownWithDefinedDate' ? countDownMinToStart : countDownMinToEnd}m
          </p>
        </div>

        <!--
        ▓ NOTE:
        ▓ > countdown (seconds)
        -->
        <div
          class=
          "
          countdown-box-child
          "
        >
          <p
            class=
            "
            s-16
            w-500
            color-black-2
            "
          >
            {widgetState == 'CountdownWithDefinedDate' ? countDownSecToStart : countDownSecToEnd}s
          </p>
        </div>

      </div>

    {:else}

      <!--
      ▓ NOTE:
      ▓ > round state (parent)
      -->
      <div
        id="round-info-box-parent"
      >
        <p
          class=
          "
          s-16
          w-500
          color-grey
            dark-v1
          "
        >
          {#if widgetState == 'ToBeAnnounced'}
            Date To Be Announced
          {:else if widgetState == 'InviteOnly'}
            Invite Only
          {:else if widgetState == 'Ended'}
            Ended
          {/if}
        </p>
      </div>

    {/if}

  </div>

  <!--
  ▓ NOTE:
  ▓ > middle box (parent)
  -->
  <div
    id="{CNAME}⮕middle-box"
  >

    <!--
    ▓ NOTE:
    ▓ > progress box (parent)
    -->
    <div>

      <!--
      ▓ NOTE:
      ▓ > progress title + progress percentage
      -->
      <div
        class=
        "
        row-space-out
        "
      >
        <!--
        ▓ NOTE:
        ▓ > progress title
        -->
        <p
          class=
          "
          s-20
          w-500
          color-black-2
          m-b-16
          "
        >
          Progress
        </p>

        <!--
        ▓ NOTE:
        ▓ > progress percetage
        -->
        <p
          class=
          "
          s-20
          w-500
          color-green
          "
        >
          {toDecimalFix(datePercentageDiff) ?? 0}%
        </p>
      </div>

      <!--
      ▓ NOTE:
      ▓ > progress bar
      -->
      <div
        id="progress-bar"
        class=
        "
        m-b-16
        "
      >
        <div
          style="width: {datePercentageDiff ?? 0}%;"
        />
      </div>

      <!--
      ▓ NOTE:
      ▓ > progress funds + progress limit
      -->
      <div
        class=
        "
        row-space-out
        "
      >
        <!--
        ▓ NOTE:
        ▓ > progress funds
        -->
        <p
          class=
          "
          s-16
          color-black-2
          "
        >
          {mapInvestorData?.get('round')?.data?.find(x => x?.lang == 'en')?.current_value_title}
          <span
            class=
            "
            w-600
            "
          >
            <!-- ${WIDGET_DATA?.txProgressRaised} -->
            ${mapInvestorData?.get('round')?.values?.current_value ?? '-'}
          </span>
        </p>

        <!--
        ▓ NOTE:
        ▓ > progress limit
        -->
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          {mapInvestorData?.get('round')?.data?.find(x => x?.lang == 'en')?.max_title ?? 'Unlimited'}
        </p>
      </div>

    </div>

    <!--
    ▓ NOTE:
    ▓ > token information section (parent)
    -->
    <div>

      {#each roundData ?? [] as item}

        <!--
        ▓ NOTE:
        ▓ > token information segment title
        -->
        <p
          class=
          "
          s-16
          color-black-2
          w-500
          m-t-25
          m-b-8
          "
        >
          {item?.title}
        </p>

        <!--
        ▓ NOTE:
        ▓ > token information row(s)
        -->
        <div
          class=
          "
          token-info-box
          "
        >

          {#each item?.data ?? [] as subItem}

            <div
              class=
              "
              row-space-out
              <!---->
              token-info-row
              "
            >
              <!--
              ▓ NOTE:
              ▓ > token row title
              -->
              <p
                class=
                "
                s-14
                
                color-grey
                  grey-v1
                "
              >
                {subItem?.row_title ?? ''}
              </p>

              <!--
              ▓ NOTE:
              ▓ > token row title
              -->
              <p
                class=
                "
                s-16
                color-black-2
                w-500
                "
              >
                {subItem?.value ?? ''}
              </p>

            </div>

          {/each}

        </div>

      {/each}

    </div>

  </div>

</div>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<style>

  div#profile⮕w⮕investround⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
    height: fit-content;
  }

  div#profile⮕w⮕investround⮕main⮕top-row
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    padding: 20px;
    padding-top: 24px;
    background: var(--white);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    /* z-index: 10; */
  }

  div#profile⮕w⮕investround⮕main⮕top-row div#countdown-box-parent
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    border-radius: 4px;
    overflow: hidden;
    /* 🛝 layout */
    display: grid;
    gap: 2px;
    grid-auto-flow: column;
  }
  div#profile⮕w⮕investround⮕main⮕top-row div.countdown-box-child
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    padding: 17px 0;
    background: var(--whitev2);
    width: 60px;
    height: 60px;
    text-align: center;
  }

  div#profile⮕w⮕investround⮕main⮕top-row div#round-info-box-parent
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    padding: 20px;
    border-radius: 4px;
    background: var(--whitev2);
    width: fit-content;
    height: 60px;
  }

  div#profile⮕w⮕investround⮕main⮕middle-box
  {
    /* 🎨 style */
    padding: 20px;
    background: var(--white);
    display: grid;
    gap: 12px;
  }

  div#profile⮕w⮕investround⮕main⮕middle-box div#progress-bar
  {
    /* 🎨 style */
    height: 6px;
    border-radius: 12px;
    width: 100%;
    background-color: var(--grey-color);
  }
  div#profile⮕w⮕investround⮕main⮕middle-box div#progress-bar > div
  {
    /* 🎨 style */
		background-color: var(--green-success);
		/* width: 40%; */ /* Adjusted with JavaScript */
    height: 6px;
    border-radius: 12px;
	}

  div#profile⮕w⮕investround⮕main⮕middle-box div.token-info-box div.token-info-row
  {
    /* 🎨 style */
    border-radius: 4px;
    padding: 10px 20px;
    height: 40px;
  }
  div#profile⮕w⮕investround⮕main⮕middle-box div.token-info-box div.token-info-row:nth-child(odd)
  {
    /* 🎨 style */
    background-color: var(--whitev2);
  }

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕top-row
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕middle-box
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade);
  }

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕top-row div.countdown-box-child
  {
    /* 🎨 style */
    background: var(--dark-theme-1-4-shade);
  }

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕middle-box div#progress-bar
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕middle-box div.token-info-box div.token-info-row:nth-child(odd)
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1);
  }

  div#profile⮕w⮕investround⮕main.dark-background-1 div#profile⮕w⮕investround⮕main⮕top-row div#round-info-box-parent
  {
    /* 🎨 style */
    background-color: var(--dark-theme-1-4-shade);
  }

</style>
