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

	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { toCorrectDate, toZeroPrefixDateStr } from '$lib/utils/dates.js';

  import icon_bta_token from '../assets/price-tier/icon-bta-token.svg';

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
    CNAME: string = 'profile⮕w⮕investtge⮕main'
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
  ;

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  $: countDownSecToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / 1000) % 60).toString());
	$: countDownMinToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / 1000 / 60) % 60).toString());
	$: countDownHourToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60)) % 24).toString());
	$: countDownDayToEnd = toZeroPrefixDateStr(Math.floor((dateDiff / (1000 * 60 * 60 * 24))).toString());

  // [🐞]
  // profileData!.presaleData.data!.end_date = '';
  // profileData!.investorData!.data!.tge!.status = 'Claimed';

  // #endregion ➤ 📌 VARIABLES

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
    }
  );

  onDestroy
  (
    () =>
    {
      // @ts-expect-error
      clearInterval(interval1);
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
  class:column-space-stretch={!VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1]}
  class:row-space-out={VIEWPORT_TABLET_INIT_PARENT[1] && !VIEWPORT_MOBILE_INIT_PARENT[1]}
  style=
  "
  {!VIEWPORT_TABLET_INIT_PARENT[1] || VIEWPORT_MOBILE_INIT_PARENT[1] ? 'justify-content: space-between;' : ''}
  "
>
  <!-- [🐞] -->
  <!-- {VIEWPORT_TABLET_INIT_PARENT[1]} -->

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
      width: 170px;
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
          $userBetarenaSettings.user.scores_user_data?.investor_balance
          ?? 0
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
  {#if profileData?.investorData?.data?.tge.status == null}
    <div>

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
      {#if !profileData?.presaleData.data?.end_date}
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
            Date to be announced soon
          </p>
        </div>

      <!--
      ▓ NOTE:
      ▓ > token release date.
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
  ▓ > token ready to claim.
  -->
  {:else if profileData?.investorData?.data?.tge.status == 'Pending'}
    <button
      class=
      "
      btn-primary-v2
      "
      on:click={() => {return alert('Initiate Process for Claim!')}}
    >
      {
        profileTrs.investor?.tge.cta_title
        ?? 'Claim now!'
      }
    </button>

  <!--
  ▓ NOTE:
  ▓ > tokens have been claimed.
  -->
  {:else if profileData?.investorData?.data?.tge.status == 'Claimed'}
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

  div#profile⮕w⮕investtge⮕main
  {
    /* 🎨 style */
    background-color: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
    padding: 20px;
    height: 229px;
    min-height: 229px;
    max-height: 229px;

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
