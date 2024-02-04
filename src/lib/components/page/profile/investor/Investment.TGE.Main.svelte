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
	import { onDestroy, onMount } from 'svelte';

  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';
  import { dlog } from '$lib/utils/debug.js';

  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';

  import AdminDevControlPanel from '$lib/components/misc/admin/Admin-Dev-ControlPanel.svelte';
  import AdminDevControlPanelToggleButton from '$lib/components/misc/admin/Admin-Dev-ControlPanelToggleButton.svelte';
  import MainClaimModal from './Main-Claim-Modal.svelte';

  import { formatNumberWithCommas } from '$lib/utils/platform-functions.js';
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
     *  📣 makes use of parent 📱 MOBILE viewport state.
    */
    , VIEWPORT_MOBILE_INIT_PARENT: [ number, boolean ]
    /**
     * @description
     *  📣 makes use of parent 💻 TABLET viewport state.
    */
    , VIEWPORT_TABLET_INIT_PARENT: [ number, boolean ]
  ;

  /**
   * @description
   *  📣 available widget states.
   */
  type WidgetState = 'NoDefinedDate' | 'DateDefined' | 'ClaimAvailable' | 'Claimed';

  class Dev
  {
    mutated: boolean = false;
    noData: boolean = false;
  }

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
    */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕investtge⮕main'
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = VIEWPORT_MOBILE_INIT_PARENT
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
    */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = VIEWPORT_TABLET_INIT_PARENT
  ;

  let
    /**
     * @description
     *  📣 investor number of days difference (from end)
    */
    dateDiff: number = 0
    /**
     * @description
     *  📣 interval variable for `countdown` logic
    */
    , interval1: NodeJS.Timer
    /**
     * @description
     *  📣 target date of relase of tokens.
    */
    , targetDate: Date = new Date()
    /**
     * @description
     *  📣 target `DEV` class instance.
    */
    , newDevInstance = new Dev()
    /**
     * @description
     *  📣 target `state` update.
    */
    , updateWidgetState = (state?: WidgetState) =>
    {
      if (state)
      {
        // ▓ [🐞]
        console.log('state', state);
        widgetState = state;
        return;
      }

      if (profileData?.investorData?.data?.tge.status == null)
      {
        if (!profileData?.presaleData.data?.end_date)
          widgetState = 'NoDefinedDate';
        else
          widgetState = 'DateDefined';
      }
      else if (profileData.investorData.data.tge.status == 'Pending')
        widgetState = 'ClaimAvailable'
      else
        widgetState = 'Claimed'
      //

      return;
    }
    /**
     * @description
     *  📣 target `state` value.
    */
    , widgetState: WidgetState = 'NoDefinedDate'
  ;

  /**
   * @description
   *  📣 Available `translations`.
   */
  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;
  /**
   * @description
   *  📣 Number of `seconds` from target release date.
   */
  $: countDownSecToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / 1000) % 60).toString());
  /**
   * @description
   *  📣 Number of `minutes` from target release date.
   */
	$: countDownMinToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / 1000 / 60) % 60).toString());
  /**
   * @description
   *  📣 Number of `hours` from target release date.
   */
	$: countDownHourToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60)) % 24).toString());
  /**
   * @description
   *  📣 Number of `days` from target release date.
   */
	$: countDownDayToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60 * 24))).toString());

  // ▓ [🐞]
  // profileData!.presaleData.data!.end_date = '';
  // profileData!.investorData!.data!.tge!.status = 'Claimed';

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
   * @description
   *  📣
   */
  function initializeCountdown
  (
  ): void
  {
    targetDate.setDate(targetDate.getDate() + 1);
    dateDiff = toCorrectDate(targetDate, false).getTime() - new Date().getTime();
    setInterval
    (
      () =>
      {
        dateDiff = toCorrectDate(targetDate, false).getTime() - new Date().getTime();
      },
      1000
    );

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

  $: if (countDownSecToEnd < 0 && dateDiff <= 0)
  {
    // ▓ [🐞]
    dlog
    (
      '🚏 checkpoint [R] ➤ AX123',
      true
    );

    widgetState = 'ClaimAvailable';
  }

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

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
      updateWidgetState();
      initializeCountdown();
      return;
    }
  );

  onDestroy
  (
    (
    ) =>
    {
      // @ts-expect-error
      clearInterval(interval1);
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
▓ > (child-component) claim modal
-->
{#if $sessionStore.currentActiveModal == 'ProfileInvestor_ClaimTGE_Modal'}
  <MainClaimModal
    VIEWPORT_MOBILE_INIT_PARENT={VIEWPORT_MOBILE_INIT}
    VIEWPORT_TABLET_INIT_PARENT={VIEWPORT_TABLET_INIT}
    on:confirmEntry=
    {
      () =>
      {
        alert('Executing TGE Claim!');
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
  class:column-space-stretch={!VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1]}
  class:row-space-out={VIEWPORT_TABLET_INIT_PARENT[1] && !VIEWPORT_MOBILE_INIT_PARENT[1]}
  style=
  "
  {!VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1] ? 'justify-content: space-between;' : ''}
  "
  class:mutated={newDevInstance.mutated}
>
  <!-- [🐞] -->
  <!-- {VIEWPORT_TABLET_INIT_PARENT[1]} -->

  <AdminDevControlPanelToggleButton
    title='Tokens available on launch date (TGE)'
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
  ╭──────────────────────────────────────────────────────────────────────╮
  │ NOTE:                                                                │
  │ TGE Tokens information/action(s) box.                                │
  ╰──────────────────────────────────────────────────────────────────────╯
  -->

  <div>

    <!--
    ▓ NOTE:
    ▓ > tokens available hint text.
    -->
    <p
      id="hint"
      class=
      "
      s-14
      color-grey
        grey-v1
      "
      class:m-b-24={VIEWPORT_TABLET_INIT_PARENT[1] && !VIEWPORT_MOBILE_INIT_PARENT[1]}
      class:m-b-12={!VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1]}
      style=
      "
      line-height: 20px; /* 142.857% */
      {!VIEWPORT_MOBILE_INIT_PARENT[1] ? 'width: 170px;' : ''}
      "
    >
      {
        profileTrs.investor?.tge.info
        ?? 'Tokens available on launch date (TGE)'
      }
    </p>

    <!--
    ▓ NOTE:
    ▓ > tokens accumulated (so far by user).
    -->
    <div
      class=
      "
      row-space-start
      "
    >

      <!--
      ▓ NOTE:
      ▓ > (text) TGE amount
      -->
      <p
        class=
        "
        w-500
        color-black-2
        m-r-6
        "
        class:s-40={!VIEWPORT_MOBILE_INIT_PARENT[1]}
        class:s-32={VIEWPORT_MOBILE_INIT_PARENT[1]}
        style=
        "
        line-height: 100%; /* 40px */
        "
      >
        {
          formatNumberWithCommas($userBetarenaSettings.user.scores_user_data?.investor_balance)
        }
        <span
          class=
          "
          s-24
          "
        >
          BTA
        </span>
      </p>

      <!--
      ▓ NOTE:
      ▓ > (asset) BTA icon token.
      -->
      <img
        id=''
        src={icon_bta_token}
        alt=''
        title=''
        loading='lazy'
        width=20
        height=20
      />

    </div>

     <!--
    ▓ NOTE:
    ▓ > token ready to claim.
    -->
    {#if widgetState == 'ClaimAvailable'}
      <button
        class=
        "
        m-t-20
        btn-primary-v2
        "
        on:click=
        {
          () =>
          {
            // alert('Initiate Process for Claim!');
            $sessionStore.currentActiveModal = 'ProfileInvestor_ClaimTGE_Modal';
            return;
          }
        }
      >
        {
          profileTrs.investor?.tge.cta_title
          ?? 'Claim now!'
        }
      </button>
    {/if}

  </div>

  <!--
  ╭──────────────────────────────────────────────────────────────────────╮
  │ NOTE:                                                                │
  │ TGE Tokens information/action(s) box.                                │
  ╰──────────────────────────────────────────────────────────────────────╯
  -->

  <!--
  ▓ NOTE:
  ▓ > token release date view.
  -->
  {#if widgetState != 'Claimed'}
    <div
      class=
      "
      {VIEWPORT_MOBILE_INIT_PARENT[1] ? 'm-t-32' : ''}
      "
    >

      <!--
      ▓ NOTE:
      ▓ > Release date text.
      -->
      <p
        class=
        "
        s-14
        color-grey
          grey-v1
        m-b-12
        "
        style=
        "
        line-height: 20px; /* 142.857% */
        "
      >
        {
          profileTrs.investor?.tge.date_title
          ?? 'Release date'
        }
      </p>

      <!--
      ▓ NOTE:
      ▓ > token release date not set.
      -->
      {#if widgetState == 'NoDefinedDate' || widgetState == 'ClaimAvailable'}
        <div
          id="round-info-box-parent"
        >
          <p
            class=
            "
            s-14
            color-grey
              dark-v1
            "
          >
            {#if widgetState == 'NoDefinedDate'}
              {
                'Date to be announced soon'
              }
            {:else}
              {
                profileData?.presaleData.data?.end_date
              }
            {/if}
          </p>
        </div>

      <!--
      ▓ NOTE:
      ▓ > token release date set (countdown).
      -->
      {:else}
        <div
          id="countdown-row"
        >
          <div
            class=
            "
            countdown-box
            "
          >
            <p>
              {countDownDayToEnd}d
            </p>
          </div>

          <div
            class=
            "
            countdown-box
            "
          >
            <p>
              {countDownHourToEnd}h
            </p>
          </div>

          <div
            class=
            "
            countdown-box
            "
          >
            <p>
              {countDownMinToEnd}m
            </p>
          </div>

          <div
            class=
            "
            countdown-box
            "
          >
            <p>
              {countDownSecToEnd}s
            </p>
          </div>
        </div>

      {/if}

    </div>

  <!--
  ▓ NOTE:
  ▓ > tokens have been claimed.
  -->
  {:else}
    <div
      id="claimed"
    >
      <p
        class=
        "
        s-14
        w-500
        color-white
        "
      >
      {
        profileTrs.investor?.tge.cta_title_2
        ?? 'Claimed'
      }
      </p>
    </div>

  {/if}

</div>

<!--
▓ NOTE:
▓ > (widget) admin development state UI change control panel.
-->
<AdminDevControlPanel
  title='Tokens available on launch date (TGE)'
>

  <!--
  ▓ NOTE:
  ▓ > (select) widget state.
  -->
  <div
    class=
    "
    row-space-out
    "
  >
    <!--
    ▓ NOTE:
    ▓ > (text) target action.
    -->
    <p
      class=
      "
      s-14
      color-black
      "
    >
      <b>[1]</b> Choose <b>Widget State</b>
    </p>

    <!--
    ▓ NOTE:
    ▓ > (action) target select.
    -->
    <select
      id="cars"
      name="cars"
      bind:value={widgetState}
      on:change=
      {
        () =>
        {
          newDevInstance.mutated = true;
          return;
        }
      }
    >
      <option value="NoDefinedDate">Release date not defined</option>
      <option value="DateDefined">Release date defined</option>
      <option value="ClaimAvailable">Ready to claim</option>
      <option value="Claimed">Claimed</option>
    </select>
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

  div#profile⮕w⮕investtge⮕main
  {
    /* 📌 position */
    position: relative;
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    min-height: 229px;

    p#hint
    {
      /* 🎨 style */
      line-height: 20px; /* 142.857% */
      width: unset;
    }

    div#round-info-box-parent
    {
      /* 📌 position */
      position: relative;
      /* 🎨 style */
      padding: 20px;
      border-radius: 4px;
      background: var(--whitev2);
      width: fit-content;
      height: 60px;
    }

    div#countdown-row
    {
      /* 🎨 style */
      display: grid;
      gap: 2px;
      grid-auto-flow: column;
      width: fit-content;

      div.countdown-box
      {
        /* 🎨 style */
        text-align: center;
        padding: 20px 0;
        border-radius: 2px;
        width: 60px;
        height: 60px;
        background-color: var(--whitev2);

        &:first-child
        {
          /* 🎨 style */
          border-radius: 4px 0px 0px 4px;
        }

        &:last-child
        {
          /* 🎨 style */
          border-radius: 0px 4px 4px 0px;
        }

        p
        {
          /* 🎨 style */
          @extend .s-16;
          @extend .w-500;
          @extend .color-black-2;
        }
      }
    }

    button.btn-primary-v2
    {
      /* 🎨 style */
      width: 96px;
      height: 36px;
    }

    div#claimed
    {
      /* 🎨 style */
      background-color: var(--grey-shade);
      height: 44px;
      padding: 12px 24px 11px 24px;
      border-radius: 8px;
      width: fit-content;
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
    div#profile⮕w⮕investtge⮕main
    {
      /* 🎨 style */
      height: auto;
      min-height: auto;
      max-height: auto;
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#profile⮕w⮕investtge⮕main
    {
      /* 🎨 style */
      height: 333px;
      min-height: 333px;
      max-height: 333px;

      p#hint
      {
        /* 🎨 style */
        width: 170px;
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#profile⮕w⮕investtge⮕main
  {
    &.dark-background-1
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-4-shade) !important;
    }

    &.dark-background-1 div#round-info-box-parent
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1-7-shade);
    }

    &.dark-background-1 div#countdown-row
    {
      div.countdown-box
      {
        /* 🎨 style */
        background-color: var(--dark-theme-1-7-shade);
      }
    }

    &.dark-background-1 div#claimed
    {
      /* 🎨 style */
      background-color: var(--dark-theme-1);
    }
  }

</style>
