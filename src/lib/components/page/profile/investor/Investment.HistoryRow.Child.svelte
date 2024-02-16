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

  import { page } from '$app/stores';
  import TxStatusPill from '$lib/components/shared/Tx-Status-Pill.svelte';

  import { toZeroPrefixDateStr } from '$lib/utils/dates.js';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_bronze from '../assets/price-tier/icon-bta-bronze.svg';
  import icon_gold from '../assets/price-tier/icon-bta-gold.svg';
  import icon_platinum from '../assets/price-tier/icon-bta-platinum.svg';
  import icon_silver from '../assets/price-tier/icon-bta-silver.svg';

	import TranslationText from '$lib/components/misc/Translation-Text.svelte';

	import type { KeypairInvestorPresaleMain, PublicTransactionHistoryMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
	import type { IPresaleTier } from '@betarena/scores-lib/types/_ENUMS_.js';
	import type { B_H_KEYP_Tier } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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
     * @augments PublicTransactionHistoryMain
     */
    data: PublicTransactionHistoryMain
    /**
     * @description
     *  📣 Target `tier` data represented as `map`.
     */
    , tierDataMap: Map < IPresaleTier, KeypairInvestorPresaleMain >
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕invest-history-row⮕main'
  ;

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
    , mobileProps: string[]
      = [
        'discount'
        , 'investment'
        , 'tokens'
        , 'price'
        , 'description'
        , 'tier'
      ]
    /**
     * @description
     *  📣 Target `icon` asset for _this_ transaction.
     */
    , targetTxTierIcon: string = selectIcon(data.tier ?? 'NaN')
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;

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

  // #endregion ➤ 🛠️ METHODS

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

<tr
  class=
  "
  {CNAME}
  "
  class:extra-info={isTxExtraInfo && VIEWPORT_MOBILE_INIT[1]}
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
    <div
      class=
      "
      column-start-grid-start
      "
    >
      <p>
        {data.type ?? '-'}
      </p>
      {#if !VIEWPORT_MOBILE_INIT[1]}
        <span
          class=
          "
          s-12
          color-grey
          "
        >
          {data.description ?? '-'}
        </span>
      {/if}
    </div>
  </td>

  <!--
  ▓ NOTE:
  ▓ > 💻 TABLET 🖥️ LAPTOP
  -->
  {#if !VIEWPORT_MOBILE_INIT[1]}

    <!--
    ▓ NOTE:
    ▓ > transaction execution tier.
    -->
    <td>
      {#if data.tier != null && data.tier != 'NaN'}
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
            {data.tier}
          </p>

        </div>
      {:else}
        <p>
          -
        </p>
      {/if}
    </td>

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
        ${data.quantity ?? '-'}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment tokens amount
    -->
    <td>
      <p>
        {data.amount ?? '-'}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment BTA price
    -->
    <td>
      <p>
        ${data.bta_price ?? '-'}
      </p>
    </td>

  {/if}

  <!--
  ▓ NOTE:
  ▓ > investment status + dropdown for 📱 MOBILE
  -->
  <td>
    <div
      class=
      "
      row-space-end
      "
    >
      <TxStatusPill
        txStatus={data.status}
        trsStatusTerms={profileTrs?.tx?.status}
      />

      {#if VIEWPORT_MOBILE_INIT[1]}
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
      {/if}

    </div>
  </td>

  <!--
  ▓ NOTE:
  ▓ > transaction 📱 MOBILE layout
  -->
  {#if isTxExtraInfo && VIEWPORT_MOBILE_INIT[1]}

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
              <TranslationText
                key={'profile/investor/invest-history/row/discount'}
                text={profileTrs?.investor?.investment_details.discount}
                fallback={'Discount'}
              />
            {:else if item == 'investment'}
              <TranslationText
                key={'profile/investor/invest-history/row/investment'}
                text={profileTrs?.investor?.investment_details.investment}
                fallback={'Investment'}
              />
            {:else if item == 'tokens'}
              <TranslationText
                key={'profile/investor/invest-history/row/tokens'}
                text={profileTrs?.investor?.investment_details.tokens}
                fallback={'Tokens'}
              />
            {:else if item == 'price'}
              <TranslationText
                key={'profile/investor/invest-history/row/price'}
                text={profileTrs?.investor?.investment_details.price}
                fallback={'Price'}
              />
            {:else if item == 'description'}
              <TranslationText
                key={'profile/investor/invest-history/row/description'}
                text={null}
                fallback={'Description'}
              />
            {:else if item == 'tier'}
              <TranslationText
                key={'profile/investor/invest-history/row/tire'}
                text={profileTrs?.investor?.investment_details.tier}
                fallback={'Tier'}
              />
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
              ${data.quantity ?? '-'}
            {:else if item == 'tokens'}
              {data.amount ?? '-'}
            {:else if item == 'price'}
              ${data.bta_price ?? '-'}
            {:else if item == 'description'}
              {data.description ?? '-'}
            {:else if item == 'tier'}
              {#if data.tier != null && data.tier != 'NaN'}
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
                    {data.tier}
                  </p>

                </div>
              {:else}
                <p>
                  -
                </p>
              {/if}
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
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  // ▓ IMPORTANT
  // ▓ > Controlled By Parent

</style>
