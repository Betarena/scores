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

  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { toDecimalFix, viewport_change } from '$lib/utils/platform-functions.js';
  import { Misc } from '@betarena/scores-lib/dist/classes/class.misc.js';

  import icon_investment_checkpoint_2 from '../assets/investor/icon-investment-checkpoint-2.svg';
  import icon_investment_checkpoint from '../assets/investor/icon-investment-checkpoint.svg';
  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';

  import type { B_H_KEYP, B_H_KEYP_Tier } from '@betarena/scores-lib/types/_HASURA_.js';
  import type { IProfileData } from '@betarena/scores-lib/types/types.profile.js';

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
    /** @augments IProfileData */
    profileData: IProfileData | null
  ;

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investTierPricing⮕main'
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
    dataMap: Map < B_H_KEYP_Tier, B_H_KEYP > = new Misc().convertToMapKEYPINVSTTIER
    (
      (profileData?.investorTierPricing?.sort((a, b) => {return b.data?.position - a.data?.position}) ?? [])
    )
    /**
     * @description
     *  📣 Dynamic **table layout**.
    */
    , tableLayout : B_H_KEYP_Tier[][] = [[]]
    /**
     * @description
     *  📣 Current `tier` of _this_ user.
    */
    , currentAccumulatedAmountProgress: number = -1
    /**
     * @description
     *  📣
    */
    , colspan1Value: number = 1
    /**
     * @description
     *  📣
    */
    , colspanSet = ( newValue: number ) => { colspan1Value = newValue; return; }
  ;

  // [🐞]
  $userBetarenaSettings.user.scores_user_data.investor_balance = 10000;

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
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Update variables for viewport state.
   * @return { void }
   */
  function resizeCustom
  (
  ): void
  {
    [
      VIEWPORT_TABLET_INIT[1],
      VIEWPORT_MOBILE_INIT[1]
    ] = viewport_change
    (
      VIEWPORT_TABLET_INIT[0],
      VIEWPORT_MOBILE_INIT[0]
    );
    updateTierPricingLayout();
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Assign target icon for target visible option.
   * @param { string } target
   *  💠 Target `tier` selected.
   * @return { string }
   *  📤 Target `tier icon`.
   */
  function selectIcon
  (
    target: B_H_KEYP_Tier
  ): string
  {
    if (target == 'bronze')
      return icon_bronze;
    else if (target == 'silver')
      return icon_silver;
    else if (target == 'gold')
      return icon_gold;
    else if (target == 'platinum')
      return icon_platinum;
    else
      return '';
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Set **current tier** of _this_ user.
   * @return { void }
   */
  function setLargestCurrentTier
  (
    tierNumber: number
  ): void
  {
    currentAccumulatedAmountProgress = tierNumber;
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Updates layout of tier pricings, dependent on device `resize`.
   * @return { void }
   */
  function updateTierPricingLayout
  (
  ): void
  {
    if (VIEWPORT_MOBILE_INIT[1])
    {
      tableLayout = [['bronze'], ['silver'], ['gold'], ['platinum']];
      colspanSet(2);
    }
    else if (VIEWPORT_TABLET_INIT[1])
    {
      tableLayout = [['bronze', 'silver'], ['gold', 'platinum']]
      colspanSet(1);
    }
    else
    {
      tableLayout = [['bronze', 'silver', 'gold', 'platinum']]
      colspanSet(1);
    }
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
    ) =>
    {
      resizeCustom();
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<svelte:window
  on:resize=
  {
    () => {return resizeCustom()}
  }
/>

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

  <!-- [🐞]-->
  <!-- {VIEWPORT_TABLET_INIT[1]} -->
  <!-- [🐞]-->
  <!-- {VIEWPORT_MOBILE_INIT[1]} -->

  <!--
  ▓ NOTE:
  ▓ > widget title.
  -->
  <h1
    id="widget-title"
    class=
    "
    s-20
    w-500
    color-black-2
    "
  >
    Tier Pricing
  </h1>

  <!--
  ▓ NOTE:
  ▓ > tier pricing table.
  -->
  {#each tableLayout as layout}

    <table
      class=
      "
      m-b-25
      "
    >

      <!--
      ▓ NOTE:
      ▓ > (header-row) tier pricing table.
      -->
      <thead>

        <tr>

          {#if !VIEWPORT_MOBILE_INIT[1]}
            <th/>
          {/if}

          {#each layout as key}

            {#if key != 'NaN'}

              <th>
                <div
                  class=
                  "
                  row-space-start
                  "
                >
                  <img
                    id=''
                    src={selectIcon(key)}
                    alt=''
                    title=''
                    loading='lazy'
                    width=40
                    height=40
                    class=
                    "
                    m-r-12
                    "
                  />
                  <p
                    class=
                    "
                    s-20
                    w-500
                    color-black-2
                    capitalize
                    "
                  >
                    {dataMap.get(key)?.tier}
                  </p>
                </div>
              </th>

            {/if}

          {/each}
        </tr>

      </thead>

      <!--
      ▓ NOTE:
      ▓ > (row) tier pricing table.
      -->
      <tbody>

        {#each ['token-price', 'MINIMUM INVESTMENT', 'Discount', 'Initial Token Release', 'Vesting Period', 'progress'] ?? [] as item}

          <tr
            class:row-progress={item == 'progress'}
          >

            <!--
            ▓ NOTE:
            ▓ > row title.
            -->

            {#if item == 'progress' && VIEWPORT_MOBILE_INIT[1]}
              <!--  -->
            {:else}

              <td>

                {#if item != 'progress'}

                  <p
                    class=
                    "
                    s-12
                    color-grey
                      grey-v1
                    "
                  >
                    {item}
                  </p>

                {:else if !VIEWPORT_MOBILE_INIT[1]}

                  <div
                    style=
                    "
                    position: relative;
                    "
                  >
                    <!--
                    ▓ NOTE:
                    ▓ > (box) tier progress bar.
                    -->
                    <div
                      class=
                      "
                      line
                      "
                    >
                      <div
                        class:reached-tier={currentAccumulatedAmountProgress != -1}
                      />
                    </div>
                  </div>

                {/if}

              </td>

            {/if}

            <!-- {colspan1Value} -->

            <!--
            ▓ NOTE:
            ▓ > row target tiers data, per column.
            -->
            {#each layout as key}

              {#if key != 'NaN'}

                <td
                  colspan={colspan1Value}
                >
                  {#if item != 'progress'}
                    <p
                      class=
                      "
                      s-16
                      color-black-2
                      "
                    >
                      {#if item == 'token-price'}
                        ${
                          toDecimalFix
                          (
                            dataMap.get(key)?.data?.token_price ?? 0
                            , 2
                            , false
                            , false
                          )
                        }
                      {:else if item == 'MINIMUM INVESTMENT'}
                        ${
                          dataMap.get(key)?.data?.invest_min
                          ?? ''
                        }
                        {
                          dataMap.get(key)?.data?.invest_max == -1
                            ? 'or more'
                            : `- $${dataMap.get(key)?.data?.invest_max ?? ''}`
                        }
                      {:else if item == 'Discount'}
                        {
                          dataMap.get(key)?.data?.discount_percentage
                          ?? ''
                        }%
                      {:else if item == 'Initial Token Release'}
                        {
                          dataMap.get(key)?.data?.initial_token_release_percentage
                          ?? ''
                        }% at (TGE)
                      {:else if item == 'Vesting Period'}
                        {
                          dataMap.get(key)?.data?.vesting_months
                          ?? ''
                        } months
                      {/if}
                    </p>

                  {:else}

                    <!--
                    ▓ NOTE:
                    ▓ > user 'cumulative sum' investment(s) progress.
                    -->
                    <div
                      class=
                      "
                      investment-tier-progress
                      "
                    >
                      <!-- [🐞]-->
                      <!-- {currentAccumulatedAmountProgress} -->

                      <!--
                      ▓ NOTE:
                      ▓ > (asset) tier checkpoint.
                      -->
                      <img
                        id=''
                        class=
                        "
                        checkpoint
                        "
                        src=
                        {
                          currentAccumulatedAmountProgress >= (dataMap.get(key)?.data?.position ?? 0)
                            ? icon_investment_checkpoint
                            : icon_investment_checkpoint_2
                        }
                        alt='icon_invest_progress_checkpoint'
                        title='{dataMap.get(key)?.tier} checkpoint'
                        loading='lazy'
                        width=auto
                        height=auto
                      />

                      <!--
                      ▓ NOTE:
                      ▓ > (box) tier progress bar.
                      -->
                      <div
                        class=
                        "
                        line
                        "
                      >
                        <div
                          class:reached-tier={currentAccumulatedAmountProgress > (dataMap.get(key)?.data?.position ?? 0)}
                          class:current-tier={currentAccumulatedAmountProgress == (dataMap.get(key)?.data?.position ?? 0)}
                        />
                      </div>

                      <!--
                      ▓ CHECK
                      ▓ > wether 'this' tier is the one user belongs to.
                      -->
                      {#if
                        ($userBetarenaSettings.user.scores_user_data?.investor_balance ?? 0) >= (dataMap.get(key)?.data?.invest_min ?? 0)
                        && (
                          ($userBetarenaSettings.user.scores_user_data?.investor_balance ?? 0) <= (dataMap.get(key)?.data?.invest_max ?? 0)
                          || (dataMap.get(key)?.data?.invest_max ?? 0) == -1)
                      }

                        <!--
                        ▓ IMPORTANT
                        ▓ > dynamic update user tier, from within HTML trigger.
                        -->
                        {setLargestCurrentTier(dataMap.get(key)?.data?.position ?? 0) ?? ''}

                        <!--
                        ▓ NOTE:
                        ▓ > staked amount box.
                        -->
                        <div
                          id="cumulative-sum-slider-box"
                          class=
                          "
                          text-center
                          "
                          transition:fly={{ x: -200, duration: 500 }}
                        >
                          <!--
                          ▓ NOTE:
                          ▓ > staked amount.
                          -->
                          <p
                            id="staked-amount"
                            class=
                            "
                            s-16
                            w-500
                            color-white
                            m-b-12
                            "
                          >
                            {$userBetarenaSettings.user.scores_user_data?.investor_balance ?? 0} BTA
                          </p>

                          <!--
                          ▓ NOTE:
                          ▓ > staked amount hint text.
                          -->
                          <p
                            class=
                            "
                            s-12
                            color-grey
                            "
                          >
                            Your staked ammount
                          </p>
                        </div>

                      {/if}

                    </div>

                  {/if}
                </td>

              {/if}

            {/each}

          </tr>

        {/each}

      </tbody>

    </table>

  {/each}

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

  div#profile⮕w⮕investTierPricing⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    position: relative;
    padding: 20px;

    h1#widget-title
    {
      /* 🎨 style */
      position: relative;
      margin: 0;
      margin-bottom: 20px;
    }

    div.line
    {
      /* 📌 position */
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      left: 0;
      right: 0;
      /* 🎨 style */
      height: 1px;
      width: 100%;
      background-color: var(--grey-color);

      > div
      {
        /* 🎨 style */
        background: var(--primary);
        /* width: 40%; */ /* Adjusted with JavaScript */
        height: 1px;
        width: 0%;

        &.current-tier
        {
          /* 🎨 style */
          width: 50%;
        }

        &.reached-tier
        {
          /* 🎨 style */
          width: 100%;
        }
      }
    }

    table
    {
      /* 🎨 style */
      text-align: left;
      border-collapse: collapse;
      width: -webkit-fill-available;
      width: -moz-available;

      thead
      {
        tr
        {
          th
          {
            /* 🛝 layout */
            width: fit-content;
            /* 🎨 style */
            white-space: nowrap;
            padding: 8px 0 20px 0;
            padding-right: 12px;

            &:first-child
            {
              /* 🎨 style */
              padding-left: 20px;
              border-radius: 2px 0 0 2px;
            }

            &:last-child
            {
              /* 🎨 style */
              padding-right: 20px;
              border-radius: 0 2px 2px 0;
            }
          }
        }
      }

      tbody
      {
        tr
        {
          /* 🎨 style */
          position: relative;
          position: -webkit-sticky;
          max-height: 40px;
          height: 40px;
          min-height: 40px;

          &.row-progress
          {
            td
            {
              /* 🎨 style */
              padding: 25px 0 8px 0;
            }
          }

          td
          {
            /* 🎨 style */
            padding: 8px 0 8px 0;
            // padding-right: 12px;

            &:first-child
            {
              /* 🎨 style */
              padding-left: 20px !important;
              border-radius: 4px 0 0 4px;
            }
            &:last-of-type
            {
              /* 🎨 style */
              padding-right: 20px !important;
              border-radius: 0 4px 4px 0;
            }
          }

          &:nth-child(odd)
          {
            /* 🎨 style */
            background-color: var(--whitev2)
          }

          &:nth-child(even)
          {
            /* 🎨 style */
            background-color: var(--white);
          }
        }
      }
    }

    div.investment-tier-progress
    {
      /* 📌 position */
      position: relative;

      img.checkpoint
      {
        /* 📌 position */
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 0;
        z-index: 1;
      }

      div#cumulative-sum-slider-box
      {
        /* 📌 position */
        position: absolute;
        top: 15px;
        right: 0;
        left: 0;
        margin: auto;
        bottom: 0;
        height: fit-content;

        p#staked-amount
        {
          /* 🎨 style */
          padding: 0 8px;
          background-color: var(--primary);
          border-radius: 32px;
          height: 24px;
          max-height: 24px;
          max-width: 100px;
        }
      }
    }

  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#profile⮕w⮕investTierPricing⮕main
    {
      h1#widget-title
      {
        /* 🎨 style */
        position: absolute;
        top: 10px;
        left: 20px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investTierPricing⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 table
    {
      tbody
      {
        tr:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--dark-theme-1);
        }
        tr:nth-child(even)
        {
          /* 🎨 style */
          background-color: transparent;
        }
      }
    }

    &.dark-background-1 div.line
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-6-shade);
    }
  }

</style>
