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
  import { onMount } from 'svelte';

  import userBetarenaSettings from '$lib/store/user-settings.js';

  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';

  import type { PUBLIC__INVESTOR_IBonus } from '@betarena/scores-lib/types/_HASURA_.js';
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
  ;

  type IDataLayout = keyof PUBLIC__INVESTOR_IBonus | '' ;

  class Dev
  {
    mutated: boolean = false;
    noData: boolean = false;

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
      (
        profileData.investorData ??=
        {
          data:
          {
            bonus_summary:
            {
              referral_bonus: 50
              , referrals_number: 10
              , referred_bonus: 100
              , total_bonus: 500
            }
          }
        }
      );
      (
        profileData?.investorData?.data?.bonus_summary ??=
        {
          referral_bonus: 50
          , referrals_number: 10
          , referred_bonus: 100
          , total_bonus: 500
        }
      );

      profileData = profileData;

      checkNoData();

      return;
    }
  }

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-bonus⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;

  let
    /**
     * @description
     *  📣 Target `table` row order.
    */
    dataLayout: IDataLayout[]
    = [
      'referral_bonus'
      , 'referred_bonus'
      , 'referrals_number'
      , 'total_bonus'
    ]
    /**
     * @description
     *  📣 target `DEV` class instance.
    */
    , newDevInstance = new Dev()
    /**
     * @description
     *  📣 Wether `widget` contains `NoData` state.
    */
    , isNoData: boolean = false
  ;

  /**
   * @description
   *  📣 Available `translations`.
   */
  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

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
   *  📣 Validates data widget for respective `state`.
   * @return { void }
   */
  function checkNoData
  (
  ): void
  {
    isNoData = false;

    let
      /**
       * @description
       *  📣 counter of amount of invalid data points in data.
      */
      noDataCount: number = 0
    ;

    for (const item of dataLayout)
    {
      if ([null, undefined, 0].includes(profileData?.investorData?.data?.bonus_summary[item]))
        noDataCount++;
    }

    if (noDataCount == dataLayout.length) isNoData = true;

    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    async (
    ) =>
    {
      checkNoData();
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
  class:mutated={newDevInstance.mutated}
>

  <AdminDevControlPanelToggleButton
    title='Bonus Summary'
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
  ▓ > bonus summary widget title.
  -->
  <p
    class=
    "
    s-20
    w-500
    color-black-2
    m-b-20
    "
  >
    {
      profileTrs.investor?.referral.bonus.title
      ?? 'Bonus Summary'
    }
  </p>

  <!--
  ▓ NOTE:
  ▓ > bonus summary data.
  -->
  <div
    id="referral-bonus-box"
  >
    {#if !isNoData && !newDevInstance.noData}

      {#each dataLayout as item}

        <div
          class=
          "
          row-space-out
          <!---->
          bonus-row
          "
        >

          <p
            class=
            "
            s-14
            color-grey
              grey-v1
            "
          >
            {#if item == 'referral_bonus'}
              {
                profileTrs.investor?.referral.bonus.referral_bonus
                ?? 'Referral Bonus'
              }
            {:else if item == 'referrals_number'}
              {
                profileTrs.investor?.referral.bonus.ref_number
                ?? 'Referrals Number'
              }
            {:else if item == 'referred_bonus'}
              {
                profileTrs.investor?.referral.bonus.referred_bonus
                ?? 'Referred Bonus'
              }
            {:else if item == 'total_bonus'}
              {
                profileTrs.investor?.referral.bonus.total
                ?? 'Total Bonus'
              }
            {/if}
          </p>

          <p
            class=
            "
            s-14
            color-black-2
            "
          >
            {profileData?.investorData?.data?.bonus_summary[item] ?? 0}
            {#if item != 'referrals_number'}
              BTA
            {/if}
          </p>

        </div>

      {/each}

    {:else}

      <div
        id="no-widget-data"
      >
        <p
          class=
          "
          s-16
          color-black-3
            dark-v1
          "
          style=
          "
          line-height: 24px; /* 150% */
          "
        >
          {
            profileTrs.investor?.general.no_information
            ?? 'Uh-oh! No Investments have been found.'
          }
        </p>
      </div>

    {/if}
  </div>

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Bonus Summary'
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
          newDevInstance.noData = !newDevInstance.noData;
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

  div#profile⮕w⮕referral-bonus⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    height: 242px;
    min-height: 242px;
    max-height: 242px;

    div#referral-bonus-box
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      height: 160px;
      min-height: 160px;
      max-height: 160px;

      div.bonus-row
      {
        /* 🎨 style */
        padding: 10px 20px;
        border-radius: 4px;
        min-height: 40px;
        max-height: 40px;

        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: var(--whitev2);
        }
      }

      div#no-widget-data
      {
        /* 📌 position */
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 10;
        /* 🎨 style */
        background-color: var(--white);
        text-align: center;

        p
        {
          /* 📌 position */
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
          /* 🎨 style */
          height: fit-content;
          -ms-transform: translateY(-50%);
          width: 176px;
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-bonus⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 div#referral-bonus-box
    {
      div.bonus-row
      {
        &:nth-child(odd)
        {
          /* 🎨 style */
          background-color: rgba(75, 75, 75, 0.50) !important;
        }
      }

      div#no-widget-data
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1-4-shade) !important;
      }
    }
  }

</style>