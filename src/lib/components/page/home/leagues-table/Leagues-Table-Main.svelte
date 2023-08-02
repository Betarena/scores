<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

  import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
  import WidgetTitle from '$lib/components/Widget-Title.svelte';
  import LeagueTableTeamRow from './Leagues-Table-Team-Row.svelte';

  import arrow_down from './assets/arrow-down.svg';
  import arrow_up from './assets/arrow-up.svg';
  import check_league from './assets/check-league.svg';

	import type { B_LEGT_D, B_LEGT_T } from '@betarena/scores-lib/types/leagues-table.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	export let
    B_LEGT_T: B_LEGT_T,
    B_LEGT_D: B_LEGT_D
  ;

  const
    // ◼️ IMPORTANT
    VIEWPORT_MOBILE_INIT = 560,
    VIEWPORT_TABLET_INIT = 767
    // ◼️ IMPORTANT
  ;

  let
    // ◼️ IMPORTANT
    isViewMobile: boolean = true,
    isViewTablet: boolean = true,
    // ◼️ IMPORTANT
    noWidgetData: unknown = false,
    dropdownSelect: string = B_LEGT_D?.top_leagues_table_data?.[0]?.season_league_id ?? null,
    toggleDropdown: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

	onMount
  (
    async () =>
    {
      [
        isViewTablet,
        isViewMobile
      ] = viewport_change
      (
        VIEWPORT_TABLET_INIT,
        VIEWPORT_MOBILE_INIT
      );
      window.addEventListener
      (
        'resize',
        function ()
        {
          [
            isViewTablet,
            isViewMobile
          ] =
          viewport_change
          (
            VIEWPORT_TABLET_INIT,
            VIEWPORT_MOBILE_INIT
          );
        }
      );
	  }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div>

	<!--
  NO BEST PLAYERS AVAILABLE PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={B_LEGT_T?.translations?.title}
      NO_DATA_TITLE={"No Best Players Available"}
      NO_DATA_DESC={"Sorry, at this time there is no best players available!"}
    />
	{/if}

	<!--
  WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={B_LEGT_T?.translations?.title}
    />

    <!--
    WIDGET COMPONENT
    -->
    <div
      id="leagues-table-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >
      <!--
      Dropdown leagues select box
      -->
      <div
        id="dropdown-leagues-container"
        on:click={() => (toggleDropdown = !toggleDropdown)}
      >

        <!--
        MAIN SELECTED
        -->
        {#each B_LEGT_D?.top_leagues_table_data ?? [] as season_league_data_obj}

          {#if dropdownSelect === season_league_data_obj.season_league_id}

            <div
              id="dropdown-box-select"
              class=
              "
              row-space-out
              cursor-pointer
              "
            >

              <p
                class=
                "
                s-14
                w-500
                color-black-2
                "
              >
                {season_league_data_obj?.season_league_name}
              </p>

              <img
                src={!toggleDropdown ? arrow_down : arrow_up}
                alt="default alt text"
                width=20
                height=20
              />

            </div>

          {/if}

        {/each}

        <!--
        TOP 8 LEAGUES / SEASONS
        -->
        {#if toggleDropdown}

          <div
            id="more-top-leagues-outer"
          >
            <div
              id="more-top-leagues-list-container"
            >

              {#each B_LEGT_D?.top_leagues_table_data ?? [] as item}

                <div
                  class=
                  "
                  row-space-out
                  top-league-container
                  "
                >
                  <div
                    class=
                    "
                    row-space-start
                    cursor-pointer
                    "
                    on:click={() => (dropdownSelect = item.season_league_id)}
                  >

                    <img
                      src={item.season_league_logo}
                      alt={item.season_league_name + '-image'}
                      width=20
                      height=20
                      class=
                      "
                      m-r-15
                      "
                      style="object-fit: contain;"
                    />

                    <p
                      class=
                      "
                      s-14
                      w-500
                      color-black-2
                      "
                    >
                      {item.season_league_name}
                    </p>

                  </div>

                  {#if item.season_league_id === dropdownSelect}

                    <img
                      src={check_league}
                      alt="default alt text"
                      width=20
                      height=20
                    />

                  {/if}

                </div>

              {/each}

            </div>
          </div>

        {/if}

      </div>

      <!--
      TARGET LEAGUE & SEASONS
      💻 TABLET + 🖥️ LAPTOP
      -->
      {#each B_LEGT_D?.top_leagues_table_data ?? [] as season_league_data_obj}

        {#if dropdownSelect === season_league_data_obj.season_league_id}

          {#if !isViewTablet}

            <div
              id="widget-title-row"
              class=
              "
              ow-space-out
              "
              style="width: auto;"
            >
              <p
                class=
                "
                w-400
                medium
                color-grey
                "
              >
                {season_league_data_obj.season_league_name}
              </p>

              <div
                class=
                "
                row-space-end
                "
              >

                <p
                  class=
                  "
                  w-400
                  medium
                  color-grey
                  "
                  style="width: 64px; text-align: -webkit-center;"
                >
                  {B_LEGT_T?.translations?.games}
                </p>

                <p
                  class=
                  "
                  w-400
                  medium
                  color-grey
                  "
                  style="margin-left: 8px; width: 64px; text-align: -webkit-center;"
                >
                  {B_LEGT_T?.translations?.points}
                </p>

              </div>

            </div>

          {/if}

          {#each season_league_data_obj?.season_league_teams ?? [] as season_league_team}
            <LeagueTableTeamRow
              data={season_league_team}
            />
          {/each}

        {/if}

      {/each}

    </div>

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	#leagues-table-container
  {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
		padding-bottom: 14px;
	}

	div#widget-title-row
  {
		/* padding: 7px 18px 7px 40px; */
		margin: 16px 20px 4px 20px;
	}
	div#widget-title-row p
  {
		white-space: nowrap;
	}

	div#more-top-leagues-outer
  {
		position: absolute;
		top: 115%;
		width: 100%;
		/* background-color: #F2F2F2; */
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		z-index: 10000;
		height: 302px;
		overflow-y: scroll;
		padding-right: 6px;
	}
	div#more-top-leagues-outer::-webkit-scrollbar
  {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	div#more-top-leagues-outer::-webkit-scrollbar
  {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	div#dropdown-leagues-container
  {
		position: relative;
		margin: 20px 20px 0px 20px;
	}
	div#dropdown-leagues-container div#dropdown-box-select
  {
		padding: 12px 20px 12px 20px;
		border: 1px solid #8c8c8c;
		box-sizing: border-box;
		border-radius: 8px;
		position: relative;
	}
	div#dropdown-leagues-container div#more-top-leagues-list-container
  {
		height: 302px;
		overflow-y: scroll;
	}
	div#dropdown-leagues-container div#more-top-leagues-list-container .top-league-container
  {
		padding: 12px 20px;
	}
	div#dropdown-leagues-container div#more-top-leagues-list-container .top-league-container:hover
  {
		cursor: pointer;
	}
	div#dropdown-leagues-container div#more-top-leagues-list-container .top-league-container:hover p
  {
		color: #f5620f !important;
	}

	/* width */
	div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar
  {
		width: 4px;
	}
	/* track */
	div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-track
  {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	}
	/* handle */
	div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-thumb
  {
		background: #cccccc;
		border-radius: 12px;
	}

	/*
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 767px)
  {

		#leagues-table-container
    {
			min-width: 100%;
			/* max-width: 700px; */
		}

	}

	@media only screen
  and (min-width: 1024px)
  {

		#leagues-table-container
    {
			min-width: 100%;
			/* max-width: 560px; */
		}

	}

	.dark-background-1 div#dropdown-leagues-container div#more-top-leagues-outer
  {
		background: #616161;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
		border-radius: 4px;
	}

	/* handle */
	.dark-background-1 div#dropdown-leagues-container div#more-top-leagues-list-container::-webkit-scrollbar-thumb
  {
		background: #999999 !important;
	}

	/* track */
	.dark-background-1 div#more-top-leagues-list-container::-webkit-scrollbar-track
  {
		background: #4b4b4b !important;
	}

</style>
