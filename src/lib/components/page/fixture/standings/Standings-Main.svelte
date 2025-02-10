<!-- ===============
	COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { dlog } from '$lib/utils/debug';
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import StandingsTeamRow from './Standings-Team-Row.svelte';

	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';

  import type { B_SAP_FP_D } from '@betarena/scores-lib/types/seo-pages.js';
  import type { B_STA_D, B_STA_T, STA_Season } from '@betarena/scores-lib/types/standings';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  export let FIXTURE_INFO: B_SAP_FP_D;
	export let STANDINGS_DATA: B_STA_D;
	export let STANDINGS_T: B_STA_T;

  const MOBILE_VIEW = 820;
	const TABLET_VIEW = 1000;

	let mobileExclusive = false;
  let tabletExclusive = false;

	let noWidgetData: boolean = false;
	let toggleCTA: boolean = false;
	let showMore: boolean = false;
	let currentSeason: number = undefined;
	let selectedOpt: 'total' | 'home' | 'away' = 'total';
	let selectedOptTableMobile: number = 1;
  let seasonCheck: boolean = false;
	let season: STA_Season;
  let stage_opt: string[] = []
  let select_stage_opt: string = ''
  let select_stage_dropdown: boolean = false;
	let only_total_view_league_ids =
  [
		732 // World Cup
	];
  let stagesWithFixtureTeams: string[] = []
  let targetGroupsNamesArray: string[] = []

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  // HELPER
	function selectTableView
  (
		opt: 'total' | 'home' | 'away'
	): void
  {
		selectedOpt = opt;
	}

  // HELPER
	function closeAllDropdowns
  (
	): void
  {
		toggleCTA = false;
    select_stage_dropdown = false;
	}

  // HELPER
	function toggleFullList
  (
  ): void
  {
		showMore = !showMore;
	}

  // HELPER
	function toggleMobileForm
  (
  ): void
  {
		selectedOptTableMobile =
			selectedOptTableMobile == 1
        ? 2
        : 1
    ;
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
  function checkStagesWithTargetFixtureTeams
  (
  ): void
  {
    const target_teams: string[] =
    [
      FIXTURE_INFO?.data?.away_team_name,
      FIXTURE_INFO?.data?.home_team_name
    ]
    for (const standing of season?.standings)
    {
      // (validation) group-standings;
      if (standing?.group_based)
      {
        for (const g_standing of standing?.group_standings)
        {
          for (const g_total of g_standing?.total)
          {
            if (target_teams.includes(g_total?.team_name))
            {
              stagesWithFixtureTeams.push(standing?.stage_name)
            }
          }
        }
      }
      // [ℹ] else, regular-standing;
      else
      {
        for (const r_total of standing?.total)
        {
          if (target_teams.includes(r_total?.team_name))
          {
            stagesWithFixtureTeams.push(standing?.stage_name)
          }
        }
      }
    }
    stagesWithFixtureTeams = [...new Set(stagesWithFixtureTeams)]
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


	$: if (STANDINGS_DATA != undefined)
  {
		// sort seasons by season-id (desc)
    // using the largest (id), as the latest === current season
		STANDINGS_DATA?.seasons
    ?.sort
    (
			(
        a,
        b
      ) =>
        b?.season_id - a?.season_id
		);
		season = STANDINGS_DATA?.seasons?.[0];

		// check season exists / contains data
		let seasonCheckLength: number = 0;
    stage_opt = []

		if (season != undefined)
    {
			seasonCheckLength = season?.standings?.length

      checkStagesWithTargetFixtureTeams()

      let number_stages: number = stagesWithFixtureTeams?.length
      // [🐞]
      dlog
      (
        `number_stages: ${number_stages}`,
        true
      );

      if (number_stages > 1)
      {
        stage_opt = season?.standings
        ?.map
        (
          a =>
          a?.stage_name
        );

        // [🐞]
        dlog
        (
          `stage_opt ${stage_opt}`,
          true
        );

        // select first on list;
        select_stage_opt = stage_opt[0];
      }
      else
      {
        select_stage_opt = stagesWithFixtureTeams[0]
      }
		}

		noWidgetData =
			seasonCheckLength == 0
      || seasonCheckLength == undefined
				? true
				: false
    ;

		seasonCheck = true;
	}
  else
  {
		seasonCheck = true;
	}

  // [ℹ] identify target groups, target teams part of
  // [ℹ] on selct_stage view change;
  $: if (select_stage_opt)
  {
    const target_teams: string[] =
    [
      FIXTURE_INFO?.data?.away_team_name,
      FIXTURE_INFO?.data?.home_team_name
    ];

    for (const standing of season?.standings)
    {
      if (standing?.group_based)
      {
        for (const g_standing of standing?.group_standings)
        {
          for (const g_total of g_standing?.total)
          {
            if (target_teams.includes(g_total?.team_name))
            {
              targetGroupsNamesArray.push(g_standing?.group_name)
            }
          }
        }
      }
    }
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
{#if toggleCTA || select_stage_dropdown}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div
	class:display-none={noWidgetData}
>

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData && seasonCheck}
    <WidgetNoData
      WIDGET_TITLE={STANDINGS_T?.translations?.standings}
      NO_DATA_TITLE={STANDINGS_T?.no_data_t?.no_info}
      NO_DATA_DESC={STANDINGS_T?.no_data_t?.no_info_desc}
    />
	{/if}

  <!--
  📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
  -->

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData && seasonCheck}

    <WidgetTitle
      WIDGET_TITLE={STANDINGS_T.translations.standings}
    />

    <div
      id="standings-table-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!--
      TOP ROW - STANDINGS SELECT
      -->
      <div
        class="row-space-out"
      >
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
              on:click={() => selectTableView('total')}
              class:activeOpt={selectedOpt == 'total'}
              class:total_view_only={only_total_view_league_ids.includes(STANDINGS_DATA?.league_id)}
            >
              <p
                class="
                  s-14
                  w-500
                  color-grey
                "
              >
                {STANDINGS_T?.translations?.total}
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
                on:click={() => selectTableView('home')}
                class:activeOpt={selectedOpt == 'home'}
              >
                <p
                  class="
                    s-14
                    w-500
                    color-grey
                  "
                >
                  {STANDINGS_T?.translations?.home}
                </p>
              </div>

              <div
                class="
                  stand-view-opt-box
                  cursor-pointer
                "
                on:click={() => selectTableView('away')}
                class:activeOpt={selectedOpt == 'away'}
              >
                <p
                  class="
                    s-14
                    w-500
                    color-grey
                  "
                >
                  {STANDINGS_T?.translations?.away}
                </p>
              </div>
            {/if}
          </div>

          <!--
          [ℹ] standings (stage/phase) select view
          -->
          {#if stage_opt.length > 1 && !mobileExclusive}
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
            class:activeOpt={selectedOptTableMobile == 2}
            on:click={() => toggleMobileForm()}
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
      STANDINGS PHASE SELECT
      -->
      {#if stage_opt?.length > 1 && mobileExclusive}
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

      <!--
      STANDINGS TABLE
      -->
      <table
        class="standings_table"
      >

        <!--
        TABLE TOP ROW
        -->
        <tr
          class="row-head"
        >

          <!--
          TEAM NAME + POSITION
          -->
          <th
            style="width: 100%;">

            <p
              class="
                s-12
                m-r-20
                color-grey
              ">
              #
              <span
                class="
                  m-r-20
                "
              />
              {STANDINGS_T.translations.team}
            </p>

          </th>

          <!--
          TABLE <TH> 1st BATCH
          -->
          {#if (mobileExclusive && selectedOptTableMobile == 1) || !mobileExclusive}

            <!--
            TEAM POINTS
            -->
            <th>
              <p class="s-12 color-grey">
                {STANDINGS_T.translations.pts}
              </p>
              <div class="tooltip-extra-info">
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.pts.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.pts.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GAMES-PLAYED
            -->
            <th>
              <p class="s-12 color-grey">
                {STANDINGS_T.translations.pld}
              </p>
              <div class="tooltip-extra-info">
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.pld.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.pld.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GAMES-WINS
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
                  {STANDINGS_T.translations.tooltips.w.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.w.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GAMES-DRAW
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
                  {STANDINGS_T.translations.tooltips.d.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.d.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GAMES-LOST
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
                  {STANDINGS_T.translations.tooltips.l.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.l.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GOALS-FOR
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
                  {STANDINGS_T.translations.tooltips.gf.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.gf.description}
                </p>
              </div>
            </th>

            <!--
            TEAM GOALS-AGAINST
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
                  {STANDINGS_T.translations.tooltips.ga.title}
                </p>
                <p
                  class="s-12 color-white no-wrap"
                >
                  {STANDINGS_T.translations.tooltips.ga.description}
                </p>
              </div>
            </th>

          {/if}

          <!--
          TABLE <TH> 2nd BATCH
          -->
          {#if (mobileExclusive && selectedOptTableMobile == 2) || !mobileExclusive}

            <!--
            TEAM RECENT FORM
            -->
            <th>
              <p
                class="
                  s-12
                  color-grey
                "
                style="width: 70px;"
              >
                {STANDINGS_T?.translations?.recent_form}
              </p>
            </th>
          {/if}

        </tr>

        <!--
        STANDINGS TEAM ROW
        -->
        {#each season?.standings || [] as standing}
          {#if standing?.stage_name == select_stage_opt}
            <!--
            STANDINGS IS OF REGUALR-TYPE
            -->
            {#if !standing?.group_based}
              {#each standing?.[selectedOpt] || [] as team}
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
            STANDINGS IS OF GROUP TYPE
            -->
            {:else}
              {#if !showMore}
                {#each standing?.group_standings || [] as group}
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
                    {#each group?.[selectedOpt] as team}
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
                {#each standing?.group_standings || [] as group}
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
                  {#each group?.[selectedOpt] as team}
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
      (TOGGLE) FULL STANDINGS VIEW
      -->
      <div>
        <p
          id="show-more-box"
          on:click={() => toggleFullList()}
        >
          {#if !showMore}
            See the full standings
          {:else}
            Show less
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

  div#ss-box
  {
    /* p */
		position: relative;
    /* s */
    min-width: 171px;
    height: 40px;
    border: 1px solid var(--grey);
    border-radius: 8px;
    padding: 10px 20px;
		cursor: pointer;
    margin: 0 20px 20px 20px;
  } div#ss-box div#ssdb-main
  {
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
		max-height: 308px;
		overflow-y: scroll;
		padding-right: 6px;
  } div#ss-box div#ssdb-main::-webkit-scrollbar
  {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	} div#ss-box div#ssdb-main::-webkit-scrollbar
  {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

  div#ss-box div#ssdb-main div#ssdb-inner
  {
    max-height: 308px;
		overflow-y: scroll;
  } div#ss-box div#ssdb-main div#ssdb-inner p.stage-opt
  {
    padding: 11px 20px;
  } div#ss-box div#ssdb-main div#ssdb-inner p.stage-opt:hover
  {
    cursor: pointer;
		color: #f5620f !important;
  } div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar
  {
		width: 4px;
	} div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-track
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	} div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-thumb
  {
		background: #cccccc;
		border-radius: 12px;
	}

	#standings-table-container
  {
		padding: 0;
		padding-bottom: 20px;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		position: relative;
	}

	div#standings-view-box
  {
		margin: 20px 20px 15px 20px;
		width: -webkit-fill-available;
	}
	div.stand-view-opt-box
  {
		border: 1px solid #cccccc;
		padding: 10px 15px;
		width: inherit;
		text-align: center;
	}
	div.stand-view-opt-box.activeOpt
  {
		border: 1px solid #f5620f;
	}
	div.stand-view-opt-box.activeOpt p
  {
		color: #f5620f !important;
	}
	div.stand-view-opt-box:hover p
  {
		color: #292929 !important;
	}
	div.stand-view-opt-box:first-child
  {
		border-radius: 8px 0px 0px 8px;
	}
	div.stand-view-opt-box:last-child
  {
		border-radius: 0px 8px 8px 0px;
	}


	#form-view-opt-box
  {
		border: 1px solid #cccccc;
		padding: 10px 20px;
		width: auto;
		text-align: center;
		border-radius: 8px;
		margin: 20px 15px 15px 0;
	}
	#form-view-opt-box.activeOpt
  {
		border: 1px solid #f5620f;
	}
	#form-view-opt-box.activeOpt p
  {
		color: #f5620f !important;
	}
	#form-view-opt-box:hover p
  {
		color: #292929 !important;
	}

	/* old - table approach */
	div#top-row-standings-head
  {
		background-color: #f2f2f2;
		border-radius: 2px;
		padding: 7px 9px 7px 9px;
		margin: 20px 20px 20px 20px;
		width: auto;
	}

	/* new - table approach */
	table.standings_table
  {
		text-align: left;
		border-collapse: collapse;
		/* width: 100%; */
		/* extra */
		margin-bottom: 20px;
		overflow: hidden;
		/* width: -webkit-fill-available; */
	}
	table.standings_table .row-head
  {
		background: #f2f2f2;
		border-radius: 2px;
	}
	table.standings_table .row-head th
  {
		/* padding: 7px 12px; */
		padding: 7px 5px;
		vertical-align: middle;
		border: none !important;
		text-align: center;
		position: relative;
	}
	table.standings_table .row-head th p
  {
		/* width: 10px; */
		/* width: fit-content; */
	}
	table.standings_table .row-head th:first-child
  {
		padding-left: 20px;
		text-align: left;
	}
	table.standings_table .row-head th:last-child
  {
		padding-right: 10px;
		text-align: right;
	}
	table.standings_table .row-head .tooltip-extra-info
  {
		visibility: hidden;
		position: absolute;
		background: #4b4b4b;
		border-radius: 4px;
		padding: 9px 12px;
		bottom: 80%;
		left: 50%;
		-webkit-transform: translateX(-50%); /* Safari iOS */
		transform: translateX(-50%);
	}
	table.standings_table	.row-head	th:hover.tooltip-extra-info
  {
		visibility: visible !important;
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
		margin-top: 20px;
	}

	/*
  group-text head
  */
	tr.group-row-head td
  {
		padding: 16px 0px 0 0;
	}
	tr.group-row-head td
  {
		padding-left: 20px;
		padding-right: 20px;
	}
	tr.group-row-head td p.group-head-text
  {
		font-size: 16px;
	}
	table.standings_table tr:nth-of-type(2) td div.table-divider
  {
		display: none !important;
	}
	table.standings_table	tr.group-row-head	td div.table-divider,
	table.standings_table	tr.row-divider td div.table-divider
  {
		height: 1px;
		width: 100%;
		background: #e6e6e6;
	}
	table.standings_table tr.group-row-head td div.table-divider
  {
		margin-bottom: 16px;
	}
	table.standings_table tr.row-divider td div.table-divider
  {
		margin-top: 24px;
	}
	tr.row-divider td
  {
		padding-left: 20px;
		padding-right: 20px;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 821px)
  and (max-width: 1000px)
  {
		#standings-table-container
    {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	@media only screen
  and (min-width: 821px)
  {
		table.standings_table
    {
			margin: 20px;
		}
		table.standings_table
			.row-head
			th:first-child
      {
			padding-left: 10px;
		}
		table.standings_table
			.row-head
			th:last-child
      {
			padding-right: 10px;
		}

		div#standings-view-box
    {
			/* width: auto; */
			margin-bottom: 0;
		}
		div.stand-view-opt-box
    {
			width: 96px;
			max-width: 96px;
			text-align: center;
			/* padding: 10px 30px; */
		}

		/* group dividers style [update] */
		tr.group-row-head td
    {
			padding-left: 0;
			padding-right: 0;
		}
		tr.row-divider td
    {
			padding-left: 0;
			padding-right: 0;
		}

    div#ss-box
    {
      margin: 20px;
    }
	}

	@media only screen
  and (min-width: 1000px)
  {
		#standings-table-container
    {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 table.standings_table .row-head
  {
		background-color: #616161 !important;
	}
	.dark-background-1 table.standings_table .row-head.table_1
  {
		/* border-bottom: 16px solid transparent; */
	}

	.dark-background-1 div.stand-view-opt-box:hover p,
	.dark-background-1 #form-view-opt-box:hover p
  {
		color: white !important;
	}

	.dark-background-1 table.standings_table .row-head .tooltip-extra-info
    {
		background: #616161;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
	}

	.dark-background-1 table.standings_table tr.group-row-head td div.table-divider,
	.dark-background-1table.standings_table tr.row-divider td	div.table-divider
  {
		height: 1px;
		width: 100%;
		background: #616161;
	}

	.dark-background-1 #show-more-box
  {
		border-top: 1px solid #616161;
	}

  .dark-background-1 div#ss-box div#ssdb-main
  {
		background: #616161;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
  }

  .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar
  {
		width: 4px;
	}
  .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-track
  {
		background: var(--dark-theme-1) !important;
	}
  .dark-background-1 div#ss-box div#ssdb-main div#ssdb-inner::-webkit-scrollbar-thumb
  {
		background: var(--dark-theme-1-3-shade) !important;
	}

</style>
