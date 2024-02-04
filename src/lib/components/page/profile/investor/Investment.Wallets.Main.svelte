<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component JS/TS                                                           │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | Access snippets for '<script> [..] </script>' those found in           │
|         | '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
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

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { copyToClipboard } from '$lib/utils/platform-functions.js';

  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import WalletsModal from './Investment.Wallets.Modal.svelte';

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
     *  📣 makes use of parent 📱 MOBILE viewport state.
    */
    , VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣 makes use of parent 💻 TABLET viewport state.
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
  ;

  class Dev
  {
    mutated: boolean = false;
    noData: boolean = false;
    sampleData: string[] = [
      '0xb794f5ea0ba39494ce839613fffba74279579268'
      , '0xb12134f5ea0ba39494ce839613fffba742795792'
      , '0xb42310ba39494ce839613fffba74279579264234'
      , '0xb42342523423423529613fffba74279579124125'
    ];

    /**
     * @description
     */
    toggleNoData
    (
    ): void
    {
      return;
    }

    /**
     * @author
     *  @migbash
     * @summary
     *  🟦 HELPER
     * @description
     *  📣 Infinite inject sample data to widget for testing.
     * @return { void }
    */
    addSampleData
    (
    ): void
    {
      userWallets.push
      (
        ...this.sampleData
      );

      userWallets = userWallets;

      return;
    }
  }

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investment-wallets⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = VIEWPORT_MOBILE_INIT_PARENT
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = VIEWPORT_TABLET_INIT_PARENT
  ;

  let
    /**
     * @description
     *  📣 Target **unique** wallets used in `investments` by _this_ user.
    */
    userWallets: string[]
    = [
      ...new Set
      (
        profileData?.tx_hist
          ?.filter(x => { return x.type == 'vesting' && x.wallet_address_erc20 != null })
          ?.map(x => { return x.wallet_address_erc20 ?? '' })!
      )
    ]
    /**
     * @description
     *  📣 target `DEV` class instance.
    */
    , newDevInstance = new Dev()
  ;

  /**
   * @description
   *  📣 Available `translations`.
   */
  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // ▓ [🐞]
  // ▓ > validate for missing user not having any associated investment wallets.
  // userWallets = [];

  // #endregion ➤ 📌 VARIABLES

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    |
│         │ imported from './static/app.css'                                       |
│ ➤ HINT: | access custom Betarena Scores VScode Snippets by typing emmet-like     |
|         | abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
▓ NOTE:
▓ > (widget) main
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  class:row-space-out={!VIEWPORT_MOBILE_INIT_PARENT[1]}
  class:column-space-center={VIEWPORT_MOBILE_INIT_PARENT[1]}
  class:mutated={newDevInstance.mutated}
>
  <AdminDevControlPanelToggleButton
    title='Investor Wallet Address'
    mutated={newDevInstance.mutated}
    on:reset=
    {
      () =>
      {
        newDevInstance.mutated = false;
        newDevInstance.noData = false;
        return;
      }
    }
  />

  <!--
  ▓ NOTE:
  ▓ > (text) 1st column.
  -->
  <div
    class=
    "
    {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'row-space-out m-b-20' : 'row-space-start'}
    "
  >

    <!--
    ▓ NOTE:
    ▓ > (text) widget title.
    -->
    <p
      class=
      "
      s-14
      color-black-2
      m-r-20
      "
    >
      {
        profileTrs.investor?.wallets.title
        ?? 'Investor Wallet Address'
      }
    </p>

    <!--
    ▓ NOTE:
    ▓ > (text) view all.
    -->
    <p
      class=
      "
      s-14
      color-black-2
      underline
      w-500
      cursor-pointer
      hover-color-primary
      "
      on:click=
      {
        () =>
        {
          $sessionStore.currentActiveModal = 'ProfileInvestor_Wallets_Modal';
          return;
        }
      }
    >
      {#if
        userWallets.length > 0
        && !newDevInstance.noData
      }
        {
          profileTrs.investor?.wallets.view
          ?? 'View All'
        }
      {/if}
    </p>

  </div>

  <!--
  ▓ NOTE:
  ▓ > (text) 2nd column.
  -->
  <div
    class=
    "
    {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'row-space-out' : 'row-space-end'}
    "
  >

    <!--
    ▓ NOTE:
    ▓ > (text) last wallet address used.
    -->
    <p
      id="first-wallet"
      class=
      "
      s-14
      color-grey
        dark-white-v1
      m-r-40
      "
    >
      {userWallets[0] ?? '-'}
    </p>

    <!--
    ▓ NOTE:
    ▓ > (text) copy.
    -->
    <p
      class=
      "
      s-14
      color-black-2
      underline
      w-500
      cursor-pointer
      hover-color-primary
      "
      on:click={() => { copyToClipboard(userWallets[0]); return; }}
    >
      {
        profileTrs.investor?.wallets.copy
        ?? 'Copy'
      }
    </p>

  </div>

  <!--
  ▓ NOTE:
  ▓ > investment detail wallet modal.
  -->
  {#if
    $sessionStore.currentActiveModal == 'ProfileInvestor_Wallets_Modal'
    && userWallets.length > 0
    && !newDevInstance.noData
  }
    <WalletsModal
      walletAddressList={userWallets}
    />
  {/if}

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Investor Wallet Address'
>

  <!--
  ▓ NOTE:
  ▓ > (no data) widget state.
  -->
  <div
    class=
    "
    row-space-out
    "
  >
    <!--
    ▓ NOTE:
    ▓ > (no data state) text.
    -->
    <p
      class=
      "
      s-14
      color-black
      "
    >
      <b>[1]</b> Toggle <b>No Data State</b>
    </p>

    <!--
    ▓ NOTE:
    ▓ > (no data state) button.
    -->
    <button
      class=
      "
      dev-toggle
      "
      on:click=
      {
        () =>
        {
          newDevInstance.noData = !newDevInstance.noData
          newDevInstance.mutated = true;
          return;
        }
      }
      class:on={newDevInstance.noData}
      class:off={!newDevInstance.noData}
    >
      {#if newDevInstance.noData}
        ON
      {:else}
        OFF
      {/if}
    </button>
  </div>

  <!--
  ▓ NOTE:
  ▓ > (add sample data) widget.
  -->
  <div
    class=
    "
    row-space-out
    "
  >
    <!--
    ▓ NOTE:
    ▓ > (no data state) text.
    -->
    <p
      class=
      "
      s-14
      color-black
      "
    >
      <b>[2]</b> Add <b>Sample Data</b>
    </p>

    <!--
    ▓ NOTE:
    ▓ > (no data state) button.
    -->
    <button
      class=
      "
      dev-toggle
      "
      on:click=
      {
        () =>
        {
          newDevInstance.addSampleData();
          newDevInstance.mutated = true;
          return;
        }
      }
    >
      TOGGLE
    </button>
  </div>

</AdminDevControlPanel>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: | auto-fill/auto-complete iniside <style> for var()                      │
|         | values by typing/CTRL+SPACE                                            │
│ ➤ HINT: | access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investment-wallets⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;

    p#first-wallet
    {
      /* 🎨 style */
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 85%;
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investment-wallets⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }
  }

</style>
