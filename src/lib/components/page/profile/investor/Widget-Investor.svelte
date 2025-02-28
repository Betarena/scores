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
	import { get } from '$lib/api/utils.js';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { onMount } from 'svelte';
  import { sleep } from '$lib/utils/miscellenous.js';

  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { scoresProfileInvestorStore } from './_store.js';

	import WidgetTxHistLoader from './../competitions-history/Widget-Comp-Hist-Loader.svelte';
	import MainFaq from './FAQ-Main.svelte';
	import MainInvestmentDetail from './Investment.History.Main.svelte';
	import TgeMain from './Investment.TGE.Main.svelte';
	import MainVestingPeriods from './Investment.VestingPeriods.Main.svelte';
	import MainWalletsInvestor from './Investment.Wallets.Main.svelte';
	import LaunchpadWallets from './Launchpad-Wallets.svelte';
	import TierPricing from './Launchpad.TierPricing.Main.svelte';
	import MainInvestBox from './Main-InvestBox.svelte';
	import MainInvestorTitle from './Main-Investor-Title.svelte';
	import MainRound from './Main-Round.svelte';
	import ReferralsBonusSummary from './Referrals.BonusSummary.Main.svelte';
	import ReferralsHistory from './Referrals.History.Main.svelte';
	import ReferralsInfo from './Referrals.Info.Main.svelte';
	import ReferralsSteps from './Referrals.Steps.Main.svelte';

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

  const
    /** @description 📣 `this` component **main** `id` and `data-testid` prefix. */
    // eslint-disable-next-line no-unused-vars
    CNAME: string = 'profile⮕w⮕comp-hist'
    /** @description 📣 threshold start + state for 📱 MOBILE */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 581, true ]
    /** @description 📣 threshold start + state for 💻 TABLET */
    // eslint-disable-next-line no-unused-vars
    , VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 912, true ]
  ;

  let
    /** @description 📣 (widget) translations data */
    widgetDataTranslation: IProfileTrs
    /** @description 📣 (widget) translations (SEO) data */
    // , widgetDataSeo: B_COMP_MAIN_S
    /** @description 📣 (widget) main data */
    , widgetDataMain: IProfileData
    /** @description 📣 (widget) wether widget has or no data */
    // eslint-disable-next-line no-unused-vars
    , widgetNoData: boolean = true
    /** @description 📣 (widget) dynamic import variable for svelte component [1] */
    // , MainMainAsDynamic: any
  ;

  // eslint-disable-next-line no-unused-vars
  $: widgetDataTranslation = $page.data.RESPONSE_PROFILE_DATA ?? { };
  // $: widgetDataTranslation = $page.data?.B_COMP_MAIN_T;
  // $: widgetDataSeo = $page.data?.B_COMP_MAIN_S;
  // $: WIDGET_TITLE = widgetDataTranslation?.translations?.widget_title ?? translationObject?.featured_bet_site;

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
    return;
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟩 MAIN
   * @description
   *  📌 main widget data loader
   *  - ⚡️ (and) try..catch (error) handler
   *  - ⚡️ (and) placeholder handler
   * @returns { Promise < IProfileData | null > }
   */
  async function widgetInit
  (
  ): Promise < IProfileData | null >
  {
    const response = await get
    (
      `/api/data/profile.main?uid=${$userBetarenaSettings.user.firebase_user_data?.uid}`
      // '/api/data/profile.main?uid=0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81'
      // '/api/data/profile.main?uid=Z4ebLuAuDqdOu4Wt6z6EfVn35js2'
    ) as IProfileData;

    widgetDataMain = response

    const if_M_0
      = widgetDataMain == undefined
    ;
    if (if_M_0)
    {
      // dlog(`${IN_W_F_TAG} ❌ no data available!`, IN_W_F_TOG, IN_W_F_STY);
      widgetNoData = true;
      return null;
    }

    widgetNoData = false;

    // IMPORTANT
    scoresProfileInvestorStore.assignMainSectionState
    (
      {
        investmentCount: $userBetarenaSettings.user.scores_user_data?.investor_balance?.grand_total ?? 0
        , presaleName: widgetDataMain.presaleData.presale
        , activePresaleStartDate: widgetDataMain.presaleData.data?.start_date
        , activePresaleEndDate: widgetDataMain.presaleData.data?.end_date
        , publicEndDate: widgetDataMain.presaleData.data?.end_date
        , tgeAvailableDate: widgetDataMain.investorData?.data?.tge.available_date
        , tgeStatus: widgetDataMain.investorData?.data?.tge.status
        , transactionHistory: widgetDataMain.tx_hist
      }
    );

    await sleep(1000);

    return widgetDataMain;
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
      resizeCustom();
      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<svelte:window
  on:resize=
  {
    () =>
    {
      return resizeCustom();
    }
  }
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component HTML                                                            │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - use 'Ctrl+Space' to autocomplete global class=styles                           │
│ - access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.     │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!-- [🐞] -->
<!-- <WidgetTxHistLoader /> -->

{#await widgetInit()}

  <WidgetTxHistLoader />

{:then data}

  <div
    id="investor-grid-box"
    class:dark-background-1={theme == 'Dark'}
  >

    <!--
    ▓ NOTE:
    ▓ > Launchpad Information Section
    -->
    <div
      id="launchpad-grid-box"
    >
      <MainInvestorTitle />

      <MainRound
        WIDGET_DATA={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />

      <MainInvestBox
        profileData={data}
      />

      <iframe
        src="https://www.youtube.com/embed/AGIXX306u-Y?controls=1&rel=0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      />

      <TierPricing
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
    </div>

    <!--
    ▓ NOTE:
    ▓ > Investment Information Section
    -->
    <div
      id="section-investing"
    >

      <!--
      ▓ NOTE:
      ▓ > main title
      -->
      <div
        id='profile⮕w⮕investtge⮕main⮕title'
      >

        <!--
        ▓ NOTE:
        ▓ > title
        -->
        <p
          id="title"
          class=
          "
          {VIEWPORT_MOBILE_INIT[1] ? 's-24' : 's-32'}
          w-500
          color-black-2
          m-b-16
          "
          style=
          "
          line-height: 100%; /* 32px */
          "
        >
          {
            widgetDataTranslation.investor?.tab.title_investment
            ?? 'Investment Information'
          }
        </p>

        <!--
        ▓  NOTE:
        ▓ > sub-title
        -->
        <p
          id="sub-title"
        >
          {#if VIEWPORT_MOBILE_INIT[1]}
            {
              @html widgetDataTranslation.investor?.tab.description_investment.replace('<br/>', '')
              ?? 'This section provides a comprehensive overview of your investment in Betarena tokens ($BTA). '
            }
          {:else}
            {
              @html widgetDataTranslation.investor?.tab.description_investment
              ?? 'This section provides a comprehensive overview of your investment in Betarena tokens ($BTA). '
            }
          {/if}
        </p>

      </div>

      <LaunchpadWallets
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />

      <TgeMain
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />

      <MainInvestmentDetail
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />

      <MainWalletsInvestor
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />

      <MainVestingPeriods
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
    </div>

    <!--
    ▓ NOTE:
    ▓ > Referral Information Section
    -->
    <div
      id="section-referral"
    >
      <ReferralsSteps
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
      <ReferralsInfo
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
      <ReferralsBonusSummary
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
      <ReferralsHistory
        profileData={data}
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
    </div>

    <!--
    ▓ NOTE:
    ▓ > FAQ Information Section
    -->
    <div
      id="section-FAQ"
    >
      <MainFaq
        {VIEWPORT_MOBILE_INIT}
        {VIEWPORT_TABLET_INIT}
      />
    </div>

  </div>

{/await}

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ Svelte Component CSS/SCSS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ - auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE  │
│ - access custom Betarena Scores CSS VScode Snippets by typing 'style...'         │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#investor-grid-box
  {
    /* 🎨 style */
    display: grid;
    grid-template-columns: 1fr;
    gap: 64px 20px;

    div#launchpad-grid-box
    {
      /* 🎨 style */
      display: grid;
      gap: 20px;

      iframe
      {
        /* 🎨 style */
        // width: -webkit-fill-available;
        // width: -moz-available;
        width: 100%;
        border-radius: 12px;
        height: 216px;
        grid-row: 3;
      }
    }

    div#section-investing
    {
      /* 🎨 style */
      display: grid;
      gap: 20px;

      div#profile⮕w⮕investtge⮕main⮕title
      {
        // IMPORTANT
        :global
        {
          p#sub-title
          {
            /* 🎨 style */
            font-size: 16px;
            color: var(--grey);

            span#x3123
            {
              /* 🎨 style */
              font-weight: 500;
              color: var(--dark-theme);
            }
          }
        }
      }
    }

    div#section-referral
    {
      /* 🎨 style */
      display: grid;
      gap: 20px;
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
    div#investor-grid-box
    {
      div#launchpad-grid-box
      {
        iframe
        {
          /* 🎨 style */
          height: 372px;
        }
      }

      div#section-investing
      {
        /* 🎨 style */
        gap: 20px;
        // grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr;

        div#profile⮕w⮕investtge⮕main⮕title
        {
          /* 🎨 style */
          padding: 0 20px;
        }
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    // ▓ IMPORTANT
    // ▓ > require for parent mutation to have CSS for 'this' section work.
    // ▓ > WARNING:
    // ▓ > will not work, as post navigation away from 'this' section, will keep 'this' style, CSS.
    // :global
    // {
    //   main
    //   {
    //     /* 🎨 style */
    //     overflow: visible !important;
    //   }
    // }

    div#investor-grid-box
    {
      /* 🎨 style */
      gap: 80px 20px;

      div#launchpad-grid-box
      {
        /* 🎨 style */
        gap: 20px;
        grid-template-columns: 1fr 1fr;

        iframe
        {
          /* 🎨 style */
          height: 259px;
        }

        :global
        {
          div#profile⮕w⮕investor-title⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 3;
          }
          div#profile⮕w⮕investbox⮕main
          {
            /* 🎨 style */
            grid-row: 2 / 4;
            grid-column: 2;

            form
            {
              /* 📌 position */
              position: sticky;
              top: 75px;
            }
          }
          div#profile⮕w⮕investTierPricing⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 3;
          }
        }
      }

      div#section-investing
      {
        /* 🎨 style */
        // grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-columns: 282px 1fr;

        :global
        {
          div#profile⮕w⮕investtge⮕main⮕title
          {
            /* 🎨 style */
            grid-column: 1 / 5;
          }
          div#profile⮕w⮕launchpad-wallets⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 5;
          }
          div#profile⮕w⮕investtge⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 2;
          }
          div#profile⮕w⮕investment-detail⮕main
          {
            /* 🎨 style */
            grid-column: 2 / 5;
          }
          div#profile⮕w⮕investment-wallets⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 5;
          }
          div#profile⮕w⮕vesting-period⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 5;
          }
        }
      }

      div#section-referral
      {
        /* 🎨 style */
        gap: 20px 45px;
        grid-template-columns: 1fr 1fr;

        :global
        {
          div#profile⮕w⮕referral-step⮕main
          {
            /* 🎨 style */
            grid-column: 1 / 2;
            grid-row: 1 / 4;
          }
          div#profile⮕w⮕referral-info⮕main
          {
            /* 🎨 style */
            grid-column: 2;
          }
          div#profile⮕w⮕referral-bonus⮕main
          {
            /* 🎨 style */
            grid-column: 2;
          }
          div#profile⮕w⮕referral-history⮕main
          {
            /* 🎨 style */
            grid-column: 2;
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

  div#investor-grid-box
  {
    &.dark-background-1
    {
      background-color: transparent !important;

      div#profile⮕w⮕investtge⮕main⮕title
      {
        // IMPORTANT
        :global
        {
          p#sub-title
          {
            /* 🎨 style */
            color: var(--grey-shade-3);

            span#x3123
            {
              /* 🎨 style */
              color: var(--white) !important;
            }
          }
        }
      }
    }
  }

</style>
