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

  import { toZeroPrefixDateStr } from '$lib/utils/dates.js';
  import { toDecimalFix } from '$lib/utils/platform-functions';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';

	import type { B_H_KEYP, B_H_KEYP_Tier, B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';

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
     * @augments B_H_TH
    */
    data: B_H_TH
    /**
     * @description
     *  📣
    */
    , tierDataMap: Map < B_H_KEYP_Tier, B_H_KEYP >
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
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  // type K1 = keyof B_H_TH;

  let
    /**
     * @description
     *  📣 Wether extra information is toggled (mobile only).
    */
    isTxExtraInfo: boolean = false
    /**
     * @description
     *  📣 Properties to be shown in mobile view.
    */
    , mobileProps: string[] = ['discount', 'investment', 'tokens', 'price']
    /**
     * @description
     *  📣 Target `icon` asset for _this_ transaction.
    */
    , targetTxTierIcon: string = selectIcon(data.tier ?? 'NaN')
  ;

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

  // #endregion ➤ 🛠️ METHODS

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<tr
  class:extra-info={isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}
  on:click={() => {return isTxExtraInfo = !isTxExtraInfo}}
>

  <!--
  ▓ NOTE:
  ▓ > transaction execution date.
  -->
  <td>
    <p>
      {
        new Date(data.date ?? '').getDate()
        + '/'
        + toZeroPrefixDateStr(new Date(data.date ?? '').getMonth() + 1)
        + '/'
        + (new Date(data.date ?? '').getFullYear()).toString().substr(-2)
      }
    </p>
  </td>

  <!--
  ▓ NOTE:
  ▓ > transaction execution type.
  -->
  <td>
    <p>
      {data.type}
    </p>
  </td>

  <!--
  ▓ NOTE:
  ▓ > transaction execution tier.
  -->
  <td>
    <div
      class=
      "
      row-space-start
      "
    >
      <!--
      ▓ NOTE:
      ▓ > transaction tier icon.
      -->
      <img
        id=''
        src='{targetTxTierIcon}'
        alt=''
        title=''
        loading='lazy'
        width=24
        height=24
        class=
        "
        m-r-8
        "
      />

      <!--
      ▓ NOTE:
      ▓ > transaction tier name tag.
      -->
      <p
        class=
        "
        capitalize
        "
      >
        {data.tier ?? 'NaN'}
      </p>

    </div>
  </td>

  <!--
  ▓ NOTE:
  ▓ > 💻 TABLET 🖥️ LAPTOP
  -->
  {#if !VIEWPORT_MOBILE_INIT_PARENT[1]}

    <!--
    ▓ NOTE:
    ▓ > discount
    -->
    <td>
      <p>
        {tierDataMap.get(data.tier ?? 'NaN')?.data?.discount_percentage}%
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment amount
    -->
    <td>
      <p>
        ${data.amount}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment tokens amount
    -->
    <td>
      <p>
        {data.quantity}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment BTA price
    -->
    <td>
      <p>
        ${
          toDecimalFix
          (
            tierDataMap.get(data.tier ?? 'NaN')?.data?.token_price ?? 0
            , 2
            , false
            , false
          )
        }
      </p>
    </td>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > 📱 MOBILE
  -->
  {#if VIEWPORT_MOBILE_INIT_PARENT[1]}
    <td>
      <img
        src={isTxExtraInfo ? icon_arrow_up : icon_arrow_down}
        alt={isTxExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
        class=
        "
        cursor-pointer
        m-l-8
        "
        style=
        "
        float: right;
        "
      />
    </td>
  {/if}

  <!--
  ▓ NOTE:
  ▓ > transaction 📱 MOBILE layout
  -->
  {#if isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}

    <div
      class=
      "
      extra-information
      "
    >
      {#each mobileProps as item}

        <!--
        ▓ NOTE:
        ▓ > target transaction further data row.
        -->
        <div
          class=
          "
          m-b-8
          row-space-out
          "
        >

          <!--
          ▓ NOTE:
          ▓ > target transaction property title.
          -->
          <p
            class=
            "
            s-12
            color-grey
            "
          >
            {#if item == 'discount'}
              Discount
            {:else if item == 'investment'}
              Investment
            {:else if item == 'tokens'}
              Tokens
            {:else if item == 'price'}
              Price
            {/if}
          </p>

          <!--
          ▓ NOTE:
          ▓ > target transaction property value.
          -->
          <p
            class=
            "
            s-14
            color-black-2
            "
          >
            {#if item == 'discount'}
              {tierDataMap.get(data.tier ?? 'NaN')?.data?.discount_percentage}%
            {:else if item == 'investment'}
              ${data.amount}
            {:else if item == 'tokens'}
              {data.quantity}
            {:else if item == 'price'}
              ${
                toDecimalFix
                (
                  tierDataMap.get(data.tier ?? 'NaN')?.data?.token_price ?? 0
                  , 2
                  , false
                  , false
                )
              }
            {/if}
          </p>

        </div>

      {/each}
    </div>

  {/if}

</tr>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  // ▓ IMPORTANT
  // ▓ > Controlled By Parent

</style>
