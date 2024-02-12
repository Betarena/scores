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

  import { ddMMyyFormat } from '$lib/utils/dates.js';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { scoresProfileInvestorStore } from './_store.js';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_arrow_down_dark from '../assets/investor/arrow-down-dark.svg';
  import icon_arrow_up_dark from '../assets/investor/arrow-up-dark.svg';
  import icon_green_dot from '../assets/investor/icon-green-dot.svg';

	import type { PUBLIC__INVESTOR_IVesting } from '@betarena/scores-lib/types/_HASURA_.js';
	import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

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
     * @augments PUBLIC__INVESTOR_IVesting
     */
    data: PUBLIC__INVESTOR_IVesting
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
    /**
     * @description
     *  📣 Target `vesting periods` claimed (ethermal storage).
    */
    , vestingPeriodsClaimed: number[]
  ;

  /**
   * @description
   *  📣 Component interface.
   */
  type IRowState =
    'NoVestingClaimAvailable'
    | 'VestingClaimAvailable'
    | 'VestingClaimPending'
    | 'VestingClaimed'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /**
     * @augments EventDispatcher
    */
    , dispatch: EventDispatcher < any > = createEventDispatcher()
  ;

  let
    /**
     * @description
     *  📣 Wether extra information is toggled (mobile only).
     */
    isTxExtraInfo: boolean = false
    /**
     * @description
     *  📣 Properties to be shown in mobile view.
     */
    , mobileProps: string[] = [ 'Tokens', 'Status', 'Distribution', 'Claim' ]
    /**
     * @description
     *  📣 Target component `state.
     */
    , componentState: IRowState = 'NoVestingClaimAvailable'
    /**
     * @description
     *  📣 Logic for updating component state.
     */
    , updateComponentState
      = () =>
      {
        if (data.status == 'Distributed')
          componentState = 'VestingClaimed';
        else if (data.status == 'Pending' || vestingPeriodsClaimed.includes(data.id))
          componentState = 'VestingClaimPending';
        else if (new Date().getTime() > new Date(data.available_date ?? '').getTime())
          componentState = 'VestingClaimAvailable';
        else
          componentState = 'NoVestingClaimAvailable';
        //
        return;
      }
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs | null | undefined;
  $: deepReactListenInternalClock = $scoresProfileInvestorStore.globalInternalClock;

  // #endregion ➤ 📌 VARIABLES

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

  $: if (vestingPeriodsClaimed) updateComponentState();
  $: if (deepReactListenInternalClock) updateComponentState();

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

<tr
  class:extra-info={isTxExtraInfo && VIEWPORT_MOBILE_INIT[1]}
  on:click={() => {return isTxExtraInfo = !isTxExtraInfo}}
>

  <!--
  ▓ NOTE:
  ▓ > vesting period 'id'
  -->
  <td>
    <p>
      {data.id ?? '-'}
    </p>
  </td>

  <!--
  ▓ NOTE:
  ▓ > vesting period 'available date' for claim.
  -->
  <td>
    <p>
      {
        ddMMyyFormat
        (
          data.available_date ?? ''
        )
      }
    </p>
  </td>

  <!--
  ▓ NOTE: ▓ 💻 TABLET
  ▓ > target columns.
  -->
  {#if !VIEWPORT_MOBILE_INIT[1]}

    <!--
    ▓ NOTE:
    ▓ > vesting period 'tokens'.
    -->
    <td>
      <p>
        {data.tokens ?? '-'}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > vesting period 'status'.
    -->
    <td>
      <p
        class=
        "
        tx-status-pill
        "
        class:available={componentState == 'VestingClaimAvailable'}
        class:pending={componentState == 'VestingClaimPending'}
        class:completed={componentState == 'VestingClaimed'}
      >
        {#if componentState == 'NoVestingClaimAvailable'}
          -
        {:else if componentState == 'VestingClaimAvailable'}
          <img
            id=''
            src={icon_green_dot}
            alt='green-dot'
            title='green-dot'
            loading='lazy'
            class=
            "
            m-r-6
            "
          />
          {
            profileTrs?.investor?.vesting.status_1
            ?? 'Available'
          }
        {:else if componentState == 'VestingClaimPending'}
          {
            profileTrs?.investor?.vesting.status_2
            ?? 'Pending'
          }
        {:else if componentState == 'VestingClaimed'}
          {
            profileTrs?.investor?.vesting.status_3
            ?? 'Distributed'
          }
        {/if}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > vesting period 'wallet' used.
    -->
    <!-- <td>
      <p>
        {data.wallet ?? '-'}
      </p>
    </td> -->

  {/if}

  <!--
  ▓ NOTE: ▓ 🖥️ LAPTOP
  ▓ > target columns.
  -->
  {#if !VIEWPORT_TABLET_INIT[1]}

    <!--
    ▓ NOTE:
    ▓ > discount
    -->
    <td>
      <p>
        {
          ddMMyyFormat
          (
            data.distribution_date
          )
        }
    </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > investment amount
    -->
    <td>
      <p>
        {
          ddMMyyFormat
          (
            data.claim_date
          )
        }
      </p>
    </td>

  {/if}

  <td>
    <div
      class=
      "
      row-space-end
      "
    >
      {#if componentState == 'NoVestingClaimAvailable' || componentState == 'VestingClaimPending'}
        <p>
          -
        </p>
      {:else if componentState == 'VestingClaimAvailable'}
        <button
          class=
          "
          btn-primary-v2
          "
          on:click=
          {
            () =>
            {
              dispatch('claimTrigger');
              return;
            }
          }
        >
          <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
          {
            profileTrs?.investor?.vesting.cta_claim
            ?? 'Claim'
          }
        </button>
      {:else if componentState == 'VestingClaimed'}
        <button
          class=
          "
          btn-hollow
          "
        >
          <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
          {
            profileTrs?.investor?.vesting.cta_claimed
            ?? 'Claimed'
          }
        </button>
      {/if}

      <!--
      ▓ NOTE: ▓ 💻 TABLET 📱 MOBILE
      ▓ > collapse/expand asset.
      -->
      {#if VIEWPORT_TABLET_INIT[1] || VIEWPORT_MOBILE_INIT[1]}
        <img
          src=
          {
            isTxExtraInfo
              ? ($userBetarenaSettings.theme == 'Dark') ? icon_arrow_down_dark : icon_arrow_down
              : ($userBetarenaSettings.theme == 'Dark') ? icon_arrow_up_dark : icon_arrow_up
          }
          alt={isTxExtraInfo ? 'icon_arrow_up' : 'icon_arrow_down'}
          class=
          "
          m-l-8
          "
        />
      {/if}
    </div>

  </td>

  <!--
  ▓ NOTE:
  ▓ > extra hidden data 📱 MOBILE layout
  -->
  {#if isTxExtraInfo && VIEWPORT_MOBILE_INIT[1]}

    <div
      class=
      "
      extra-information
      "
    >
      {#each mobileProps as item}

        <!--
        ▓ NOTE:
        ▓ > target transaction further data row.
        -->
        <div
          class=
          "
          m-b-8
          row-space-out
          "
        >

          <!--
          ▓ NOTE:
          ▓ > target transaction property title.
          -->
          <p
            class=
            "
            s-12
            color-grey
            "
          >
            {#if item == 'Tokens'}
              <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
              {
                profileTrs?.investor?.vesting.tokens
                ?? 'Tokens'
              }
            {:else if item == 'Status'}
              <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
              {
                profileTrs?.investor?.vesting.status
                ?? 'Status'
              }
            <!-- {:else if item == 'Wallet'}
              Wallet -->
            {:else if item == 'Distribution'}
              <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
              {
                profileTrs?.investor?.vesting.distribution
                ?? 'Distribution'
              }
            {:else if item == 'Claim'}
              <!-- NOTE: TRANSLATION TERM + (EN) FALLBACK -->
              {
                profileTrs?.investor?.vesting.claim
                ?? 'Claim'
              }
            {/if}
          </p>

          <!--
          ▓ NOTE:
          ▓ > target transaction property value.
          -->
          <p
            class=
            "
            s-14
            color-black-2
            "
            class:tx-status-pill={componentState != 'NoVestingClaimAvailable' && item == 'Status'}
            class:available={componentState != 'VestingClaimAvailable'}
            class:pending={componentState != 'VestingClaimPending'}
            class:completed={componentState != 'VestingClaimed'}
          >
            {#if item == 'Tokens'}
              {data.tokens ?? '-'}
            {:else if item == 'Status'}
              {data.status ?? '-'}
            <!-- {:else if item == 'Wallet'}
              {data.wallet ?? '-'} -->
            {:else if item == 'Distribution'}
              {
                ddMMyyFormat
                (
                  data.distribution_date
                )
              }
            {:else if item == 'Claim'}
              {
                ddMMyyFormat
                (
                  data.claim_date
                )
              }
            {/if}
          </p>

        </div>

      {/each}
    </div>

  {/if}

</tr>

<!--
▓ NOTE:
▓ > extra hidden data 💻 TABLET layout
-->
{#if isTxExtraInfo && VIEWPORT_TABLET_INIT[1] && !VIEWPORT_MOBILE_INIT[1]}
  <tr
    class=
    "
    extra-info-row
    "
  >
    <td colspan="3" />

    <!--
    ▓ NOTE:
    ▓ > distribution date.
    -->
    <td>
      <p
        class=
        "
        m-b-20
        "
      >
        Distribution
      </p>
      <p>
        {
          ddMMyyFormat
          (
            data.distribution_date
          )
        }
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > claimed date.
    -->
    <td>
      <p
        class=
        "
        m-b-20
        "
      >
        Claim
      </p>
      <p>
        {
          ddMMyyFormat
          (
            data.claim_date
          )
        }
      </p>
    </td>

    <td colspan="1" />

  </tr>
{/if}

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

  // ▓ IMPORTANT
  // ▓ > Major Control By Parent

  tr
  {
    td
    , div.extra-information
    {
      p
      {
        /* 🛝 layout */
        width: fit-content;
        white-space: nowrap;
        /* 🎨 style */
        color: var(--dark-theme);

        &.tx-status-pill
        {
          /* 🛝 layout */
          width: fit-content;
          /* 🎨 style */
          padding: 4px 12px;
          border-radius: 32px;

          &.available
          {
            /* 🎨 style */
            background-color: rgba(89, 198, 93, 0.10);
          }

          &.pending
          {
            /* 🎨 style */
            color: var(--yellow-gold) !important;
            background-color: rgba(255, 185, 4, 0.10);
          }

          &.completed
          {
            /* 🎨 style */
            background-color: var(--white-3);
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

  .dark-background-1
  {
    tr
    {
      td
      , div.extra-information
      {
        p
        {
          &.tx-status-pill
          {
            &.pending
            {
              /* 🎨 style */
              color: var(--yellow-gold) !important;
            }

            &.completed
            {
              /* 🎨 style */
              background-color: rgba(204, 204, 204, 0.10);
            }
          }
        }
      }
    }
  }

</style>
