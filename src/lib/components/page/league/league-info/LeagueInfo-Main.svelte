<!-- ===============
  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { getImageBgColor } from '$lib/utils/color_thief';
	import { MONTH_NAMES_ABBRV } from '$lib/utils/dates.js';
	import { LI_W_T_STY, LI_W_T_TAG, LI_W_T_TOG, dlog } from '$lib/utils/debug';
	import { googleEventLog } from '$lib/utils/platform-functions.js';

	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import team_w from './assets/team-white.svg';
	import team from './assets/team.svg';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import World from './assets/_World.svelte';

	import type { B_FO_T } from '@betarena/scores-lib/types/fixture-odds';
	import type { B_LEG_D, LEG_SeasonData } from '@betarena/scores-lib/types/league-info';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

	export let LEAGUE_INFO_SEO_DATA: B_LEG_D;

  let FIXTURES_ODDS_T: B_FO_T = $page.data?.FIXTURES_ODDS_T
  $: FIXTURES_ODDS_T = $page.data?.FIXTURES_ODDS_T

	let noWidgetData: boolean = false;
	let dropdownSeasonSelect: LEG_SeasonData = undefined;
	let toggleDropdown: boolean = false;
	let toggleCTA: boolean = false;
	let datePercentageDiff: number = 0;
	let dateDateStartDisplay: string;
	let dateDateEndDisplay: string;
	let selectedOpt: number = 0;
	let imageVar: string = '--league-info-bookmaker-bg-';

  //#endregion ➤ [VARIABLES]

  // #region ➤ [METHODS]

  function mainIntercept
  (
  ): void
  {
    // =========
    // TODO:
    // Move (below) to @scores-lib;

		// ACTION: Sort seasons by "descending" of "name (as digits)";
		LEAGUE_INFO_SEO_DATA.data.seasons
    ?.sort
    (
			(
        a,
        b
      ) =>
      {
        const _b = b.name.replace(/\D/g, "");
        const _a = a.name.replace(/\D/g, "");
        return parseFloat(_b.toString().slice(-2)) - parseFloat(_a.toString().slice(-2))
      }
		);

		// ACTION: Convert season-names from "2021/2022" => "21/22"
		for (const season of LEAGUE_INFO_SEO_DATA?.data?.seasons)
    {
			// [ℹ] check if already processed
			if (season.name.length > 5) {
        if (season.name == '2024 Germany') {
          // do nothing;
          continue;
        }
				if (!season.name.includes('2020')) {
					season.name = season.name.replace(
						/20/g,
						''
					);
				}
        else {
					season.name = season.name.replace(
						'2020',
						'-'
					);
					season.name = season.name.replace(
						/20/g,
						''
					);
					season.name = season.name.replace(
						'-',
						'20'
					);
				}
			}
		}

    // Move (above) to @scores-lib;
    // =========

		// [ℹ] select 1st league/season
		dropdownSeasonSelect = LEAGUE_INFO_SEO_DATA?.data?.seasons?.[0];
		$sessionStore.selectedSeasonID = dropdownSeasonSelect.id;

		// [ℹ] intercept date-league-calculation
		const startDate: Date = LEAGUE_INFO_SEO_DATA?.data?.seasons?.[0]?.start_date;
		const endDate: Date =	LEAGUE_INFO_SEO_DATA.data?.seasons?.[0]?.end_date;

		validateSeasonProgressDate
    (
			startDate,
			endDate
		);

		LEAGUE_INFO_SEO_DATA = LEAGUE_INFO_SEO_DATA;
  }

  mainIntercept();

  // TODO: DOC:
	function validateSeasonProgressDate
  (
		start_end: Date,
		end_date: Date
	): void
  {

    const if_M_0: boolean =
      start_end == null
      || end_date == null
      || start_end == undefined
      || end_date == undefined
    ;
		if (if_M_0)
    {
      // [🐞]
      dlog
      (
        `${LI_W_T_TAG} identified as NULL!`,
        LI_W_T_TOG,
        LI_W_T_STY
      );

			datePercentageDiff = null;
			return;
		}

		// [ℹ] check if progress bar should have (%)
		const currentDate = new Date();
		const startDate = new Date(start_end);
		const endDate = new Date(end_date);

		dateDateStartDisplay =
			new Date(start_end).getUTCDate().toString() +
			' ' +
      FIXTURES_ODDS_T?.months_abbreviation[MONTH_NAMES_ABBRV[new Date(start_end).getMonth().toString()]]
    ;

		dateDateEndDisplay =
			new Date(end_date).getUTCDate().toString() +
			' ' +
			FIXTURES_ODDS_T?.months_abbreviation[MONTH_NAMES_ABBRV[new Date(end_date).getMonth().toString()]]
    ;

    const if_M_1: boolean =
      currentDate > startDate
      && currentDate < endDate
    ;
    const if_M_E_1: boolean =
      currentDate >= endDate
    ;
		if (if_M_1)
    {
      // @ts-ignore
			const seasonDiffDays = Math.floor((endDate - startDate) / 86400000);
      // @ts-ignore
			const currentDiffDays = Math.floor((endDate - currentDate) / 86400000);

			datePercentageDiff =
				100 - (currentDiffDays / seasonDiffDays) * 100
      ;
		}
    else if (if_M_E_1)
    {
			datePercentageDiff = 100;
		}
    else
    {
			datePercentageDiff = 0;
		}

	}

  // TODO: DOC:
	function selectSeason
  (
    season
  ): void
  {
		dropdownSeasonSelect = season;
		$sessionStore.selectedSeasonID = season.id;
		validateSeasonProgressDate
    (
			dropdownSeasonSelect.start_date,
			dropdownSeasonSelect.end_date
		);
	}

  // TODO: DOC:
	function closeAllDropdowns
  (
  ): void
  {
		toggleDropdown = false;
		toggleCTA = false;
	}

  // #endregion ➤ [METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

  $: if ($sessionStore?.sportbook_main)
  {
    LEAGUE_INFO_SEO_DATA.data.sportbook_detail = $sessionStore?.sportbook_main;
		const imageURL: string = LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.image;
		getImageBgColor(imageURL, imageVar);
  }

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= 1000) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 575) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				// [ℹ] TABLET - VIEW
				if (w >= 1000) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// [ℹ] MOBILE - VIEW
				if (w < 575) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] area-outside-for-close
-->
{#if toggleDropdown || toggleCTA}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div>

  <!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={LEAGUE_INFO_SEO_DATA.data.name}
      NO_DATA_TITLE={LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info}
      NO_DATA_DESC={LEAGUE_INFO_SEO_DATA?.data?.translation?.no_info_desc}
    />
  {/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <!--
    🖥️ LAPTOP
    -->
    {#if !mobileExclusive && !tabletExclusive}

      <div
        id="leagues-table-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      >

        <!--
        TOP ROW
        -->
        <div
          class=
          "
            row-space-out-top
            m-b-40
          "
        >

          <!--
          1st COLUMN
          -->
          <div
            class="row-space-start"
          >

            <!--
            LEAGUE LOGO
            -->
            <img
              id="league-logo"
              class="m-r-20"
              src={LEAGUE_INFO_SEO_DATA.data.image_path}
              alt={LEAGUE_INFO_SEO_DATA.data.name}
              width=80
              height=80
            />

            <div
              class="column-start-grid-start"
              style="width: fit-content;"
            >

              <!--
              LEAGUE NAME
              -->
              <h1
                id="widget-title"
                class=
                "
                  s-32
                  m-b-10
                  color-black-2
                  m-0
                "
                class:color-white={$userBetarenaSettings.theme == 'Dark'}
                style="margin: 0; font-weight: 700"
              >
                {LEAGUE_INFO_SEO_DATA?.data?.name}
              </h1>

              <!--
              EXTRA LEAGUE INFO
              -->
              <div
                class="row-space-start"
              >

                <!--
                LEAGUE COUNTRY
                -->
                <div
                  class=
                  "
                    row-space-start
                    m-r-16
                  "
                >

                  {#if LEAGUE_INFO_SEO_DATA?.data?.country == 'World'}

                    <div
                      style="width: auto;"
                      class=
                      "
                        row-space-start
                        m-r-10
                      "
                    >
                      <World />
                    </div>

                  {:else}

                    <img
                      id="country-img"
                      src={LEAGUE_INFO_SEO_DATA?.data?.country_logo}
                      alt={LEAGUE_INFO_SEO_DATA?.data?.country}
                      width=24
                      height=24
                      class="m-r-10"
                    />

                  {/if}

                  <p
                    class=
                    "
                      s-16
                      color-grey
                      w-500
                      m-0
                    "
                  >
                    {LEAGUE_INFO_SEO_DATA?.data?.country}
                  </p>

                </div>

                <!--
                NUMBER TEAMS
                -->
                <div
                  id="team-container"
                  class=
                  "
                    row-space-start
                    m-r-16
                  "
                >

                  <img
                    src={$userBetarenaSettings.theme == 'Dark' ? team_w : team}
                    alt={LEAGUE_INFO_SEO_DATA?.data?.translation?.teams}
                    width=24
                    height=24
                    class="m-r-8"
                  />

                  {#each LEAGUE_INFO_SEO_DATA?.data?.seasons || [] as item}
                    {#if dropdownSeasonSelect?.name === item.name}
                      <p
                        style="width: 70px;"
                        class=
                        "
                          s-14
                          w-500
                          color-grey
                          no-wrap
                        "
                      >
                        {item?.number_of_clubs || '-'}
                        {LEAGUE_INFO_SEO_DATA?.data?.translation?.teams}
                      </p>
                    {/if}
                  {/each}

                </div>

                <!--
                DROPDOWN SELECT
                -->
                <div
                  id="dropdown-seasons"
                  class="m-r-16"
                >

                  <div
                    class="row-space-start"
                    on:click={() => (toggleDropdown = !toggleDropdown)}
                  >

                    <!--
                    SELECTED SEASON
                    -->
                    <p
                      class=
                      "
                        s-14
                        m-r-5
                        color-primary
                        no-wrap
                      "
                    >
                      {dropdownSeasonSelect.name}
                    </p>

                    <!--
                    ARROW DOWN
                    -->
                    <img
                      src={!toggleDropdown ? arrow_down : arrow_up}
                      alt="arrow_down"
                      width=16
                      height=16
                    />

                  </div>

                  <!--
                  DROPDOWN
                  -->
                  {#if toggleDropdown}
                    <div
                      id="dropdown-list-main-container"
                    >
                      <div
                        id="dropdown-list-inner-container"
                      >
                        {#each LEAGUE_INFO_SEO_DATA?.data?.seasons || [] as item}
                          <p
                            class=
                            "
                              s-14
                              w-500
                              row-season
                              no-wrap
                            "
                            class:color-primary={item.name === dropdownSeasonSelect.name}
                            on:click={() => selectSeason(item)}
                          >
                            {item?.name}
                          </p>
                        {/each}
                      </div>
                    </div>
                  {/if}

                </div>

              </div>

            </div>
          </div>

          <!--
          2nd COLUMN
          -->
          <div>

            <!--
            EXTRA INFO + ACTIONS
            -->
            <div
              class=
              "
                row-space-end
                m-b-15
              "
            >

              {#if LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail}

                <div
                  id="button-extra-info-container"
                >
                  <div
                    id="betting-site-container"
                    class=
                    "
                      row-space-start
                      m-r-16
                    "
                  >

                    <a
                      rel="nofollow"
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() =>	googleEventLog('betting_site_logo_widget_league_info')}
                      href={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.register_link}
                      target="_blank"
                      style="width: inherit;"
                    >
                      <img
                        id="sportbook-logo-img"
                        src={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.image}
                        alt={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.title}
                      />
                    </a>

                    <button
                      class="place-bet-btn btn-primary"
                      on:click={() => (toggleCTA = !toggleCTA)}
                    >
                      <p
                        class="medium">
                        Bet now
                      </p>
                    </button>

                  </div>

                  <!--
                  EXTRA-INFO POPUP
                  -->
                  {#if toggleCTA}

                    <div
                      class="extra-info"
                      in:fade
                    >

                      <!--
                      BET-SITE IMAGE
                      -->
                      <a
                        rel="nofollow"
                        href={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.register_link}
                        aria-label="betting_site_logo_widget_league_info"
                        on:click={() =>	googleEventLog('betting_site_logo_widget_league_info')}
                        style="width: inherit;"
                      >
                        <img
                          alt={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.title}
                          src={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.image}
                          style="background-color: var({imageVar});"
                          class="extra-info-img"
                        />
                      </a>

                      <!--
                      EXTRA BET-SITE INFO
                      -->
                      <div
                        class="extra-info-container"
                      >

                        <p
                          class="large"
                        >
                          {LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.bonus_description}
                        </p>

                        <!--
                        BUTTON CTA
                        -->
                        <a
                          rel="nofollow"
                          href={LEAGUE_INFO_SEO_DATA?.data?.sportbook_detail?.register_link}
                          aria-label="betting_site_logo_widget_league_info"
                          on:click={() => googleEventLog('beting_cta_link_widget_league_info')}
                          target="_blank"
                        >

                          <button
                            class=
                            "
                              btn-primary
                              btn-cta
                            "
                            style="width: 100% !important;"
                          >
                            <p
                              class=
                              "
                                w-500
                                s-14
                                w-normal
                              "
                            >
                              Register
                            </p>
                          </button>

                        </a>

                        <!--
                        EXTRA TEXT INFO
                        -->
                        <p
                          class="small"
                          style="color: #CCCCCC;"
                        >
                          {LEAGUE_INFO_SEO_DATA.data.sportbook_detail.information}
                        </p>

                      </div>

                    </div>

                  {/if}
                </div>

              {/if}

              <!--
              FOLLOW BET - BUTTON
              -->
              {#if false}
                <button
                  id="following-btn"
                  class="cursor-not-allowed"
                >
                  <p
                    class=
                    "
                      s-14
                      color-grey
                      w-500
                      no-wrap
                    "
                  >
                    {LEAGUE_INFO_SEO_DATA?.data?.translation?.following}
                  </p>
                </button>
              {/if}

            </div>

            <!--
            SEASON START/END PROGRESS BAR
            -->
            <div
              class="row-space-start"
            >
              {#if datePercentageDiff != null}

                <p
                  class=
                  "
                    s-14
                    color-grey
                    w-500
                    m-r-10
                    no-wrap
                  "
                >
                  {dateDateStartDisplay}
                </p>

                <div
                  id="season-progressbar"
                  class="m-r-10"
                >
                  <div
                    style="width: {datePercentageDiff}%;"
                  />
                </div>

                <p
                  class=
                  "
                    s-14
                    color-grey
                    w-500
                    no-wrap
                  "
                >
                  {dateDateEndDisplay}
                </p>

              {/if}
            </div>

          </div>

        </div>

        <!--
        BOTTOM ROW
        -->
        <div
          id="view-tournaments-opt-container"
          class="row-space-start"
        >

          <!--
          OPTIONS VIEW BTN
          -->
          <div
            class=
            "
              opt-container
              cursor-pointer
              m-r-32
            "
            on:click={() => (selectedOpt = 0)}
            class:activeOpt={selectedOpt == 0}
          >
            <p
              class=
              "
                s-14
                color-grey
                w-500
                no-wrap
              "
            >
              {LEAGUE_INFO_SEO_DATA?.data?.translation?.overview}
            </p>
          </div>

          <!--
          CONTENT VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class=
              "
                opt-container
                cursor-not-allowed
                m-r-32
              "
              on:click={() => (selectedOpt = 1)}
              class:activeOpt={selectedOpt == 1}
            >
              <p
                class=
                "
                  s-14
                  color-grey
                  w-500
                  no-wrap
                "
              >
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.content}
              </p>
            </div>
          {/if}

          <!--
          STATS VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class=
              "
                opt-container
                cursor-not-allowed
                m-r-32
              "
              on:click={() => (selectedOpt = 2)}
              class:activeOpt={selectedOpt == 2}
            >
              <p
                class=
                "
                  s-14
                  color-grey
                  w-500
                  no-wrap
                "
              >
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.stats}
              </p>
            </div>
          {/if}

        </div>

      </div>

    <!--
    💻 TABLET
    TODO:
    -->
    {:else if !mobileExclusive && tabletExclusive}

      <div
        id="leagues-table-container"
        class:dark-background-1={$userBetarenaSettings.theme ==	'Dark'}
      >
        <!-- [ℹ] top-row data container
        -->
        <div class="row-space-out-top m-b-20">
          <!-- [ℹ] main league info-1st container
          -->
          <div class="row-space-start">
            <!-- [ℹ] tournament / league logo
            -->
            <img
              id="league-logo"
              class="m-r-20"
              src={LEAGUE_INFO_SEO_DATA.data
                .image_path}
              alt={LEAGUE_INFO_SEO_DATA.data
                .name}
              width="80px"
              height="80px"
            />

            <div
              class="column-start-grid-start"
              style="width: fit-content;"
            >
              <!-- [ℹ] wiget-title
              -->
              <h1
                id="widget-title"
                class="s-32 m-b-10 color-black-2 m-0"
                class:color-white={$userBetarenaSettings.theme ==
                  'Dark'}
                style="margin: 0; font-weight: 700"
              >
                {LEAGUE_INFO_SEO_DATA.data.name}
              </h1>

              <!-- [ℹ] under-league-info-title
              -->
              <div class="row-space-start">
                <!-- [ℹ] league-country
                -->
                <div
                  class="row-space-start m-r-16"
                >
                  {#if LEAGUE_INFO_SEO_DATA.data.country == 'World'}
                    <div
                      style="width: auto;"
                      class="row-space-start m-r-10"
                    >
                      <World />
                    </div>
                  {:else}
                    <img
                      id="country-img"
                      src={LEAGUE_INFO_SEO_DATA
                        .data.country_logo}
                      alt={LEAGUE_INFO_SEO_DATA
                        .data.country}
                      width="24"
                      height="24"
                      class="m-r-10"
                    />
                  {/if}
                  <p
                    class="s-16 color-grey w-500 m-0"
                  >
                    {LEAGUE_INFO_SEO_DATA.data
                      .country}
                  </p>
                </div>

                <!-- [ℹ] num. of teams
                -->
                <div
                  id="team-container"
                  class="row-space-start m-r-16"
                >
                  {#if $userBetarenaSettings.theme == 'Dark'}
                    <img
                      src={team_w}
                      alt={LEAGUE_INFO_SEO_DATA
                        .data.translation.teams}
                      width="24px"
                      height="24px"
                    />
                  {:else}
                    <img
                      src={team}
                      alt={LEAGUE_INFO_SEO_DATA
                        .data.translation.teams}
                      width="24px"
                      height="24px"
                    />
                  {/if}

                  {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                    {#if dropdownSeasonSelect.name === item.name}
                      <p
                        class="s-14 w-500 color-grey no-wrap"
                      >
                        {item?.number_of_clubs || '-'}
                        {LEAGUE_INFO_SEO_DATA
                          .data.translation
                          .teams}
                      </p>
                    {/if}
                  {/each}
                </div>

                <!-- [ℹ] dropdown season select
                -->
                <div
                  id="dropdown-seasons"
                  class="m-r-16"
                >
                  <div
                    class="row-space-start"
                    on:click={() =>
                      (toggleDropdown =
                        !toggleDropdown)}
                  >
                    <!-- [ℹ] display selected season (round)
                    -->
                    {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                      {#if dropdownSeasonSelect.name === item.name}
                        <p
                          class="
                            s-14
                            m-r-5
                            color-primary
                            no-wrap
                          "
                        >
                          {item.name}
                        </p>
                      {/if}
                    {/each}
                    <!-- [ℹ] arrow down [hidden-menu]
                    -->
                    {#if !toggleDropdown}
                      <img
                        src={arrow_down}
                        alt="arrow_down"
                        width="16px"
                        height="16px"
                      />
                    {:else}
                      <img
                        src={arrow_up}
                        alt="arrow_up"
                        width="16px"
                        height="16px"
                      />
                    {/if}
                  </div>

                  <!-- [ℹ] show-dropdown
                  -->
                  {#if toggleDropdown}
                    <div
                      id="dropdown-list-main-container"
                    >
                      <div
                        id="dropdown-list-inner-container"
                      >
                        {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                          <p
                            class="s-14 w-500 row-season no-wrap"
                            class:color-primary={item.name ===
                              dropdownSeasonSelect.name}
                            on:click={() =>
                              selectSeason(
                                item
                              )}
                          >
                            {item.name}
                          </p>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>

          <!-- [ℹ] sportsbook-logo & follow btn & container
          -->
          {#if false}
            <button
              id="following-btn"
              class="cursor-not-allowed"
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA?.data?.translation?.following}
              </p>
            </button>
          {/if}

        </div>

        <!-- [ℹ] extra tablet / mobile row
        -->
        <div class="row-space-out m-b-30">
          <!-- [ℹ] season start-end & progress-bar dates select
          -->
          <div class="row-space-start m-r-24">
            {#if datePercentageDiff != null}
              <p
                class="s-14 color-grey w-500 m-r-10 no-wrap"
              >
                {dateDateStartDisplay}
              </p>

              <div
                id="season-progressbar"
                class="m-r-10"
              >
                <div
                  style="width: {datePercentageDiff}%;"
                />
              </div>

              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {dateDateEndDisplay}
              </p>
            {/if}
          </div>

          <!-- [ℹ] sportsbook-logo
          -->
          {#if LEAGUE_INFO_SEO_DATA.data.sportbook_detail}
            <div
              id="button-extra-info-container"
            >
              <div
                id="betting-site-container"
                class="row-space-end"
              >
                <a
                  rel="nofollow"
                  aria-label="betting_site_logo_widget_league_info"
                  on:click={() => googleEventLog('betting_site_logo_widget_league_info')}
                  href={LEAGUE_INFO_SEO_DATA
                    .data.sportbook_detail
                    .register_link}
                  target="_blank"
                  style="width: inherit;"
                >
                  <img
                    id="sportbook-logo-img"
                    src={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .image}
                    alt={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .title}
                  />
                </a>
                <button
                  class="place-bet-btn btn-primary"
                  on:click={() =>
                    (toggleCTA = !toggleCTA)}
                >
                  <p class="medium">Bet now</p>
                </button>
              </div>

              <!-- [ℹ] extra-info pop-up container
              -->
              {#if toggleCTA}
                <div class="extra-info" in:fade>
                  <!--  [ℹ] site-image
                  -->
                  <a
                    rel="nofollow"
                    aria-label="betting_site_logo_widget_league_info"
                    on:click={() => googleEventLog('betting_site_logo_widget_league_info')}
                    href={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .register_link}
                    style="width: inherit;"
                  >
                    <img
                      style="background-color: var({imageVar});"
                      class="extra-info-img"
                      src={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .image}
                      alt={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .title}
                    />
                  </a>

                  <!--  [ℹ] extra-site info
                  -->
                  <div
                    class="extra-info-container"
                  >
                    <!--  [ℹ] text
                    -->
                    <p class="large">
                      {LEAGUE_INFO_SEO_DATA.data
                        .sportbook_detail
                        .bonus_description}
                    </p>
                    <!--  [ℹ] button_cta
                    -->
                    <a
                      rel="nofollow"
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() => googleEventLog('beting_cta_link_widget_league_info')}
                      href={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .register_link}
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
                    <!--  [ℹ] extra-site info text
                    -->
                    <p
                      class="small"
                      style="color: #CCCCCC;"
                    >
                      {LEAGUE_INFO_SEO_DATA.data
                        .sportbook_detail
                        .information}
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- [ℹ] bottom-row data container
        -->
        <div
          id="view-tournaments-opt-container"
          class="row-space-start"
        >
          <!--
          OVERVIEW VIEW BTN
          -->
          <div
            class="opt-container cursor-pointer m-r-32"
            on:click={() => (selectedOpt = 0)}
            class:activeOpt={selectedOpt == 0}
          >
            <p
              class="s-14 color-grey w-500 no-wrap"
            >
              {LEAGUE_INFO_SEO_DATA.data.translation.overview}
            </p>
          </div>

          <!--
          CONTENT VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => (selectedOpt = 1)}
              class:activeOpt={selectedOpt == 1}
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA.data.translation.content}
              </p>
            </div>
          {/if}

          <!--
          STATS VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class="opt-container cursor-not-allowed m-r-32"
              on:click={() => (selectedOpt = 2)}
              class:activeOpt={selectedOpt == 2}
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA.data
                  .translation.stats}
              </p>
            </div>
          {/if}

        </div>
      </div>

    <!--
    📱 MOBILE
    TODO:
    -->
    {:else}

      <div
        id="leagues-table-container"
        class:dark-background-1={$userBetarenaSettings.theme ==
          'Dark'}
      >
        <!-- [ℹ] top-row data container
        -->
        <div class="row-space-out-top m-b-20">
          <!-- [ℹ] main league info-1st container
          -->
          <div class="row-space-start">
            <!-- [ℹ] tournament / league logo
            -->
            <img
              id="league-logo"
              class="m-r-10"
              src={LEAGUE_INFO_SEO_DATA.data
                .image_path}
              alt={LEAGUE_INFO_SEO_DATA.data
                .name}
            />

            <div
              class="column-start-grid-start"
              style="width: fit-content;"
            >
              <!-- [ℹ] wiget-title
              -->
              <h1
                id="widget-title"
                class="s-16 m-b-10 color-black-2 m-0"
                class:color-white={$userBetarenaSettings.theme ==
                  'Dark'}
                style="margin: 0; font-weight: 700"
              >
                {LEAGUE_INFO_SEO_DATA.data.name}
              </h1>

              <!-- [ℹ] league-country
              -->
              <div
                class="row-space-start m-r-16"
              >
                {#if LEAGUE_INFO_SEO_DATA.data.country == 'World'}
                  <div
                    style="width: auto;"
                    class="row-space-start m-r-10"
                  >
                    <World />
                  </div>
                {:else}
                  <img
                    id="country-img"
                    src={LEAGUE_INFO_SEO_DATA
                      .data.country_logo}
                    alt={LEAGUE_INFO_SEO_DATA
                      .data.country}
                    width="24"
                    height="24"
                    class="m-r-10"
                  />
                {/if}
                <p
                  class="s-12 color-grey w-500 m-0"
                >
                  {LEAGUE_INFO_SEO_DATA.data
                    .country}
                </p>
              </div>
            </div>
          </div>

          <!-- [ℹ] dropdown season select
          -->
          <div id="dropdown-seasons">
            <div
              class="row-space-start"
              on:click={() =>
                (toggleDropdown =
                  !toggleDropdown)}
            >
              <!-- [ℹ] display selected season (round)
              -->
              {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                {#if dropdownSeasonSelect.name === item.name}
                  <p
                    class="
                      s-14
                      m-r-5
                      color-primary
                      no-wrap
                    "
                  >
                    {item.name}
                  </p>
                {/if}
              {/each}
              <!-- [ℹ] arrow down [hidden-menu]
              -->
              {#if !toggleDropdown}
                <img
                  src={arrow_down}
                  alt="arrow_down"
                  width="16px"
                  height="16px"
                />
              {:else}
                <img
                  src={arrow_up}
                  alt="arrow_up"
                  width="16px"
                  height="16px"
                />
              {/if}
            </div>

            <!-- [ℹ] show-dropdown
            -->
            {#if toggleDropdown}
              <div
                id="dropdown-list-main-container"
              >
                <div
                  id="dropdown-list-inner-container"
                >
                  {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
                    <p
                      class="s-14 w-500 row-season no-wrap"
                      class:color-primary={item.name ===
                        dropdownSeasonSelect.name}
                      on:click={() =>
                        selectSeason(item)}
                    >
                      {item.name}
                    </p>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- [ℹ] extra tablet / mobile row
        -->
        <div
          class="row-space-out m-b-20"
          style="align-items: flex-end;"
        >
          <!-- [ℹ] num. of teams
          -->
          <div
            id="team-container"
            class="column-space-center m-r-20"
            style="width: auto;"
          >
            {#if $userBetarenaSettings.theme == 'Dark'}
              <img
                src={team_w}
                alt={LEAGUE_INFO_SEO_DATA.data
                  .translation.teams}
                width="24px"
                height="24px"
              />
            {:else}
              <img
                src={team}
                alt={LEAGUE_INFO_SEO_DATA.data
                  .translation.teams}
                width="24px"
                height="24px"
              />
            {/if}

            {#each LEAGUE_INFO_SEO_DATA.data.seasons as item}
              {#if dropdownSeasonSelect.name === item.name}
                <p
                  class="s-12 w-500 color-grey no-wrap text-center"
                >
                  {item?.number_of_clubs || '-'}
                  {LEAGUE_INFO_SEO_DATA.data
                    .translation.teams}
                </p>
              {/if}
            {/each}
          </div>

          <!-- [ℹ] season start-end & progress-bar dates select
          -->
          <div class="column-space-start">
            {#if datePercentageDiff != null}
              <div
                id="season-progressbar"
                class="m-b-8"
              >
                <div
                  style="width: {datePercentageDiff}%;"
                />
              </div>

              <div class="row-space-out">
                <p
                  class="s-12 color-grey w-500 no-wrap"
                >
                  {dateDateStartDisplay}
                </p>
                <p
                  class="s-12 color-grey w-500 no-wrap"
                >
                  {dateDateEndDisplay}
                </p>
              </div>
            {/if}
          </div>
        </div>

        <!-- [ℹ] sportbook-logo + follow-btn
        -->
        <div class="m-b-20">

          <!-- [ℹ] sportsbook-logo
          -->
          {#if LEAGUE_INFO_SEO_DATA.data.sportbook_detail}
            <div
              id="button-extra-info-container"
            >
              <div
                id="betting-site-container"
                class="row-space-start m-b-8"
              >
                <a
                  rel="nofollow"
                  aria-label="betting_site_logo_widget_league_info"
                  on:click={() => googleEventLog('betting_site_logo_widget_league_info')}
                  href={LEAGUE_INFO_SEO_DATA
                    .data.sportbook_detail
                    .register_link}
                  target="_blank"
                  style="width: inherit;"
                >
                  <img
                    id="sportbook-logo-img"
                    src={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .image}
                    alt={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .title}
                  />
                </a>
                <button
                  class="place-bet-btn btn-primary"
                  on:click={() =>
                    (toggleCTA = !toggleCTA)}
                >
                  <p class="medium w-500">
                    Bet now
                  </p>
                </button>
              </div>

              <!-- [ℹ] extra-info pop-up container
              -->
              {#if toggleCTA}
                <div class="extra-info" in:fade>
                  <!--  [ℹ] site-image
                  -->
                  <a
                    rel="nofollow"
                    aria-label="betting_site_logo_widget_league_info"
                    on:click={() => googleEventLog('betting_site_logo_widget_league_info')}
                    href={LEAGUE_INFO_SEO_DATA
                      .data.sportbook_detail
                      .register_link}
                    style="width: inherit;"
                  >
                    <img
                      style="background-color: var({imageVar});"
                      class="extra-info-img"
                      src={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .image}
                      alt={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .title}
                    />
                  </a>

                  <!--  [ℹ] extra-site info
                  -->
                  <div
                    class="extra-info-container"
                  >
                    <!--  [ℹ] text
                    -->
                    <p class="large">
                      {LEAGUE_INFO_SEO_DATA.data
                        .sportbook_detail
                        .bonus_description}
                    </p>
                    <!--  [ℹ] button_cta
                    -->
                    <a
                      rel="nofollow"
                      aria-label="betting_site_logo_widget_league_info"
                      on:click={() => googleEventLog('beting_cta_link_widget_league_info')}
                      href={LEAGUE_INFO_SEO_DATA
                        .data.sportbook_detail
                        .register_link}
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
                    <!--  [ℹ] extra-site info text
                    -->
                    <p
                      class="small"
                      style="color: #CCCCCC;"
                    >
                      {LEAGUE_INFO_SEO_DATA.data
                        .sportbook_detail
                        .information}
                    </p>
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          {#if false}
            <button
              id="following-btn"
              class="cursor-not-allowed"
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA.data
                  .translation.following}
              </p>
            </button>
          {/if}

        </div>

        <!-- [ℹ] bottom-row data container
        -->
        <div
          id="view-tournaments-opt-container"
          class="row-space-even"
        >
          <!--
          OVERVIEW VIEW BTN
          -->
          <div
            class="opt-container cursor-pointer"
            on:click={() => (selectedOpt = 0)}
            class:activeOpt={selectedOpt == 0}
          >
            <p
              class="s-14 color-grey w-500 no-wrap"
            >
              {LEAGUE_INFO_SEO_DATA.data
                .translation.overview}
            </p>
          </div>

          <!--
          CONTENT VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class="opt-container cursor-not-allowed"
              on:click={() => (selectedOpt = 1)}
              class:activeOpt={selectedOpt == 1}
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA.data
                  .translation.content}
              </p>
            </div>
          {/if}

          <!--
          STATS VIEW BTN :: HIDDEN
          -->
          {#if false}
            <div
              class="opt-container cursor-not-allowed"
              on:click={() => (selectedOpt = 2)}
              class:activeOpt={selectedOpt == 2}
            >
              <p
                class="s-14 color-grey w-500 no-wrap"
              >
                {LEAGUE_INFO_SEO_DATA.data
                  .translation.stats}
              </p>
            </div>
          {/if}

        </div>
      </div>

    {/if}

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	#background-area-close
  {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1000;
	}

	#leagues-table-container
  {
		/* display: grid; */
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		/* overflow: hidden; */
		padding-bottom: 0; /* was 12px w/ the bottom row as "absolute" */
		position: relative;
	}

	img#league-logo
  {
		object-fit: contain;
		width: 40px;
		height: 40px;
	}

	img#country-img
  {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid #e6e6e6;
		object-fit: cover;
	}

	div#dropdown-seasons
  {
		padding: 4.5px 8px 4.5px 12px;
		border: 1px solid #cccccc;
		border-radius: 4px;
		position: relative;
		cursor: pointer;
	}
	div#dropdown-seasons:hover
  {
		border: 1px solid #8c8c8c;
	}
	div#dropdown-seasons div#dropdown-list-main-container
  {
		position: absolute;
		top: 115%;
		/* width: 100%; */
		/* background-color: #F2F2F2; */
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		z-index: 10000;
		/* height: 308px; */
		max-height: 308px;
		overflow-y: scroll;
		padding-right: 6px;
		/* right: 0; */
		left: 0;
	}
	div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar
  {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	div#dropdown-seasons div#dropdown-list-main-container::-webkit-scrollbar
  {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container
  {
		/* height: 308px; */
		max-height: 308px;
		overflow-y: scroll;
	}
	div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season
  {
		padding: 11px 20px;
	}
	div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season:hover
  {
		cursor: pointer;
		color: #f5620f !important;
	}

	/* width */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar
  {
		width: 4px;
	}
	/* track */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	}
	/* handle */
	div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb
  {
		background: #cccccc;
		border-radius: 12px;
	}

	div#season-progressbar
  {
		background: #e6e6e6;
		border-radius: 10px;
		max-width: 367px;
		width: 100%;
	}
	div#season-progressbar > div
  {
		background-color: #f5620f;
		/* width: 40%; */ /* Adjust with JavaScript */
		height: 8px;
		border-radius: 10px;
	}

	div#betting-site-container
  {
		width: 100%;
	}
	div#betting-site-container img#sportbook-logo-img
  {
		width: 100%;
		height: 40px;
		object-fit: none;
		border-radius: 8px;
		background-color: var(--league-info-bookmaker-bg-);
	}
	div#betting-site-container button.place-bet-btn
  {
		height: 40px;
		/* width: 120px; */
		min-width: 120px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px	rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-left: -12.5px;
	}

	button#following-btn
  {
		height: 40px;
		background-color: transparent;
		border: 1px solid #8c8c8c !important;
		border-radius: 8px;
		padding: 10px 30px;
		width: 100%;
	}
	button#following-btn:hover
  {
		border: 1px solid #f5620f !important;
	}
	button#following-btn:hover p
  {
		color: #f5620f;
	}

	div#view-tournaments-opt-container
  {
		/* position: absolute; */
		/* bottom: 0; */
		/* left: 0; */
		/* margin-left: 20px; */
	}
	div#view-tournaments-opt-container div.opt-container
  {
		border-bottom: solid 2.5px transparent;
		width: 100%;
		text-align: center;
	}
	div#view-tournaments-opt-container div.opt-container
		p
    {
		padding-bottom: 12px;
	}
	div#view-tournaments-opt-container div.opt-container.activeOpt
  {
		border-color: #f5620f;
	}
	div#view-tournaments-opt-container div.opt-container.activeOpt
		p
    {
		color: #f5620f !important;
	}

	#button-extra-info-container
  {
		position: relative;
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
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		position: absolute;
		top: 105%;
		right: 0;
		/* width: 289px; */
		max-width: 289px;
		width: 100%;
		display: grid;
		z-index: 100000000000;
		justify-items: center;
		overflow: hidden;
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

	/*
  =============
  RESPONSIVNESS
  =============
  */

	/*
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 575px) and (max-width: 1000px)
  {
		#leagues-table-container
    {
			min-width: 100%;
			/* max-width: 700px; */
		}

		button#following-btn
    {
			width: auto;
			position: absolute;
			top: 0;
			right: 0;
			margin: 20px 20px 0 0;
		}

		/* div#betting-site-container
    { */
		/* min-width: 289px; */
		/* max-width: 289px; */
		/* width: 100%; */
		/* } */
	}

	/*
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
	@media only screen and (min-width: 575px)
  {
		img#league-logo
    {
			width: 80px;
			height: 80px;
		}

		img#country-img
    {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			border: 1px solid #e6e6e6;
		}

		div#view-tournaments-opt-container div.opt-container
    {
			border-bottom: solid 2.5px transparent;
			width: auto;
		}

		div#betting-site-container img#sportbook-logo-img
    {
			/* width: 100%; */
			/* max-width: 169px; */
		}

		div#betting-site-container
    {
			width: 289px;
		}

		button#following-btn
    {
			width: auto;
		}
	}

	/*
  DESKTOP RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1000px)
  {
		#leagues-table-container
    {
			min-width: 100%;
			/* max-width: 560px; */
		}

		div#view-tournaments-opt-container div.opt-container:hover p
    {
			color: #292929 !important;
		}

		.dark-background-1 div#view-tournaments-opt-container div.opt-container:hover p
    {
			color: #ffffff !important;
		}

		div#season-progressbar
    {
			width: 367px !important;
		}

		.extra-info
    {
			left: 0;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 div#season-progressbar
  {
		background: #616161 !important;
	}

	.dark-background-1 div#dropdown-seasons div#dropdown-list-main-container
  {
		/* dark theme/dark-gray */
		background: #616161;
		/* shadow/black */
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
		border-radius: 4px;
	}

	.dark-background-1 div#dropdown-seasons div#dropdown-list-main-container div#dropdown-list-inner-container .row-season
  {
		color: #ffffff;
	}

	/* handle */
	.dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-thumb
  {
		background: #999999 !important;
	}
	/* track */
	.dark-background-1 div#dropdown-seasons div#dropdown-list-inner-container::-webkit-scrollbar-track
  {
		background: #4b4b4b !important;
	}

	.dark-background-1 div#dropdown-seasons
  {
		border: 1px solid #737373;
	}
</style>
