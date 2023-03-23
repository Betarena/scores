<!-- ===============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { dlog, ST_W_F_STY, ST_W_F_TAG, ST_W_F_TOG } from '$lib/utils/debug';
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	
	import type { REDIS_CACHE_SINGLE_fixtures_page_info_response } from '$lib/models/_main_/pages_and_seo/types';

	import SeoBox from '$lib/components/SEO-Box.svelte';
	import StandingsWidgetContentLoader from './Standings-Loader.svelte';
	import StandingsTeamRow from './Standings-Team-Row.svelte';

	import type { B_STA_D, B_STA_T, STA_Season } from '@betarena/scores-lib/types/standings';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
  
	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	let loaded: boolean = false; // [ℹ] holds boolean for data loaded;
	let refresh: boolean = false; // [ℹ] refresh value speed of the WIDGET;
	let refresh_data: any = undefined; // [ℹ] refresh-data value speed;
	let no_widget_data: boolean = false; // [ℹ] identifies the no_widget_data boolean;
	let dropdownSeasonSelect: any = undefined; // [ℹ] selected TOP LEAGUE;
	let toggleCTA: boolean = false;
	let showMore: boolean = false;
	let currentSeason: number = undefined;
	let show_placeholder: boolean = false; // [ℹ] [override] placeholder for "no-widget-data" for fixtures-page

	let diasbleDev: boolean = false;

	let selectedOpt: 'total' | 'home' | 'away' =
		'total';
	let refreshRow: boolean = false;
	let selectedOptTableMobile: number = 1;

	let only_total_view_league_ids = [
		732 // [ℹ] World Cup
	];

  let seasonCheck: boolean = false;
	let season: STA_Season;
  let stage_opt: string[] = []
  let select_stage_opt: string = ''
  let select_stage_dropdown: boolean = false;

  let target_stages_with_teams: string[] = []

	export let FIXTURE_INFO: REDIS_CACHE_SINGLE_fixtures_page_info_response;
	export let STANDINGS_T: B_STA_T;
	export let STANDINGS_DATA: B_STA_D;

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT METHODS
	// ~~~~~~~~~~~~~~~~~~~~~

	async function widgetInit(): Promise<void> {

    const valdiation = 
      STANDINGS_DATA?.comp_typ != 'domestic'
      || STANDINGS_DATA == undefined

		// [ℹ] validation [1]
		if (valdiation) {
      dlog(`${ST_W_F_TAG} ❌ no data available!`, ST_W_F_TOG, ST_W_F_STY);
			no_widget_data = true;
			return;
		}
    no_widget_data = false;
		STANDINGS_T = STANDINGS_T;
	}

	function selectTableView(
		opt: 'total' | 'home' | 'away'
	) {
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

	function toggle_full_list() {
		showMore = !showMore;
	}

	function toggle_mobile_form() {
		selectedOptTableMobile =
			selectedOptTableMobile == 1 ? 2 : 1;
	}

  /**
   * @summary [HELPER] method
   * @description identifies and populates a target
   * string[] variable with stages/phases that contain
   * the two target teams of (this) fixtures; This
   * allows for the hiding of those stages/phases that
   * do not contain target teams from UI
   * @returns void
  */
  function identify_stages_with_target_teams (
  ): void {
    const target_teams: string[] = [
      FIXTURE_INFO?.data?.away_team_name,
      FIXTURE_INFO?.data?.home_team_name
    ]
    for (const standing of season?.standings) {
      // [ℹ] (validation) group-standings;
      if (standing.group_based) {
        for (const g_standing of standing?.group_standings) {
          for (const g_total of g_standing?.total) {
            if (target_teams.includes(g_total?.team_name)) {
              target_stages_with_teams.push(standing?.stage_name)
            }
          }
        }
      }
      // [ℹ] else, regular-standing;
      else {
        for (const r_total of standing?.total) {
          if (target_teams.includes(r_total?.team_name)) {
            target_stages_with_teams.push(standing?.stage_name)
          }
        }
      }
    }
    target_stages_with_teams = [...new Set(target_stages_with_teams)]
  }
  $: console.log('target_stages_with_teams', target_stages_with_teams)

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	const tabletView = 1000;
	const mobileView = 820;
	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		viewport_change();
		window.addEventListener(
			'resize',
			function () {
				viewport_change();
			}
		);
	});

	function viewport_change() {
		var w = document.documentElement.clientWidth;
		tabletExclusive =
			w >= tabletView ? false : true;
		mobileExclusive =
			w <= mobileView ? true : false;
	}

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
		no_widget_data = false;
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


	$: if (STANDINGS_DATA != undefined) {
		// [ℹ] sort seasons by season-id (desc)
    // [ℹ] using the largest (id), as the latest === current season
		STANDINGS_DATA?.seasons.sort(
			(a, b) => b?.season_id - a?.season_id
		);
		season = STANDINGS_DATA?.seasons[0];
		// [ℹ] check season exists / contains data
		let seasonCheckLength = 0;
    stage_opt = []
		if (season != undefined) {
			seasonCheckLength = season.standings.length
      identify_stages_with_target_teams()
      let number_stages = target_stages_with_teams?.length
      dlog(`number_stages: ${number_stages}`, true)
      if (number_stages > 1) {
        stage_opt = season?.standings
          .map(a => a?.stage_name);
        dlog(`stage_opt ${stage_opt}`, true)
        // [ℹ] select first on list;
        select_stage_opt = stage_opt[0];
      }
      else {
        select_stage_opt = target_stages_with_teams[0]
      }
		}
		no_widget_data =
			seasonCheckLength == 0 ||
			seasonCheckLength == undefined
				? true
				: false;
		seasonCheck = true;
	} else {
		seasonCheck = true;
	}

  let targetGroupsNamesArray: string[] = []
  // [ℹ] identify target groups, target teams part of
  // [ℹ] on selct_stage view change;
  $: if (select_stage_opt) {
    console.log('Stage/Phase Changed!')
    for (const standing of season?.standings) {
      if (standing.group_based) {
        for (const g_standing of standing?.group_standings) {
          for (const g_total of g_standing?.total) {
            const target_teams: string[] = [
              FIXTURE_INFO?.data?.away_team_name,
              FIXTURE_INFO?.data?.home_team_name
            ]
            if (target_teams.includes(g_total?.team_name)) {
              targetGroupsNamesArray.push(g_standing?.group_name)
            }
          }
        }
      }
    }
  }
  // $: console.log('targetGroupsNamesArray', targetGroupsNamesArray)

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

<div
	class:display_none={no_widget_data &&
		!show_placeholder}
  >

	<!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
	{#if no_widget_data && seasonCheck && !loaded}
		<!-- 
    [ℹ] widget title
    -->
		<h2
			class="
        s-20
        m-b-10 
        w-500 
        color-black-2
      "
			style="margin-top: 0;"
			class:color-white={$userBetarenaSettings.theme ==
				'Dark'}
		>
			{STANDINGS_T?.translations.standings}
		</h2>
		<!-- 
    [ℹ] no data container
    -->
		<div
			id="no-widget-box"
			class="column-space-center"
			class:dark-background-1={$userBetarenaSettings.theme ==
				'Dark'}
		>
			<!-- 
      [ℹ] no-visual icon
      -->
			<img
				src={$userBetarenaSettings.theme == 'Dark'
					? no_visual_dark
					: no_visual}
				alt="no_visual_dark"
				width="32"
				height="32"
				class="m-b-16"
			/>
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
	{#if !no_widget_data && !refresh && browser && $userBetarenaSettings.country_bookmaker && seasonCheck && !diasbleDev}
		<!-- <StandingsWidgetContentLoader /> -->

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
      [ℹ] widget-component 
      [ℹ] [DESKTOP] [TABLET] [MOBILE]
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
				<!-- 
        [ℹ] widget-top-selection-standings-view [DESKTOP]
        -->
				<div class="row-space-out">
					<!-- 
          [ℹ] main standings opt view box
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
                class:total_view_only={only_total_view_league_ids.includes(
                  STANDINGS_DATA?.league_id
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
              {#if !only_total_view_league_ids.includes(STANDINGS_DATA?.league_id)}
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
          [ℹ] recent form button box
          -->
					{#if mobileExclusive}
						<div
							id="form-view-opt-box"
							class="
                cursor-pointer
              "
							class:activeOpt={selectedOptTableMobile ==
								2}
							on:click={() =>
								toggle_mobile_form()}
						>
							<p
								class="
                  s-14 
                  w-500 
                  color-grey
                "
							>
								Form
							</p>
						</div>
					{/if}
				</div>
				<!-- 
        [ℹ] standings table
        -->
				<table class="standings_table">
					<!-- 
          [ℹ] widget-top-row-table-standings [DESKTOP]
          -->
					<tr class="row-head">
						<!-- 
            [ℹ] team position [head]
            [ℹ] team name [head]
            -->
						<th style="width: 100%;">
							<p class="s-12 m-r-20 color-grey">
								#
								<span class="m-r-20" />
								{STANDINGS_T.translations.team}
							</p>
						</th>
						<!-- 
            [ℹ] table view 
            [headers]
            -->
						{#if (mobileExclusive && selectedOptTableMobile == 1) || !mobileExclusive}
							<!-- 
              [ℹ] team points [head]
              -->
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
							<!-- 
              [ℹ] team games played [head]
              -->
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
							<!-- 
              [ℹ] team games win [head]
              -->
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
							<!-- 
              [ℹ] team games draw [head]
              -->
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
							<!-- 
              [ℹ] team games lost [head]
              -->
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
							<!-- 
              [ℹ] team goals-for [head]
              -->
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
							<!-- 
              [ℹ] team goals-against [head]
              -->
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
						{/if}
						<!-- 
            [ℹ] table view 2
            [headers]
            -->
						{#if (mobileExclusive && selectedOptTableMobile == 2) || !mobileExclusive}
							<!-- 
              [ℹ] team recent form [head]
              -->
							<th>
								<p
									class="
                    s-12 
                    color-grey
                  "
									style="width: 70px;"
								>
									{STANDINGS_T.translations
										.recent_form}
								</p>
							</th>
						{/if}
					</tr>

					<!-- 
          [ℹ] widget-team-standing-row-table-standings 
          [DESKTOP]
          -->
					<!-- 
          [ℹ] STANDINGS 
          [REGUALR-TYPE]
          -->
          {#each season.standings as standing}
            {#if standing?.stage_name == select_stage_opt}
              <!-- 
              [ℹ] STANDINGS IS A REGUALR-TYPE
              -->
              {#if !standing.group_based}
                {#each standing[selectedOpt] as team}
                  {#if !showMore 
                    && (team?.team_name == FIXTURE_INFO?.data?.away_team_name 
                      || team?.team_name == FIXTURE_INFO?.data?.home_team_name)}
                    <StandingsTeamRow
                      TEAM_DATA={team}
                      TABLEMOBILEVIEW={selectedOptTableMobile}
                      {currentSeason}
                    />
                  {:else if showMore}
                    <StandingsTeamRow
                      TEAM_DATA={team}
                      TABLEMOBILEVIEW={selectedOptTableMobile}
                      {currentSeason}
                    />
                  {/if}
						    {/each}
              <!-- 
              [ℹ] STANDINGS
              [GROUP-STAGE-TYPE]
              -->
              {:else}
                {#if !showMore}
                  {#each standing.group_standings as group}
                    {#if targetGroupsNamesArray.includes(group?.group_name)}
                      <tr class="group-row-head">
                        <td colspan="20">
                          <div class="table-divider" />
                          <p
                            class="
                              w-500
                              color-black-2
                              group-head-text
                              text-center
                            "
                          >
                            {STANDINGS_T?.translations?.group}
                            {group.group_name.split(' ')[1]}
                          </p>
                        </td>
                      </tr>
                      {#each group[selectedOpt] as team}
                        {#if (team?.team_name == FIXTURE_INFO?.data?.away_team_name 
                            || team?.team_name == FIXTURE_INFO?.data?.home_team_name)}
                          <StandingsTeamRow
                            TEAM_DATA={team}
                            {currentSeason}
                          />
                        {/if}
                      {/each}
                    {/if}
                  {/each}
                {:else}
                  {#each standing.group_standings as group}
                    <tr class="group-row-head">
                      <td colspan="20">
                        <div class="table-divider" />
                        <p
                          class="
                            w-500
                            color-black-2
                            group-head-text
                            text-center
                          "
                        >
                          {STANDINGS_T?.translations?.group}
                          {group.group_name.split(' ')[1]}
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
                {/if}
                <tr class="row-divider">
                  <td colspan="20">
                    <div class="table-divider" />
                  </td>
                </tr>
              {/if}
            {/if}
          {/each}
				</table>
				<!-- 
        [ℹ] toggle full standings table
        -->
				<div>
					<p
						id="show-more-box"
						on:click={() => toggle_full_list()}
					>
						{#if !showMore}
							See the full standings
						{:else}
							Show less
						{/if}
					</p>
				</div>
			</div>
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
	.display_none {
		display: none !important;
	}

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
		/* padding: 20px; */
		/* padding-bottom: 0; */
		margin: 20px 20px 15px 20px;
		width: -webkit-fill-available;
	}
	div.stand-view-opt-box {
		border: 1px solid #cccccc;
		padding: 10px 15px;
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
	div.stand-view-opt-box.total_view_only {
		border-radius: 8px !important;
	}

	#form-view-opt-box {
		border: 1px solid #cccccc;
		padding: 10px 20px;
		width: auto;
		text-align: center;
		border-radius: 8px;
		margin: 20px 15px 15px 0;
	}
	#form-view-opt-box.activeOpt {
		border: 1px solid #f5620f;
	}
	#form-view-opt-box.activeOpt p {
		color: #f5620f !important;
	}
	#form-view-opt-box:hover p {
		color: #292929 !important;
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
		overflow: hidden;
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
		padding-right: 10px;
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

	/* show-more / show-less style */
	#show-more-box {
		padding: 25px 0;
		padding-bottom: 0;
		text-align: center;
		white-space: nowrap;
		color: var(--primary);
		cursor: pointer;
		border-top: 1px solid #ebebeb;
		margin-top: 20px;
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
  TABLET RESPONSIVNESS (&+) 
  */
	@media only screen and (min-width: 821px) and (max-width: 1000px) {
		#standings-table-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) 
  */
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
			/* width: auto; */
			margin-bottom: 0;
		}
		div.stand-view-opt-box {
			width: 96px;
			max-width: 96px;
			text-align: center;
			/* padding: 10px 30px; */
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
	}

	/* 
  DESKTOP RESPONSIVNESS (&+) 
  */
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
		p,
	.dark-background-1 #form-view-opt-box:hover p {
		color: white !important;
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

	.dark-background-1 #show-more-box {
		border-top: 1px solid #616161;
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
