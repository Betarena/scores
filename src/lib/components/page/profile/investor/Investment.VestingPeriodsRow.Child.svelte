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

  import { ddMMyyFormat } from '$lib/utils/dates.js';
  import { createEventDispatcher, type EventDispatcher } from 'svelte';

  import icon_arrow_down from '../assets/arrow-down.svg';
  import icon_arrow_up from '../assets/arrow-up.svg';
  import icon_green_dot from '../assets/investor/icon-green-dot.svg';

	import type { PUBLIC__INVESTOR_IVesting } from '@betarena/scores-lib/types/_HASURA_.js';

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
    CNAME: string = 'profile⮕w⮕investfaq⮕main'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
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
    , mobileProps: string[] = [ 'Tokens', 'Status', 'Wallet', 'Distribution', 'Claim' ]
  ;

  // $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

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

<tr
  class:extra-info={isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}
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
  {#if !VIEWPORT_MOBILE_INIT_PARENT[1]}

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
        class:available={new Date(data.available_date ?? '').getTime() > new Date().getTime()}
        class:pending={data.status == 'Pending'}
        class:completed={data.status == 'Distributed'}
      >
        {#if new Date(data.available_date ?? '').getTime() > new Date().getTime()}
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
        {/if}
        {data.status ?? '-'}
      </p>
    </td>

    <!--
    ▓ NOTE:
    ▓ > vesting period 'wallet' used.
    -->
    <td>
      <p>
        {data.wallet ?? '-'}
      </p>
    </td>

  {/if}

  <!--
  ▓ NOTE: ▓ 🖥️ LAPTOP
  ▓ > target columns.
  -->
  {#if !VIEWPORT_TABLET_INIT_PARENT[1]}

    <!--
    ▓ NOTE:
    ▓ > discount
    -->
    <td>
      <p>
        {
          ddMMyyFormat
          (
            data.distribution_date ?? ''
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
            data.claim_date ?? ''
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

      <button
        class=
        "
        btn-primary-v2
        "
        on:click=
        {
          () =>
          {
            dispatch('claimTrigger')
            return;
          }
        }
      >
        Claim
      </button>

      <!--
      ▓ NOTE: ▓ 💻 TABLET 📱 MOBILE
      ▓ > collapse/expand asset.
      -->
      {#if VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1]}
        <img
          src={isTxExtraInfo ? icon_arrow_up : icon_arrow_down}
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
  {#if isTxExtraInfo && VIEWPORT_MOBILE_INIT_PARENT[1]}

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
              Tokens
            {:else if item == 'Status'}
              Status
            {:else if item == 'Wallet'}
              Wallet
            {:else if item == 'Distribution'}
              Distribution
            {:else if item == 'Claim'}
              Claim
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
          >
            {#if item == 'Tokens'}
              {data.tokens ?? '-'}
            {:else if item == 'Status'}
              {data.status ?? '-'}
            {:else if item == 'Wallet'}
              {data.wallet ?? '-'}
            {:else if item == 'Distribution'}
              {
                ddMMyyFormat
                (
                  data.distribution_date ?? ''
                )
              }
            {:else if item == 'Claim'}
              {
                data.claim_date
                  ? ddMMyyFormat
                  (
                    data.claim_date
                  )
                  : '-'
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
{#if isTxExtraInfo && VIEWPORT_TABLET_INIT_PARENT[1] && !VIEWPORT_MOBILE_INIT_PARENT[1]}
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
            data.distribution_date ?? ''
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
            data.claim_date ?? ''
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
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  // ▓ IMPORTANT
  // ▓ > Major Control By Parent

  tr
  {
    td
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
