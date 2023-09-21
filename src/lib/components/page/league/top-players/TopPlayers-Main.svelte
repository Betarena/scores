<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT JS (w/ TS)                                                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores JS VScode Snippets by typing 'script...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'imports' that are required  ◼️
  // ### by 'this' .svelte file is ran.                                   ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. svelte/sveltekit imports                                      ◼️
  // ### 2. project-internal files and logic                              ◼️
  // ### 3. component import(s)                                           ◼️
  // ### 4. assets import(s)                                              ◼️
  // ### 5. type(s) imports(s)                                            ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	import { browser } from '$app/environment';

	import { get } from '$lib/api/utils';
	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { dlog, TP_W_STY, TP_W_TAG, TP_W_TOG } from '$lib/utils/debug';

	import TopPlayersWidgetContentLoader from './TopPlayers-Loader.svelte';
	import TopPlayerRow from './TopPlayers-Row.svelte';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import arrow_down from './assets/arrow-down.svg';
	import arrow_up from './assets/arrow-up.svg';
	import check_league from './assets/check-league.svg';
	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

	import type { B_TP_D, B_TP_T, TP_Season_Top_Player } from '@betarena/scores-lib/types/top-players.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  export let
    B_TP_D: B_TP_D
    , B_TP_T: B_TP_T
  ;

  let
    /** @description TODO: DOC: */
    noWidgetData: any = false
    /** @description TODO: DOC: */
    , dropdownPlayerViewSelect: string = 'rating'
    /** @description TODO: DOC: */
    , playerArrayConst: string = 'top_players_'
    /** @description TODO: DOC: */
    , selectedPlayerArray: string = 'top_players_rating'
    /** @description TODO: DOC: */
    , toggleDropdown: boolean = false
    /** @description TODO: DOC: */
    , showMore: boolean = false
    /** @description TODO: DOC: */
    , displayShowMore: boolean = false
    /** @description TODO: DOC: */
    , limitViewRow: number
    /** @description TODO: DOC: */
    , staticViewRow: number
    /** @description TODO: DOC: */
    , trueLengthOfArray: number
    /** @description TODO: DOC: */
    , lazyLoadingSeasonFixture: boolean = false
    /** @description TODO: DOC: */
    , optionsWithoutData: string[] = []
    /** @description TODO: DOC: */
    , wihtoutDataCheck: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  /**
   * @summary
   * @migbash
   *
   * @description
   *
   * @param opt
   */
	async function selectPlayerView
  (
    opt: string
  ): Promise < void >
  {
    // ### [🐞]
    dlog(`${TP_W_TAG} ➡️ selectPlayerView()`, TP_W_TOG, TP_W_STY);

		let checkPlayerViewOptLength: TP_Season_Top_Player = B_TP_D?.seasons
    ?.find
    (
      (
        {
          season_id
        }: TP_Season_Top_Player
      ): boolean =>
        season_id === $sessionStore?.selectedSeasonID
    );

    // ### CHECK
    // ### for 'no-target-season-id' exists.
		if (checkPlayerViewOptLength == undefined)
    {
      wihtoutDataCheck = false;
			lazyLoadingSeasonFixture = true;

			const response: B_TP_D = await get
      (
        `/api/data/league/top-players?league_id=${B_TP_D?.league_id}&season_id=${$sessionStore.selectedSeasonID}&hasura=true`
      );
			if (response == undefined)
      {
				noWidgetData = true;
				trueLengthOfArray = 0;
				lazyLoadingSeasonFixture = false;
				return;
			}

      B_TP_D?.seasons?.push(...response?.seasons);
      B_TP_D = B_TP_D;
      checkPlayerViewOptLength = response?.seasons?.[0];
      lazyLoadingSeasonFixture = false;
		}

    // ### CHECK:
    // ### for no widget data (exit).
    const if_M_0: boolean =
      checkPlayerViewOptLength == undefined
      ||
      (
        checkPlayerViewOptLength?.top_players_assists?.length == 0
        && checkPlayerViewOptLength?.top_players_goals?.length == 0
        && checkPlayerViewOptLength?.top_players_rating?.length == 0
        && checkPlayerViewOptLength?.top_players_total_shots?.length == 0
      )
    ;
    if (if_M_0)
    {
      noWidgetData = true;
      trueLengthOfArray = 0;
      return;
    }

    dropdownPlayerViewSelect = opt
			.toLowerCase()
			.replace(/\s/g, '_')
    ;
		selectedPlayerArray =	playerArrayConst + dropdownPlayerViewSelect;
		showMore = false;
    optionsWithoutData = [];

    // ### CHECK:
    // ### for options with no data (multi).

    if (checkPlayerViewOptLength?.top_players_rating?.length == 0)
      optionsWithoutData.push('rating');
    ;
    if (checkPlayerViewOptLength?.top_players_assists?.length == 0)
      optionsWithoutData.push('assists');
    ;
    if (checkPlayerViewOptLength?.top_players_goals?.length == 0)
      optionsWithoutData.push('goals');
    ;
    if (checkPlayerViewOptLength?.top_players_total_shots?.length == 0)
      optionsWithoutData.push('total shots');
    ;

    optionsWithoutData = optionsWithoutData;

    // ### CHECK:
    // ### for 'no-options-data' check not yet been made.

    if (!wihtoutDataCheck)
    {
      if (checkPlayerViewOptLength?.top_players_rating?.length > 0)
      {
        selectedPlayerArray = 'top_players_rating';
        dropdownPlayerViewSelect = 'rating';
      }
      else if (checkPlayerViewOptLength?.top_players_assists?.length > 0)
      {
        selectedPlayerArray = 'top_players_assists';
        dropdownPlayerViewSelect = 'assists';
      }
      else if (checkPlayerViewOptLength?.top_players_goals?.length > 0)
      {
        selectedPlayerArray = 'top_players_goals';
        dropdownPlayerViewSelect = 'goals';
      }
      else if (checkPlayerViewOptLength?.top_players_total_shots?.length > 0)
      {
        selectedPlayerArray = 'top_players_total_shots';
        dropdownPlayerViewSelect = 'total_shots';
      }
    }

    wihtoutDataCheck = true;
    noWidgetData = false;
    trueLengthOfArray =	checkPlayerViewOptLength?.[selectedPlayerArray]?.length;

    if (trueLengthOfArray > 10)
    {
      displayShowMore = true;
      staticViewRow = 10;
      limitViewRow = 10;
    }
    else
    {
      displayShowMore = false;
      staticViewRow = 10;
      limitViewRow = 10;
    }

    return;
	}

  selectPlayerView(dropdownPlayerViewSelect);

  /**
   * @author
   * @migbash
   *
   * @summary
   *
   * @description
   */
  function closeAllDropdowns
  (
  ): void
  {
    toggleDropdown = false;
  }

  /**
   * @author
   * @migbash
   *
   * @summary
   *
   * @description
  */
	function toggleFullList
  (
  ): void
  {
		// [ℹ] update the showMore Boolean
		showMore = !showMore;
		// [ℹ] check if the `limitViewRow` matches the `trueLengthOfArray`,
		if (limitViewRow == trueLengthOfArray) {
			// [ℹ] if so, revert back to the original number of list row items,
			limitViewRow = staticViewRow;
			return;
		}
		// [ℹ] otherwise, expand the list to the full length,
		limitViewRow = trueLengthOfArray;
	}

  // #region ➤ 🛠️ METHODS

  //#region ➤ [REACTIVIY] [METHODS]

  /**
   * @description regenerated the top-player widget
   * on every time the selectedSeasonID updates
  */
	$: if (browser &&	$sessionStore.selectedSeasonID != undefined) {
	  selectPlayerView(dropdownPlayerViewSelect)
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!--
[ℹ] area-outside-for-close
-->
{#if toggleDropdown}
	<div
		id="background-area-close"
		on:click={() => closeAllDropdowns()}
	/>
{/if}

<div
  id="widget-outer"
>

	<!--
  TOP-PLAYERS ➤ NO DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={B_TP_T?.top_players}
      NO_DATA_TITLE={B_TP_T?.no_data_t?.no_info}
      NO_DATA_DESC={B_TP_T?.no_data_t?.no_info_desc}
      version={2}
    />
	{/if}

	<!--
  TOP-PLAYERS ➤ MAIN
  -->
	{#if !noWidgetData}

    {#if lazyLoadingSeasonFixture}

      <TopPlayersWidgetContentLoader />

    {:else}

      <WidgetTitle
        WIDGET_TITLE={B_TP_T?.top_players}
      />

      <div
        id="top-players-widget-container"
        class:widget-no-data-height={trueLengthOfArray == 0}
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      >

        <!--
        TOP-PLAYERS ➤ DROPDOWN
        -->
        <div
          id="dropdown-top-players-container"
          on:click={() => (toggleDropdown = !toggleDropdown)}
        >

          <!--
          MAIN SELECTED OPT
          -->
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
              {B_TP_T?.[dropdownPlayerViewSelect]}
            </p>

            <img
              src={!toggleDropdown ? arrow_down : arrow_up}
              alt={!toggleDropdown ? "arrow_down" : "arrow_up"}
              width=20
              height=20
            />

          </div>

          <!--
          TOP PLAYERS VIEWS
          -->
          {#if toggleDropdown}

            <div
              id="more-top-leagues-outer"
            >

              <div
                id="more-top-leagues-list-container"
              >

                <!-- [🐞] -->
                <!-- {console.log('optionsWithoutData', optionsWithoutData)} -->
                <!-- {console.log('B_TP_T?.pl_view_opt', B_TP_T?.pl_view_opt)} -->

                {#each B_TP_T?.pl_view_opt ?? [] as optView}

                  {#if !optionsWithoutData.includes(optView?.toLowerCase())}

                    <div
                      class=
                      "
                      row-space-out
                      top-league-container
                      "
                      on:click={() => selectPlayerView(optView?.toLowerCase())}
                    >
                      <!--
                      ROW DATA
                      -->
                      <div
                        class=
                        "
                        row-space-start
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
                          class:color-primary=
                          {
                            dropdownPlayerViewSelect === optView.toLowerCase().replace(/\s/g, '_')
                          }
                        >
                          {B_TP_T?.[optView.toLowerCase().replace(/\s/g, '_')]}
                        </p>

                      </div>

                      {#if dropdownPlayerViewSelect === optView.toLowerCase().replace(/\s/g, '_')}
                        <img
                          src={check_league}
                          alt="default alt text"
                          width=20
                          height=20
                        />
                      {/if}

                    </div>

                  {/if}

                {/each}
              </div>

            </div>

          {/if}

        </div>

        <!--
        TOP-PLAYERS ➤ COLUMNS
        -->
        <div
          id="widget-title-row"
          class=
          "
          row-space-out
          "
          style="width: auto;"
        >

          <!--
          1st RIGTH COLUMN
          -->
          <div
            class=
            "
            row-space-start
            "
          >

            <!--
            COLUMN ➤ PLAYER RANKING
            -->
            <p
              class=
              "
                w-400
                small
                color-grey m-r-20
              "
            >
              #
            </p>

            <!--
            COLUMN ➤ PLAYER
            -->
            <p
              class=
              "
              w-400
              small
              color-grey
              "
            >
              {B_TP_T?.player ?? "Player"}
            </p>

          </div>

          <!--
          1st LEFT COLUMN
          -->
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
              small
              color-grey
              "
            >
              {B_TP_T?.[dropdownPlayerViewSelect]}
            </p>
          </div>

        </div>

        <!--
        TOP-PLAYERS ➤ NO SEASONS DATA
        -->
        {#if trueLengthOfArray != 0}

          {#each B_TP_D?.seasons ?? [] as season}

            {#if season?.season_id === $sessionStore?.selectedSeasonID}

              {#each season?.[selectedPlayerArray]?.slice(0, limitViewRow) ?? [] as data, i}

                <TopPlayerRow
                  pos={i + 1}
                  optView={dropdownPlayerViewSelect}
                  {data}
                  translations={B_TP_T}
                />

              {/each}

            {/if}

          {/each}

        {:else}

          <!--
          PARTIAL PLACEHOLDER
          -->
          <div
            class=
            "
            column-space-center
            "
            style=
            "
            margin-top: 280px;
            "
          >

            <!--
            no-visual-asset
            -->
            <img
              src={$userBetarenaSettings.theme == 'Dark' ? no_visual_dark : no_visual}
              alt="no_visual_dark"
              width=32
              height=32
              class=
              "
              m-b-16
              "
            />

            <!--
            CONTAINER TEXT
            -->
            <div>
              <p
                class=
                "
                s-14
                w-500
                color-black-2
                "
              >
                {B_TP_T?.no_data_t?.no_info}
              </p>
            </div>

          </div>
        {/if}

        <!--
        TOP-PLAYERS ➤ SHOW MORE/LESS
        -->
        {#if displayShowMore && trueLengthOfArray != 0}

          <div>

            <p
              id="show-more-box"
              on:click={() => toggleFullList()}
            >
              {#if !showMore}
                {B_TP_T?.show_more_less?.[1]}
              {:else}
                {B_TP_T?.show_more_less?.[0]}
              {/if}
            </p>

          </div>

        {:else if trueLengthOfArray != 0}

          <p
            id="show-more-box"
            style=
            "
            padding: 5px;
            box-shadow: none;
            "
          />

        {/if}

      </div>

    {/if}

	{/if}

</div>

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT STYLE                                                                    ◼️
### NOTE:                                                                              ◼️
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE      ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'             ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

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

	.color-primary {
		color: #f5620f !important;
	}

	div#top-players-widget-container.widget-no-data-height {
		height: 832px;
	}

	#top-players-widget-container {
		padding: 0;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		position: relative;
	}

	div#widget-title-row {
		background-color: #f2f2f2;
		border-radius: 2px;
		padding: 7px 16px 7px 9px;
		margin: 16px 20px 10px 20px;
	}

	div#more-top-leagues-outer {
		position: absolute;
		top: 115%;
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
		border-radius: 4px;
		z-index: 10000;
		max-height: 302px;
		overflow-y: scroll;
		padding-right: 6px;
	}
	div#more-top-leagues-outer::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}
	div#more-top-leagues-outer::-webkit-scrollbar {
		/* Hide scrollbar for IE, Edge and Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	div#dropdown-top-players-container {
		position: relative;
		margin: 0 20px 0px 20px;
		padding-top: 20px;
	}
	div#dropdown-top-players-container
		div#dropdown-box-select {
		padding: 9px 20px;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		border-radius: 8px;
		position: relative;
		height: 40px;
	}
	div#dropdown-top-players-container
		div#dropdown-box-select:hover {
		border: 1px solid #8c8c8c !important;
	}
	div#dropdown-top-players-container
		div#more-top-leagues-list-container {
		max-height: 302px;
		overflow-y: scroll;
	}
	div#dropdown-top-players-container
		div#more-top-leagues-list-container
		.top-league-container {
		padding: 12px 20px;
	}
	div#dropdown-top-players-container
		div#more-top-leagues-list-container
		.top-league-container:hover {
		cursor: pointer;
	}
	div#dropdown-top-players-container
		div#more-top-leagues-list-container
		.top-league-container:hover
		p {
		color: #f5620f !important;
	} /* width */
	div#dropdown-top-players-container
		div#more-top-leagues-list-container::-webkit-scrollbar {
		width: 4px;
	} /* track */
	div#dropdown-top-players-container
		div#more-top-leagues-list-container::-webkit-scrollbar-track {
		background: #f2f2f2;
		border-radius: 12px;
		margin: 8px;
	} /* handle */
	div#dropdown-top-players-container
		div#more-top-leagues-list-container::-webkit-scrollbar-thumb {
		background: #cccccc;
		border-radius: 12px;
	}

	#show-more-box {
		padding: 25px 0;
		text-align: center;
		white-space: nowrap;
		color: var(--primary);
		box-shadow: inset 0px 1px 0px #ebebeb;
		cursor: pointer;
	}

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
		#top-players-widget-container
    {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	@media only screen
  and (min-width: 1160px)
  {
		#top-players-widget-container
    {
			min-width: 100%;
		}

		div#widget-outer
    {
			margin-top: 0;
		}

		div#widget-title-row
    {
			margin: 20px 20px 12.5px 20px;
		}
	}

	/*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	.dark-background-1 div#widget-title-row {
		background-color: #616161 !important;
	}

	.dark-background-1 p#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1
		div.stand-view-opt-box:hover
		p {
		color: white !important;
	}

	.dark-background-1 div#mobile-table-box p {
		color: white;
	}

	.dark-background-1 div#more-top-leagues-outer {
		/* dark theme/dark-gray */
		background: #616161;
		/* shadow/black */
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.24);
		border-radius: 4px;
	} /* handle */
	.dark-background-1
		div#more-top-leagues-list-container::-webkit-scrollbar-thumb {
		background: #999999 !important;
	} /* track */
	.dark-background-1
		div#more-top-leagues-list-container::-webkit-scrollbar-track {
		background: #4b4b4b !important;
	}

</style>
