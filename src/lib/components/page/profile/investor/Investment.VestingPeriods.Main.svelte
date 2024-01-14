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

  import userBetarenaSettings from '$lib/store/user-settings.js';

  import InvestmentVestingPeriodsRowChild from './Investment.VestingPeriodsRow.Child.svelte';

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
    CNAME: string = 'profile⮕w⮕vesting-period⮕main'
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
     *  📣 Target `table` header order.
    */
    tableHeader: string[]
    = [
      'period'
      , 'available'
      , 'tokens'
      , 'status'
      , 'wallet'
      , 'distribution'
      , 'claim'
    ]
  ;

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
   *  📣 Updates layout of vesting periods, dependent on device `resize`.
   * @return { void }
   */
  function updateTableLayout
  (
  ): void
  {
    if (VIEWPORT_MOBILE_INIT_PARENT[1])
      tableHeader = [ 'period', 'available', '' ];
    else if (VIEWPORT_TABLET_INIT_PARENT[1])
      tableHeader = [ 'period' , 'available' , 'tokens' , 'status' , 'wallet', '' ];
    else
      tableHeader = [ 'period' , 'available' , 'tokens' , 'status' , 'wallet' , 'distribution' , 'claim', '' ];
    return;
  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and/or reactively for 'this' .svelte file is ran.          │
  // │ WARNING:                                                               │
  // │ ❗️ Can go out of control.                                              │
  // │ (a.k.a cause infinite loops and/or cause bottlenecks).                 │
  // │ Please keep very close attention to these methods and                  │
  // │ use them carefully.                                                    │
  // ╰────────────────────────────────────────────────────────────────────────╯

  $: if (VIEWPORT_MOBILE_INIT_PARENT || VIEWPORT_TABLET_INIT_PARENT)
    updateTableLayout()

    // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
>

  <!--
  ▓ NOTE:
  ▓ > vesting period widget title.
  -->
  <p
    id="widget-title"
    class=
    "
    s-20
    w-500
    color-black-2
    "
  >
    Vesting Periods
  </p>

  <!--
  ▓ NOTE:
  ▓ > vesting period list table.
  -->
  <div
    id="table-box"
  >

    <!--
    ▓ NOTE:
    ▓ > vesting periods.
    -->
    <table>

      <!--
      ▓ NOTE:
      ▓ > (header-row) tier pricing table.
      -->
      <thead>
        <tr>
          {#each tableHeader as item}
            <th>
              <p
                class=
                "
                s-12
                color-grey
                "
              >
                {item}
              </p>
            </th>
          {/each}
        </tr>
      </thead>

      <!--
      ▓ NOTE:
      ▓ > (row) tier pricing table.
      -->
      <tbody>
        {#each profileData?.investorData?.data?.vesting_periods ?? [] as item}
          <InvestmentVestingPeriodsRowChild
            data={item}
            {VIEWPORT_MOBILE_INIT_PARENT}
            {VIEWPORT_TABLET_INIT_PARENT}
          />
        {:else}
          <p
            class=
            "
            s-20
            color-black-2
            "
          >
            Uh-oh! No Vesting Periods have been found.
          </p>
        {/each}
      </tbody>

    </table>

  </div>

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

  @import '../../../../../../static/app.scss';

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕vesting-period⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);

    p#widget-title
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div#table-box
    {
      /* 🎨 style */
      position: relative;
      min-height: 258px;
      max-height: 258px;
      overflow-y: scroll;
      padding-top: 20px;

      &::-webkit-scrollbar
      {
        /* Hide scrollbar for Chrome, Safari and Opera */
        display: none;
      }
      &::-webkit-scrollbar
      {
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      table
      {
        /* 🎨 style */
        text-align: left;
        border-collapse: collapse;
        width: -webkit-fill-available;
        width: -moz-available;

        thead
        {
          tr
          {
            /* 🎨 style */
            background-color: var(--whitev2);
            max-height: 24px;
            height: 24px;
            min-height: 24px;

            th
            {
              /* 🛝 layout */
              width: fit-content;
              /* 🎨 style */
              white-space: nowrap;
              padding: 3px 0 3px 0;
              padding-right: 12px;

              &:first-child
              {
                /* 🎨 style */
                padding-left: 20px;
                border-radius: 2px 0 0 2px;
              }

              &:last-child
              {
                /* 🎨 style */
                padding-right: 20px;
                border-radius: 0 2px 2px 0;
              }
            }
          }
        }

        tbody
        {
          // IMPORTANT
          :global
          {
            tr
            {
              /* 🎨 style */
              position: relative;
              position: -webkit-sticky;
              max-height: 56px;
              height: 56px;
              min-height: 56px;

              &.extra-info
              {
                /* 🎨 style */
                height: unset;

                td
                {
                  /* 🎨 style */
                  // padding-top: 8px;
                  padding-bottom: 160px;
                }
              }

              td
              {
                /* 🎨 style */
                padding: 10px 0 10px 0;
                padding-right: 12px;

                &:first-child
                {
                  /* 🎨 style */
                  padding-left: 20px !important;
                  border-radius: 4px 0 0 4px;
                }
                &:last-of-type
                {
                  /* 🎨 style */
                  padding-right: 20px !important;
                  border-radius: 0 4px 4px 0;
                }

                p
                {
                  @extend .s-14;
                  @extend .color-black-2;
                }

                p.status-pill
                {
                  /* 🛝 layout */
                  width: fit-content;
                  /* 🎨 style */
                  padding: 4px 12px;
                  border-radius: 32px;

                  .completed
                  {
                    /* 🎨 style */
                    color: var(--status-green, #59C65D) !important;
                    background: rgba(89, 198, 93, 0.10);
                  }
                  .pending
                  {
                    /* 🎨 style */
                    color: var(--status-yellow, #FFB904) !important;
                    background: rgba(255, 185, 4, 0.10);
                  }
                  .failed
                  {
                    /* 🎨 style */
                    color: var(--status-red-night, #FF5959) !important;
                    background: rgba(255, 89, 89, 0.10);
                  }
                }

                button.btn-primary-v2
                {
                  /* 🎨 style */
                  height: 36px;
                  width: 96px;
                }
              }

              &:nth-child(even):not(.extra-info-row)
              {
                /* 🎨 style */
                background-color: var(--whitev2);

                ~ tr.extra-info-row
                {
                  /* 🎨 style */
                  background-color: var(--whitev2);
                }
              }

              div.extra-information
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
            }
          }
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕vesting-period⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 thead
    {
      tr
      {
        /* 🎨 style */
        background-color: rgba(75, 75, 75, 0.50) !important;
      }
    }

    &.dark-background-1 tbody
    {
      // IMPORTANT
      :global
      {
        tr
        {
          &:nth-child(even):not(.extra-info-row)
          {
            /* 🎨 style */
            background-color: rgba(75, 75, 75, 0.50) !important;

            ~ tr.extra-info-row
            {
              /* 🎨 style */
              background-color: rgba(75, 75, 75, 0.50) !important;
            }
          }
        }
      }
    }
  }

</style>
