<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
	import { FIXTURE_FULL_TIME_OPT, FIXTURE_LIVE_TIME_OPT } from "@betarena/scores-lib/dist/api/sportmonks.js";

	import { page } from "$app/stores";
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { toCorrectDate, toISOMod, toZeroPrefixDateStr } from "$lib/utils/dates.js";
	import { viewport_change } from "$lib/utils/platform-functions";
	import type { B_LS2_T, LS2_C_Fixture } from "@betarena/scores-lib/types/livescores-v2";
	import { onMount } from "svelte";
    import { isPWA } from "$lib/utils/device.js";

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let FIXTURE_D: LS2_C_Fixture
  export let server_side_language: string

  let WIDGET_T_DATA: B_LS2_T = $page.data?.LIVESCORES_V2_T_DATA
  $: WIDGET_T_DATA = $page.data?.LIVESCORES_V2_T_DATA

	let tickSecShow: boolean = false;

  let
    one_red_card: string,
    one_red_card_dark: string,
    two_red_card: string,
    two_red_card_dark: string,
    three_red_card: string,
    three_red_card_dark: string
  ;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  /**
   * @description triggers google event(s) for
   * a target action
   * @param {string} action
   * @returns void
   */
  function trigger_google_events (
    action: 'livescore_betting_tips' | 'livescore_betting_sites'
  ): void {
		if (
			action ===
			'livescore_betting_tips'
		) {
      // @ts-ignore
			window.gtag(
				'event',
				'livescore_betting_tips',
				{
					event_category:
						'widget_livescores_v2',
					event_label: 'click_betting_site_logo',
					value: 'click'
				}
			);
			return;
		}
    if (
			action ===
			'livescore_betting_sites'
		) {
      // @ts-ignore
			window.gtag(
				'event',
				'livescore_betting_sites',
				{
					event_category:
						'widget_livescores_v2',
					event_label: 'click_betting_site_logo',
					value: 'click'
				}
			);
			return;
		}
	}

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 475;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

   // #region ➤ 🔄 LIFECYCLE [SVELTE]

  onMount(() => {
    setInterval(async () => {
      tickSecShow = !tickSecShow;
    }, 500);
  })

  onMount
  (
    async () =>
    {
      one_red_card = (await import('./assets/1_red_card.svg')).default;
      one_red_card_dark = (await import('./assets/1_red_card_dark.svg')).default;
      two_red_card = (await import('./assets/2_red_cards.svg')).default;
      two_red_card_dark = (await import('./assets/2_red_cards_dark.svg')).default;
      three_red_card = (await import('./assets/3_red_cards.svg')).default;
      three_red_card_dark = (await import('./assets/3_red_cards_dark.svg')).default;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  class="
    row-space-out
    fixture-row
  "
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>
  <!--
  [ℹ] fixture left-side container
  -->
  <div
    class="row-space-start">
    <!--
    [ℹ] fixture LIVE minute box
    -->
    <div
      class="
        m-r-8
        fixture-time-box
        text-center
      "
    >
      <!--
      [ℹ] fixture == LIVE | minute show
      -->
      {#if FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_D?.status) && FIXTURE_D?.status != "HT"}
        {#if toISOMod($sessionStore.userDate) != toISOMod(FIXTURE_D?.fixture_day)}
          <p
            class="
              no-wrap
              s-12
              color-grey
              dark-theme-custom-1
            "
          >
            <!-- user-client date/time -->
            {
              toCorrectDate(FIXTURE_D?.fixture_day, false).getDate()
              + '/'
              + (toCorrectDate(FIXTURE_D?.fixture_day, false).getMonth() + 1)
            }
          </p>
        {/if}
        <p
          class="
            s-12
            no-wrap
            color-red-bright
          "
        >
          {FIXTURE_D?.minute || '-'}
          <span
            class:visibility-none={tickSecShow}
            >'
          </span>
        </p>
      <!--
      [ℹ] fixture == HT | abbrv show
      -->
      {:else if FIXTURE_D?.status === 'HT'}
        <p
          class="
            no-wrap
            s-12
            color-red-bright
          "
        >
          {WIDGET_T_DATA?.status_abbrev?.HT}
        </p>
      <!--
      [ℹ] fixture == FT | show TIME + abbrv show
      -->
      {:else}
        <p
          class="
            no-wrap
            s-12
            color-black-2
            dark-theme-custom-1
          "
          class:color-grey={FIXTURE_FULL_TIME_OPT.includes(FIXTURE_D?.status)}
        >
          <!-- HH/mm -->
          <!-- user-client date/time -->
          {
            toZeroPrefixDateStr(toCorrectDate(FIXTURE_D?.time, false).getHours())
            + ':'
            + toZeroPrefixDateStr(toCorrectDate(FIXTURE_D?.time, false).getMinutes())
          }
        </p>
        <!--
        [ℹ] show full-time status [translated]
        -->
        {#if FIXTURE_FULL_TIME_OPT.includes(FIXTURE_D?.status)}
          <p
            class="
              no-wrap
              s-12
              color-grey
              dark-theme-custom-1
            "
          >
            {WIDGET_T_DATA?.status_abbrev[FIXTURE_D?.status] || FIXTURE_D?.status}
          </p>
        {/if}
      {/if}
    </div>

    <!--
    [ℹ] fixture-teams with FIXTURE-LINK
    FIXME: syntax error
    -->
    <a
      href={FIXTURE_D?.urls == undefined ? '' : FIXTURE_D?.urls[server_side_language].replace('https://scores.betarena.com','')}
      class="width-auto"
      class:disable-anchor={FIXTURE_D?.urls == undefined || FIXTURE_D?.urls[server_side_language] == undefined}
      >
      <div
        class="
          column-start-grid-start
          fixture-teams-box
          cursor-pointer
        "
      >
        <!--
        [ℹ] fixture home team box
        -->
        <div
          class="row-space-start"
        >
          <!--
          [ℹ] fixture home team name
          -->
          <p
            class="
              s-14
              color-black-2
              w-500
              m-r-8
              odds-view
            "
            class:team-name-txt-mobile={mobileExclusive}
            class:team-lost-style={FIXTURE_D?.teams?.home?.score < FIXTURE_D?.teams?.away?.score}
          >
            {FIXTURE_D?.teams?.home?.name}
          </p>
          <!--
          [ℹ] fixture-red-cards show/hide
          <-conditional->
          -->
          {#if FIXTURE_D.teams?.home?.red_cards}
            {#if FIXTURE_D.teams?.home?.red_cards == 1}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                alt="default alt text"
                width="12"
                height="16"
              />
            {:else if FIXTURE_D?.teams?.home?.red_cards == 2}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                alt="default alt text"
                width="15"
                height="19"
              />
            {:else}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                alt="default alt text"
                width="15px"
                height="19px"
              />
            {/if}
          {/if}
        </div>
        <!--
        [ℹ] fixture away team box
        -->
        <div
          class="row-space-start"
        >
          <!--
          [ℹ] fixture away team name
          -->
          <p
            class="
              s-14
              color-black-2
              w-500
              m-r-8
              odds-view
            "
            class:team-lost-style={FIXTURE_D?.teams?.away?.score < FIXTURE_D?.teams?.home?.score}
            class:team-name-txt-mobile={mobileExclusive}
          >
            {FIXTURE_D?.teams?.away?.name}
          </p>
          <!--
          [ℹ] fixture-red-cards show/hide
          <-conditional->
          -->
          {#if FIXTURE_D.teams?.away?.red_cards}
            {#if FIXTURE_D.teams?.away?.red_cards == 1}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                alt="default alt text"
                width="12"
                height="16"
              />
            {:else if FIXTURE_D?.teams?.away?.red_cards == 2}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                alt="default alt text"
                width="15"
                height="19"
              />
            {:else}
              <img
                loading="lazy"
                src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                alt="default alt text"
                width="15px"
                height="19px"
              />
            {/if}
          {/if}
        </div>
      </div>
    </a>
  </div>
  <!--
  [ℹ] fixture right-side container
  -->
  <div
    class="row-space-end"
    style="width: auto;"
  >
    <!--
    [ℹ] tip-link box SHOW/HIDE
    -->
    {#if FIXTURE_D?.tips && FIXTURE_D?.tips[server_side_language]}
      <a
        rel="noreferrer"
        aria-label="tip_link_redirect"
        on:click={() =>
        trigger_google_events(
          'livescore_betting_tips'
        )}
        href={FIXTURE_D?.tips[server_side_language] == undefined ? '' : FIXTURE_D?.tips[server_side_language].replace('https://scores.betarena.com','')}
        target="_self"
        class="width-auto"
      >
        <div
          class="
            tip-box
            m-r-5
            cursor-pointer
          "
        >
          <p
            class="
              s-10
              w-500
              color-black-2
            "
          >
            {WIDGET_T_DATA?.tip || 'TIP'}
          </p>
        </div>
      </a>
    {/if}

    <!--
    [ℹ] bet-site SHOW/HIDE
    -->
    {#if $sessionStore?.sportbook_main && !isPWA()}
      <a
        rel="nofollow noreferrer"
        aria-label="livescore_betting_sites"
        on:click={() =>
          trigger_google_events(
            'livescore_betting_sites'
          )}
        href={$sessionStore?.sportbook_main?.register_link}
        target="_blank"
        style="width: inherit;"
      >
        <img
          loading="lazy"
          id="sportbook-logo-img"
          class="
            cursor-pointer
          "
          src={$sessionStore?.sportbook_main?.image}
          alt={$sessionStore?.sportbook_main?.title}
        />
      </a>
    {/if}

    <!--
    [ℹ] fixture scores BOX SHOW/HIDE
    -->
    {#if (FIXTURE_D?.teams?.away?.score && FIXTURE_D?.teams?.home?.score)
    || [...FIXTURE_FULL_TIME_OPT, ...FIXTURE_LIVE_TIME_OPT].includes(FIXTURE_D?.status)}
      <div
        class="
          column-space-center
          fixtures-scores-box
          m-l-5
        "
      >
        <!--
        [ℹ] home score
        -->
        <p
          class="
            s-12
            color-black-2
          "
          class:team-lost-style={FIXTURE_D?.teams?.home?.score < FIXTURE_D?.teams?.away?.score && !FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_D?.status)}
          class:color-red-bright={FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_D?.status)}
        >
          {FIXTURE_D?.teams?.home?.score}
        </p>
        <!--
        [ℹ] away score
        -->
        <p
          class="
            s-12
            color-black-2
          "
          class:team-lost-style={FIXTURE_D?.teams?.away?.score < FIXTURE_D?.teams?.home?.score && !FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_D?.status)}
          class:color-red-bright={FIXTURE_LIVE_TIME_OPT.includes(FIXTURE_D?.status)}
        >
          {FIXTURE_D?.teams?.away?.score}
        </p>
      </div>
    {/if}
  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div.fixture-row {
    padding: 5px 16px 5px 8px;
  }

  div.fixture-time-box {
		min-width: 37px;
    max-width: 37px;
	}

  div.fixture-teams-box {
		border-left: 1px var(--grey-color) solid;
		padding-left: 8px;
	} div.fixture-teams-box p.odds-view {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 85px;
	}

  div.fixtures-scores-box {
    width: 14px;
  }

  .team-lost-style {
    color: var(--grey) !important;
  }

  img#sportbook-logo-img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 4px;
    object-position: left;
  }

  div.tip-box {
		padding: 2.5px 7px;
		border-radius: 4px;
		border: 1px solid #cccccc;
	} div.tip-box:hover {
		border: 1px solid var(--primary) !important;
	} div.tip-box:hover p {
		color: var(--primary);
	}

  span.visibility-none {
		visibility: hidden;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

  .team-name-txt-mobile {
    /* font-weight: 400; */
  }

  @media only screen
    and (min-width: 375px) {
    div.fixture-teams-box p.odds-view {
      max-width: unset;
    }
  }

  @media only screen
    and (min-width: 475px) {
    div.fixture-row {
      padding: 5px 16px;
    }
    div.tip-box {
      padding: 6px 12px;
      margin-right: 16px;
    } div.tip-box p {
      font-size: 12px;
    }
    div.fixture-time-box {
      margin-right: 16px;
      min-width: 47px;
      max-width: 47px;
    } div.fixture-time-box p {
      font-size: 14px;
    }
    div.fixture-teams-box {
      padding-left: 16px;
    }
    img#sportbook-logo-img {
			width: 30px;
			height: 30px;
		}
    div.fixtures-scores-box {
      margin-left: 16px;
    } div.fixtures-scores-box p {
      font-size: 14px;
      font-weight: 500;
    }
  }

  /*
  =============
  DARK-THEME
  =============
  */

  .dark-background-1 div.fixture-teams-box {
		border-left: 1px var(--dark-theme-1-shade) solid;
  }

  .dark-background-1 .dark-theme-custom-1 {
    color: var(--dark-theme-1-3-shade) !important;
  }

  .dark-background-1 .team-lost-style {
    color: var(--dark-theme-1-3-shade) !important;
  }

  .dark-background-1 .color-red-bright {
    color: var(--red-bright) !important;
  }

  .dark-background-1 div.tip-box {
		border: 1px solid var(--dark-theme-1-2-shade);
	}

</style>