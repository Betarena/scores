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

  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import ReferralsHistoryRowChild from './Referrals.HistoryRow.Child.svelte';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import type { IProfileData, IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';
  import { scoresProfileInvestorStore } from './_store.js';

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

  type IRowLayout =
    | 'id'
    | 'referral_bonus_percentage'
    | 'referral_bonus_bta'
    | 'date'
    | ''
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕referral-history⮕main'
  ;

  let
    /**
     * @description
     *  📣 Target `table` header order.
    */
    tableHeader: IRowLayout[]
    = [
      'id'
      , 'referral_bonus_percentage'
      , 'referral_bonus_bta'
      , 'date'
    ]
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: ({ theme } = $userBetarenaSettings);
  $: ({ adminOverrides, referralHistoryStateWidget } = $scoresProfileInvestorStore);

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
   *  📣 Updates layout of referral history, dependent on device `resize`.
   * @return { void }
   */
  function updateTableLayout
  (
  ): void
  {
    if (VIEWPORT_MOBILE_INIT[1])
      tableHeader = [ 'id' , 'referral_bonus_percentage' , 'referral_bonus_bta' , '' ];
    else
      tableHeader = [ 'id' , 'referral_bonus_percentage' , 'referral_bonus_bta' , 'date' ];
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
    updateTableLayout()

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
  class:mutated={adminOverrides.has('ReferralHistory')}
>

  <AdminDevControlPanelToggleButton
    title='Referral History'
    mutated={adminOverrides.has('ReferralHistory')}
    on:reset=
    {
      () =>
      {
        scoresProfileInvestorStore.updateAdminMutatedWidgets
        (
          'ReferralHistory'
          , 'remove'
        );
        return;
      }
    }
  />

  <!--
  ▓ NOTE:
  ▓ > Referral History Widget Title.
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
      text={profileTrs?.investor?.referral.ref_history.title}
      fallback={'Referral History'}
    />
  </p>

  <!--
  ▓ NOTE:
  ▓ > Referral History Summary Data.
  -->
  <div
    id="table-box"
  >
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
                {#if item == 'id'}
                  <TranslationText
                    key={`${CNAME}/title`}
                    text={profileTrs?.investor?.referral.ref_history.id}
                    fallback={'Id'}
                  />
                {:else if item == 'referral_bonus_percentage'}
                  <TranslationText
                    key={`${CNAME}/title`}
                    text={profileTrs?.investor?.referral.ref_history.bonus}
                    fallback={'Bonus %'}
                  />
                {:else if item == 'referral_bonus_bta'}
                  <TranslationText
                    key={`${CNAME}/title`}
                    text={profileTrs?.investor?.referral.ref_history.ref_bonus_bta}
                    fallback={'Referral Bonus BTA'}
                  />
                {:else if item == 'date'}
                  <TranslationText
                    key={`${CNAME}/title`}
                    text={profileTrs?.investor?.referral.ref_history.date}
                    fallback={'Date'}
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

        <!--
        {#each [...profileData?.investorData?.data?.referral_history ?? [], ...profileData?.investorData?.data?.referral_history ?? []
          , ...profileData?.investorData?.data?.referral_history ?? [], ...profileData?.investorData?.data?.referral_history ?? []] as item}
        -->

        {#if
          (profileData?.investorData?.data?.referral_history.length ?? 0) > 0
          && referralHistoryStateWidget != 'NoData'
        }
          {#each [...profileData?.investorData?.data?.referral_history ?? []] as item}
            <ReferralsHistoryRowChild
              data={item}
              {VIEWPORT_MOBILE_INIT}
              {VIEWPORT_TABLET_INIT}
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
                key={`${CNAME}/title`}
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
  title='Referral History'
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
            'ReferralHistory'
            , 'set'
          );
          $scoresProfileInvestorStore.referralHistoryStateWidget = 'NoData';
          return;
        }
      }
      class:on={referralHistoryStateWidget == 'NoData'}
      class:off={referralHistoryStateWidget != 'NoData'}
    >
      {#if referralHistoryStateWidget == 'NoData'}
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
          // @ts-expect-error
          (profileData.investorData ??= { data: { referral_history: [] } });
          // @ts-expect-error
          (profileData.investorData.data.referral_history ??= [] );

          profileData?.investorData?.data?.referral_history.push
          (
            ...this.sampleData
          );

          profileData = profileData;

          scoresProfileInvestorStore.updateAdminMutatedWidgets
          (
            'ReferralHistory'
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

  div#profile⮕w⮕referral-history⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    height: 321px;
    min-height: 321px;
    max-height: 321px;

    p#widget-title
    {
      /* 🎨 style */
      padding: 20px 20px 0 20px;
    }

    div#table-box
    {
      /* 🎨 style */
      position: relative;
      min-height: 231px;
      max-height: 231px;
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

              p
              {
                /* 🎨 style */
                font-size: 12px;
                color: var(--grey-shade);
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
              max-height: 40px;
              height: 40px;
              min-height: 40px;

              &.extra-info
              {
                /* 🎨 style */
                height: unset;

                td
                {
                  /* 🎨 style */
                  // padding-top: 8px;
                  padding-bottom: 64px;
                }
              }

              td
              {
                /* 🎨 style */
                padding: 8px 0 8px 0;
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
                  /* 🎨 style */
                  font-size: 14px;
                  color: var(--dark-theme);
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
    div#profile⮕w⮕referral-history⮕main
    {
      /* 🎨 style */
      height: 274px;
      min-height: 274px;
      max-height: 274px;

      div#table-box
      {
        /* 🎨 style */
        padding: 20px;
        min-height: 184px;
        max-height: 184px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕referral-history⮕main
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

            td
            {
              p
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
