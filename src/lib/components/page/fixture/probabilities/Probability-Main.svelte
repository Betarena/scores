<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { getImageBgColor } from '$lib/utils/color_thief';
	import { googleEventLog, viewport_change } from '$lib/utils/platform-functions.js';
  
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
  
	import type { B_PR_T, PR_Fixture } from '@betarena/scores-lib/types/probabilities.js';
	import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
	
  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_INFO: B_SAP_FP_D;
	export let FIXTURE_PROBS_TRANSLATION: B_PR_T;

  let FIXTURE_PROB_DATA: PR_Fixture;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1160;
  
	let mobileExclusive = false;
  let tabletExclusive = false;

	let loaded: boolean = false;
	let refresh: boolean = false;
	let no_widget_data: any = false;
	let showMore: boolean = false;
	let limitViewRow: number = 8;
	let toggleCTA: boolean = false;
	let toggleCTA_Key: string = undefined;
	let show_placeholder: boolean = false;
	let imageVar: string = '--probabilities-info-bookmaker-bg-';

	let exclude_prob_list = 
  [
		'home',
		'draw',
		'away',
		'correct_score'
	];

	let probabilities_order = 
  [
		'btts',
		'over_2_5',
		'over_3_5',
		'under_2_5',
		'under_3_5',
		'HT_over_0_5',
		'HT_under_0_5',
		'HT_over_1_5',
		'HT_under_1_5',
		'AT_over_0_5',
		'AT_under_0_5',
		'AT_over_1_5',
		'AT_under_1_5',
		'correct_score'
	];

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

	function toggleFullList
  (
  ): void 
  {
		showMore = !showMore;
		limitViewRow = showMore == true ? 100 : 8;
	}

	function toggleCTAFunc
  (
    key: string
  ): void 
  {
		if (toggleCTA_Key == key) 
    {
			toggleCTA = !toggleCTA;
      return;
    }
    toggleCTA = true;
    toggleCTA_Key = key;
	}

	function closeAllDropdowns
  (
  ) 
  {
		toggleCTA = false;
	}

  async function injectLiveOddsData
  (
  )
  {
		// [ℹ] match "data.key" (fixture_id)
		// [ℹ] with available (fixture_id's)
		// [ℹ] and populate the SPORTBOOK_DETAILS
		// [ℹ] based on the "top-1" OR avaialble ODDS
		// [ℹ] for the selected GEO-POSITION
		// [ℹ] and inject to LIVE_ODDS for TARGET FIXTURE

		if (SPORTBOOK_DETAILS_LIST == undefined) {
			// [🐞]
			logs.push(
				`SPORTBOOK_DETAILS_LIST is undefined`
			);
			lazy_load_data_check = true;
			return;
		}

		let count = 0;

		FIXTURE_PROB_DATA.odds = undefined;
		FIXTURE_PROB_DATA.odds = {
			_1x2: {
				home: undefined,
				away: undefined,
				draw: undefined
			},
			btts: undefined,
			over_2_5: undefined
		};

		for (const main_sportbook of SPORTBOOK_DETAILS_LIST) {
			const main_sportbook_title =
				main_sportbook?.title;
			for (const firebase_sportbook of sportbook_list) {
				const firebase_sportbook_title =
					firebase_sportbook?.sportbook;

				if (
					main_sportbook_title.toLowerCase() ==
						firebase_sportbook_title.toLowerCase() &&
					firebase_sportbook.markets != null &&
					firebase_sportbook.markets['1X2FT'] !=
						null &&
					firebase_sportbook.markets['1X2FT']
						.data[0].value != null &&
					firebase_sportbook.markets['1X2FT']
						.data[1].value != null &&
					firebase_sportbook.markets['1X2FT']
						.data[2].value != null &&
					count != 1
				) {
					// [🐞]
					logs.push(
						`main_sportbook_title: ${main_sportbook_title}`
					);
					logs.push(
						`firebase_sportbook: ${firebase_sportbook}`
					);

					// [ℹ] 1X2FT [ODDS]
					FIXTURE_PROB_DATA.odds._1x2.home =
						firebase_sportbook.markets[
							'1X2FT'
						].data[0].value.toFixed(2);
					FIXTURE_PROB_DATA.odds._1x2.draw =
						firebase_sportbook.markets[
							'1X2FT'
						].data[1].value.toFixed(2);
					FIXTURE_PROB_DATA.odds._1x2.away =
						firebase_sportbook.markets[
							'1X2FT'
						].data[2].value.toFixed(2);

					// [ℹ] BTSC [ODDS]
					if (
						firebase_sportbook.markets['BTSC'] !=
							null &&
						firebase_sportbook.markets['BTSC']
							.data[0].value != null &&
						firebase_sportbook.markets['BTSC']
							.data[1].value != null
					) {
						FIXTURE_PROB_DATA.odds.btts =
							firebase_sportbook.markets[
								'BTSC'
							].data[0].value.toFixed(2);
					}

					// [ℹ] HCTG3 [ODDS]
					if (
						firebase_sportbook.markets['HCTG3'] !=
							null &&
						firebase_sportbook.markets['HCTG3']
							.data[0].value != null &&
						firebase_sportbook.markets['HCTG3']
							.data[1].value != null
					) {
						FIXTURE_PROB_DATA.odds.over_2_5 =
							firebase_sportbook.markets[
								'HCTG3'
							].data[0].value.toFixed(2);
					}

					SPORTBOOK_INFO = main_sportbook;

					// [ℹ] distorted "sportmonks" image color-thief application
					const imageURL: string =
						SPORTBOOK_INFO?.image;
					getImageBgColor(imageURL, imageVar);

					count = 1;
				}
			}
		}

		// [ℹ] no sportbook is present
		if (count == 0) {
			// [ℹ] distorted "sportmonks" image color-thief application
			const imageURL: string =
				SPORTBOOK_INFO?.image;
			getImageBgColor(imageURL, imageVar);
		}

		FIXTURE_PROB_DATA = FIXTURE_PROB_DATA;
  }

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive, 
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function () 
      {
				resizeAction();
			}
		);
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] 
   * [REACTIVE]
   * @description 
   * listens to target "fixture" in "odds" data;
  */
  $: if ($sessionStore?.live_odds_fixture_target)
  {
    injectLiveOddsData()
  }

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() => 
    {
      resizeAction();
      addEventListeners();
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!-- 
[ℹ] area-outside-for-close 
-->
{#if toggleCTA}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div
	id="widget-outer"
	class:display-none={no_widget_data && !show_placeholder}
>

	<!-- 
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if no_widget_data && loaded && show_placeholder}
    <WidgetNoData 
      WIDGET_TITLE={FIXTURE_PROBS_TRANSLATION?.probabilities}
      NO_DATA_TITLE={FIXTURE_PROBS_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_PROBS_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!-- 
  MAIN WIDGET COMPONENT
  -->
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_PROBS_TRANSLATION?.probabilities}
    />

    <!-- 
    [ℹ] [MOBILE] [TABLET] [DESKTOP]
    [ℹ] (minimal) cross-platform design change
    -->

    <div
      id="prob-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!-- 
      [ℹ] Top Bet Site Box
      -->
      <div
        class="
          row-space-center
          bet-site-box
          m-b-8
        "
      >
        <p
          class="
            s-12
            color-grey
            m-r-10
          "
        >
          {FIXTURE_PROBS_TRANSLATION?.featured_by}
        </p>
        <a
          rel="nofollow"
          aria-label="fixture_football_fixtures_probabilities"
          on:click={() => googleEventLog('fixture_football_fixtures_probabilities')}
          href={SPORTBOOK_INFO?.register_link}
          target="_blank"
          style="width: fit-content;"
        >
          <img
            id="sportbook-logo-img"
            src={SPORTBOOK_INFO?.image}
            alt={SPORTBOOK_INFO?.title}
          />
        </a>
      </div>

      <!-- 
      [ℹ] Team Row (Prob + Odds)
      -->
      <div
        id="team-row-probabilities"
        class="
          row-space-out
        "
      >
        <!-- 
        HOME TEAM 
        -->
        <div
          class="
            column-space-center
            team-box
          "
        >
          <p
            class="
              w-500
              color-black-2
              market-type-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.home_team_win}
          </p>
          <!-- 
          Probabilities BUTTON
          + Bet-Site PopUp
          -->
          <div id="button-extra-info-container">
            <button
              class="
                place-bet-btn 
                btn-primary
              "
              on:click={() =>
                toggleCTAFunc('home')}
            >
              <p
                class="
                  w-500
                "
              >
                {FIXTURE_PROB_DATA?.probabilites?.home.toFixed(
                  0
                )}%
              </p>
            </button>

            <!-- 
            [ℹ] extra-info pop-up container
            -->
            {#if toggleCTA && toggleCTA_Key == 'home'}
              <div class="extra-info" in:fade>
                <!--  
                [ℹ] site-image 
                -->
                <a
                  rel="nofollow"
                  aria-label="fixture_football_fixtures_probabilities"
                  on:click={() =>
                    triggerGoggleEvents(
                      'fixture_football_fixtures_probabilities'
                    )}
                  href={SPORTBOOK_INFO?.register_link}
                  style="width: inherit;"
                >
                  <img
                    style="background-color: var({imageVar});"
                    class="extra-info-img"
                    src={SPORTBOOK_INFO?.image}
                    alt={SPORTBOOK_INFO?.title}
                  />
                </a>

                <!--  
                [ℹ] extra-site info 
                -->
                <div
                  class="extra-info-container"
                >
                  <!--  
                  [ℹ] text 
                  -->
                  <p class="large">
                    {SPORTBOOK_INFO?.bonus_description}
                  </p>
                  <!--  
                  [ℹ] button_cta 
                  -->
                  <a
                    rel="nofollow"
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() =>
                      triggerGoggleEvents(
                        'fixture_football_fixtures_probabilities'
                      )}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                  >
                    <button
                      class="btn-primary btn-cta"
                      style="width: 100% !important;"
                    >
                      <p
                        class="w-500 s-14 w-normal"
                      >
                        Register
                      </p>
                    </button>
                  </a>
                  <!--  
                  [ℹ] extra-site info text 
                  -->
                  <p
                    class="small"
                    style="color: #CCCCCC;"
                  >
                    {SPORTBOOK_INFO?.information}
                  </p>
                </div>
              </div>
            {/if}
          </div>
          <p
            class="
              w-400
              color-grey
              odds-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.odds}
            {#if FIXTURE_PROB_DATA?.odds?._1x2?.home != undefined}
              {FIXTURE_PROB_DATA?.odds?._1x2
                ?.home}
            {:else}
              -
            {/if}
          </p>
        </div>

        <!-- 
        DRAW 
        -->
        <div
          class="
            column-space-center
            team-box
          "
        >
          <p
            class="
              w-500
              color-black-2
              market-type-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.draw}
          </p>
          <!-- 
          Probabilities BUTTON
          + Bet-Site PopUp
          -->
          <div id="button-extra-info-container">
            <button
              class="
                place-bet-btn 
                btn-primary
              "
              on:click={() =>
                toggleCTAFunc('draw')}
            >
              <p
                class="
                  w-500
                "
              >
                {FIXTURE_PROB_DATA?.probabilites?.draw.toFixed(
                  0
                )}%
              </p>
            </button>

            <!-- 
            [ℹ] extra-info pop-up container
            -->
            {#if toggleCTA && toggleCTA_Key == 'draw'}
              <div class="extra-info" in:fade>
                <!--  
                [ℹ] site-image 
                -->
                <a
                  rel="nofollow"
                  aria-label="fixture_football_fixtures_probabilities"
                  on:click={() =>
                    triggerGoggleEvents(
                      'fixture_football_fixtures_probabilities'
                    )}
                  href={SPORTBOOK_INFO?.register_link}
                  style="width: inherit;"
                >
                  <img
                    style="background-color: var({imageVar});"
                    class="extra-info-img"
                    src={SPORTBOOK_INFO?.image}
                    alt={SPORTBOOK_INFO?.title}
                  />
                </a>

                <!--  
                [ℹ] extra-site info 
                -->
                <div
                  class="extra-info-container"
                >
                  <!--  
                  [ℹ] text 
                  -->
                  <p class="large">
                    {SPORTBOOK_INFO?.bonus_description}
                  </p>
                  <!--  
                  [ℹ] button_cta 
                  -->
                  <a
                    rel="nofollow"
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() =>
                      triggerGoggleEvents(
                        'fixture_football_fixtures_probabilities'
                      )}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                  >
                    <button
                      class="btn-primary btn-cta"
                      style="width: 100% !important;"
                    >
                      <p
                        class="w-500 s-14 w-normal"
                      >
                        Register
                      </p>
                    </button>
                  </a>
                  <!--  
                  [ℹ] extra-site info text 
                  -->
                  <p
                    class="small"
                    style="color: #CCCCCC;"
                  >
                    {SPORTBOOK_INFO?.information}
                  </p>
                </div>
              </div>
            {/if}
          </div>
          <p
            class="
              w-400
              color-grey
              odds-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.odds}
            {#if FIXTURE_PROB_DATA?.odds?._1x2?.draw != undefined}
              {FIXTURE_PROB_DATA?.odds?._1x2
                ?.draw}
            {:else}
              -
            {/if}
          </p>
        </div>

        <!-- 
        AWAY TEAM 
        -->
        <div
          class="
            column-space-center
            team-box
          "
        >
          <p
            class="
              w-500
              color-black-2
              market-type-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.away_team_win}
          </p>
          <!-- 
          Probabilities BUTTON
          + Bet-Site PopUp
          -->
          <div id="button-extra-info-container">
            <button
              class="
                place-bet-btn 
                btn-primary
              "
              on:click={() =>
                toggleCTAFunc('away')}
            >
              <p
                class="
                  w-500
                "
              >
                {FIXTURE_PROB_DATA?.probabilites?.away.toFixed(
                  0
                )}%
              </p>
            </button>

            <!-- 
            [ℹ] extra-info pop-up container
            -->
            {#if toggleCTA && toggleCTA_Key == 'away'}
              <div class="extra-info" in:fade>
                <!--  
                [ℹ] site-image 
                -->
                <a
                  rel="nofollow"
                  aria-label="fixture_football_fixtures_probabilities"
                  on:click={() =>
                    triggerGoggleEvents(
                      'fixture_football_fixtures_probabilities'
                    )}
                  href={SPORTBOOK_INFO?.register_link}
                  style="width: inherit;"
                >
                  <img
                    style="background-color: var({imageVar});"
                    class="extra-info-img"
                    src={SPORTBOOK_INFO?.image}
                    alt={SPORTBOOK_INFO?.title}
                  />
                </a>

                <!--  
                [ℹ] extra-site info 
                -->
                <div
                  class="extra-info-container"
                >
                  <!--  
                  [ℹ] text 
                  -->
                  <p class="large">
                    {SPORTBOOK_INFO?.bonus_description}
                  </p>
                  <!--  
                  [ℹ] button_cta 
                  -->
                  <a
                    rel="nofollow"
                    aria-label="fixture_football_fixtures_probabilities"
                    on:click={() =>
                      triggerGoggleEvents(
                        'fixture_football_fixtures_probabilities'
                      )}
                    href={SPORTBOOK_INFO?.register_link}
                    target="_blank"
                  >
                    <button
                      class="btn-primary btn-cta"
                      style="width: 100% !important;"
                    >
                      <p
                        class="w-500 s-14 w-normal"
                      >
                        Register
                      </p>
                    </button>
                  </a>
                  <!--  
                  [ℹ] extra-site info text 
                  -->
                  <p
                    class="small"
                    style="color: #CCCCCC;"
                  >
                    {SPORTBOOK_INFO?.information}
                  </p>
                </div>
              </div>
            {/if}
          </div>
          <p
            class="
              w-400
              color-grey
              odds-text
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.odds}
            {#if FIXTURE_PROB_DATA?.odds?._1x2?.away != undefined}
              {FIXTURE_PROB_DATA?.odds?._1x2
                ?.away}
            {:else}
              -
            {/if}
          </p>
        </div>
      </div>

      <!-- 
      [ℹ] Other Probabilities + Odds Box [TOP]
      -->
      <div
        id="probabilites-head-box"
        class="
          row-space-out
        "
      >
        <div
          class="
            prob-head-box
          "
        >
          <p
            class="
              w-400
              color-grey
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.market}
          </p>
        </div>
        <div
          class="
            prob-head-box
            text-center
          "
        >
          <p
            class="
              w-400
              color-grey
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.probabilities}
          </p>
        </div>
        <div
          class="
            prob-head-box
            text-center
          "
        >
          <p
            class="
              w-400
              color-grey
            "
          >
            {FIXTURE_PROBS_TRANSLATION?.odds}
          </p>
        </div>
      </div>

      <!-- 
      [ℹ] Other Probabilities + Odds Box [Section Main]
      -->
      {#each probabilities_order as prob_item_order}
        {#each Object.entries(FIXTURE_PROB_DATA.probabilites).slice(0, limitViewRow) as [key, value]}
          {#if prob_item_order == key}
            {#if !exclude_prob_list.includes(key)}
              <!-- 
              Probabilites ROW
              -->
              <div
                class="
                  row-space-out
                  prob-odds-row
                "
              >
                <!-- 
                Probabilities Title
                -->
                <p
                  class="
                    w-500
                    color-black-2
                    prob-title
                  "
                >
                  {FIXTURE_PROBS_TRANSLATION[
                    key
                  ]}:
                </p>
                <!-- 
                Probabilities BUTTON
                + Bet-Site PopUp
                -->
                <div
                  id="button-extra-info-container"
                >
                  <button
                    class="
                      place-bet-btn 
                      btn-primary
                    "
                    on:click={() =>
                      toggleCTAFunc(key)}
                  >
                    <p
                      class="
                        w-500
                      "
                    >
                      {value.toFixed(0)}%
                    </p>
                  </button>

                  <!-- 
                  [ℹ] extra-info pop-up container
                  -->
                  <div
                    class="extra-info fade-in"
                    class:display-none={!toggleCTA ||
                      toggleCTA_Key != key}
                    in:fade
                  >
                    <!--  
                    [ℹ] site-image 
                    -->
                    <a
                      rel="nofollow"
                      aria-label="fixture_football_fixtures_probabilities"
                      on:click={() =>
                        triggerGoggleEvents(
                          'fixture_football_fixtures_probabilities'
                        )}
                      href={SPORTBOOK_INFO?.register_link}
                      style="width: inherit;"
                    >
                      <img
                        style="background-color: var({imageVar});"
                        class="extra-info-img"
                        src={SPORTBOOK_INFO?.image}
                        alt={SPORTBOOK_INFO?.title}
                      />
                    </a>

                    <!--  
                    [ℹ] extra-site info 
                    -->
                    <div
                      class="extra-info-container"
                    >
                      <!--  
                      [ℹ] text 
                      -->
                      <p class="large">
                        {SPORTBOOK_INFO?.bonus_description}
                      </p>
                      <!--  
                      [ℹ] button_cta 
                      -->
                      <a
                        rel="nofollow"
                        aria-label="fixture_football_fixtures_probabilities"
                        on:click={() =>
                          triggerGoggleEvents(
                            'fixture_football_fixtures_probabilities'
                          )}
                        href={SPORTBOOK_INFO?.register_link}
                        target="_blank"
                      >
                        <button
                          class="btn-primary btn-cta"
                          style="width: 100% !important;"
                        >
                          <p
                            class="w-500 s-14 w-normal"
                          >
                            Register
                          </p>
                        </button>
                      </a>
                      <!--  
                      [ℹ] extra-site info text 
                      -->
                      <p
                        class="small"
                        style="color: #CCCCCC;"
                      >
                        {SPORTBOOK_INFO?.information}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 
                Equal Sign
                [TABLET] [DESKTOP]
                -->
                {#if !mobileExclusive}
                  <p
                    class="
                      w-400
                      color-grey
                      equal-sign
                    "
                  >
                    =
                  </p>
                {/if}
                <!-- 
                Odds BUTTON
                -->
                <button
                  class="
                    odds-box-btn
                  "
                >
                  <p
                    class="
                      color-grey
                      w-400
                    "
                  >
                    {#if key == 'btts' && FIXTURE_PROB_DATA?.odds?.btts != undefined}
                      {FIXTURE_PROB_DATA?.odds
                        ?.btts}
                    {:else if key == 'over_2_5' && FIXTURE_PROB_DATA?.odds?.over_2_5 != undefined}
                      {FIXTURE_PROB_DATA?.odds
                        ?.over_2_5}
                    {:else}
                      -
                    {/if}
                  </p>
                </button>
              </div>
            {/if}

            {#if key == 'correct_score'}
              <!--
              [ℹ] Correct Socre Title (txt)
              -->
              <p
                id="correct-score-text"
                class="
                  w-400
                  color-grey
                  text-center
                "
              >
                {FIXTURE_PROBS_TRANSLATION?.correct_score}
              </p>

              <!--
              [ℹ] Correct Socre Grid-Box (box)
              -->
              <div id="correct-score-box">
                {#each Object.entries(FIXTURE_PROB_DATA.probabilites.correct_score) as [key, value]}
                  <!-- 
                  Probabilities Title
                  -->
                  <div
                    class="
                      column-space-center
                    "
                  >
                    <p
                      class="
                        w-500
                        color-black-2
                      "
                    >
                      {key}
                    </p>
                    <!-- 
                    Probabilities BUTTON
                    + Bet-Site PopUp
                    -->
                    <div
                      id="button-extra-info-container"
                    >
                      <button
                        class="
                          place-bet-btn 
                          btn-primary
                        "
                        on:click={() =>
                          toggleCTAFunc(key)}
                      >
                        <p
                          class="
                            w-500
                          "
                        >
                          {value.toFixed(0)}%
                        </p>
                      </button>

                      <!-- 
                      [ℹ] extra-info pop-up container
                      -->
                      <div
                        class="extra-info fade-in"
                        class:display-none={!toggleCTA ||
                          toggleCTA_Key != key}
                        in:fade
                      >
                        <!--  
                        [ℹ] site-image 
                        -->
                        <a
                          rel="nofollow"
                          aria-label="fixture_football_fixtures_probabilities"
                          on:click={() =>
                            triggerGoggleEvents(
                              'fixture_football_fixtures_probabilities'
                            )}
                          href={SPORTBOOK_INFO?.register_link}
                          style="width: inherit;"
                        >
                          <img
                            style="background-color: var({imageVar});"
                            class="extra-info-img"
                            src={SPORTBOOK_INFO?.image}
                            alt={SPORTBOOK_INFO?.title}
                          />
                        </a>

                        <!--  
                        [ℹ] extra-site info 
                        -->
                        <div
                          class="extra-info-container"
                        >
                          <!--  
                          [ℹ] text 
                          -->
                          <p class="large">
                            {SPORTBOOK_INFO?.bonus_description}
                          </p>
                          <!--  
                          [ℹ] button_cta 
                          -->
                          <a
                            rel="nofollow"
                            aria-label="fixture_football_fixtures_probabilities"
                            on:click={() =>
                              triggerGoggleEvents(
                                'fixture_football_fixtures_probabilities'
                              )}
                            href={SPORTBOOK_INFO?.register_link}
                            target="_blank"
                          >
                            <button
                              class="btn-primary btn-cta"
                              style="width: 100% !important;"
                            >
                              <p
                                class="w-500 s-14 w-normal"
                              >
                                Register
                              </p>
                            </button>
                          </a>
                          <!--  
                          [ℹ] extra-site info text 
                          -->
                          <p
                            class="small"
                            style="color: #CCCCCC;"
                          >
                            {SPORTBOOK_INFO?.information}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p
                      class="
                        w-400
                        color-grey
                      "
                    >
                      {FIXTURE_PROBS_TRANSLATION?.odds}
                      -
                    </p>
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
        {/each}
      {/each}

      <!--
      [ℹ] Show more / show less (box)
      -->
      <div>
        <p
          id="show-more-box"
          on:click={() => toggleFullList()}
        >
          {#if !showMore}
            {FIXTURE_PROBS_TRANSLATION?.show_more_options}
          {:else}
            {FIXTURE_PROBS_TRANSLATION?.show_less}
          {/if}
        </p>
      </div>
    </div>

	{/if}
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* [ℹ] OTHER STYLE / CSS */

	#background-area-close 
  {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 998;
	}

	/* 
  widget-main 
  */
	div#prob-widget-container 
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		/* overflow: hidden; */
		width: 100%;
		position: relative;
		padding: 20px;
	}

	/* 
  bet-site 
  */
	div#prob-widget-container div.bet-site-box 
  {
		margin-bottom: 26px;
	}
	div#prob-widget-container div.bet-site-box img 
  {
		width: 67px;
		height: 28px;
		border-radius: 5.49px;
		object-fit: cover;
		z-index: 1;
	}

	/* 
  team probabilites box style 
  */
	div#prob-widget-container	div#team-row-probabilities 
  {
		margin-bottom: 24px;
		border-bottom: 1px #e6e6e6 solid;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box 
  {
		margin-right: 8px;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box:last-child 
  {
		margin-right: 0;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box	p.market-type-text 
  {
		font-size: 14px;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box	p.odds-text 
  {
		font-size: 14px;
		margin-bottom: 12px;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box	button.place-bet-btn 
  {
		height: 46px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-top: 8px;
		margin-bottom: 12px;
	}
	div#prob-widget-container	div#team-row-probabilities div.team-box	button.place-bet-btn p 
  {
		font-size: 14px;
	}

	/* 
  probabilites head box style 
  */
	div#prob-widget-container	div#probabilites-head-box 
  {
		margin-bottom: 12px;
	}
	div.prob-head-box 
  {
		width: 100%;
	}

	/* 
  probabilites [main] rows style 
  */
	div.prob-odds-row 
  {
		padding-bottom: 12px;
	}
	div.prob-odds-row p.prob-title 
  {
		font-size: 14px;
		width: 100%;
	}
	div.prob-odds-row	div#button-extra-info-container 
  {
		margin-right: 8px;
		margin-left: 8px;
	}
	div.prob-odds-row	div#button-extra-info-container	button.place-bet-btn 
  {
		height: 48px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-top: 0;
		padding: 0;
	}
	div.prob-odds-row	div#button-extra-info-container button.place-bet-btn p {
		font-size: 14px;
	}
	div.prob-odds-row p.equal-sign 
  {
		margin: 0 4px;
		font-size: 14px;
	}
	div.prob-odds-row button.odds-box-btn 
  {
		height: 48px;
		width: 100%;
		background-color: #ffffff;
		border-radius: 8px;
		margin-top: 0;
		border: 1px solid #cccccc !important;
		padding: 0;
	}
	div.prob-odds-row button.odds-box-btn p 
  {
		font-size: 14px;
	}

	/* 
  probabilites [correct-score] rows style 
  */
	p#correct-score-text 
  {
		font-size: 14px;
		margin-top: 8px;
		margin-bottom: 12px;
	}

	div#correct-score-box 
  {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: auto;
		grid-gap: 12px 16px;
	}
	div#correct-score-box button.place-bet-btn 
  {
		height: 48px;
		width: 100%;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-top: 8px;
		margin-bottom: 12px;
	}
	div#correct-score-box button.place-bet-btn p 
  {
		font-size: 14px;
	}

	#button-extra-info-container 
  {
		position: relative;
		width: 100%;
	}
	.extra-info-container 
  {
		padding: 20px;
		display: grid;
		justify-items: stretch;
		justify-content: center;
		align-items: center;
		align-content: center;
		text-align: center;
	}
	.extra-info-container p 
  {
		color: white;
	}
	.extra-info 
  {
		background: #4b4b4b;
		box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
		border-radius: 8px;
		top: 105%;
		max-width: 289px;
		width: 289px;
		display: grid;
		z-index: 999;
		justify-items: center;
		overflow: hidden;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
	}
	.extra-info-img
  {
		width: 100%;
		object-fit: contain;
		height: 40px;
	}
	.btn-cta 
  {
		border-radius: 8px !important;
		margin-top: 32px;
		margin-bottom: 16px;
		padding: 11.5px !important;
		width: -webkit-fill-available;
	}

	/* TODO: bring into one CLASS */
	button.place-bet-btn:hover,
	.btn-cta:hover 
  {
		background: #f77c42 !important;
	}

	/* 
  show-more / show-less style 
  */
	#show-more-box 
  {
		padding: 25px 0;
		padding-bottom: 0;
		text-align: center;
		white-space: nowrap;
		color: var(--primary);
		cursor: pointer;
		border-top: 1px solid #ebebeb;
		margin: 0 -20px;
		margin-top: 20px;
	}

	/*
  =============
  RESPONSIVNESS 
  =============
  */

	@media only screen 
  and (min-width: 726px) 
  and (max-width: 1160px)
  {
		#prob-widget-container 
    {
			min-width: 100%;
		}
	}

	@media only screen 
  and (min-width: 726px) 
  {
		div.prob-odds-row	div#button-extra-info-container 
    {
			margin-right: unset;
			margin-left: 8px;
		}
	}

	@media only screen 
  and (min-width: 1160px) 
  {
		#prob-widget-container 
    {
			min-width: 100%;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div#prob-widget-container.dark-background-1	div#team-row-probabilities 
  {
		border-bottom: 1px #616161 solid;
	}

	div#prob-widget-container.dark-background-1	div.prob-odds-row	button.odds-box-btn 
  {
		height: 48px;
		width: 100%;
		background-color: #4b4b4b;
		border-radius: 8px;
		margin-top: 0;
		border: 1px solid #737373 !important;
	}

	div#prob-widget-container.dark-background-1	#show-more-box 
  {
		border-top: 1px solid #616161;
	}

</style>
