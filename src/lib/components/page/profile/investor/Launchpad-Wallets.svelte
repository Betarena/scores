<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ High Order Component Overview                                                    │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Version Svelte Format :|: V.8.0 [locked]                                       │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { dlog } from '$lib/utils/debug.js';
  import { toDecimalFix } from '$lib/utils/string.js';
  import { tryCatchAsync } from '@betarena/scores-lib/dist/util/common.js';
  import type { Chart as ChartJS, ChartItem } from 'chart.js';

  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import { MONTH_NAMES_ABBRV } from '$lib/utils/dates.js';
  import { passByValue } from '@betarena/scores-lib/dist/util/common.js';
  import type { PublicInvestorMain, PublicTransactionHistoryMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
  import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';
  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  type ChartModule = typeof import('chart.js');

  let chartModule: ChartModule | null = null;
  let chartModulePromise: Promise<ChartModule> | null = null;

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
    profileData: IProfileData | null
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕launchpad-wallets⮕main'
  ;

  let
    /**
     * @description
     *  📣
     */
    today: Date = new Date()
    /**
     * @description
     *  📣
     */
    , targetMonths
      = () =>
      {
        const dateList: Date[] = [];

        today.setFullYear(today.getFullYear() - 2);

        for (let index = 0; index < 25; index++)
        {
          dateList.push(new Date(today));
          today.setMonth(today.getMonth() + 1);
        }

        return dateList;
      }
    /**
     * @description
     *  📣 Invesmtnet `map` showing investment change per calendar month.
     */
    , mapInvestAmountDeltaPerMonth
      = generateInvestmentMonthlyMap
      (
        targetMonths()
        , profileData?.tx_hist ?? []
        , profileData?.investorData
      )
    /**
     * @description
     *  📣 stores target `state` used within widget.
     */
    , stateObject:
      {
        /**
         * @description
         *  📣 stores target `chart` instance (1).
        */
        chartInstance: ChartJS | null;
        /**
         * @description
         *  📣 stores target `chart` instance (2).
        */
      chartInstance2: ChartJS | null;
        /**
         * @description
         *  📣 stores target `chart` scroll action (lock).
        */
        chartIsBeingScrolled: boolean;
      } = {
        chartInstance: null
        , chartInstance2: null
        , chartIsBeingScrolled: false
      }
    /**
     * @description
     *  📣 Target `start` scroll value.
     */
    , startScroll: [number, number, number] = [0, 0, 0]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: monthsTrs = $page.data.B_SAP_D2 as B_SAP_D2 | null | undefined;
  $: ({ theme, lang } = $userBetarenaSettings);
  $: ({ grand_total } = $userBetarenaSettings.user.scores_user_data?.investor_balance ?? { grand_total: 0 });

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
   *  📣 Instantiate `eventListeners` needed for _this_ widget.
   * @return { void }
   */
  function addEventListeners
  (
  ): void
  {
    const
      /**
       * @description
       *  📣 target container to `listen` changes to.
       */
      container = document.getElementById('chartParent')
    ;

    if (!container) return

    // ▓ NOTE:
    // ▓ > 📱 MOBILE.
    container.addEventListener('touchstart', mouseDownEvent, true);
    window.addEventListener('touchend', mouseUpEvent, true);
    window.addEventListener('touchmove', mouseMoveEvent, true);

    // ▓ NOTE:
    // ▓ > 💻 TABLET + 🖥️ LAPTOP.
    container.addEventListener('mousedown', mouseDownEvent, true);
    window.addEventListener('mouseup', mouseUpEvent, true);
    window.addEventListener('mousemove', mouseMoveEvent, true);

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Trigger event on `mouseDown` (or similar) action.
   * @param { any } event
   *  💠 Target `event` passed to `function`.
   * @return { void }
   */
  function mouseDownEvent
  (
    event: MouseEvent
  ): void
  {
    if (stateObject.chartIsBeingScrolled) return;

    let
      container = document.getElementById('chartParent')!
      , scrollBox = document.getElementById('scrollBox')!
    ;
    event.preventDefault();

    const
      // @ts-expect-error
      leftVal = container.offsetLeft - (event.clientX || event.touches[0].clientX)
      , currentRight = parseInt(scrollBox.style.right.replace('px', ''))
      , currentLeft = scrollBox.offsetLeft
    ;

    startScroll[0] = leftVal;
    startScroll[1] = isNaN(currentRight) ? 0 : currentRight;
    startScroll[2] = currentLeft;

    stateObject.chartIsBeingScrolled = true;

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Trigger event on `mouseMove` (or similar) action.
   * @param { any } event
   *  💠 Target `event` passed to `function`.
   * @return { void }
   */
  function mouseMoveEvent
  (
    event: MouseEvent
  ): void
  {
    if (!stateObject.chartIsBeingScrolled) return;

    let
      container = document.getElementById('chartParent')!
      , scrollBox = document.getElementById('scrollBox')!
    ;
    event.preventDefault();

    const
      // @ts-expect-error
      leftVal = container.offsetLeft - (event.clientX || event.touches[0].clientX)
    ;

    if ((startScroll[1] + (leftVal - startScroll[0])) > 0) return;
    if (startScroll[2] - (leftVal - startScroll[0]) > 0) return;

    scrollBox.style.right = `${startScroll[1] + (leftVal - startScroll[0])}px`;

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Trigger event on `mouseUp` (or similar) action.
   * @param { any } event
   *  💠 Target `event` passed to `function`.
   * @return { void }
   */
  function mouseUpEvent
  (
  ): void
  {
    stateObject.chartIsBeingScrolled = false;

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 removes `eventListeners` no longer needed for _this_ widget.
   * @return { void }
   */
  function removeEventListeners
  (
  ): void
  {
    const
      /**
       * @description
       *  📣 target container to `listen` changes to.
       */
      container = document.getElementById('chartParent')
    ;

    if (container)
    {
      container.removeEventListener('touchstart', mouseDownEvent, true);
      container.removeEventListener('mousedown', mouseDownEvent, true);
    }

    window.removeEventListener('touchend', mouseUpEvent, true);
    window.removeEventListener('touchmove', mouseMoveEvent, true);
    window.removeEventListener('mouseup', mouseUpEvent, true);
    window.removeEventListener('mousemove', mouseMoveEvent, true);

    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Generates target `user` investment monthly graph data.
   * @param { Date[] } dateList
   *  💠 Target dates list.
   * @param { PublicTransactionHistoryMain[] } dateList
   *  💠 Target investor transaction list.
   * @return { Map < string, number > }
   *  📤 A `Map` of change (delta) in investor wallet amount, where:
   *  - key=`month_year`
   *  - value=`change of investor wallet amount for that month`
   */
  function generateInvestmentMonthlyMap
  (
    dateList: Date[]
    , investorTxList: PublicTransactionHistoryMain[]
    , investorData: PublicInvestorMain | undefined
  ): Map < string, number >
  {
    const
      /**
       * @description
       *  📣 Temporary `map` for `transaction-history` data sum grouped by `month_year` data.
       */
      mapTemp = new Map < string, number >()
      /**
       * @description
       *  📣 Temporary `map` for `referral-history` data sum grouped by `month_year` data.
       */
      , mapTemp2 = new Map < string, number >()
      /**
       * @description
       *  📣 Main `map` holding past year (12-months) data, merged with `mapTemp` data.
       */
      , mapMain = new Map < string, number >()
    ;

    // ╭────────────────────────────────────────────────────────────────────────╮
    // │ NOTE:                                                                  │
    // │ loop over each transaction and group them by monthly+year.             │
    // ╰────────────────────────────────────────────────────────────────────────╯

    for (const iterator of investorTxList)
    {
      const
        txMonthYear = `${new Date(iterator.date ?? '').getMonth()}/${new Date(iterator.date ?? '').getFullYear()}`
      ;

      if (
        !['completed', 'pending'].includes(iterator.status!)
        || !['investment', 'vesting', 'tge'].includes(iterator.type!)
      )
        continue;
      // ────────────────────────────────────────────────────────────────────────

      let deltaAmount: number = 0;

      if (iterator.type == 'investment')
        deltaAmount = iterator.amount ?? 0;
      else if (iterator.type == 'vesting' || iterator.type == 'tge')
        deltaAmount = -(iterator.amount ?? 0);
      // ────────────────────────────────────────────────────────────────────────

      if (mapTemp.has(txMonthYear))
      {
        let existingAmount = mapTemp.get(txMonthYear) ?? 0;
        existingAmount += deltaAmount;
        mapTemp.set(txMonthYear, existingAmount);
        continue;
      }

      mapTemp.set(txMonthYear, deltaAmount);
    }

    // ▓ [🐞]
    console.log('mapTemp', mapTemp);

    // ╭────────────────────────────────────────────────────────────────────────╮
    // │ NOTE:                                                                  │
    // │ loop over each referral and group them by monthly+year;                │
    // ╰────────────────────────────────────────────────────────────────────────╯

    for (const iterator of investorData?.data?.referral_history ?? [])
    {
      const
        txMonthYear = `${new Date(iterator.date).getMonth()}/${new Date(iterator.date).getFullYear()}`
      ;

      if (mapTemp2.has(txMonthYear))
      {
        let existingAmount = mapTemp2.get(txMonthYear) ?? 0;
        existingAmount += iterator.bonus_bta;
        mapTemp2.set(txMonthYear, existingAmount);
        continue;
      }

      mapTemp2.set(txMonthYear, iterator.bonus_bta);
    }

    // ▓ [🐞]
    console.log('mapTemp2', mapTemp2);

    // ╭────────────────────────────────────────────────────────────────────────╮
    // │ NOTE:                                                                  │
    // │ loop over each group monthly+year, and combine transaction + referrals │
    // ╰────────────────────────────────────────────────────────────────────────╯

    let
      /**
       * @description
       *  📣 **cumulative sum** for month-on-month amount.
       */
      cummulativeSum: number = 0
      /**
       * @description
       *  📣 Tracking of last `month-year`.
       */
      , lastMonthYear: string = ''
    ;

    for (const date of dateList)
    {
      const
        txMonthYear = `${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
      ;

      if (mapTemp.has(txMonthYear))
      {
        let existingAmount = mapTemp.get(txMonthYear)!;
        cummulativeSum += existingAmount;
        mapTemp.delete(txMonthYear);
      }
      if (mapTemp2.has(txMonthYear))
      {
        let existingAmount = mapTemp2.get(txMonthYear)!;
        cummulativeSum += existingAmount;
        mapTemp2.delete(txMonthYear);
      }

      if (mapMain.has(txMonthYear))
      {
        continue;
      }
      else if (mapMain.size == 0 && cummulativeSum == 0)
      {
        lastMonthYear = passByValue(txMonthYear);
        continue;
      }
      else if (mapMain.size == 0 && cummulativeSum > 0)
      {
        mapMain.set(lastMonthYear, 0);
      }

      mapMain.set(txMonthYear, cummulativeSum);
    }

    // ▓ [🐞]
    console.log('mapMain', mapMain);

    if (mapTemp.size > 0 || mapTemp2.size > 0)
    {
      const
        /**
         * @description
         *  📣 Past sum of all > 2 years sum history.
        */
        pastHistSum = [...mapTemp.values()]
          .reduce((a, b) => { return a + b }, 0)
        /**
         * @description
         *  📣 Past sum of all > 2 years sum history.
        */
        , pastHistSum2 = [...mapTemp2.values()]
          .reduce((a, b) => { return a + b }, 0)
        /**
         * @description
         *  📣 First recorded MonthYear, to be mutated.
         */
        , firstMonthYear = mapMain.keys().next().value
      ;

      fillPastDataLoop: for (const date of dateList)
      {
        const
          txMonthYear = `${new Date(date).getMonth()}/${new Date(date).getFullYear()}`
        ;

        mapMain.set(txMonthYear, (pastHistSum + pastHistSum2));

        if (txMonthYear == firstMonthYear) break fillPastDataLoop;
      }
    }

    const
      finalMap = new Map([...mapMain.entries()]
        .sort
        (
          (
            a,
            b
          ) =>
          {
            let
              dateASplit = `${a[0]}`.split('/')
              , dateBSplit = `${b[0]}`.split('/')
              , dateA = new Date(`${parseInt(dateASplit[0]) + 1}/01/${dateASplit[1]}`).getTime()
              , dateB = new Date(`${parseInt(dateBSplit[0]) + 1}/01/${dateBSplit[1]}`).getTime()
            ;

            return dateA - dateB;
          }
        )
      )
    ;

    // ▓ [🐞]
    console.log('finalMap', finalMap);

    return finalMap;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Generates target `user` investment monthly cahrt GUI.
   */
  async function loadChartModule
  (): Promise<ChartModule | null>
  {
    if (!browser)
      return null;

    if (chartModule)
      return chartModule;

    if (!chartModulePromise)
    {
      chartModulePromise = import('chart.js')
        .then
        (
          (module): ChartModule =>
          {
            module.Chart.register(...module.registerables);
            chartModule = module;
            return module;
          }
        );
    }

    return chartModulePromise;
  }

  async function generateTargetChart
  (
  ): Promise<void>
  {
    return tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        const module = await loadChartModule();

        if (!module)
          return;

        const { Chart } = module;

        const
          canvas = document.getElementById('valueChart') as HTMLCanvasElement
          , canvasHover = document.getElementById('constChart') as HTMLCanvasElement
          , ctx = canvas.getContext('2d')!
        ;
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(245, 98, 15, 0.24)');
        gradient.addColorStop(0.75, 'rgba(0,0,0,0)');

        // ▓ read-more :|: https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas
        if (stateObject.chartInstance)
          stateObject.chartInstance.destroy();
        //
        if (stateObject.chartInstance2)
          stateObject.chartInstance2.destroy();
        //

        // ▓ [🐞]
        // console.log('mapInvestAmountDeltaPerMonth', mapInvestAmountDeltaPerMonth)

        Chart.defaults.font.size = 14;
        Chart.defaults.color = '#8C8C8C';

        const gridLineColor: string
          = theme == 'Dark'
            ? '#4B4B4B'
            : '#E6E6E6'
        ;

        stateObject.chartInstance = new Chart
        (
          canvas as ChartItem,
          {
            type: 'line'
            , data:
            {
              labels: [...mapInvestAmountDeltaPerMonth.keys()]
                .map
                (
                  x =>
                  {
                    return monthsTrs?.months_abbreviation?.[MONTH_NAMES_ABBRV[x.split('/')[0]]]
                  }
                )
              , datasets:
              [
                {
                  data: [...mapInvestAmountDeltaPerMonth.values()]
                  , borderWidth: 3
                  , borderColor: '#F5620F'
                  // , backgroundColor: 'rgba(245, 98, 15, 0.24)'
                  , fill: true
                  , backgroundColor: gradient // Put the gradient here as a fill color
                }
              ]
            }
            , options:
            {
              maintainAspectRatio: false
              , layout:
              {
                padding:
                {
                  top: 12
                }
              }
              , plugins:
              {
                legend:
                {
                  display: false
                }
              }
              , elements:
              {
                point:
                {
                  pointStyle: false
                }
              }
              , scales:
              {
                y:
                {
                  beginAtZero: true
                  // , suggestedMin: 100
                  , min: 100
                  , grid:
                  {
                    color: gridLineColor
                    , lineWidth: 2
                    , drawTicks: false
                  }
                  , border:
                  {
                    dash: [5,5]
                  }
                  , ticks:
                  {
                    display: false
                  }
                }
                , x:
                {
                  grid:
                  {
                    color: gridLineColor
                    , lineWidth: 2
                  }
                  , border:
                  {
                    dash: [5,5]
                  }
                }
              }
            }
          }
        );

        stateObject.chartInstance2 = new Chart
        (
          canvasHover as ChartItem,
          {
            type: 'line'
            , data:
            {
              labels: [...mapInvestAmountDeltaPerMonth.keys()]
                .map
                (
                  x =>
                  {
                    return monthsTrs?.months_abbreviation?.[MONTH_NAMES_ABBRV[x.split('/')[0]]]
                  }
                )
              , datasets:
              [
                {
                  data: [...mapInvestAmountDeltaPerMonth.values()]
                  , borderColor: gridLineColor
                }
              ]
            }
            , options:
            {
              maintainAspectRatio: false
              , layout:
              {
                padding:
                {
                  bottom: 5
                  , left: 0
                }
              }
              , plugins:
              {
                legend:
                {
                  display: false
                }
              }
              , elements:
              {
                point:
                {
                  pointStyle: false
                }
              }
              , scales:
              {
                y:
                {
                  beginAtZero: true
                  // , suggestedMin: 100
                  , min: 100
                  , afterFit: (ctx) =>
                  {
                    ctx.width = 60;
                  }
                  , grid:
                  {
                    color: '#FFFFF'
                    , lineWidth: 0
                  }
                  , border:
                  {
                    dash: [5,5]
                  }
                }
                , x:
                {
                  ticks:
                  {
                    display: false
                  }
                  , grid:
                  {
                    drawTicks: false
                  }
                }
              }
            }
          }
        );

        return;
      }
      , (
        ex: unknown
      ): void =>
      {
        // ▓ [🐞]
        // if (ex?.toString()?.includes('TypeError: null is not an object (evaluating /'signerOrProvider.call/')'))
        //   console.info('❗️', '');
        // else
        //   console.error('💀 Unhandled :: ex');

        // ▓ [🐞]
        console.error(`💀 Unhandled :: ${ex}`);

        return;
      }
    );
  }

  // #endregion ➤ 🛠️ METHODS

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
      addEventListeners();
      await generateTargetChart();
      return;
    }
  );

  onDestroy
  (
    async (

    ): Promise < void > =>
    {
      removeEventListeners();
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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

  $:
  if (browser && (theme || lang))
  {
    // ▓ [🐞]
    dlog
    (
      '🚏 checkpoint [R] ➤ Launchpad-Wallets.svelte if_R_3',
      true
    );

    generateTargetChart();
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
  class:dark-background-1={theme == 'Dark'}
>

  <div
    id="top-row"
    class=
    "
    m-b-32
    "
  >

    <!--
    ▓ NOTE:
    ▓ > Investor Wallets Widget Title.
    -->
    <p
      id="widget-title"
      class=
      "
      s-14
      color-grey
        grey-v1
      m-b-12
      "
    >
      <TranslationText
        key={'profile/investor/portofilo/title'}
        text={profileTrs?.investor?.general.title_wallet}
        fallback={'Investor Wallets'}
      />
    </p>

    <!--
    ▓ NOTE:
    ▓ > tokens accumulated (so far by user).
    -->
    <div
      class=
      "
      row-space-start
      "
    >

      <!--
      ▓ NOTE:
      ▓ > (text) TGE amount
      -->
      <p
        class=
        "
        w-500
        color-black-2
        m-r-6
        "
        class:s-40={!VIEWPORT_MOBILE_INIT[1]}
        class:s-32={VIEWPORT_MOBILE_INIT[1]}
        style=
        "
        line-height: 100%; /* 40px */
        "
      >
        {
          toDecimalFix(grand_total ?? 0, 2, false, false)
        }
        <span
          class=
          "
          s-24
          "
        >
          BTA
        </span>
      </p>

      <!--
      ▓ NOTE:
      ▓ > (asset) BTA icon token.
      -->
      <img
        id=''
        src={icon_bta_token}
        alt=''
        title=''
        loading='lazy'
        width=20
        height=20
      />

    </div>

  </div>

  <!--
  ▓ NOTE:
  ▓ > Investor Wallets Graph Data.
  -->
  {#if mapInvestAmountDeltaPerMonth.size > 0}
    <div
      id="chartParent"
    >

      <!--
      ▓ NOTE:
      ▓ > Investor Chart Data 1.
      -->
      {#if !VIEWPORT_MOBILE_INIT[1]}
        <div
          id="chartHover"
        >
          <canvas
            id="constChart"
          >
          </canvas>
        </div>
      {/if}

      <!--
      ▓ NOTE:
      ▓ > Investor Chart Data 2.
      -->
      <div
        id="chartMain"
        style=
        "
        {!VIEWPORT_MOBILE_INIT[1] ? 'margin-left: 47px;' : ''}
        "
      >
        <div
          id="scrollBox"
          class:limit-width={mapInvestAmountDeltaPerMonth.size <= 4}
          style=
          "
          {mapInvestAmountDeltaPerMonth.size > 4 ? `width: ${mapInvestAmountDeltaPerMonth.size * 85}px;` : ''}
          "
        >
          <canvas
            id="valueChart"
          >
          </canvas>
        </div>
      </div>
    </div>
  {:else}
    <div
      id="no-widget-data"
    >
      <p
        class=
        "
        s-16
        color-black-3
          dark-v1
        "
        style=
        "
        line-height: 24px; /* 150% */
        "
      >
        <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
        {
          profileTrs?.investor?.general.no_information
          ?? 'Uh-oh! No Investments have been found.'
        }
      </p>
    </div>
  {/if}

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕launchpad-wallets⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    height: 334px;
    min-height: 334px;
    max-height: 334px;
    position: relative;

    div#top-row
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div#chartParent
    {
      /* 🎨 style */
      display: flex;
      padding: 0 20px;
      width: auto;
      // width: 500px;
      height: 185px;

      div#chartHover
      {
        /* 🎨 style */
        max-width: 60px;
        position: absolute;
        min-height: 170px;
        max-height: 170px;
        background-color: var(--white);

        canvas#constChart
        {
          /* 🎨 style */
        }
      }

      div#chartMain
      {
        /* 🎨 style */
        // max-width: 500px;
        min-width: auto;
        overflow-x: scroll;
        overflow-y: hidden;
        width: -webkit-fill-available;
        width: -moz-available;
        position: relative;
        scrollbar-width: none; /* Firefox */

        &::-webkit-scrollbar
        {
          /* Hide scrollbar for Chrome, Safari and Opera */
          display: none;
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none; /* IE and Edge */
          width: 4px;
        }

        div#scrollBox
        {
          /* 🎨 style */
          // max-width: 100%;
          position: absolute;
          right: 0;

          &.limit-width
          {
            /* 🎨 style */
            width: -webkit-fill-available;
            width: -moz-available;
          }

          canvas#valueChart
          {
            /* 🎨 style */
            min-height: 190px;
            max-height: 190px;
          }
        }
      }
    }

    div#no-widget-data
    {
      /* 📌 position */
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 10;
      /* 🎨 style */
      background-color: var(--white);
      text-align: center;
      height: fit-content;

      p
      {
        /* 📌 position */
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        /* 🎨 style */
        height: fit-content;
        -ms-transform: translateY(-50%);
        width: 176px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕launchpad-wallets⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;

      div#chartParent
      {
        div#chartHover
        {
          /* 🎨 style */
          background-color: var(--dark-theme-1-4-shade);
        }
      }
    }
  }

</style>
