<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { dlog, ST_W_T_STY, ST_W_T_TAG, ST_W_T_TOG } from '$lib/utils/debug';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { get } from '$lib/api/utils';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { getImageBgColor } from '$lib/utils/color_thief';

	import type { Cache_Single_SportbookDetails_Data_Response } from '$lib/models/tournaments/league-info/types';

  import type { B_STA_D, B_STA_T } from '@betarena/scores-lib/types/standings';

	import StandingsTeamRow from './_Standings_Team_Row.svelte';
	import StandingsWidgetContentLoader from './_Standings_Widget_ContentLoader.svelte';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
	import slider_left_dark from './assets/slider-left-dark.svg';
	import slider_left from './assets/slider-left.svg';
	import slider_right_dark from './assets/slider-right-dark.svg';
	import slider_right from './assets/slider-right.svg';

	let loaded: boolean = false; // [ℹ] holds boolean for data loaded;
	let refresh: boolean = false; // [ℹ] refresh value speed of the WIDGET;
	let refresh_data: any = undefined; // [ℹ] refresh-data value speed;
	let noStandingsBool: any = false; // [ℹ] identifies the noStandingsBool boolean;
	let dropdownSeasonSelect: any = undefined; // [ℹ] selected TOP LEAGUE;
	let toggleCTA: boolean = false;

	let diasbleDev: boolean = false;

	let selectedOpt: string = 'total';
	let refreshRow: boolean = false;
	let selectedOptTableMobile: number = 1;

	let currentSeason: number = undefined;

	let imageVar: string =
		'--standings-info-bookmaker-bg-';

	let only_total_view_league_ids = [
		732 // [ℹ] World Cup
	];

	export let STANDINGS_T: B_STA_T;
	export let STANDINGS_DATA: B_STA_D;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	// [ℹ] MAIN
	// [ℹ] In Use
	// [ℹ] (x1) cache
	async function widgetInit(): Promise<Cache_Single_SportbookDetails_Data_Response> {
		if (
			!$userBetarenaSettings.country_bookmaker
		) {
			return;
		}
		let userGeo =
			$userBetarenaSettings.country_bookmaker
				.toString()
				.toLowerCase();

		// [ℹ] [GET] response sportbook [geo]
		const response: Cache_Single_SportbookDetails_Data_Response =	await get
    (
      `/api/data/main/sportbook?geoPos=${userGeo}`,
      null,
      true,
      true
    );

		// [ℹ] data validation check
		if (response == undefined ||
			STANDINGS_DATA == undefined) {
      dlog(`${ST_W_T_TAG} ❌ no data available!`, ST_W_T_TOG, ST_W_T_STY);
			noStandingsBool = true;
			return;
		}
		// [ℹ] otherwise, no data
		else {
			noStandingsBool = false;
		}

		// loaded = true;

		// STANDINGS_T.data.sportbook_detail = response

		// [ℹ] distorted "sportmonks" image color-thief application
		const imageURL: string = response.image;
		getImageBgColor(imageURL, imageVar);

		// [ℹ] order dates by descending order;
		// STANDINGS_T.data.seasons.sort((a, b) => parseFloat(b.name.toString().slice(-2)) - parseFloat(a.name.toString().slice(-2)));

		// [ℹ] select same-seaon-as-league-info-widget;
		// dropdownSeasonSelect = STANDINGS_T.data.seasons[0]

		STANDINGS_T = STANDINGS_T;

		return response;
	}

	function selectTableView(opt: string) {
		selectedOpt = opt;
		refreshRow = true;
		setTimeout(async () => {
			refreshRow = false;
		}, 50);
	}

	function closeAllDropdowns() {
		toggleCTA = false;
    select_stage_dropdown = false;
	}

	function triggerGoggleEvents(action: string) {
		if (
			action === 'betting_site_logo_standings'
		) {
			window.gtag(
				'event',
				'betting_site_logo_standings',
				{
					event_category: 'widget_standings_info',
					event_label: 'click_betting_site_logo',
					value: 'click'
				}
			);
			return;
		}

		if (action === 'cta_button_standings') {
			window.gtag(
				'event',
				'cta_button_standings',
				{
					event_category: 'widget_standings_info',
					event_label: 'beting_cta_link_logo',
					value: 'click'
				}
			);
			return;
		}
	}

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let tabletView = 1000;
	let mobileView = 820;
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit <= mobileView) {
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
				if (w >= tabletView) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// [ℹ] MOBILE - VIEW
				if (w <= mobileView) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE METHODS
	// CRITICAL
	// ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data =
		$userBetarenaSettings.country_bookmaker;

	$: if (browser && refresh_data) {
		// [ℹ] reset necessary variables;
		refresh = true;
		loaded = false;
		noStandingsBool = false;
		// widgetInit()
		setTimeout(async () => {
			refresh = false;
		}, 100);
	}

	afterNavigate(async () => {
		widgetInit();
	});

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE OTHER
	// ~~~~~~~~~~~~~~~~~~~~~

	let loadedCurrentSeason: boolean = false;
	$: if (
		browser &&
		$sessionStore.selectedSeasonID != undefined &&
		!loadedCurrentSeason
	) {
		currentSeason =
			$sessionStore.selectedSeasonID;
		loadedCurrentSeason = true;
	}

	let seasonCheck: boolean = false;
	$: if (STANDINGS_DATA != undefined) {
		// [ℹ] (validation) check season exists;
		let season = STANDINGS_DATA.seasons.find(
			({ season_id }) =>
				season_id ===
				$sessionStore.selectedSeasonID
		);
		// [ℹ] (validation) check contains data;

		let seasonCheckLength = 0;
		if (season != undefined) {
			seasonCheckLength = season.standings.length;
		}
		noStandingsBool =
			seasonCheckLength == 0 ||
			seasonCheckLength == undefined
				? true
				: false;
		seasonCheck = true;
	} else {
		seasonCheck = true;
	}

  let stage_opt: string[] = []
  let select_stage_opt: string = ''
  let select_stage_dropdown: boolean = false;
  $: if (STANDINGS_DATA
    && $sessionStore.selectedSeasonID
  ) {
    stage_opt = []
    let target_stage = STANDINGS_DATA.seasons
      .find( ({ season_id }) =>
				season_id ===
				$sessionStore.selectedSeasonID
		  )
    ;
    let number_stages = target_stage?.standings.length
    dlog(`number_stages: ${number_stages}`, true)
    if (number_stages > 1) {
      dlog(`number_stages: ${number_stages}`, true)
      stage_opt = target_stage?.standings
        .map(a => a?.stage_name);
      dlog(`stage_opt ${stage_opt}`, true)
      select_stage_opt = stage_opt[0];
    }
    else {
      select_stage_opt = target_stage?.standings[0]?.stage_name
    }
  }

</script>

<!-- ===============
    COMPONENT HTML
=================-->

<!--
[ℹ] area-outside-for-close
-->
{#if toggleCTA || select_stage_dropdown}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<SeoBox>
  <h2>{STANDINGS_T?.translations?.standings}</h2>
  {#if STANDINGS_DATA != undefined
    && STANDINGS_DATA?.seasons.length != 0}
    <!--
    [ℹ] stage standings (regular)
    -->
    {#if !STANDINGS_DATA.seasons[0].standings[0].group_based}
      {#each STANDINGS_DATA.seasons[0].standings[0].total as team}
        <p>{team.team_name}</p>
      {/each}
    <!--
    [ℹ] stage standings (groups)
    -->
    {:else}
      {#each STANDINGS_DATA.seasons[0].standings[0].group_standings as group}
        <p>{group.group_name}</p>
        {#each group.total as team}
          <p>{team.team_name}</p>
        {/each}
      {/each}
    {/if}
  {/if}
</SeoBox>

<div>
	<!--
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
	{#if noStandingsBool && seasonCheck && !loaded}
		<!--
    [ℹ] title of the widget
    -->
		<h2
			class="s-20 m-b-10 w-500 color-black-2"
			style="margin-top: 0;"
			class:color-white={$userBetarenaSettings.theme ==
				'Dark'}
		>
			{STANDINGS_T?.translations.standings}
		</h2>

		<!--
    [ℹ] no-widget-data-avaiable-placeholder container
    -->
		<div
			id="no-widget-box"
			class="column-space-center"
			class:dark-background-1={$userBetarenaSettings.theme ==
				'Dark'}
		>
			<!--
      [ℹ] no-visual-asset
      -->
			{#if $userBetarenaSettings.theme == 'Dark'}
				<img
					src={no_visual_dark}
					alt="no_visual_dark"
					width="32"
					height="32"
					class="m-b-16"
				/>
			{:else}
				<img
					src={no_visual}
					alt="no_visual"
					width="32"
					height="32"
					class="m-b-16"
				/>
			{/if}

			<!--
      [ℹ] container w/ text
      -->
			<div>
				<p
					class="
            s-14
            m-b-8
            w-500
          "
					class:color-white={$userBetarenaSettings.theme ==
						'Dark'}
				>
					{STANDINGS_T.no_data_t.no_info}
				</p>
				<p
					class="
            s-14
            color-grey
            w-400
          "
				>
					{STANDINGS_T.no_data_t.no_info_desc}
				</p>
			</div>
		</div>
	{/if}

	<!--
  [ℹ] MAIN WIDGET COMPONENT
  -->
	{#if !noStandingsBool && !refresh && browser && $userBetarenaSettings.country_bookmaker && seasonCheck && !diasbleDev}
		<!--
    [ℹ] promise is pending
    -->
		{#await widgetInit()}
			<StandingsWidgetContentLoader />
			<!--
    [ℹ] promise was fulfilled
    -->
		{:then data}
			<!--
        [ℹ] widget-component [DESKTOP] [TABLET]
        -->
			{#if !mobileExclusive}
				<!--
          [ℹ] promise was fulfilled
          -->
				<h2
					class="
              s-20
              m-b-10
              w-500
              color-black-2
            "
					style="margin-top: 0px;"
					class:color-white={$userBetarenaSettings.theme ==
						'Dark'}
				>
					{STANDINGS_T.translations.standings}
				</h2>

				<div
					id="standings-table-container"
					class:dark-background-1={$userBetarenaSettings.theme ==
						'Dark'}
				>
					<!-- [ℹ] widget-top-selection-standings-view [DESKTOP]
            -->
					<div
						id="standings-view-box"
						class="
                row-space-out
                m-b-15
              "
					>
            <div
              class="
                row-space-start
              "
            >
              <div
                class="
                    stand-view-opt-box
                    cursor-pointer
                  "
                on:click={() =>
                  selectTableView('total')}
                class:activeOpt={selectedOpt ==
                  'total'}
                class:total_view_only={(only_total_view_league_ids.includes(
                  STANDINGS_DATA?.league_id) || STANDINGS_DATA?.comp_typ != 'domestic'
                )}
              >
                <p
                  class="
                      s-14
                      w-500
                      color-grey
                    "
                >
                  {STANDINGS_T.translations.total}
                </p>
              </div>

              <!--
              [ℹ] hide EXCLUSIVE leagues from HOME + AWAY VIEWS
              -->
              {#if !only_total_view_league_ids.includes(STANDINGS_DATA?.league_id)
                && STANDINGS_DATA?.comp_typ == 'domestic'}
                <div
                  class="
                      stand-view-opt-box
                      cursor-pointer
                    "
                  on:click={() =>
                    selectTableView('home')}
                  class:activeOpt={selectedOpt ==
                    'home'}
                >
                  <p
                    class="
                        s-14
                        w-500
                        color-grey
                      "
                  >
                    {STANDINGS_T.translations.home}
                  </p>
                </div>

                <div
                  class="
                      stand-view-opt-box
                      cursor-pointer
                    "
                  on:click={() =>
                    selectTableView('away')}
                  class:activeOpt={selectedOpt ==
                    'away'}
                >
                  <p
                    class="
                        s-14
                        w-500
                        color-grey
                      "
                  >
                    {STANDINGS_T.translations.away}
                  </p>
                </div>
              {/if}
            </div>

            <!--
            [ℹ] standings (stage/phase) select view
            -->
            {#if stage_opt.length > 1}
              <div
                id="ss-box">
                <div
                  class="
                    row-space-out
                  "
                  on:click={() => select_stage_dropdown = !select_stage_dropdown}>
                  <p
                    class="
                      color-black-2
                      w-400
                      no-wrap
                      m-r-10
                    ">
                    {select_stage_opt}
                  </p>
                  <img
                    src={select_stage_dropdown ? arrow_up : arrow_down}
                    alt="default alt"
                    width=20
                    height=20
                  />
                </div>
                {#if select_stage_dropdown}
                  <div
                    id="ssdb-main"
                  >
                    <div
                      id="ssdb-inner"
                    >
                      {#each stage_opt as item}
                        <p
                          class="
                            s-14
                            w-500
                            color-black-2
                            stage-opt
                            no-wrap
                          "
                          class:color-primary={item === select_stage_opt}
                          on:click={() => select_stage_opt = item}>
                          {item}
                        </p>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

					<!--
            [ℹ] [STASHED] [V1] [ALTERNATIVE TABLE]

              <!-- [ℹ] widget-top-row-table-standings [DESKTOP]
              - ->
              <div
                id="top-row-standings-head"
                class="row-space-out">

                <!-- [ℹ] widget table heade [first-left]
                - ->
                <div
                  class="row-space-start">
                  <p
                    class="s-12 m-r-20">
                    #
                  </p>

                  <p
                    class="s-12">
                    {STANDINGS_T.translations.team}
                  </p>
                </div>

                <!-- [ℹ] widget table heade [second-right]
                - ->
                <div
                  class="row-space-end">

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.pts}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.pld}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.w}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.d}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.l}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.gf}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.ga}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.gavg}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.yavg}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations.cavg}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations["1.5+"]}
                  </p>

                  <p
                    class="s-12 m-r-5">
                    {STANDINGS_T.translations["2.5+"]}
                  </p>

                  <p
                    class="s-12 m-r-20">
                    {STANDINGS_T.translations.prob}
                  </p>

                  <p
                    class="s-12">
                    {STANDINGS_T.translations.recent_form}
                  </p>
                </div>

              </div>

              <!-- [ℹ] widget-team-standing-row-table-standings [DESKTOP]
              - ->
              {#each STANDINGS_DATA.seasons as season}
                {#if season.season_id === $sessionStore.selectedSeasonID}
                  {#each season.teams as team}
                    <StandingsTeamRow TEAM_DATA={team} VIEW={selectedOpt} />
                  {/each}
                {/if}
              {/each}

            -->

					<table class="standings_table">
						<!--
              [ℹ] widget-top-row-table-standings [DESKTOP]
              -->
						<tr class="row-head">
							<th style="width: 100%;">
								<p class="s-12 m-r-20 color-grey">
									#
									<span class="m-r-20" />
									{STANDINGS_T.translations.team}
								</p>
							</th>

							<th>
								<p class="s-12 color-grey">
									{STANDINGS_T.translations.pts}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.pts.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.pts.description}
									</p>
								</div>
							</th>

							<th>
								<p class="s-12 color-grey">
									{STANDINGS_T.translations.pld}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.pld.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.pld.description}
									</p>
								</div>
							</th>

							<th class="">
								<p
									class="s-12 color-grey"
									style="width: 20px;"
								>
									{STANDINGS_T.translations.w}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.w.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.w.description}
									</p>
								</div>
							</th>

							<th class="">
								<p
									class="s-12 color-grey"
									style="width: 20px;"
								>
									{STANDINGS_T.translations.d}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.d.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.d.description}
									</p>
								</div>
							</th>

							<th>
								<p
									class="s-12 color-grey"
									style="width: 20px;"
								>
									{STANDINGS_T.translations.l}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.l.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.l.description}
									</p>
								</div>
							</th>

							<th class="">
								<p
									class="s-12 color-grey"
									style="width: 20px;"
								>
									{STANDINGS_T.translations.gf}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.gf.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.gf.description}
									</p>
								</div>
							</th>

							<th class="">
								<p
									class="s-12 color-grey"
									style="width: 20px;"
								>
									{STANDINGS_T.translations.ga}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.ga.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.ga.description}
									</p>
								</div>
							</th>

							<th class="">
								<p class="s-12 color-grey">
									{STANDINGS_T.translations.gavg}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.gavg.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.gavg.description}
									</p>
								</div>
							</th>

							<th class="">
								<p class="s-12 color-grey">
									{STANDINGS_T.translations.yavg}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.yavg.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.yavg.description}
									</p>
								</div>
							</th>

							<th class="">
								<p class="s-12 color-grey">
									{STANDINGS_T.translations.cavg}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.cavg.title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips.cavg.description}
									</p>
								</div>
							</th>

							<th class="">
								<p class="s-12 color-grey">
									{STANDINGS_T.translations[
										'1.5+'
									]}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips['1.5+'].title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips['1.5+']
											.description}
									</p>
								</div>
							</th>

							<th class="">
								<p class="s-12 color-grey">
									{STANDINGS_T.translations[
										'2.5+'
									]}
								</p>

								<div class="tooltip-extra-info">
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips['2.5+'].title}
									</p>
									<p
										class="s-12 color-white no-wrap"
									>
										{STANDINGS_T.translations
											.tooltips['2.5+']
											.description}
									</p>
								</div>
							</th>

							{#if $sessionStore.selectedSeasonID && currentSeason != undefined}
								{#if $sessionStore.selectedSeasonID === currentSeason}
									<th>
										<p class="s-12 color-grey">
											{STANDINGS_T.translations
												.prob}
										</p>

										<div
											class="tooltip-extra-info"
										>
											<p
												class="s-12 color-white no-wrap"
											>
												{STANDINGS_T.translations
													.tooltips.prob.title}
											</p>
											<p
												class="s-12 color-white no-wrap"
											>
												{STANDINGS_T.translations
													.tooltips.prob
													.description}
											</p>
										</div>
									</th>
								{/if}
							{/if}

							<th>
								<p
									class="s-12 color-grey"
									style="width: 70px;"
								>
									{STANDINGS_T.translations
										.recent_form}
								</p>
							</th>
						</tr>

						<!--
            [ℹ] widget-team-standing-row-table-standings [DESKTOP]
            -->
						{#each STANDINGS_DATA.seasons as season}
							{#if season.season_id === $sessionStore.selectedSeasonID}
                <!--
                [ℹ] iterate over each stage (phase) available
                -->
                {#each season.standings as standing}
                  {#if standing?.stage_name == select_stage_opt}
                    <!--
                    [ℹ] STANDINGS IS A REGUALR-TYPE
                    -->
                    {#if !standing.group_based}
                      {#each standing[selectedOpt] as team}
                        <StandingsTeamRow
                          TEAM_DATA={team}
                          {currentSeason}
                        />
                      {/each}
                    <!--
                    [ℹ] STANDINGS IS A GROUP-STAGE-TYPE
                    -->
                    {:else}
                      {#each standing.group_standings as group}
                        <tr class="group-row-head">
                          <td colspan="20">
                            <div
                              class="table-divider"
                            />
                            <p
                              class="
                                  w-500
                                  color-black-2
                                  group-head-text
                                  text-center
                                "
                            >
                              {STANDINGS_T
                                ?.translations?.group}
                              {group.group_name.split(
                                ' '
                              )[1]}
                            </p>
                          </td>
                        </tr>
                        {#each group[selectedOpt] as team}
                          <StandingsTeamRow
                            TEAM_DATA={team}
                            {currentSeason}
                          />
                        {/each}
                      {/each}
                      <tr class="row-divider">
                        <td colspan="20">
                          <div
                            class="table-divider"
                          />
                        </td>
                      </tr>
                    {/if}
                  {/if}
                {/each}
							{/if}
						{/each}
					</table>

					<!--
            [ℹ] widget-sportbook-details-table-standings [DESKTOP]
            -->
					<div
						id="standings-sportbook-details"
						class="m-t-20"
					>
						{#if data}
							<div
								id="button-extra-info-container"
							>
								<div
									id="betting-site-container"
									class="
                      row-space-start
                      m-r-16
                      cursor-pointer
                    "
								>
									<a
										rel="nofollow"
										aria-label="betting_site_logo_standings"
										on:click={() =>
											triggerGoggleEvents(
												'betting_site_logo_standings'
											)}
										href={data.register_link}
										target="_blank"
										style="width: inherit;"
									>
										<img
											id="sportbook-logo-img"
											src={data.image}
											alt={data.title}
										/>
									</a>

									<button
										class="
                        place-bet-btn
                        btn-primary
                      "
										aria-label="toggleCTA"
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
											aria-label="betting_site_logo_standings"
											on:click={() =>
												triggerGoggleEvents(
													'betting_site_logo_standings'
												)}
											href={data.register_link}
											style="width: inherit;"
										>
											<img
												style="background-color: var({imageVar});"
												class="extra-info-img"
												src={data.image}
												alt={data.title}
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
												{data.bonus_description}
											</p>
											<!--
                        [ℹ] button_cta
                        -->
											<a
												rel="nofollow"
												aria-label="cta_button_standings"
												on:click={() =>
													triggerGoggleEvents(
														'cta_button_standings'
													)}
												href={data.register_link}
												target="_blank"
											>
												<button
													class="
                              btn-primary
                              btn-cta
                            "
													aria-label="registerCTA"
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
												{data.information}
											</p>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!--
        [ℹ] widget-component [MOBILE]
        -->
			{:else}
				<!--
        [ℹ] promise was fulfilled
        -->
				<h1
					class="s-20 m-b-10 w-500 color-black-2"
					style="margin-top: 0px;"
					class:color-white={$userBetarenaSettings.theme ==
						'Dark'}
				>
					{STANDINGS_T.translations.standings}
				</h1>

				<div
					id="standings-table-container"
					class:dark-background-1={$userBetarenaSettings.theme ==
						'Dark'}
				>
					<!-- [ℹ] widget-top-selection-standings-view [DESKTOP]
            -->
					<div
						id="standings-view-box"
						class="
                row-space-start
                m-b-20
              "
					>
						<div
							class="
                  stand-view-opt-box
                  cursor-pointer
                "
							on:click={() =>
								selectTableView('total')}
							class:activeOpt={selectedOpt ==
								'total'}
							class:total_view_only={(only_total_view_league_ids.includes(
								STANDINGS_DATA?.league_id) || STANDINGS_DATA?.comp_typ == 'domestic'
							)}
						>
							<p
								class="
                    s-14
                    w-500
                    color-grey
                  "
							>
								{STANDINGS_T.translations.total}
							</p>
						</div>

						<!--
              [ℹ] hide EXCLUSIVE leagues from HOME + AWAY VIEWS
              -->
						{#if !only_total_view_league_ids.includes(STANDINGS_DATA?.league_id)
              && STANDINGS_DATA?.comp_typ == 'domestic'}
							<div
								class="stand-view-opt-box cursor-pointer"
								on:click={() =>
									selectTableView('home')}
								class:activeOpt={selectedOpt ==
									'home'}
							>
								<p class="s-14 w-500 color-grey">
									{STANDINGS_T.translations.home}
								</p>
							</div>

							<div
								class="stand-view-opt-box cursor-pointer"
								on:click={() =>
									selectTableView('away')}
								class:activeOpt={selectedOpt ==
									'away'}
							>
								<p class="s-14 w-500 color-grey">
									{STANDINGS_T.translations.away}
								</p>
							</div>
						{/if}
					</div>

          <!--
          [ℹ] standings (stage/phase) select view
          -->
          {#if stage_opt.length > 1}
            <div
              id="ss-box">
              <div
                class="
                  row-space-out
                "
                on:click={() => select_stage_dropdown = !select_stage_dropdown}>
                <p
                  class="
                    color-black-2
                    w-400
                    no-wrap
                    m-r-10
                  ">
                  {select_stage_opt}
                </p>
                <img
                  src={select_stage_dropdown ? arrow_up : arrow_down}
                  alt="default alt"
                  width=20
                  height=20
                />
              </div>
              {#if select_stage_dropdown}
                <div
                  id="ssdb-main"
                >
                  <div
                    id="ssdb-inner"
                  >
                    {#each stage_opt as item}
                      <p
                        class="
                          s-14
                          w-500
                          color-black-2
                          stage-opt
                          no-wrap
                        "
                        class:color-primary={item === select_stage_opt}
                        on:click={() => select_stage_opt = item}>
                        {item}
                      </p>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}

					<!-- [ℹ] widget table view mobile select
            -->
					<div
						id="mobile-table-box"
						class="row-space-out m-b-12"
					>
						<button
							class="table-nav-btn"
							aria-label="selectedOptionTableMobile"
							disabled={selectedOptTableMobile ==
								1}
							on:click={() =>
								(selectedOptTableMobile =
									selectedOptTableMobile - 1)}
						>
							{#if $userBetarenaSettings.theme == 'Dark'}
								<img
									src={slider_left_dark}
									alt="default alt text"
								/>
							{:else}
								<img src={slider_left} alt="default alt text" />
							{/if}
						</button>

						<p class="s-14 w-500 color-black-2">
							{STANDINGS_T.translations.table}
							{selectedOptTableMobile}
						</p>

						<button
							class="table-nav-btn"
							aria-label="selectedOptionTableMobile"
							disabled={selectedOptTableMobile ==
								3}
							on:click={() =>
								(selectedOptTableMobile =
									selectedOptTableMobile + 1)}
						>
							{#if $userBetarenaSettings.theme == 'Dark'}
								<img
									src={slider_right_dark}
									alt="default alt text"
								/>
							{:else}
								<img src={slider_right} alt="default alt text" />
							{/if}
						</button>
					</div>

					<!--
          [ℹ] STANDINGS TABLE
          -->
					<table class="standings_table">
						<!-- [ℹ] widget-top-row-table-standings [DESKTOP]
              -->
						<tr class="row-head">
							<th style="width: 100%;">
								<p class="s-12 m-r-20 color-grey">
									#
									<span class="m-r-20" />
									{STANDINGS_T.translations.team}
								</p>
							</th>

							<!-- [ℹ] table view 1
                -->
							{#if selectedOptTableMobile == 1}
								<th>
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.pts}
									</p>
								</th>

								<th>
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.pld}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.w}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.d}
									</p>
								</th>

								<th>
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.l}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.gf}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations.ga}
									</p>
								</th>
							{/if}

							<!-- [ℹ] table view 2
                -->
							{#if selectedOptTableMobile == 2}
								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations
											.gavg}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations
											.yavg}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations
											.cavg}
									</p>
								</th>

								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations[
											'1.5+'
										]}
									</p>
								</th>
							{/if}

							<!-- [ℹ] table view 3
                -->
							{#if selectedOptTableMobile == 3}
								<th class="">
									<p class="s-12 color-grey">
										{STANDINGS_T.translations[
											'2.5+'
										]}
									</p>
								</th>

								{#if $sessionStore.selectedSeasonID && currentSeason != undefined}
									{#if $sessionStore.selectedSeasonID === currentSeason}
										<th>
											<p class="s-12 color-grey">
												{STANDINGS_T.translations
													.prob}
											</p>
										</th>
									{/if}
								{/if}

								<th>
									<p
										class="s-12 color-grey no-wrap"
									>
										{STANDINGS_T.translations
											.recent_form}
									</p>
								</th>
							{/if}
						</tr>

						<!--
              [ℹ] widget-team-standing-row-table-standings [DESKTOP]
              -->
            {#each STANDINGS_DATA.seasons as season}
							{#if season.season_id === $sessionStore.selectedSeasonID}
                <!--
                [ℹ] iterate over each stage (phase) available
                -->
                {#each season.standings as standing}
                  {#if standing?.stage_name == select_stage_opt}
                    <!--
                    [ℹ] STANDINGS IS A REGUALR-TYPE
                    -->
                    {#if !standing.group_based}
                      {#each standing[selectedOpt] as team}
                        <StandingsTeamRow
                          TEAM_DATA={team}
                          TABLEMOBILEVIEW={selectedOptTableMobile}
                          {currentSeason}
                        />
                      {/each}
                    <!--
                    [ℹ] STANDINGS IS A GROUP-STAGE-TYPE
                    -->
                    {:else}
                      {#each standing.group_standings as group}
                        <tr class="group-row-head">
                          <td colspan="20">
                            <div
                              class="table-divider"
                            />
                            <p
                              class="
                                  w-500
                                  color-black-2
                                  group-head-text
                                  text-center
                                "
                            >
                              {STANDINGS_T
                                ?.translations?.group}
                              {group.group_name.split(
                                ' '
                              )[1]}
                            </p>
                          </td>
                        </tr>
                        {#each group[selectedOpt] as team}
                          <StandingsTeamRow
                            TEAM_DATA={team}
                            TABLEMOBILEVIEW={selectedOptTableMobile}
                            {currentSeason}
                          />
                        {/each}
                      {/each}
                      <tr class="row-divider">
                        <td colspan="20">
                          <div
                            class="table-divider"
                          />
                        </td>
                      </tr>
								    {/if}
                  {/if}
                {/each}
							{/if}
						{/each}
					</table>

					<!--
            [ℹ] widget-sportbook-details-table-standings [DESKTOP]
            -->
					<div
						id="standings-sportbook-details"
						class="m-t-20"
					>
						{#if data}
							<div
								id="button-extra-info-container"
							>
								<div
									id="betting-site-container"
									class="row-space-start m-r-16"
								>
									<a
										rel="nofollow"
										aria-label="betting_site_logo_standings"
										on:click={() =>
											triggerGoggleEvents(
												'betting_site_logo_standings'
											)}
										href={data.register_link}
										target="_blank"
										style="width: inherit;"
									>
										<img
											id="sportbook-logo-img"
											src={data.image}
											alt={data.title}
										/>
									</a>

									<button
										class="place-bet-btn btn-primary"
										aria-label="toggleCTA"
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
											aria-label="betting_site_logo_standings"
											on:click={() =>
												triggerGoggleEvents(
													'betting_site_logo_standings'
												)}
											href={data.register_link}
											style="width: inherit;"
										>
											<img
												style="background-color: var({imageVar});"
												class="extra-info-img"
												src={data.image}
												alt={data.title}
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
												{data.bonus_description}
											</p>
											<!--  [ℹ] button_cta
                        -->
											<a
												rel="nofollow"
												aria-label="cta_button_standings"
												on:click={() =>
													triggerGoggleEvents(
														'cta_button_standings'
													)}
												href={data.register_link}
												target="_blank"
											>
												<button
													class="btn-primary btn-cta"
													aria-label="registerCTA"
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
												{data.information}
											</p>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!--
    [ℹ] promise was rejected
    -->
		{:catch error}
			{error}
		{/await}
	{/if}
</div>

<!-- ===============
  COMPONENT STYLE
=================-->
<style>
	#background-area-close {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1000;
	}

	/* [ℹ] NO DATA WIDGET STYLE / CSS */

	#no-widget-box {
		padding: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		text-align: center;
	}

  div#ss-box {
    /* p */
		position: relative;
    /* s */
    min-width: 171px;
    height: 40px;
    border: 1px solid var(--grey);
    border-radius: 8px;
    padding: 10px 20px;
		cursor: pointer;
    margin: 20px;
  } div#ss-box div#ssdb-main {
    /* p */
    position: absolute;
		top: 115%;
		right: 0;
		z-index: 10000;
		width: 100%;
    /* s */
		background-color: var(--white);
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		/* height: 308px; */
		max-height: 308px;
		overflow-y: scroll;
		padding-right: 6px;
  } div#ss-box div#ssdb-main::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	} div#ss-box div#ssdb-main::-webkit-scrollbar {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

  div#ss-box div#ssdb-main div#ssdb-inner {
    max-height: 308px;
		overflow-y: scroll;
  } div#ss-box div#ssdb-main div#ssdb-inner p.stage-opt {
    padding: 11px 20px;
  } div#ss-box div#ssdb-main div#ssdb-inner p.stage-opt:hover {
    cursor: pointer;
		color: #f5620f !important;
  } div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar {
		width: 4px;
	} div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-track {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	} div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-thumb {
		background: #cccccc;
		border-radius: 12px;
	}

	#standings-table-container {
		/* display: grid; */
		padding: 0;
		padding-bottom: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		/* overflow: hidden; */
		position: relative;
	}

	div#standings-view-box {
		padding: 20px;
		padding-bottom: 0;
		width: -webkit-fill-available;
	}
	div.stand-view-opt-box {
		border: 1px solid #cccccc;
		padding: 10px 30px;
		width: inherit;
		text-align: center;
	}
	div.stand-view-opt-box.activeOpt {
		border: 1px solid #f5620f;
	}
	div.stand-view-opt-box.activeOpt p {
		color: #f5620f !important;
	}
	div.stand-view-opt-box:hover p {
		color: #292929 !important;
	}
	div.stand-view-opt-box:first-child {
		border-radius: 8px 0px 0px 8px;
	}
	div.stand-view-opt-box:last-child {
		border-radius: 0px 8px 8px 0px;
	}

	/* old - table approach */
	div#top-row-standings-head {
		background-color: #f2f2f2;
		border-radius: 2px;
		padding: 7px 9px 7px 9px;
		margin: 20px 20px 20px 20px;
		width: auto;
	}

	/* new - table approach */
	table.standings_table {
		text-align: left;
		border-collapse: collapse;
		/* width: 100%; */
		/* extra */
		margin-bottom: 20px;
		/* width: -webkit-fill-available; */
	}
	table.standings_table .row-head {
		background: #f2f2f2;
		border-radius: 2px;
	}
	table.standings_table .row-head th {
		/* padding: 7px 12px; */
		padding: 7px 5px;
		vertical-align: middle;
		border: none !important;
		text-align: center;
		position: relative;
	}
	table.standings_table .row-head th p {
		/* width: 10px; */
		/* width: fit-content; */
	}
	table.standings_table .row-head th:first-child {
		padding-left: 20px;
		text-align: left;
	}
	table.standings_table .row-head th:last-child {
		padding-right: 20px;
		text-align: right;
	}
	table.standings_table
		.row-head
		.tooltip-extra-info {
		visibility: hidden;
		position: absolute;
		background: #4b4b4b;
		border-radius: 4px;
		padding: 9px 12px;
		bottom: 80%;
		/* margin-left: -80px; */
		left: 50%;
		-webkit-transform: translateX(
			-50%
		); /* Safari iOS */
		transform: translateX(-50%);
	}
	table.standings_table
		.row-head
		th:hover
		.tooltip-extra-info {
		visibility: visible !important;
	}

	div#betting-site-container {
		width: 100%;
	}
	div#betting-site-container
		img#sportbook-logo-img {
		width: 100%;
		height: 40px;
		object-fit: none;
		border-radius: 8px;
		background-color: var(
			--league-info-bookmaker-bg-
		);
		object-position: left;
	}
	div#betting-site-container
		button.place-bet-btn {
		height: 40px;
		/* width: 120px; */
		min-width: 120px;
		background-color: #f5620f;
		box-shadow: 0px 3px 8px
			rgba(212, 84, 12, 0.32);
		border-radius: 8px;
		margin-left: -12.5px;
	}

	#button-extra-info-container {
		position: relative;
		margin: 0 20px 0 20px;
	}
	.extra-info-container {
		padding: 20px;
		display: grid;
		justify-items: stretch;
		justify-content: center;
		align-items: center;
		align-content: center;
		text-align: center;
	}
	.extra-info-container p {
		color: white;
	}
	.extra-info {
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
	.extra-info-img {
		width: 100%;
		object-fit: contain;
		height: 40px;
	}
	.btn-cta {
		border-radius: 8px !important;
		margin-top: 32px;
		margin-bottom: 16px;
		padding: 11.5px !important;
		width: -webkit-fill-available;
	}

	div#mobile-table-box {
		padding: 12px;
		background: #f2f2f2;
		border-radius: 48px;
		margin: 0 20px 12px 20px;
		width: auto;
	}
	div#mobile-table-box button.table-nav-btn {
		border-radius: 50%;
		background: #4b4b4b;
		width: 32px;
		height: 32px;
		padding: 6px;
	}
	div#mobile-table-box
		button.table-nav-btn:disabled {
		opacity: 0.2;
	}

	/* group-text head */
	tr.group-row-head td {
		padding: 16px 0px 0 0;
	}
	tr.group-row-head td {
		padding-left: 20px;
		padding-right: 20px;
	}
	tr.group-row-head td p.group-head-text {
		font-size: 16px;
	}
	table.standings_table
		tr:nth-of-type(2)
		td
		div.table-divider {
		display: none !important;
	}
	table.standings_table
		tr.group-row-head
		td
		div.table-divider,
	table.standings_table
		tr.row-divider
		td
		div.table-divider {
		height: 1px;
		width: 100%;
		background: #e6e6e6;
	}
	table.standings_table
		tr.group-row-head
		td
		div.table-divider {
		margin-bottom: 16px;
	}
	table.standings_table
		tr.row-divider
		td
		div.table-divider {
		margin-top: 24px;
	}
	tr.row-divider td {
		padding-left: 20px;
		padding-right: 20px;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/*
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 821px) and (max-width: 1000px) {
		#standings-table-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/*
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
	@media only screen and (min-width: 821px) {
		table.standings_table {
			margin: 20px;
		}
		table.standings_table
			.row-head
			th:first-child {
			padding-left: 10px;
		}
		table.standings_table
			.row-head
			th:last-child {
			padding-right: 10px;
		}

		div#standings-view-box {
			width: auto;
		}
		div.stand-view-opt-box {
			width: auto;
			text-align: center;
		}

		/* group dividers style [update] */
		tr.group-row-head td {
			padding-left: 0;
			padding-right: 0;
		}
		tr.row-divider td {
			padding-left: 0;
			padding-right: 0;
		}
    div#ss-box {
      margin: unset;
    }
	}

	/*
  DESKTOP RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1000px) {
		#standings-table-container {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	.dark-background-1
		table.standings_table
		.row-head {
		background-color: #616161 !important;
	}
	.dark-background-1
		table.standings_table
		.row-head.table_1 {
		/* border-bottom: 16px solid transparent; */
	}

	.dark-background-1
		div.stand-view-opt-box:hover
		p {
		color: white !important;
	}

	.dark-background-1 div#mobile-table-box {
		background: #616161;
	}
	.dark-background-1
		div#mobile-table-box
		button.table-nav-btn {
		background: #a8a8a8;
	}
	.dark-background-1 div#mobile-table-box p {
		color: white;
	}

	.dark-background-1
		table.standings_table
		.row-head
		.tooltip-extra-info {
		background: #616161;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
	}

	.dark-background-1
		table.standings_table
		tr.group-row-head
		td
		div.table-divider,
	.dark-background-1
		table.standings_table
		tr.row-divider
		td
		div.table-divider {
		height: 1px;
		width: 100%;
		background: #616161;
	}

  .dark-background-1 div#ss-box div#ssdb-main {
		background: #616161;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
  }

  .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar {
		width: 4px;
	} .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-track {
		background: var(--dark-theme-1) !important;
	} .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-thumb {
		background: var(--dark-theme-1-3-shade) !important;
	}

</style>
