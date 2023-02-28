<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // IMPORTS GO HERE
	import { FIXTURE_FULL_TIME_OPT, FIXTURE_LIVE_TIME_OPT } from "$lib/models/sportmonks";

  //#region ➤ Svelte/SvelteKit Imports
  // IMPORTS GO HERE
	import { onMount } from "svelte";
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // (imports here)
  import { sessionStore } from "$lib/store/session";
  //
	import { userBetarenaSettings } from "$lib/store/user-settings";
  //#endregion ➤ Project Custom Imports

  //#region ➤ Firebase Imports
  // IMPORTS GO HERE
  //#endregion ➤ Firebase Imports

  //#region ➤ Types Imports
  // IMPORTS GO HERE
	import type { LS2_C_Fixture } from "@betarena/scores-lib/types/livescores-v2";
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  import one_red_card from './assets/1_red_card.svg';
  import one_red_card_dark from './assets/1_red_card_dark.svg';
  import two_red_card from './assets/2_red_cards.svg';
  import two_red_card_dark from './assets/2_red_cards_dark.svg';
  import three_red_card from './assets/3_red_cards.svg';
  import three_red_card_dark from './assets/3_red_cards_dark.svg';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let FIXTURE_D: LS2_C_Fixture
  export let server_side_language: string

	let tickSecShow: boolean = false;
  
  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function trigger_google_events (action: string) {
		if (
			action ===
			'betting_site_logo_football_fixtures_odds_tournament'
		) {
			window.gtag(
				'event',
				'betting_site_logo_football_fixtures_odds_tournament',
				{
					event_category:
						'widget_fixture_odds_info',
					event_label: 'click_betting_site_logo',
					value: 'click'
				}
			);
			return;
		}
	}

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  onMount(() => {
    setInterval(async () => {
      tickSecShow = !tickSecShow;
    }, 500);
  })

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

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
        m-r-16 
        fixture-time-box 
        text-center
      "
    >
      <!-- 
      [ℹ] fixture LIVE minute show
      -->
      {#if FIXTURE_D?.status === 'LIVE'}
        <p
          class="
            s-14 
            no-wrap
            color-red-bright
          "
        >
          {FIXTURE_D?.minute}
          <span
            class:visibility-none={tickSecShow}
            >'
          </span>
        </p>
      <!--
      [ℹ] fixture HT abbrv show
      -->
      {:else if FIXTURE_D?.status === 'HT'}
        <p
          class="
            no-wrap 
            s-14 
            color-black
          "
        >
          <!-- TODO: translations -->
          HT
        </p>
      <!-- 
      [ℹ] fixture show TIME
      [ℹ] plus appropiate abbreviations
      -->
      {:else}
        <p
          class="
            no-wrap 
            s-14 
            color-black-2
          "
          class:color-grey={[
            'FT',
            'FT_PEN',
            'AET'
          ].includes(
            FIXTURE_D?.status
          )}
        >
          {(`0${new Date(FIXTURE_D?.time + 'Z').getHours()}`.slice(-2)
          + ':'
          + `0${new Date(FIXTURE_D?.time + 'Z').getMinutes()}`.slice(-2))
          .split(' ').join('')}
        </p>
        {#if FIXTURE_D?.status === 'FT_PEN'}
          <p
            class="
              no-wrap 
              s-14 
              color-grey
            "
          >
            FT_PEN
          </p>
        {/if}
        {#if FIXTURE_D?.status === 'FT'}
          <p
            class="
              no-wrap 
              s-14 
              color-grey
            "
          >
            FT
          </p>
        {/if}
      {/if}
    </div>

    <!-- 
    [ℹ] fixture-teams with FIXTURE-LINK
    FIXME: syntax error
    -->
    <a
      href={FIXTURE_D?.urls == undefined ? '' : FIXTURE_D?.urls[server_side_language]}
      style="width: inherit;"
      class:disable-anchor={FIXTURE_D?.urls == undefined || FIXTURE_D?.urls[server_side_language] == undefined}
      >
      <div
        class="
          column-start-grid-start 
          fixture-teams-box
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
            class:color-grey={FIXTURE_D?.teams?.home?.score < FIXTURE_D?.teams?.away?.score}
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
                src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                alt=""
                width="12"
                height="16"
              />
            {:else if FIXTURE_D?.teams?.home?.red_cards == 2}
              <img
                src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                alt=""
                width="15"
                height="19"
              />
            {:else}
              <img
                src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                alt=""
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
            class:color-grey={FIXTURE_D
              ?.teams?.away
              ?.score <
              FIXTURE_D?.teams
                ?.home?.score}
          >
            {FIXTURE_D?.teams
              ?.away?.name}
          </p>
          <!-- 
          [ℹ] fixture-red-cards show/hide
          <-conditional->
          -->
          {#if FIXTURE_D.teams?.away?.red_cards}
            {#if FIXTURE_D.teams?.away?.red_cards == 1}
              <img
                src={$userBetarenaSettings.theme == 'Dark' ? one_red_card_dark : one_red_card}
                alt=""
                width="12"
                height="16"
              />
            {:else if FIXTURE_D?.teams?.away?.red_cards == 2}
              <img
                src={$userBetarenaSettings.theme == 'Dark' ? two_red_card_dark : two_red_card}
                alt=""
                width="15"
                height="19"
              />
            {:else}
              <img
                src={$userBetarenaSettings.theme == 'Dark' ? three_red_card_dark : three_red_card}
                alt=""
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
        rel="nofollow noreferrer"
        aria-label="tip_link_redirect"
        href={FIXTURE_D?.tips[
          server_side_language
        ]}
        target="_blank"
        style="width: inherit;"
      >
        <div
          class="
            tip-box 
            m-r-16
          "
        >
          <p
            class="
              s-12 
              w-500
              color-black-2
            "
          >
            TIP
          </p>
        </div>
      </a>
    {/if}

    <!-- 
    [ℹ] bet-site SHOW/HIDE
    -->
    {#if $sessionStore?.sportbook_main}
      <a
        rel="noreferrer"
        aria-label="betting_site_logo_football_fixtures_odds_tournament"
        on:click={() =>
          trigger_google_events(
            'betting_site_logo_football_fixtures_odds_tournament'
          )}
        href={$sessionStore?.sportbook_main?.register_link}
        target="_blank"
        style="width: inherit;"
      >
        <img
          id="sportbook-logo-img"
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
          m-l-24 
          fixtures-scores-box
        "
      >
        <!-- 
        [ℹ] home score
        -->
        <p
          class="
            s-14 
            w-500 
            color-black-2
          "
          class:color-grey={FIXTURE_D
            ?.teams?.home
            ?.score <
            FIXTURE_D?.teams?.away
              ?.score &&
            FIXTURE_D?.status !=
              'LIVE'}
          class:color-red-bright={FIXTURE_D?.status ===
            'LIVE'}
        >
          {FIXTURE_D?.teams?.home
            ?.score}
        </p>
        <!-- 
        [ℹ] away score
        -->
        <p
          class="
            s-14 
            w-500 
            color-black-2
          "
          class:color-grey={FIXTURE_D
            ?.teams?.away
            ?.score <
            FIXTURE_D?.teams?.home
              ?.score &&
            FIXTURE_D?.status !=
              'LIVE'}
          class:color-red-bright={FIXTURE_D?.status ===
            'LIVE'}
        >
          {FIXTURE_D?.teams?.away
            ?.score}
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
    padding: 5px 16px;
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

  div.tip-box {
		padding: 6px 12px;
		border-radius: 4px;
		border: 1px solid var(--grey-shade);
	} div.tip-box:hover {
		border: 1px solid var(--primary) !important;
	} div.tip-box:hover p {
		color: var(--primary);
	}

  span.visibility-none {
		visibility: hidden;
	}

  @media only screen
    and (min-width: 375px) {
    div.fixture-teams-box p.odds-view {
      max-width: unset;
    }
  }

  .dark-background-1 div.fixture-teams-box {
		border-left: 1px var(--dark-theme-1-shade) solid;
  }

</style>