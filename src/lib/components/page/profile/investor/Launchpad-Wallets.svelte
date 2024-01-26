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

  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { MONTH_NAMES_ABBRV } from '$lib/utils/dates.js';
  import { Chart, registerables, type ChartItem } from 'chart.js';

  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';

  import { browser } from '$app/environment';
  import { dlog } from '$lib/utils/debug.js';
  import { passByValue } from '@betarena/scores-lib/dist/functions/func.common.js';
  import { tryCatchAsync } from '@betarena/scores-lib/dist/util/util.common.js';
  import type { B_H_TH, PUBLIC__INVESTOR_DeleteInvestorByPkElement } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  Chart.register(...registerables);

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
     *  📣
    */
    , VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕launchpad-wallets⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
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
    , targetMonths = () =>
    {
      const dateList: Date[] = [];

      today.setFullYear(today.getFullYear() - 1);

      for (let index = 0; index < 12; index++)
      {
        today.setMonth(today.getMonth() + 1);
        dateList.push(new Date(today));
      }

      return dateList;
    }
    /**
     * @description
     *  📣 Invesmtnet `map` showing investment change per calendar month.
    */
    , mapInvestAmountDeltaPerMonth = generateInvestmentMonthlyMap
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
       *  📣 stores target `chart` instance.
      */
      chartInstance: Chart | null
    } = {
      chartInstance: null
    }
  ;

  // ▓ [🐞]
  // console.log('targetMonths', targetMonths())

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;
  $: deepReactListen1 = passByValue($userBetarenaSettings.theme);

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
   *  📣 Generates target `user` investment monthly graph data.
   * @param { Date[] } dateList
   *  💠 Target dates list.
   * @param { B_H_TH[] } dateList
   *  💠 Target investor transaction list.
   * @return { Map < string, number > }
   *  📤 A `Map` of change (delta) in investor wallet amount, where:
   *  - key=`month_year`
   *  - value=`change of investor wallet amount for that month`
   */
  function generateInvestmentMonthlyMap
  (
    dateList: Date[]
    , investorTxList: B_H_TH[]
    , investorData: PUBLIC__INVESTOR_DeleteInvestorByPkElement | null
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

    // ▓ NOTE:
    // ▓ > loop over each transaction and group them by monthly+year.
    for (const iterator of investorTxList)
    {
      const
        txMonthYear = `${new Date(iterator.date).getMonth()}_${new Date(iterator.date).getFullYear()}`
      ;

      if (
        !['pending', 'completed'].includes(iterator.status)
        || !['investment', 'vesting'].includes(iterator.type)
      )
        continue;
      //

      let deltaAmount: number = 0;

      if (iterator.type == 'investment')
        deltaAmount = iterator.amount ?? 0;
      else if (iterator.type == 'vesting')
        deltaAmount = -(iterator.amount ?? 0);
      //

      if (mapTemp.has(txMonthYear))
      {
        let existingAmount = mapTemp.get(txMonthYear) ?? 0;
        existingAmount += deltaAmount;
        mapTemp.set(txMonthYear, existingAmount);
        continue;
      }

      mapTemp.set(txMonthYear, iterator.amount ?? 0);
    }

    // ▓ [🐞]
    console.log('mapTemp', mapTemp);

    // ▓ NOTE:
    // ▓ > loop over each referral and group them by monthly+year;
    for (const iterator of investorData?.data?.referral_history ?? [])
    {
      const txMonthYear = `${new Date(iterator.date).getMonth()}_${new Date(iterator.date).getFullYear()}`;

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

    let
      /**
       * @description
       *  📣 **cumulative sum** for month-on-month amount.
      */
      cummulativeSum: number = 0
    ;

    // ▓ NOTE:
    // ▓ > loop over each group monthly+year.
    for (const date of dateList)
    {
      const txMonthYear = `${new Date(date).getMonth()}_${new Date(date).getFullYear()}`;

      if (mapTemp.has(txMonthYear))
      {
        let existingAmount = mapTemp.get(txMonthYear)!;
        cummulativeSum += existingAmount;
        mapMain.set(txMonthYear, cummulativeSum)
      }
      if (mapTemp2.has(txMonthYear))
      {
        let existingAmount = mapTemp2.get(txMonthYear)!;
        cummulativeSum += existingAmount;
        mapMain.set(txMonthYear, cummulativeSum)
      }

      if (mapMain.has(txMonthYear))
        continue;
      //

      mapMain.set(txMonthYear, 0);
    }

    // ▓ [🐞]
    console.log('mapMain', mapMain);

    return mapMain;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Generates target `user` investment monthly cahrt GUI.
   */
  function generateTargetChart
  (
  ): void
  {
    tryCatchAsync
    (
      async (
      ): Promise < void > =>
      {
        const
          canvas = document.getElementById('myChart') as HTMLCanvasElement
          , ctx = canvas.getContext('2d')!
        ;
        var gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(245, 98, 15, 0.24)');
        gradient.addColorStop(0.75, 'rgba(0,0,0,0)');

        // ▓ read-more :|: https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas
        if (stateObject.chartInstance)
          stateObject.chartInstance.destroy();
        //

        // ▓ [🐞]
        // console.log('mapInvestAmountDeltaPerMonth', mapInvestAmountDeltaPerMonth)

        Chart.defaults.font.size = 14;
        Chart.defaults.color = '#8C8C8C';

        const gridLineColor: string
          = $userBetarenaSettings.theme == 'Dark'
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
              labels: [...mapInvestAmountDeltaPerMonth.keys()].map(x => {return MONTH_NAMES_ABBRV[x.split('_')[0]]})
              , datasets: [
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
              plugins:
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
                  , grid:
                  {
                    color: gridLineColor
                    , lineWidth: 2
                  }
                  , border:
                  {
                    dash: [5,5]
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

    return;
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
      generateTargetChart();
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
  if (browser && deepReactListen1)
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
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
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

      {
        'Investor Wallets'
      }
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
        class:s-40={!VIEWPORT_MOBILE_INIT_PARENT[1]}
        class:s-32={VIEWPORT_MOBILE_INIT_PARENT[1]}
        style=
        "
        line-height: 100%; /* 40px */
        "
      >
        {
          $userBetarenaSettings.user.scores_user_data?.investor_balance
          ?? 0
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
  <div>
    <canvas
      id="myChart"
    >
    </canvas>
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

    div#top-row
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div
    {
      > canvas
      {
        /* 🎨 style */
        max-height: 190px;
        padding: 0 20px;
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
    }
  }

</style>
