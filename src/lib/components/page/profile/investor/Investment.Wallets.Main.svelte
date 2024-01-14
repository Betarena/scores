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

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { copyToClipboard } from '$lib/utils/platform-functions.js';

  import WalletsModal from './Investment.Wallets.Modal.svelte';

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
    /**
     * @augments IProfileData
     */
    profileData: IProfileData | null
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
    CNAME: string = 'profile⮕w⮕investment-wallets⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = VIEWPORT_MOBILE_INIT_PARENT
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = VIEWPORT_TABLET_INIT_PARENT
  ;

  let
    /**
     * @description
     *  📣 Target **unique** wallets used in `investments` by _this_ user.
    */
    userWallets = new Set
    (
      profileData?.tx_hist
        ?.filter(x => {return x.type == 'vesting' && x.wallet_address_erc20 != null})
        ?.map(x => {return x.wallet_address_erc20 ?? ''})!
    )
  ;

  // #endregion ➤ 📌 VARIABLES

</script>

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
  class:row-space-out={!VIEWPORT_MOBILE_INIT_PARENT[1]}
  class:column-space-center={VIEWPORT_MOBILE_INIT_PARENT[1]}
>
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
      Investor Wallet Address
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
      bold
      cursor-pointer
      "
      on:click={() => {return $sessionStore.showInvstementWallets = true}}
    >
      View All
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
      class=
      "
      s-14
      color-grey
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
      bold
      cursor-pointer
      "
      on:click={() => { copyToClipboard(userWallets[0]); return; }}
    >
      Copy
    </p>

  </div>

  <!--
  ▓ NOTE:
  ▓ > investment detail wallet modal.
  -->
  {#if $sessionStore.showInvstementWallets}
    <WalletsModal
      walletAddressList={userWallets}
    />
  {/if}

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

  div#profile⮕w⮕investment-wallets⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
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
