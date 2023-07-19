<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { toISOMod } from '$lib/utils/dates.js';

	import icon_arrow_down from './assets/arrow-down.svg';
	import icon_arrow_up from './assets/arrow-up.svg';
	import icon_deposit from './assets/tx-hist/deposit.svg';
	import icon_withdraw from './assets/tx-hist/withdraw.svg';

	import type { B_H_TH, B_H_TT_Field } from "@betarena/scores-lib/types/_HASURA_.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    tx_data: B_H_TH,
    mobileExclusive: boolean = false,
    txTranslation: B_H_TT_Field
  ;

  let
    txStatus: 'C' | 'P' | 'D',
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
      'amount': '',
      'quantity': 'quantity',
      'payment_processor_fee': 'fee'
    },
    walletAddrTrunc: string
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  $: if (tx_data?.status)
  {
		if (tx_data?.status?.toLowerCase() == 'completed') txStatus = 'C';
		if (['processing', 'pending'].includes(tx_data?.status?.toLowerCase())) txStatus = 'P';
		if (tx_data?.status?.toLowerCase() == 'denied')	txStatus = 'D';
	}

  $: if (tx_data?.type)
  {
		if (tx_data?.type?.toLowerCase() == 'deposit') txTypeIcon = icon_deposit;
		if (tx_data?.type?.toLowerCase() == 'withdraw') txTypeIcon = icon_withdraw;
  }

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
  class:extra-info={isTxExtraInfo && mobileExclusive}
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
    {#if mobileExclusive}
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
  {#if !mobileExclusive}

    <!--
    TX TYPE
    -->
    <td>
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
        {tx_data?.amount ?? '-'}
      </p>
    </td>

    <!--
    TX FEE
    -->
    <td>
      <p>
        {tx_data?.payment_processor_fee ?? '-'}
      </p>
    </td>

    <!--
    TX WALLET USED
    -->
    <td>
      <p>
        {tx_data?.wallet_address_erc20 ?? '-'}
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
        class:denied={txStatus == 'D'}
      >
        {tx_data?.status ?? '-'}
      </p>

      <!--
      📱 MOBILE
      -->
      {#if mobileExclusive}
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
  {#if isTxExtraInfo && mobileExclusive}

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
            {txTranslation?.[item[1]] ?? '-'}
          </p>
          <p
            class=
            "
            s-14
            color-black-2
            "
          >
            {['payment_processor_fee', 'amount'].includes(item[1]) ? '$' : ''}
            {tx_data?.[item[0]] ?? '-'}
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
    padding: 8px 0 8px 0;
    padding-right: 12px;
  }
  tr td:first-child
  {
    padding-left: 20px !important;
    border-radius: 4px 0 0 4px;
  }
  tr td:last-of-type
  {
    padding-right: 20px !important;
    border-radius: 0 4px 4px 0;
  }

  tr.extra-info
  {
    height: unset;
  }
  tr.extra-info td
  {
    padding-top: 12px;
    padding-bottom: 180px;
  }

  tr td p
  {
    color: var(--black-night, #FFF);
    white-space: nowrap;
    width: fit-content;
  }
  tr td p.tx-status-pill
  {
    width: fit-content;
    padding: 4px 12px;
    border-radius: 32px;
  }
  tr td p.tx-status-pill.completed
  {
    color: var(--status-green, #59C65D);
    background: rgba(89, 198, 93, 0.10);
  }
  tr td p.tx-status-pill.pending
  {
    color: var(--status-yellow, #FFB904);
    background: rgba(255, 185, 4, 0.10);
  }
  tr td p.tx-status-pill.denied
  {
    color: var(--status-red-night, #FF5959);
    background: rgba(255, 89, 89, 0.10);
  }

  tr div.tx-extra-info
  {
    padding: 0 20px;
    position: absolute;
    top: 56px;
    right: 0;
    left: 0;
    /*  */
    gap: 12px;
  }

</style>