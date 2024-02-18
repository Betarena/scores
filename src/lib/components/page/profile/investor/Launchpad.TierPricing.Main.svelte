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

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { formatNumberWithCommas, toDecimalFix } from '$lib/utils/platform-functions.js';
  import { Misc } from '@betarena/scores-lib/dist/classes/class.misc.js';

  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { KeypairInvestorPresaleMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
  import type { IPresaleTier } from '@betarena/scores-lib/types/_ENUMS_.js';
  import type { B_H_KEYP_Tier } from '@betarena/scores-lib/types/_HASURA_.js';
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

  /**
   * @description
   *  📣 Component interface.
   */
  type IRowLayout =
    | 'token-price'
    | 'minimum-investment'
    | 'discount'
    | 'initial-token-release'
    | 'vesting-period'
    | 'progress'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investTierPricing⮕main'
    /**
     * @description
     *  📣 Target row structure layout title.
    */
    , rowLayout: IRowLayout[]
      = [
        'token-price'
        , 'minimum-investment'
        , 'discount'
        , 'initial-token-release'
        , 'vesting-period'
        , 'progress'
      ]
  ;

  let
    /**
     * @description
     *  📣 convert target `data` to respective `map`.
     */
    dataMap: Map < IPresaleTier, KeypairInvestorPresaleMain >
      = new Misc().convertToMapKEYPINVSTTIER
      (
        (
          profileData?.investorTierPricing
            ?.sort
            (
              (
                a,
                b
              ) =>
              {
                return (b.data?.position ?? 0) - (a.data?.position ?? 0)
              }
            ) ?? [])
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
    , currentAccumulatedAmountProgress: B_H_KEYP_Tier = 'NaN'
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
    /**
     * @description
     *  📣 toggle state for `div` applied for `delay` purposes.
     */
    , show: boolean = false
    /**
     * @description
     *  📣 component target.
     */
    , componentTarget: HTMLElement
    /**
     * @description
     *  📣 state object for custom logic.
     */
    , stateObject:
    {
      /**
       * @description
       *  📣 component initial `distance` target.
       */
      initialDivDistance: number;
      /**
       * @description
       *  📣 component `state` check.
       */
      isExecuted: boolean;
      /**
       * @description
       *  📣 component `show` animation component.
       */
      show: boolean;
    }
    = {
      initialDivDistance: 0
      , isExecuted: false
      , show: false
    }
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ grand_total } = $userBetarenaSettings.user.scores_user_data?.investor_balance ?? { grand_total: 0 });

  // ▓ [🐞]
  // $userBetarenaSettings.user.scores_user_data.investor_balance = 100000;

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
  ): void
  {
    const investorBalance: number = grand_total!;
    currentAccumulatedAmountProgress = 'NaN';

    // ▓ NOTE:
    // ▓ > loop over each tier data.
    for (const [key, data] of dataMap)

      if
      (
        investorBalance >= (data.data?.invest_min ?? 0)
        && (investorBalance <= (data.data?.invest_max ?? 0)
          || (data.data?.invest_max ?? 0) == -1)
      )
        currentAccumulatedAmountProgress = key;


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

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Kickstart `animation` for widget.
   * @return { void }
   */
  function scrollCustom
  (
  ): void
  {
    // ▓ CHECK
    // ▓ > first time call of THIS method.
    if (!stateObject.isExecuted)
      // stateObject.initialDivDistance = componentTarget.getBoundingClientRect().bottom + window.scrollY;
      stateObject.isExecuted = true;
    //

    let
      /**
       * @description
       *  📣 Target dimensions of THIS widget from the respective points of interest.
      */
      elementBoundVal = componentTarget.getBoundingClientRect()
    ;

    // ▓ [🐞]
    // console.log('elementBoundVal', elementBoundVal);
    // console.log('window.innerHeight', window.innerHeight);

    // ▓ CHECK
    // ▓ > client has scrolled into view THIS widget component
    if
    (
      ((elementBoundVal.top >= 0) && (elementBoundVal.bottom <= window.innerHeight))
      || ((elementBoundVal.top <= 0) && (elementBoundVal.height >= window.innerHeight))
    )
    {
      stateObject.show = true;
      setTimeout(() => { return show = true }, 50);
    }

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
   * @author
   *  @migbash
   * @summary
   *  🔥 REACTIVITY
   * @description
   *  📌 Listens to cases when, the:
   *  - (1) _initial platform language_ has not been set,
   *  - (and) (2) `user` is **not** authenticated and/or is `anonymous`.
   * @WARNING
   *  **reactivity triggered by:**
   *  - `$userBetarenaSettings.user`- **kicker** (via deepListen)
   */
  $: if (grand_total) setLargestCurrentTier();

  $: if (VIEWPORT_MOBILE_INIT || VIEWPORT_TABLET_INIT) updateTierPricingLayout();

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<svelte:window
  on:scroll=
  {
    () => { return scrollCustom() }
  }
/>

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
  bind:this={componentTarget}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>

  <!--
  ▓ NOTE:
  ▓ > (header) widget title 📱 MOBILE
  -->
  {#if VIEWPORT_MOBILE_INIT[1]}
    <h1
      id="widget-title"
      class=
      "
      s-20
      w-500
      color-black-2
      m-0
      "
    >
      <TranslationText
        key={`${CNAME}/table/header/discount`}
        text={profileTrs?.investor?.tiers.title}
        fallback={'Tier Pricing'}
      />
    </h1>
  {/if}

  <!--
  ▓ NOTE:
  ▓ > tier pricing table.
  -->
  {#each tableLayout as layout,tableNum}

    <table
    >

      <!--
      ▓ NOTE:
      ▓ > (row) tier pricing table header/columns.
      -->
      <thead>
        <tr>

          <!--
          ▓ NOTE:
          ▓ > (header) widget title.
          -->
          {#if !VIEWPORT_MOBILE_INIT[1] && tableNum == 0}
            <th>
              <h1
                id="widget-title"
                class=
                "
                s-20
                w-500
                color-black-2
                m-0
                "
              >
                <TranslationText
                  key={`${CNAME}/table/header/discount`}
                  text={profileTrs?.investor?.tiers.title}
                  fallback={'Tier Pricing'}
                />
              </h1>
            </th>
          <!--
          ▓ NOTE:
          ▓ > (header) empty column.
          -->
          {:else if !VIEWPORT_MOBILE_INIT[1]}
            <th/>
          {/if}

          <!--
          ▓ NOTE:
          ▓ > (header) available table columns.
          -->
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
                    <!---->
                    header-column
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
      ▓ > (row) tier pricing table data.
      -->
      <tbody>
        {#each rowLayout as item}
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
                    {#if item == 'token-price'}
                      <TranslationText
                        key={`${CNAME}/table/header/token-price`}
                        text={profileTrs?.investor?.tiers.tiers_pricing.title}
                        fallback={'Tier Pricing'}
                      />
                    {:else if item == 'minimum-investment'}
                      <TranslationText
                        key={`${CNAME}/table/header/minimum-investment`}
                        text={profileTrs?.investor?.tiers.tiers_investment.title}
                        fallback={'Minimum Investment'}
                      />
                    {:else if item == 'discount'}
                      <TranslationText
                        key={`${CNAME}/table/header/discount`}
                        text={profileTrs?.investor?.tiers.tiers_discount.title}
                        fallback={'Discount'}
                      />
                    {:else if item == 'initial-token-release'}
                      <TranslationText
                        key={`${CNAME}/table/header/initial-token-release`}
                        text={profileTrs?.investor?.tiers.tiers_tge.title}
                        fallback={'Initial token release'}
                      />
                    {:else if item == 'vesting-period'}
                      <TranslationText
                        key={`${CNAME}/table/header/vesting-period`}
                        text={profileTrs?.investor?.tiers.tiers_vesting.title}
                        fallback={'Vesting period'}
                      />
                    {/if}
                  </p>

                {:else if !VIEWPORT_MOBILE_INIT[1] && stateObject.isExecuted && stateObject.show}

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
                        class:reached-tier=
                        {
                          currentAccumulatedAmountProgress != 'NaN'
                          && (
                            layout.includes(currentAccumulatedAmountProgress)
                            || (VIEWPORT_TABLET_INIT[1] && tableLayout[1].includes(currentAccumulatedAmountProgress))
                          )
                        }
                      />
                    </div>
                  </div>

                {/if}

              </td>

            {/if}

            <!-- [🐞] -->
            <!-- {colspan1Value} -->

            <!--
            ▓ NOTE:
            ▓ > row target tiers data, per column.
            -->
            {#each layout as key,i}

              {#if key != 'NaN'}

                <td
                  colspan={colspan1Value}
                >
                  <!--
                  ▓ NOTE:
                  ▓ > standard values.
                  -->
                  {#if item != 'progress'}

                    <p
                      class=
                      "
                      s-16
                      color-black-2
                      no-wrap
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
                      {:else if item == 'minimum-investment'}
                        {
                          (dataMap.get(key)?.data?.invest_max == -1 ? '+' : '')
                          + '$'
                          + formatNumberWithCommas(dataMap.get(key)?.data?.invest_min)
                        }
                        {#if dataMap.get(key)?.data?.invest_max != -1}
                          {`- $${formatNumberWithCommas(dataMap.get(key)?.data?.invest_max)}`}
                        {/if}
                      {:else if item == 'discount'}
                        {
                          dataMap.get(key)?.data?.discount_percentage
                          ?? ''
                        }%
                      {:else if item == 'initial-token-release'}
                        {
                          dataMap.get(key)?.data?.initial_token_release_percentage
                          ?? ''
                        }% (TGE)
                      {:else if item == 'vesting-period'}
                        {
                          dataMap.get(key)?.data?.vesting_months
                          ?? ''
                        }
                        <TranslationText
                          key={`${CNAME}/table/header/vesting-period`}
                          text={profileTrs?.investor?.tiers.tiers.months}
                          fallback={'months'}
                        />
                      {/if}
                    </p>

                  <!--
                  ▓ NOTE:
                  ▓ > user 'cumulative sum' investment(s) progress.
                  -->
                  {:else}

                    {#if stateObject.isExecuted && stateObject.show}
                      <div
                        class=
                        "
                        investment-tier-progress
                        "
                      >
                        <!--
                        [🐞]
                        -->
                        <!-- {currentAccumulatedAmountProgress} -->

                        <!--
                        ▓ NOTE:
                        ▓ > (asset) tier checkpoint.
                        -->
                        <div
                          class=
                          "
                          checkpoint
                          "
                          style=
                          "
                          transition-delay: {(i + 1) * ((tableNum + 1) * 0.5)}s;
                          "
                          class:reached=
                          {
                            browser
                            && show
                            && (dataMap.get(currentAccumulatedAmountProgress)?.data?.position ?? 0) >= (dataMap.get(key)?.data?.position ?? 0)
                          }
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
                            class:reached-tier=
                            {
                              (dataMap.get(currentAccumulatedAmountProgress)?.data?.position ?? 0) > (dataMap.get(key)?.data?.position ?? 0)
                            }
                            class:current-tier=
                            {
                              (dataMap.get(currentAccumulatedAmountProgress)?.data?.position ?? 0) == (dataMap.get(key)?.data?.position ?? 0)
                            }
                            style=
                            "
                            animation-delay: {(i + 1) * ((tableNum + 1) * 0.5)}s ;
                            "
                          />
                        </div>

                        <!--
                        ▓ CHECK
                        ▓ > wether 'this' tier is the one user belongs to.
                        -->
                        {#if (dataMap.get(currentAccumulatedAmountProgress)?.data?.position ?? 0) == (dataMap.get(key)?.data?.position ?? 0)}

                          <!--
                          ▓ WARNING:
                          ▓ > does not work, specifically in a table > tr sections.
                          ▓ > https://github.com/sveltejs/svelte/issues/4948
                          transition:fly={{ x: -100, duration: 500, delay: i*2000 }}
                          -->

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
                            style=
                            "
                            animation-delay: {(i + 1) * ((tableNum + 1) * 0.5)}s;
                            "
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
                              {!VIEWPORT_TABLET_INIT[1] ? 'm-b-12' : 'm-b-8'}
                              no-wrap
                              "
                            >
                              {toDecimalFix(grand_total ?? 0, 2, false, false)} BTA
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
                                grey-v1
                              "
                            >
                              <TranslationText
                                key={`${CNAME}/table/header/vesting-period`}
                                text={profileTrs?.investor?.tiers.general_stake}
                                fallback={'Your staked ammount'}
                              />
                            </p>
                          </div>

                        {/if}

                      </div>
                    {/if}

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

  div#profile⮕w⮕investTierPricing⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding-bottom: 20px;
    /* 🛝 layout */
    display: grid;
    gap: 20px;

    h1#widget-title
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
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
        animation-duration: 0.5s;
        animation-delay: 0.5s;
        animation-fill-mode: forwards;
        -webkit-animation-fill-mode: forwards;

        &.current-tier
        {
          /* 🎡 animation */
          animation-name: slidein1;
        }

        &.reached-tier
        {
          /* 🎡 animation */
          animation-name: slidein2;
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
      // overflow: hidden;

      &:has(div#cumulative-sum-slider-box)
      {
        /* 🎨 style */
        margin-bottom: 20px;
      }

      thead
      {
        tr
        {
          /* 🎨 style */
          height: 40px;
          min-height: 40px;
          max-height: 40px;

          th
          {
            /* 📌 position */
            position: relative;
            /* 🛝 layout */
            width: fit-content;
            /* 🎨 style */
            white-space: nowrap;
            padding: 0 0 8px 0;
            padding-right: 78px;

            &:first-child
            {
              /* 🎨 style */
              padding-left: 20px;
              padding-right: 20px;
              min-width: 210px;
              max-width: 210px;
            }

            &:last-child
            {
              /* 🎨 style */
              padding-right: 20px;
            }
          }
        }
      }

      tbody
      {
        tr
        {
          /* 📌 position */
          position: relative;
          position: -webkit-sticky;
          /* 🎨 style */
          max-height: 40px;
          height: 40px;
          min-height: 40px;

          &.row-progress
          {
            td
            {
              /* 🎨 style */
              padding: 25px 0 8px 0;

              &:first-child
              {
                /* 🎨 style */
                padding-left: 20px !important;
              }
              &:last-of-type
              {
                /* 🎨 style */
                padding-right: 20px !important;
              }

              div.investment-tier-progress
              {
                /* 📌 position */
                position: relative;

                div.checkpoint
                {
                  /* 📌 position */
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  margin: auto;
                  left: 0;
                  z-index: 1;
                  /* 🎨 style */
                  width: 20px;
                  height: 20px;
                  background-image: url('../assets/investor/icon-investment-checkpoint-2.svg');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: 20px 20px;
                  transition-duration: 0.25s;

                  &.reached
                  {
                    /* 🎨 style */
                    background-image: url('../assets/investor/icon-investment-checkpoint.svg');
                    background-size: inherit;
                  }
                }

                div#cumulative-sum-slider-box
                {
                  /* 📌 position */
                  position: absolute;
                  top: -13px;
                  margin: auto;
                  /* 🎨 style */
                  opacity: 0;
                  height: fit-content;
                  width: fit-content;
                  /* 🎡 animation */
                  animation-duration: 0.25s;
                  animation-name: slidein;
                  animation-fill-mode: forwards;
                  -webkit-animation-fill-mode: forwards;

                  p#staked-amount
                  {
                    /* 🎨 style */
                    padding: 0 8px;
                    background-color: var(--primary);
                    border-radius: 32px;
                    height: 24px;
                    max-height: 24px;
                    max-width: fit-content;
                  }
                }
              }
            }
          }

          td
          {
            /* 🎨 style */
            padding: 4px 0 4px 0;
            // padding-right: 12px;

            &:first-child
            {
              /* 🎨 style */
              padding-left: 20px !important;
            }
            &:last-of-type
            {
              /* 🎨 style */
              padding-right: 20px !important;

              p
              {
                /* 🎨 style */
                text-align: end;
              }
            }
          }

          &:nth-child(odd)
          {
            td
            {
              /* 🎨 style */
              background-color: var(--whitev2);
            }
          }
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
      /* 🎨 style */
      // min-height: 716px;
      // height: 716px;
      // max-height: 716px;
      padding-bottom: 43px;
      padding: 20px;
      /* 🛝 layout */
      gap: 40;

      table
      {
        h1#widget-title
        {
          /* 🎨 style */
          padding: 0;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        thead
        {
          tr
          {
            th
            {
              /* 🎨 style */
              padding-bottom: 20px;

              &:first-child
              {
                /* 🎨 style */
                padding-left: 0;
              }

              &:last-child
              {
                /* 🎨 style */
                padding-right: 20px;
              }

              p.header-column
              {
                /* 🎨 style */
                position: absolute;
                left: 50px;
              }
            }
          }
        }

        tbody
        {
          tr
          {
            &.row-progress
            {
              td
              {
                &:first-child
                {
                  /* 🎨 style */
                  padding-left: 0px !important;
                }
                &:last-of-type
                {
                  /* 🎨 style */
                  padding-right: 0px !important;
                }
              }
            }

            td
            {
              /* 🎨 style */
              padding: 8px 0 8px 0;

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

                p
                {
                  /* 🎨 style */
                  text-align: start;
                }
              }
            }
          }
        }
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕investTierPricing⮕main
    {
      /* 🎨 style */
      height: 376px;
      min-height: 376px;
      max-height: 376px;

      table
      {
        &:has(div#cumulative-sum-slider-box)
        {
          /* 🎨 style */
          margin-bottom: none;
        }

        // h1#widget-title
        // {
        //   /* 🎨 style */
        //   max-width: 150px;
        // }
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
        tr
        {
          &.row-progress
          {
            td
            {
              div.investment-tier-progress
              {
                div.checkpoint
                {
                  /* 🎨 style */
                  background-image: url('../assets/investor/icon-investment-checkpoint-2-dark.svg');

                  &.reached
                  {
                    /* 🎨 style */
                    background-image: url('../assets/investor/icon-investment-checkpoint.svg');
                  }
                }
              }
            }
          }

          &:nth-child(odd)
          {
            td
            {
              /* 🎨 style */
              background-color: var(--dark-theme-1-5-shade-o-0-5);
            }
          }
        }
      }
    }

    &.dark-background-1 div.line
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-6-shade);
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🎡 ANIMATION                                                                 │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @keyframes slidein
  {
    0%
    {
      opacity: 1;
      left: 0%;
    }
    100%
    {
      opacity: 1;
      left: 25%;
    }
  }

  @keyframes slidein1
  {
    0%
    {
      width: 0%;
    }
    100%
    {
      width: 35%;
    }
  }

  @keyframes slidein2
  {
    0%
    {
      width: 0%;
    }
    100%
    {
      width: 100%;
    }
  }

</style>
