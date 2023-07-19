<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { toISOMod } from '$lib/utils/dates.js';

	import icon_deposit from './assets/tx-hist/deposit.svg';
	import icon_withdraw from './assets/tx-hist/withdraw.svg';

	import type { B_H_TH } from "@betarena/scores-lib/types/_HASURA_.js";

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  export let
    tx_data: B_H_TH
  ;

  let
    txStatus: 'C' | 'P' | 'D',
    txTypeIcon: string
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

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: use (CTRL+SPACE) to select a (class) (id) style
=================-->

<tr>

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
  TX DATE
  -->
  <td>
    <p>
      {toISOMod(tx_data?.date) ?? '-'}
    </p>
  </td>

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

  <!--
  TX STATUS
  -->
  <td>
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
  </td>

</tr>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  tr
  {
    max-height: 56px;
    height: 56px;
    min-height: 56px;
  }
  td
  {
    padding: 8px 0 8px 0;
    padding-right: 40px;
  }
  td:first-child
  {
    padding-left: 12px;
    border-radius: 4px 0 0 4px;
  }
  td:last-child
  {
    padding-right: 12px;
    border-radius: 0 4px 4px 0;
  }

  td p
  {
    white-space: nowrap;
    width: fit-content;
  }
  td p.tx-status-pill
  {
    width: fit-content;
    padding: 4px 12px;
    border-radius: 32px;
  }
  td p.tx-status-pill.completed
  {
    color: var(--status-green, #59C65D);
    background: rgba(89, 198, 93, 0.10);
  }
  td p.tx-status-pill.pending
  {
    color: var(--status-yellow, #FFB904);
    background: rgba(255, 185, 4, 0.10);
  }
  td p.tx-status-pill.denied
  {
    color: var(--status-red-night, #FF5959);
    background: rgba(255, 89, 89, 0.10);
  }

</style>