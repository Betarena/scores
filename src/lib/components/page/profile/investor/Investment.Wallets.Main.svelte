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
	import { copyToClipboard } from '$lib/utils/miscellenous.js';
	import { investWalletSampleData } from './_sample.js';
	import { scoresProfileInvestorStore } from './_store.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
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
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investment-wallets⮕main'
  ;

  let
    /**
     * @description
     *  📣 Target **unique** wallets used in `investments` by _this_ user.
     */
    userWallets: string[] = profileData?.investorData?.data?.investor_wallets ?? []
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ adminOverrides, walletsStateWidget } = $scoresProfileInvestorStore);

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
  class:row-space-out={!VIEWPORT_MOBILE_INIT[1]}
  class:column-space-center={VIEWPORT_MOBILE_INIT[1]}
  class:mutated={adminOverrides.has('Wallets')}
>
  <AdminDevControlPanelToggleButton
    title='Investor Wallet Address'
    mutated={adminOverrides.has('Wallets')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'Wallets'
          , 'remove'
        );
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
    {VIEWPORT_MOBILE_INIT[1] ? 'row-space-out m-b-20' : 'row-space-start'}
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
      <TranslationText
        key={`${CNAME}/title`}
        text={profileTrs?.investor?.wallets.title}
        fallback={'Investor Wallet Address'}
      />
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
        && walletsStateWidget != 'NoData'
      }
        <TranslationText
          key={`${CNAME}/title`}
          text={profileTrs?.investor?.wallets.view}
          fallback={'View All'}
        />
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
    {VIEWPORT_MOBILE_INIT[1] ? 'row-space-out' : 'row-space-end'}
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
      <TranslationText
        key={`${CNAME}/title`}
        text={profileTrs?.investor?.wallets.copy}
        fallback={'Copy'}
      />
    </p>

  </div>

  <!--
  ▓ NOTE:
  ▓ > investment detail wallet modal.
  -->
  {#if
    $sessionStore.currentActiveModal == 'ProfileInvestor_Wallets_Modal'
    && userWallets.length > 0
    && walletsStateWidget != 'NoData'
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
          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'Wallets'
            , 'set'
          );
          if (walletsStateWidget == 'NoData')
            $scoresProfileInvestorStore.walletsStateWidget = 'NoData';
          else
            $scoresProfileInvestorStore.walletsStateWidget = 'Standard';
          return;
        }
      }
      class:on={walletsStateWidget == 'NoData'}
      class:off={walletsStateWidget != 'NoData'}
    >
      {#if walletsStateWidget == 'NoData'}
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
          userWallets.push
          (
            ...investWalletSampleData
          );

          userWallets = userWallets;

          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'InvestmentHistory'
            , 'set'
          );

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
