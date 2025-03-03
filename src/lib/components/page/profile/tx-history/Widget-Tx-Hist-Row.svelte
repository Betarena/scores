<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { toISOMod } from '$lib/utils/dates.js';
  import { toDecimalFix } from '$lib/utils/string.js';

	import icon_arrow_down from '../assets/arrow-down.svg';
	import icon_arrow_up from '../assets/arrow-up.svg';
	import icon_deposit from '../assets/tx-hist/deposit.svg';
	import icon_withdraw from '../assets/tx-hist/withdraw.svg';

	import type { B_H_TH, B_H_TH_Type, B_H_TT_Field, B_H_TT_Status } from "@betarena/scores-lib/types/_HASURA_.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    tx_data: B_H_TH,
    isViewMobile: boolean = false,
    isViewTablet: boolean = false,
    txTranslation: B_H_TT_Field,
    txStatusTrans: B_H_TT_Status
  ;

  let
    txStatus: 'C' | 'P' | 'F' | 'R',
    txStatusTranslation: string,
    txTypeIcon: string,
    isTxExtraInfo: boolean,
    txExtraInfoStruct =
    {
      'type': 'type',
      // FIXME: missing 'description' from 'translation'
      'description': '',
      'asset': 'asset',
      'Gateway': 'gateway',
      // FIXME: missing 'amount' from 'translation'
      'quantity': 'quantity',
      'amount': 'bta',
      'payment_processor_fee': 'fee'
    },
    walletAddrTrunc: string
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  /**
   * @description
   * TODO: DOC:
   */
  $: if (tx_data?.status)
  {
    // NOTE:
    // Identify Tx-Type.
		if (tx_data?.status?.toLowerCase() == 'completed') txStatus = 'C';
		if (['processing', 'pending'].includes(tx_data?.status?.toLowerCase())) txStatus = 'P';
		if (tx_data?.status?.toLowerCase() == 'failed' || tx_data?.status?.toLowerCase() == 'canceled')	txStatus = 'F';
		if (tx_data?.status?.toLowerCase() == 'refunded') txStatus = 'R';

    // NOTE:
    // Identify Tx-Translation.
		if (tx_data?.status?.toLowerCase() == 'completed')
      txStatusTranslation = txStatusTrans?.complete;
    ;
    if (['processing', 'pending'].includes(tx_data?.status?.toLowerCase()))
      txStatusTranslation = txStatusTrans?.pending;
    ;
		if (tx_data?.status?.toLowerCase() == 'failed')
      txStatusTranslation = txStatusTrans?.failed;
    ;
    if (tx_data?.status?.toLowerCase() == 'refunded')
      txStatusTranslation = txStatusTrans?.refunded;
    ;
    if (tx_data?.status?.toLowerCase() == 'canceled')
      txStatusTranslation = txStatusTrans?.canceled;
    ;
	}

  /**
   * @description
   * TODO: DOC:
   */
  $: if (tx_data?.type)
  {
		if ((['deposit', 'investment'] as B_H_TH_Type[]).includes(tx_data?.type)) txTypeIcon = icon_deposit;
		if ((['Withdraw', 'tge', 'vesting'] as B_H_TH_Type[]).includes(tx_data?.type)) txTypeIcon = icon_withdraw;
  }

  /**
   * @description
   * TODO: DOC:
   */
  $: if (tx_data?.wallet_address_erc20)
  {
    const f3char: string = tx_data?.wallet_address_erc20
    ?.substring
    (
      0,
      6
    );

    const l3char: string = tx_data?.wallet_address_erc20
    ?.slice
    (
      -4
    );

    walletAddrTrunc = `${f3char}...${l3char}`;
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<tr
  class:extra-info={isTxExtraInfo && isViewMobile}
  on:click={() => isTxExtraInfo = !isTxExtraInfo}
>

  <!--
  TX ID
  -->
  <td>
    <p
      class=
      "
      w-500
      "
    >
      {tx_data?.id ?? '-'}
    </p>
  </td>

  <!--
  📱 MOBILE
  TX DATE
  -->
  <td>
    <p
      class=
      "
      s-14
      "
    >
      {toISOMod(tx_data?.date) ?? '-'}
    </p>
    <!--
    📱 MOBILE
    -->
    {#if isViewMobile || isViewTablet}
      <p
        class=
        "
        s-12
        color-grey
        "
      >
        {walletAddrTrunc ?? '-'}
      </p>
    {/if}
  </td>

  <!--
  🖥️ LAPTOP
  -->
  {#if !isViewMobile && !isViewTablet}

    <!--
    TX TYPE
    -->
    <td>
      <div
        class=
        "
        column-start-grid-start
        "
      >
        <div
          class=
          "
          row-space-start
          "
        >
          <img
            src={txTypeIcon}
            alt="{tx_data?.type}_icon"
            class=
            "
            m-r-6
            "
          />
          <p>
            {tx_data?.type ?? '-'}
          </p>
        </div>
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          {tx_data?.description ?? '-'}
        </p>
      </div>
    </td>

    <!--
    TX ASSET USED
    -->
    <td>
      <p>
        {tx_data?.asset ?? '-'}
      </p>
    </td>

    <!--
    TX GATEWAY USED
    -->
    <td>
      <p>
        {tx_data?.Gateway ?? '-'}
      </p>
    </td>

    <!--
    TX QUANTITY (BTA)
    -->
    <td>
      <p>
        ${tx_data?.quantity}
      </p>
    </td>

    <!--
    TX AMOUNT (of asset)
    -->
    <td>
      <p>
        {toDecimalFix(tx_data?.amount ?? 0, 2, false, false)}
      </p>
    </td>

    <!--
    TX FEE
    -->
    <td>
      <p>
        ${tx_data?.payment_processor_fee ?? '-'}
      </p>
    </td>

    <!--
    TX WALLET USED
    -->
    <td>
      <p>
        {walletAddrTrunc ?? '-'}
      </p>
    </td>

  {/if}

  <!--
  💻 TABLET
  -->
  {#if !isViewMobile && isViewTablet}

    <!--
    TX TYPE
    -->
    <td>
      <div
        class=
        "
        column-space-start-grid
        "
      >
        <div
          class=
          "
          row-space-start
          "
        >
          <img
            src={txTypeIcon}
            alt="{tx_data?.type}_icon"
            class=
            "
            m-r-6
            "
          />
          <p>
            {tx_data?.type ?? '-'}
          </p>
        </div>
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          {tx_data?.description ?? '-'}
        </p>
      </div>
    </td>

    <!--
    TX ASSET USED
    -->
    <td>
      <div
        class=
        "
        column-space-start-grid
        "
      >
        <p>
          {tx_data?.asset ?? '-'}
        </p>
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          {tx_data?.Gateway ?? '-'}
        </p>
      </div>
    </td>

    <!--
    TX QUANTITY (BTA)
    -->
    <td>
      <div
        class=
        "
        column-space-start-grid
        "
      >
        <p>
          ${tx_data?.quantity ?? '-'}
        </p>
        <p
          class=
          "
          s-12
          color-grey
          "
        >
          {toDecimalFix(tx_data?.amount ?? 0, 2, false, false)} BTA
        </p>
      </div>
    </td>

    <!--
    TX FEE
    -->
    <td>
      <p>
        ${tx_data?.payment_processor_fee ?? '-'}
      </p>
    </td>

  {/if}

  <!--
  TX STATUS
  -->
  <td>
    <div
      class=
      "
      row-space-end
      "
    >
      <p
        class=
        "
        tx-status-pill
        "
        class:completed={txStatus == 'C'}
        class:pending={txStatus == 'P'}
        class:failed={txStatus == 'F'}
        class:refunded={txStatus == 'R'}
        class:color-grey={txStatus == 'R'}
      >
        {txStatusTranslation ?? '-'}
      </p>

      <!--
      📱 MOBILE
      -->
      {#if isViewMobile}
        <img
          src={isTxExtraInfo ? icon_arrow_up : icon_arrow_down}
          alt={isTxExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
          class=
          "
          m-l-8
          "
        />
      {/if}

    </div>
  </td>

  <!--
  📱 MOBILE
  EXTRA TX INFO
  -->
  {#if isTxExtraInfo && isViewMobile}

    <div
      class=
      "
      column-start-grid-start
      tx-extra-info
      "
    >
      {#each Object.entries(txExtraInfoStruct) as item}
        <div
          class=
          "
          row-space-out
          "
        >
          <p
            class=
            "
            s-14
            color-grey
            "
          >
            {txTranslation?.[item[1]] ?? item[0]}
          </p>
          <p
            class=
            "
            s-14
            color-black-2
            "
          >
            {['payment_processor_fee', 'quantity'].includes(item[0]) ? '$' : ''}{tx_data?.[item[0]] ?? '-'}
          </p>
        </div>
      {/each}
    </div>

  {/if}

</tr>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  tr
  {
    position: relative;
    position: -webkit-sticky;
    max-height: 56px;
    height: 56px;
    min-height: 56px;
  }
  tr td
  {
    /* 🎨 style */
    padding: 8px 0 8px 0;
    padding-right: 12px;
  }
  tr td:first-child
  {
    /* 🎨 style */
    padding-left: 20px !important;
    border-radius: 4px 0 0 4px;
  }
  tr td:last-of-type
  {
    /* 🎨 style */
    padding-right: 20px !important;
    border-radius: 0 4px 4px 0;
  }

  tr.extra-info
  {
    /* 🎨 style */
    height: unset;
  }
  tr.extra-info td
  {
    /* 🎨 style */
    padding-top: 8px;
    padding-bottom: 250px;
  }

  tr td p
  {
    /* 🛝 layout */
    width: fit-content;
    white-space: nowrap;
    /* 🎨 style */
    color: var(--dark-theme);
  }
  tr td p.tx-status-pill
  {
    /* 🛝 layout */
    width: fit-content;
    /* 🎨 style */
    padding: 4px 12px;
    border-radius: 32px;
  }
  tr td p.tx-status-pill.completed
  {
    /* 🎨 style */
    color: var(--status-green, #59C65D) !important;
    background: rgba(89, 198, 93, 0.10);
  }
  tr td p.tx-status-pill.pending
  {
    /* 🎨 style */
    color: var(--status-yellow, #FFB904) !important;
    background: rgba(255, 185, 4, 0.10);
  }
  tr td p.tx-status-pill.failed
  {
    /* 🎨 style */
    color: var(--status-red-night, #FF5959) !important;
    background: rgba(255, 89, 89, 0.10);
  }
  tr td p.tx-status-pill.refunded
  {
    /* 🎨 style */
		background-color: var(--dark-theme-1-shade) !important;
  }

  tr div.tx-extra-info
  {
    /* 🎨 style */
    padding: 0 20px;
    position: absolute;
    top: 56px;
    right: 0;
    left: 0;
    /*  */
    gap: 12px;
  }

</style>