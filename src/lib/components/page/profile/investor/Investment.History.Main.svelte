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

  import { page } from '$app/stores';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { Misc } from '@betarena/scores-lib/dist/classes/class.misc.js';
  import { investHistorySampleData } from './_sample.js';
  import { scoresProfileInvestorStore } from './_store.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import InvestmentHistoryRowChild from './Investment.HistoryRow.Child.svelte';

  import type { KeypairInvestorPresaleMain } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
  import type { IPresaleTier } from '@betarena/scores-lib/types/_ENUMS_.js';
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

  /**
   * @description
   *  📣 available data points.
   */
  type IRowLayout =
    | 'date'
    | 'type'
    | 'tier'
    | 'discount'
    | 'investment'
    | 'status'
    | 'tokens'
    | 'price'
    | ''
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investment-detail⮕main'
  ;

  let
    /**
     * @description
     *  📣 convert target `data` to respective `map`.
     */
    dataMap: Map < IPresaleTier, KeypairInvestorPresaleMain >
      = new Misc().convertToMapKEYPINVSTTIER
      (
        (
          profileData?.investorTierPricing
            ?.sort
            (
              (
                a,
                b
              ) =>
              {
                return (b.data?.position ?? 0) - (a.data?.position ?? 0)
              }
            ) ?? [])
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
        , 'status'
      ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ adminOverrides, investHistoryStateWidget } = $scoresProfileInvestorStore);
  $: ({ theme } = $userBetarenaSettings);

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
   *  📣 Updates layout of tier pricings, dependent on device `resize`.
   * @return { void }
   */
  function updateTableLayout
  (
  ): void
  {
    if (VIEWPORT_MOBILE_INIT[1])
      tableHeader = [ 'date', 'type', 'status' ]
    else
      tableHeader = [ 'date', 'type', 'tier', 'discount', 'investment', 'tokens', 'price', 'status' ]
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

  $: if (VIEWPORT_MOBILE_INIT || VIEWPORT_TABLET_INIT) updateTableLayout();

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

</script>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
▓ NOTE:
▓ > (widget) main
-->
<div
  id={CNAME}
  class:dark-background-1={theme == 'Dark'}
  class:mutated={adminOverrides.has('InvestmentHistory')}
>

  <AdminDevControlPanelToggleButton
    title='Investment Details'
    mutated={adminOverrides.has('InvestmentHistory')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'InvestmentHistory'
          , 'remove'
        );
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
    <TranslationText
      key={`${CNAME}/title`}
      text={profileTrs?.investor?.investment_details.widget_title}
      fallback={'Investment Details'}
    />
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
                  <TranslationText
                    key={`${CNAME}/table/header/date`}
                    text={profileTrs?.investor?.investment_details.date}
                    fallback={'Date'}
                  />
                {:else if item == 'type'}
                  <TranslationText
                    key={`${CNAME}/table/header/type`}
                    text={profileTrs?.investor?.investment_details.type}
                    fallback={'Available'}
                  />
                {:else if item == 'tier'}
                  <TranslationText
                    key={`${CNAME}/table/header/tier`}
                    text={profileTrs?.investor?.investment_details.tier}
                    fallback={'Tier'}
                  />
                {:else if item == 'discount'}
                  <TranslationText
                    key={`${CNAME}/table/header/discount`}
                    text={profileTrs?.investor?.investment_details.discount}
                    fallback={'Discount'}
                  />
                {:else if item == 'investment'}
                  <TranslationText
                    key={`${CNAME}/table/header/discount`}
                    text={profileTrs?.investor?.investment_details.investment}
                    fallback={'Investment'}
                  />
                {:else if item == 'tokens'}
                  <TranslationText
                    key={`${CNAME}/table/header/discount`}
                    text={profileTrs?.investor?.investment_details.tokens}
                    fallback={'Tokens'}
                  />
                {:else if item == 'price'}
                  <TranslationText
                    key={`${CNAME}/table/header/price`}
                    text={profileTrs?.investor?.investment_details.price}
                    fallback={'Price'}
                  />
                {:else if item == 'status'}
                  <TranslationText
                    key={`${CNAME}/table/header/status`}
                    text={profileTrs?.investor?.investment_details.status}
                    fallback={'Status'}
                  />
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
          (profileData?.tx_hist?.filter(x => {return x.type == 'investment'})?.length ?? 0) > 0
          && investHistoryStateWidget != 'NoData'
        }
          {#each profileData?.tx_hist?.filter(x => {return x.type == 'investment'}) ?? [] as item}

            <!-- ▓ [🐞] -->
            <!-- {console.log('item', item)} -->

            <InvestmentHistoryRowChild
              data={item}
              tierDataMap={dataMap}
              {VIEWPORT_MOBILE_INIT}
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
              <TranslationText
                key={`${CNAME}/table/header/type`}
                text={profileTrs?.investor?.general.no_information}
                fallback={'Uh-oh! No Investments have been found.'}
              />
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
          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'InvestmentHistory'
            , 'set'
          );
          $scoresProfileInvestorStore.investHistoryStateWidget = 'NoData';
          return;
        }
      }
      class:on={investHistoryStateWidget == 'NoData'}
      class:off={investHistoryStateWidget != 'NoData'}
    >
      {#if investHistoryStateWidget == 'NoData'}
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
          if (!profileData) return;

          (profileData.tx_hist ??= []);

          profileData.tx_hist.push
          (
            ...investHistorySampleData
          );

          profileData = profileData;

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
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

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
                text-align: -webkit-right;
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
                  padding-bottom: 190px;
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

                @import '../../../../../../static/app.scss';

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
