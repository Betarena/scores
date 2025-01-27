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

  import { spliceBalanceDoubleZero, toDecimalFix } from "$lib/utils/string";
  import { translationObject } from "$lib/utils/translation";
  import sessionStore from "$lib/store/session.js";
  import userBetarenaSettings from "$lib/store/user-settings.js";
  import { page } from "$app/stores";
  import type { B_NAV_T } from "@betarena/scores-lib/types/navbar.js";
  import BuyBtaButton from "$lib/components/shared/BuyBta/Buy-BTA-Button.svelte";

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
  $: isMobile = $sessionStore.viewportType === "mobile";
  $: translationData = $page.data.B_NAV_T as B_NAV_T | null | undefined;
  $: ({ main_balance } = { ...$userBetarenaSettings.user?.scores_user_data });
  // #endregion ➤ 📌 VARIABLES
</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->
<div class="balance-wrapper">
  <a
    href="/u/transaction-history/{$userBetarenaSettings.lang}"
    title="View Transactions History"
  >
    <div
      id="balance-box"
      class="
    dropdown-opt-box
    row-space-start
    "
    >
      <div>
        <!--
      📱 MOBILE
      Balance Title
      -->
        <p
          class="
          color-grey
          s-12
          no-wrap
          "
        >
          {translationData?.scores_header_translations?.data?.balance ??
            translationObject.balance}
        </p>

        <p
          class="
        color-white
        s-14
        no-wrap
        "
        >
          <span
            class="
          color-primary
          w-500
          m-r-5
          "
          >
            {spliceBalanceDoubleZero(toDecimalFix(main_balance)) ?? "0.00"} BTA
          </span>

        </p>
      </div>
    </div>
  </a>

  <!--
╭─────
│ > But Betarena Token (navigation)
╰─────
-->
  <div>
    <BuyBtaButton popup={true} />
  </div>
</div>

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
  .balance-wrapper {
    display: flex;
    align-items: center;
    gap: 56px;
    border-left: 1px solid #4b4b4b;
    height: 44px;
    padding: 0 16px;
    padding-right: 0;
    width: fit-content;
  }
  div#balance-box {
    cursor: pointer;
  }
</style>
