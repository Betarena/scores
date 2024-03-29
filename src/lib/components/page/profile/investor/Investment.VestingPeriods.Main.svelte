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

  // #region ➤ 📦 Package Imports1

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

  import { postv2 } from '$lib/api/utils.js';
  import { userUpdateInvestorBalance } from '$lib/firebase/common.js';
  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { investVestingSampleData } from './_sample.js';
  import { scoresProfileInvestorStore } from './_store.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import InvestmentVestingPeriodsRowChild from './Investment.VestingPeriodsRow.Child.svelte';
  import MainClaimModal from './Main-Claim-Modal.svelte';

  import type { PublicInvestorDataIVesting } from '@betarena/scores-lib/types/_AUTO-HASURA-2_.js';
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
     *  📣 threshold start + state for  MOBILE
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
   *  📣 Component interface.
   */
  type IRowLayout =
    'period'
    | 'available'
    | 'tokens'
    | 'status'
    | 'distribution'
    | 'claim'
    | ''
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕vesting-period⮕main'
  ;

  let
    /**
     * @description
     *  📣 Target `table` header order.
     */
    tableHeader: IRowLayout[]
      = [
        'period'
        , 'available'
        , 'tokens'
        , 'status'
        , 'distribution'
        , 'claim'
      ]
    /**
     * @augments PUBLIC__INVESTOR_IVesting
     */
    , targetVestingSelected: PublicInvestorDataIVesting
    /**
     * @description
     *  📣 Target `vesting periods` that have been claimed.
     */
    , vestingPeriodsClaimed: number[] = []
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ adminOverrides, vestingHistoryStateWidget } = $scoresProfileInvestorStore);
  // @ts-expect-error
  $: ({ uid } = $userBetarenaSettings.user.firebase_user_data);

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
    if (VIEWPORT_MOBILE_INIT[1])
      tableHeader = [ 'period', 'available', '' ];
    else if (VIEWPORT_TABLET_INIT[1])
      tableHeader = [ 'period' , 'available' , 'tokens' , 'status' , '' ];
    else
      tableHeader = [ 'period' , 'available' , 'tokens' , 'status' , 'distribution' , 'claim', '' ];
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Create new **vesting request** for target user vesting period.
   * @return { void }
   */
  async function createVestingRequest
  (
  ): Promise < void >
  {
    const
      /**
       * @description
       *  📣 Response from `endpoint`.
       */
      result = await postv2
      (
        `${import.meta.env.VITE_FIREBASE_FUNCTIONS_ORIGIN}/transaction/update/investment/claim/create`
        // 'http://127.0.0.1:5001/betarena-ios/us-central1/api/transaction/update/investment/claim/create'
        , {
          uid
          , vestingId: targetVestingSelected.id
          , isTge: false
        }
      )
    ;

    // @ts-expect-error
    if (result.error)
    {
      $sessionStore.currentActiveModal = 'GeneralPlatform_Error';
      return;
    }

    let
      /**
       * @description
       *  📣 Target amount to change balance by.
      */
      deltaBalance: number = (-targetVestingSelected.tokens)
    ;

    // TODO:
    // can be offloaded to server (backend).

    await userUpdateInvestorBalance
    (
      {
        uid
        , deltaBalance
        , type: 'total'
      }
    );

    // vestingPeriodsClaimed.push(targetVestingSelected.id);
    window.location.reload();

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

  $: if (VIEWPORT_MOBILE_INIT || VIEWPORT_TABLET_INIT)
    updateTableLayout();
  // ────────────────────────────────────────────────────────────────────────

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
▓ > (child-component) claim modal
-->
{#if $sessionStore.currentActiveModal == 'ProfileInvestor_ClaimVesting_Modal'}
  <MainClaimModal
    {VIEWPORT_MOBILE_INIT}
    {VIEWPORT_TABLET_INIT}
    amount={targetVestingSelected.tokens}
    on:confirmEntry=
    {
      () =>
      {
        // alert('Executing Vesting Claim!');
        createVestingRequest();
        return;
      }
    }
  />
{/if}

<!--
▓ NOTE:
▓ > (widget) main
-->
<div
  id={CNAME}
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  class:mutated={adminOverrides.has('Vesting')}
>

  <AdminDevControlPanelToggleButton
    title='Vesting Periods'
    mutated={adminOverrides.has('Vesting')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'Vesting'
          , 'remove'
        );
        return;
      }
    }
  />

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
    m-b-20
    "
  >
    <TranslationText
      key={'vesting-period-title'}
      text={profileTrs?.investor?.vesting.title}
      fallback={'Vesting Periods'}
    />
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
                  dark-v1
                capitalize
                "
              >
                {#if item == 'period'}
                  <TranslationText
                    key={`${CNAME}/table/header/period`}
                    text={profileTrs?.investor?.vesting.period}
                    fallback={'period'}
                  />
                {:else if item == 'available'}
                  <TranslationText
                    key={`${CNAME}/table/header/available`}
                    text={profileTrs?.investor?.vesting.available}
                    fallback={'available'}
                  />
                {:else if item == 'tokens'}
                  <TranslationText
                    key={`${CNAME}/table/header/tokens`}
                    text={profileTrs?.investor?.vesting.tokens}
                    fallback={'tokens'}
                  />
                {:else if item == 'status'}
                  <TranslationText
                    key={`${CNAME}/table/header/status`}
                    text={profileTrs?.investor?.vesting.status}
                    fallback={'status'}
                  />
                {:else if item == 'distribution'}
                  <TranslationText
                    key={`${CNAME}/table/header/distribution`}
                    text={profileTrs?.investor?.vesting.distribution}
                    fallback={'distribution'}
                  />
                {:else if item == 'claim'}
                  <TranslationText
                    key={`${CNAME}/table/header/claim`}
                    text={profileTrs?.investor?.vesting.claim}
                    fallback={'claim'}
                  />
                {/if}
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

        {#if
          (profileData?.investorData?.data?.vesting_periods.length ?? 0) > 0
          && vestingHistoryStateWidget != 'NoData'
        }
          {#each profileData?.investorData?.data?.vesting_periods ?? [] as item}

            <!-- ▓ [🐞] -->
            <!-- {console.log('item', item)} -->

            <InvestmentVestingPeriodsRowChild
              data={item}
              {VIEWPORT_MOBILE_INIT}
              {VIEWPORT_TABLET_INIT}
              {vestingPeriodsClaimed}
              on:claimTrigger=
              {
                () =>
                {
                  $sessionStore.currentActiveModal = 'ProfileInvestor_ClaimVesting_Modal';
                  targetVestingSelected = item;
                  return;
                }
              }
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
                key={'vesting-no-data'}
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
  title='Vesting Periods'
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
          $scoresProfileInvestorStore.vestingHistoryStateWidget = 'NoData';
          return;
        }
      }
      class:on={vestingHistoryStateWidget == 'NoData'}
      class:off={vestingHistoryStateWidget != 'NoData'}
    >
      {#if vestingHistoryStateWidget == 'NoData'}
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

          // @ts-expect-error
          (profileData.investorData ??= { data: { vesting_periods: [] } });
          // @ts-expect-error
          (profileData.investorData.data.vesting_periods ??= []);

          profileData.investorData?.data?.vesting_periods.push
          (
            ...investVestingSampleData
          );

          profileData = profileData;

          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'Vesting'
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

  div#profile⮕w⮕vesting-period⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    height: 500px;
    min-height: 500px;
    max-height: 500px;

    p#widget-title
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div#table-box
    {
      /* 🎨 style */
      position: relative;
      min-height: 410px;
      max-height: 410px;
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

                p:not(.pending)
                {
                  /* 🎨 style */
                  font-size: 14px;
                  color: var(--dark-theme);
                }

                button
                {
                  /* 🎨 style */
                  @mixin default
                  {
                    height: 36px;
                    width: 96px;
                  }

                  &.btn-primary-v2
                  {
                    @include default;
                  }

                  &.btn-hollow.claimed-pill
                  {
                    /* 🎨 style */
                    @include default;
                  }
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
    div#profile⮕w⮕vesting-period⮕main
    {
      /* 🎨 style */
      height: 413px;
      min-height: 413px;
      max-height: 413px;

      div#table-box
      {
        /* 🎨 style */
        padding: 20px;
        min-height: 323px;
        max-height: 323px;
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕vesting-period⮕main
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

  div#profile⮕w⮕vesting-period⮕main
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

            td
            {
              p:not(.pending)
              {
                /* 🎨 style */
                color: var(--white) !important;
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
