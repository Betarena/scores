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
  import { viewport_change } from '$lib/utils/platform-functions.js';
  import { Misc } from '@betarena/scores-lib/dist/classes/class.misc.js';

  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import InvestmentHistoryRowChild from './Investment.HistoryRow.Child.svelte';

  import type { B_H_KEYP, B_H_KEYP_Tier, B_H_TH } from '@betarena/scores-lib/types/_HASURA_.js';
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

  /**
   * @description
   *  📣 available data points.
   */
  type IRowLayout = 'date' | 'type' | 'tier' | 'discount' | 'investment' | 'tokens' | 'price' | '';

  class Dev
  {
    mutated: boolean = false;
    noData: boolean = false;
    sampleData: B_H_TH[] = [
      {
        Gateway: null
        , amount: 1800
        , asset: 'BTA'
        , bic_swift: null
        , bta_price: null
        , date: '2024-01-11T02:17:33.735582+00:00'
        , deposit_wallet_address: null
        , description: 'Vesting Period Claim'
        , extra: { vestingId: 1 }
        , first_name: null
        , iban: null
        , id: 130
        , last_name: null
        , payment_email: null
        , payment_processor_fee: null
        , platform_fee: null
        , quantity: 2500
        , referral: null
        , status: 'pending'
        , tier: 'bronze'
        , type: 'investment'
        , uid: 'n65vqAoIH3b7lsU4zroxjHk0SSp2'
        , wallet_address_erc20: null
        , withdraw_wallet_address: null
      }
      , {
        status: 'pending'
        , type: 'investment'
        , amount: 50
      }
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
     * @description
    */
    addSampleData
    (
    ): void
    {
      (profileData?.tx_hist ??= []);

      profileData?.tx_hist?.push
      (
        ...this.sampleData
      );

      profileData = profileData;

      return;
    }
  }

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investment-detail⮕main'
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
     *  📣 convert target `data` to respective `map`.
    */
    dataMap: Map < B_H_KEYP_Tier, B_H_KEYP > = new Misc().convertToMapKEYPINVSTTIER
    (
      (profileData?.investorTierPricing?.sort((a, b) => {return b.data?.position - a.data?.position}) ?? [])
    )
    /**
     * @description
     *  📣 Target `table` header order.
    */
    , tableHeader: IRowLayout[]
    = [
      'date'
      , 'type'
      , 'tier'
      , 'discount'
      , 'investment'
      , 'tokens'
      , 'price'
    ]
    /**
     * @description
     *  📣
    */
    , newDevInstance = new Dev()
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
   *  🟥 COMPONENT MAIN
   * @description
   *  📣 Update variables for viewport state.
   * @return { void }
   */
  function resizeCustom
  (
  ): void
  {
    [
      VIEWPORT_TABLET_INIT[1],
      VIEWPORT_MOBILE_INIT[1]
    ] = viewport_change
    (
      VIEWPORT_TABLET_INIT[0],
      VIEWPORT_MOBILE_INIT[0]
    );
    updateTableLayout();
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Updates layout of tier pricings, dependent on device `resize`.
   * @return { void }
   */
  function updateTableLayout
  (
  ): void
  {
    if (VIEWPORT_MOBILE_INIT[1])
      tableHeader = [ 'date', 'type', 'tier', '' ]
    else
      tableHeader = [ 'date', 'type', 'tier', 'discount', 'investment', 'tokens', 'price' ]
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
    ): Promise < void > =>
    {
      resizeCustom();
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<svelte:window
  on:resize=
  {
    () => { return resizeCustom() }
  }
/>

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
    title='Investment Details'
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
  ▓ > investment detail widget title.
  -->
  <p
    id="widget-title"
    class=
    "
    s-20
    w-500
    color-black-2
    m-b-20
    "
  >
    {
      profileTrs.investor?.investment_details.widget_title
      ?? 'Investment Details'
    }
  </p>

  <!--
  ▓ NOTE:
  ▓ > investment transaction list table.
  -->
  <div
    id="table-box"
  >
    <table>

      <!--
      ▓ NOTE:
      ▓ > (header-row) transaction.
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
                  dark-v1
                capitalize
                "
              >
                {#if item == 'date'}
                  {
                    profileTrs.investor?.investment_details.date
                    ?? 'Date'
                  }
                {:else if item == 'type'}
                  {
                    profileTrs.investor?.investment_details.type
                    ?? 'Available'
                  }
                {:else if item == 'tier'}
                  {
                    profileTrs.investor?.investment_details.tier
                    ?? 'Tier'
                  }
                {:else if item == 'discount'}
                  {
                    profileTrs.investor?.investment_details.discount
                    ?? 'Discount'
                  }
                {:else if item == 'investment'}
                  {
                    profileTrs.investor?.investment_details.investment
                    ?? 'Investment'
                  }
                {:else if item == 'tokens'}
                  {
                    profileTrs.investor?.investment_details.tokens
                    ?? 'Tokens'
                  }
                {:else if item == 'price'}
                  {
                    profileTrs.investor?.investment_details.price
                    ?? 'Price'
                  }
                {/if}
              </p>
            </th>
          {/each}
        </tr>
      </thead>

      <!--
      ▓ NOTE:
      ▓ > transaction(s) investment list.
      -->
      <tbody>

        <!-- ▓ [🐞] -->
        <!-- {#each [...profileData?.tx_hist ?? [], ...profileData?.tx_hist ?? []] ?? [] as item} -->
        <!-- {#each [] as item} -->

        {#if
          profileData?.tx_hist?.filter(x => {return x.type == 'investment'})?.length > 0
          && !newDevInstance.noData
        }
          {#each profileData?.tx_hist?.filter(x => {return x.type == 'investment'}) ?? [] as item}

            <!-- ▓ [🐞] -->
            <!-- {console.log('item', item)} -->

            <InvestmentHistoryRowChild
              data={item}
              tierDataMap={dataMap}
              VIEWPORT_MOBILE_INIT_PARENT={VIEWPORT_MOBILE_INIT}
              VIEWPORT_TABLET_INIT_PARENT={VIEWPORT_TABLET_INIT}
            />
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

      </tbody>

    </table>
  </div>

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Investment Details'
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

  @import '../../../../../../static/app.scss';

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investment-detail⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    height: 469px;
    min-height: 469px;
    max-height: 469px;

    p#widget-title
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div#table-box
    {
      /* 🎨 style */
      position: relative;
      min-height: 379px;
      max-height: 379px;
      overflow-y: scroll;
      padding-top: 0 !important;

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
            /* 📌 position */
            position: sticky;
            top: 0;
            z-index: 10;
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
                  padding-bottom: 150px;
                }
              }

              td
              {
                /* 🎨 style */
                padding: 18px 0 18px 0;
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
              }

              &:nth-child(even)
              {
                td
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
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#profile⮕w⮕investment-detail⮕main
    {
      /* 🎨 style */
      height: 333px;
      min-height: 333px;
      max-height: 333px;

      div#developer-box
      {
        /* 📌 position */
        position: absolute;
        right: 0;
        /* 🎨 style */
        background-color: yellow;
        height: 100%;
        width: 20px;
      }

      div#table-box
      {
        /* 🎨 style */
        padding: 20px;
        min-height: 243px;
        max-height: 243px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investment-detail⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 table
    {

      thead
      {
        tr
        {
          /* 🎨 style */
          // background-color: rgba(75, 75, 75, 0.50) !important; // NOTE: alternative #4b4b4b80
          background-color: var(--dark-theme-1) !important;

        }
      }

      tbody
      {
        // IMPORTANT
        :global
        {
          tr
          {
            &:nth-child(even)
            {
              td
              {
                /* 🎨 style */
                background-color: rgba(75, 75, 75, 0.50) !important;
              }
            }
          }
        }

        div#no-widget-data
        {
          /* 🎨 style */
          background-color: var(--dark-theme-1-4-shade) !important;
        }
      }
    }
  }

</style>