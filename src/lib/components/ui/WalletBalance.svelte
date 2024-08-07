<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
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
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { spliceBalanceDoubleZero, toDecimalFix } from "$lib/utils/string.js";
  import Walleticon from "./assets/walleticon.svelte";

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

  $: ({ main_balance } = { ...$userBetarenaSettings.user?.scores_user_data });

  // #endregion ➤ 📌 VARIABLES
</script>

<a
  href="/u/transaction-history/{$userBetarenaSettings.lang}"
  title="View Transactions History"
>
  <div class="balance">
    <div class="icon">
      <Walleticon />
      <!-- <img src="/assets/images/icons/wallet.svg" alt="wallet" /> -->
    </div>
    <div class="info">
      <span class="amount">
        {spliceBalanceDoubleZero(toDecimalFix(main_balance)) ?? "0.00"} BTA
      </span>
      <span class="currency"
        >${spliceBalanceDoubleZero(toDecimalFix(main_balance)) ?? "0.00"}</span
      >
    </div>
  </div>
</a>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">
  .balance {
    display: flex;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    &:hover > .info .amount {
      color: var(--primary);
    }

    .icon {
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      background-color: rgb(49,49,49);

      --text-color: #FFFFFF
    }

    .info {
      display: flex;
      flex-direction: column;
      height: 34px;
      justify-content: space-between;

      .amount {
        font-size: 16px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-color);
        line-height: 20px;
      }

      .currency {
        line-height: 12px;
        font-size: 12px;
        font-weight: 400;
        color: var(--text-color-second-dark);
      }
    }
  }
</style>
