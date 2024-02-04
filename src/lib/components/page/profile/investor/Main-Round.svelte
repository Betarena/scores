<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - access custom Betarena Scores JS VScode Snippets by typing 'script...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
	import { toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';

	import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let
    /**
     * @augments IProfileData
     */
    WIDGET_DATA: IProfileData | null
  ;

  /**
   * @author
   *  @migbash
   * @summary
   *  🎪 TYPES | INTERFACE
   * @description
   *  📣 Type for `round data`.
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

  /**
   * @author
   *  @migbash
   * @summary
   *  🎪 TYPES | INTERFACE
   * @description
   *  📣 Type for possible `_this_` component states.
   */
  type IWidgetState = 'InviteOnly' | 'ToBeAnnounced' | 'CountdownWithDefinedDate' | 'CountdownToFinish' | 'Ended';

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    CNAME: string = 'profile⮕w⮕investround⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    ,VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    ,VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /** @description 📣 current widget state */
    widgetState: IWidgetState = 'ToBeAnnounced'
    /** @description 📣 investor number of days difference (from start) */
    , numDateDiffStart: number = 0
    /** @description 📣 investor number of days difference (from end) */
    , numDateDiffEnd: number = 0
    /** @description 📣 investor main information data */
    , roundData: IRoundData[] = []
    /** @description 📣 investor round date percentage progress */
    , datePercentageDiff: number = 0
    /**
     * @description
     *  📣 invest round date `start`
     * @CUSTOM_NOTE
     * `mapInvestorData?.get('round')?.values?.start_date` || 12/08/2023
     */
    , dateRoundStart: string | undefined = WIDGET_DATA?.presaleData.data?.start_date
    /**
     * @description
     *  📣 invest round date `start`
     * @CUSTOM_NOTE
     * `mapInvestorData?.get('round')?.values?.end_date` || 12/08/2023
     */
    , dateRoundEnd: string | undefined = WIDGET_DATA?.presaleData.data?.end_date
    /** @description 📣 interval variable for `countdown` logic */
    , interval1: NodeJS.Timer
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  $: countDownSecToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / 1000) % 60).toString());
	$: countDownMinToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / 1000 / 60) % 60).toString());
	$: countDownHourToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / (1000 * 60 * 60)) % 24).toString());
	$: countDownDayToStart = toZeroPrefixDateStr(Math.floor((numDateDiffStart / (1000 * 60 * 60 * 24))).toString());
	$: countDownTestHourToStart = Math.floor(numDateDiffStart / (1000 * 60 * 60));

  $: countDownSecToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / 1000) % 60).toString());
	$: countDownMinToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / 1000 / 60) % 60).toString());
	$: countDownHourToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / (1000 * 60 * 60)) % 24).toString());
	$: countDownDayToEnd = toZeroPrefixDateStr(Math.floor((numDateDiffEnd / (1000 * 60 * 60 * 24))).toString());
	$: countDownTestHourToEnd = Math.floor(numDateDiffEnd / (1000 * 60 * 60));

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Countdown initializer used within the component.
   * @return { void }
   */
  function initializeCountdown
  (
  ): void
  {
    // NOTE: accepts '12/9/2023' <=> MM/dd/YYYY
    numDateDiffStart = toCorrectDate(dateRoundStart as string | Date, false).getTime() - new Date().getTime();
    numDateDiffEnd = toCorrectDate(dateRoundEnd as string | Date, false).getTime() - new Date().getTime();

    const
      /**
       * @description
       *  📣 Number of `days` difference between `2 target dates` of presale.
      */
      // @ts-expect-error
      dateRoundDiff = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - toCorrectDate(dateRoundStart, false).getTime()))
      /**
       * @description
       *  📣 Number of `days` difference between `2 target dates` of **current date** and **presale end**, a.k.a time remaining.
      */
      // @ts-expect-error
      , dateDeltaDiffDays = Math.floor((toCorrectDate(dateRoundEnd, false).getTime() - new Date().getTime()))
    ;

    datePercentageDiff = 100 - (dateDeltaDiffDays / dateRoundDiff) * 100;
    if (datePercentageDiff > 100) datePercentageDiff = 100;
    if (isNaN(datePercentageDiff)) datePercentageDiff = 0;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

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
  $: if_R_0
    = numDateDiffStart == null
    || numDateDiffEnd == null
    || numDateDiffStart == 0
    || numDateDiffEnd == 0
  $: if_R_1
    = countDownTestHourToStart >= 0
    && numDateDiffStart >= 0
  ;
  $: if_R_2
    = countDownTestHourToEnd >= 0
    && numDateDiffEnd >= 0
  ;
  $: if_R_3
    =countDownTestHourToEnd < 23
    && numDateDiffEnd < 0
  ;
	$:
  if (if_R_0) widgetState = 'ToBeAnnounced'
  else if (if_R_1) widgetState = 'CountdownWithDefinedDate';
  else if (if_R_2) widgetState = 'CountdownToFinish';
  else if (if_R_3) widgetState = 'Ended';

  // ▓ [🐞]
  // $: console.log('countDownTestHourToStart', countDownTestHourToStart)
  // ▓ [🐞]
  // $: console.log('countDownTestHourToEnd', countDownTestHourToEnd)
  // ▓ [🐞]
  // $: console.log('numDateDiffStart', numDateDiffStart)
  // ▓ [🐞]
  // $: console.log('numDateDiffEnd', numDateDiffEnd)
  // ▓ [🐞]
  // $: console.log('widgetState', widgetState)

  $:
  if (browser || $sessionStore.serverLang)
  {
    roundData = [
      {
        title:
        (
          profileTrs.investor?.round.details.token_info_title
          ?? 'Token Information'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs.investor?.round.details.name_title
              ?? 'Name'
            )
            , value: WIDGET_DATA?.presaleData.data?.name ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.symbol_title
              ?? 'Symbol'
            )
            , value: WIDGET_DATA?.presaleData.data?.symbol ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.available_title
              ?? 'Available'
            )
            , value: WIDGET_DATA?.presaleData.data?.available ?? '-'
          }
        ]
      }
      , {
        title:
        (
          profileTrs.investor?.round.details.presale_title
          ?? 'Pre-sale'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs.investor?.round.details.start_date_title
              ?? 'Start Date'
            )
            , value: WIDGET_DATA?.presaleData.data?.start_date ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.end_date_title
              ?? 'End Date'
            )
            , value: WIDGET_DATA?.presaleData.data?.end_date ?? '-'
          }
        ]
      }
      , {
        title:
        (
          profileTrs.investor?.round.details.investment_title
          ?? 'Investment Details'
        )
        , data:
        [
          {
            row_title:
            (
              profileTrs.investor?.round.details.min_buy_title
              ?? 'Minimum Buy Amount'
            )
            , value: WIDGET_DATA?.presaleData.data?.min_buy ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.chain_title
              ?? 'Raising Platform'
            )
            , value: WIDGET_DATA?.presaleData.data?.chain ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.type_title
              ?? 'Type'
            )
            , value: WIDGET_DATA?.presaleData.data?.type ?? '-'
          }
          , {
            row_title:
            (
              profileTrs.investor?.round.details.currencies_title
              ?? 'Accepted Currencies'
            )
            , value: WIDGET_DATA?.presaleData.data?.currencies ?? '-'
          }
        ]
      }
    ]
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ): Promise < void > =>
    {
      initializeCountdown();

      interval1 = setInterval
      (
        () =>
        {
          initializeCountdown();
        },
        1000
      );

      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT[0],
        VIEWPORT_MOBILE_INIT[0]
      );

      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            VIEWPORT_TABLET_INIT[1],
            VIEWPORT_MOBILE_INIT[1]
          ]
          = viewport_change
            (
              VIEWPORT_TABLET_INIT[0],
              VIEWPORT_MOBILE_INIT[0]
            );
        }
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
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
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
        {VIEWPORT_MOBILE_INIT[1] ? 's-20' : 's-24'}
        color-black-2
        w-500
        "
      >
        {
         profileTrs.investor?.round.round_title
          ?? 'Round 1'
        }
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
          {#if ['ToBeAnnounced', 'CountdownWithDefinedDate'].includes(widgetState)}
            {
              profileTrs.investor?.round.round_description
              ?? 'Presale starts in'
            }
          {:else if widgetState == 'CountdownToFinish'}
            {
              profileTrs.investor?.round.progress_title
              ?? 'Presale ends in'
            }
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
        ▓ > countdown [d,h,m,s]
        -->
        {#each ['d', 'h', 'm', 's'] ?? [] as item}

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
              {#if item == 'd'}
                {widgetState == 'CountdownWithDefinedDate' ? countDownDayToStart : countDownDayToEnd}d
              {:else if  item == 'h'}
                {widgetState == 'CountdownWithDefinedDate' ? countDownHourToStart : countDownHourToEnd}h
              {:else if  item == 'm'}
                {widgetState == 'CountdownWithDefinedDate' ? countDownMinToStart : countDownMinToEnd}m
              {:else if  item == 's'}
                {widgetState == 'CountdownWithDefinedDate' ? countDownSecToStart : countDownSecToEnd}s
              {/if}
            </p>
          </div>

        {/each}

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
          w-400
          color-grey
            dark-v1
          "
        >
          {#if widgetState == 'ToBeAnnounced'}
            {
              profileTrs.investor?.round.round_description
              ?? 'Date To Be Announced'
            }
          {:else if widgetState == 'InviteOnly'}
            {
              profileTrs.investor?.round.date_message
              ?? 'Invite Only'
            }
          {:else if widgetState == 'Ended'}
            {
              profileTrs.investor?.round.current_value_title
              ?? 'Raised'
            }
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
          {
           profileTrs.investor?.round.progress_title
            ?? 'Progress'
          }
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
          color-green-1
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
          color-grey
            grey-v1
          "
        >
          {
           profileTrs.investor?.round.current_value_title
            ?? 'Raised'
          }
          <span
            class=
            "
            color-black-2
            w-600
            "
          >
            <!-- ${WIDGET_DATA?.txProgressRaised} -->
            ${WIDGET_DATA?.presaleData.data?.current_value ?? '-'}
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
            grey-v1
          "
        >
          {
           profileTrs.investor?.round.max_title
            ?? 'Unlimited'
          }
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
          {item.title}
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

          {#each item.data ?? [] as subItem}

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
                {VIEWPORT_MOBILE_INIT[1] ? 's-12' : 's-14'}
                color-grey
                  grey-v1
                "
              >
                {subItem.row_title ?? ''}
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
                w-400
                "
              >
                {subItem.value ?? ''}
              </p>

            </div>

          {/each}

        </div>

      {/each}

    </div>

  </div>

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  div#profile⮕w⮕investround⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    border-radius: 12px;
    overflow: hidden;
    height: fit-content;

    &⮕top-row
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      padding: 15px 20px;
      height: 92px;
      max-height: 92px;
      min-height: 92px;
      background: var(--white);
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      /* z-index: 10; */

      div#countdown-box-parent
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

      div.countdown-box-child
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

      div#round-info-box-parent
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
    }

    &⮕middle-box
    {
      /* 🎨 style */
      padding: 20px;
      background: var(--white);
      display: grid;
      gap: 12px;

      div#progress-bar
      {
        /* 🎨 style */
        height: 6px;
        border-radius: 12px;
        width: 100%;
        background-color: var(--grey-color);

        > div
        {
          /* 🎨 style */
          background: var(--green-1);
          box-shadow: 0px 0px 12px 0px rgba(77, 160, 37, 0.32);
          /* width: 40%; */ /* Adjusted with JavaScript */
          height: 6px;
          border-radius: 12px;
        }
      }

      div.token-info-box div.token-info-row
      {
        /* 🎨 style */
        border-radius: 4px;
        padding: 10px 20px;
        height: 40px;

        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--whitev2);
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investround⮕main
  {

    &.dark-background-1 &⮕top-row
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);

      div.countdown-box-child
      {
        /* 🎨 style */
        background: var(--dark-theme-1-4-shade);
      }

      div#round-info-box-parent
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1-4-shade);
      }
    }

    &.dark-background-1 &⮕middle-box
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade);

      div#progress-bar
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1);
      }

      div.token-info-box div.token-info-row:nth-child(odd)
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1);
      }
    }

  }

</style>
