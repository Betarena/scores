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

	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { viewport_change } from '$lib/utils/platform-functions';

	import close_white from './assets/close-white.svg';
	import close from './assets/close.svg';

	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import Africa from './assets/_Africa.svelte';
	import Asia from './assets/_Asia.svelte';
	import NoResults from './assets/_NoResults.svelte';
	import NorthCentralAmerica from './assets/_North_Central_America.svelte';
	import SouthAmerica from './assets/_South_America.svelte';
	import World from './assets/_World.svelte';

	import type { B_LEGL_D, B_LEGL_League_Country, B_LEGL_League_Main, B_LEGL_T } from '@betarena/scores-lib/types/types.home.league-list.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'variables' that are to be   ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. export const / let [..]                                       ◼️
  // ### 2. const [..]                                                    ◼️
  // ### 3. let [..]                                                      ◼️
  // ### 4. $: [..]                                                       ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

	export let
    /** @description __ */
    B_LEGL_T: B_LEGL_T,
    /** @description __ */
    B_LEGL_D: B_LEGL_D
  ;

  const
    /** @description */
    VIEWPORT_MOBILE_INIT = 767,
    /** @description */
    VIEWPORT_TABLET_INIT = 1160,
    /** @description */
    LEAGUES_CUSTOM_ICON_IDS: number[] =
    [
      147,
      11240938,
      24143344,
      11555657,
      99474
	  ]
  ;

  let
    /** IMPORTANT @description 📱 MOBILE */
    isViewMobile: boolean = true,
    /** IMPORTANT @description 💻 TABLET */
    isViewTablet: boolean = true,
    /** @description */
    leagueSearch: string = undefined,
    /** @description */
    selectedCountryLeagueId: number = undefined,
    /** @description */
    showFullLeagueList: boolean = false,
    /** @description */
    fullLeagueListDisplayNum: number = 4,
    /** @description */
    showFullCountryList: boolean = false,
    /** @description */
    fullCountryListDisplayNum: number = 4,
    /** @description */
    leagueSearchData: B_LEGL_League_Main[] = [],
    /** @description */
	  countrySearchData: B_LEGL_League_Country[]= [],
    /** @description official **League List** data map. */
    leagueListMap: Map < number, B_LEGL_League_Main[] > = new Map(B_LEGL_D?.league_list),
    /** @description official **League List** country map. */
    leagueListCountryMap: Map < number, B_LEGL_League_Country > = new Map(B_LEGL_D?.country_list)
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'methods' that are to be     ◼️
  // ### and are expected to be used by 'this' .svelte file / component.  ◼️
  // ### IMPORTANT                                                        ◼️
  // ### Please, structure the imports as follows:                        ◼️
  // ### 1. function (..)                                                 ◼️
  // ### 2. async function (..)                                           ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   * TODO: DOC:
   * @param targetCountry
   * @returns { void }
   */
	function selectCountryLeague
  (
		targetCountry: number
	): void
  {
		if (selectedCountryLeagueId === targetCountry)
    {
			selectedCountryLeagueId = undefined;
			return;
		}
		selectedCountryLeagueId = targetCountry;
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   * TODO: DOC:
   * @returns { void }
   */
	function toggleFullLeagueList
  (
  ) : void
  {
		showFullLeagueList = !showFullLeagueList;
		if (fullLeagueListDisplayNum == 4)
      fullLeagueListDisplayNum = 1000;
    else
      fullLeagueListDisplayNum = 4;
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  TODO: DOC:
   * @returns { void }
   */
	function toggleFullCountryList
  (
  ): void
  {
		showFullCountryList = !showFullCountryList;
		if (fullCountryListDisplayNum == 4)
      fullCountryListDisplayNum = 1000;
    else
      fullCountryListDisplayNum = 4;
	}

  /**
   * @author
   *  @migbash
   * @summary
   *  🔹 HELPER
   * @description
   *  TODO: DOC:
   * @returns { void }
   */
  function searchCountryLeagues
  (
  ): void
  {
    // ### NOTE:
    // ### reset data
		leagueSearchData = [];
		countrySearchData = [];

    const _searchTarget: string = leagueSearch.toLowerCase();

		// ### CHECK
    // ### matching 'leagues' / 'country'.
		for (const [countryId, countryLeagues] of leagueListMap)
    {
      for (const league of countryLeagues)
      {
        const if_M_0: boolean =
          league.league_name?.toLowerCase().includes(_searchTarget)
          || leagueListCountryMap.get(countryId).country_name?.toLowerCase().includes(_searchTarget)
        ;

        if (if_M_0) leagueSearchData.push(league);
      }
		}

		// ### CHECK
		// ### matching 'country'.
		for (const [countryId, countryData] of leagueListCountryMap)
    {
      const if_M_0: boolean =
        countryData.country_name?.toLowerCase().includes(_searchTarget)
      ;

			if (if_M_0) countrySearchData.push(countryData);
		}

  }

  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔥 REACTIVIY [SVELTE]

  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  // ### NOTE:                                                            ◼️
  // ### Please add inside 'this' region the 'logic' that should run      ◼️
  // ### immediately and/or reactively for 'this' .svelte file is ran.    ◼️
  // ### WARNING:                                                         ◼️
  // ### ❗️ Can go out of control.                                        ◼️
  // ### (a.k.a cause infinite loops and/or cause bottlenecks).           ◼️
  // ### Please keep very close attention to these methods and            ◼️
  // ### use them carefully.                                              ◼️
  // ### ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️

  /**
   * @description TODO: DOC:
   */
  $: if_R_0 =
    leagueSearch != undefined
    && leagueSearchData.length === 0
    && countrySearchData.length === 0
  ;

  /**
   * @description TODO: DOC:
   */
  $: if_R_1 =
    leagueSearch != undefined
    && (leagueSearchData.length !== 0 || countrySearchData.length !== 0)
  ;

  /**
   * @description TODO: DOC:
   */
  $: if (leagueSearch === '') leagueSearch = undefined;

  /**
   * @description
   * TODO: DOC:
   * change the `search-input-data` upon typing;
   * listed to search-input text;
   */
  $: if_R_2 =
    B_LEGL_D
  ;
	$: if (if_R_2 && leagueSearch != undefined)
  {
    searchCountryLeagues()
	}

  // #endregion ➤ 🔥 REACTIVIY [SVELTE]

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

	onMount
  (
    async (
    ): Promise < void > =>
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

<!--
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
### COMPONENT HTML                                                                     ◼️
### NOTE:                                                                              ◼️
### use 'CTRL+SPACE' to autocomplete global class=styles                               ◼️
### NOTE:                                                                              ◼️
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.         ◼️
◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
-->

{#if !isViewTablet}

  <div>

    <WidgetTitle
      WIDGET_TITLE={B_LEGL_T?.translations?.widget_title}
      OVERRIDE_COLOR={!isViewTablet}
    />

    <!--
    LEAGUE LIST ➤ MAIN COMPONENT
    -->
    <div
      id="league-list"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      LEAGUE LIST ➤ SEARCH BOX
      -->
      <div
        id="search-container"
      >

        <input
          id="league-list-search"
          type="text"
          placeholder={B_LEGL_T?.translations?.search_form}
          autocomplete="off"
          class=
          "
          m-b-20
          "
          style=
          "
          margin: 0 20px 20px 20px;
          "
          bind:value={leagueSearch}
        />

        <!--
        ERASE INPUT ACTION
        -->
        {#if leagueSearch != undefined}

          <img
            id="close-btn-search"
            class=
            "
            cursor-pointer
            "
            src={$userBetarenaSettings.theme == 'Dark' ? close_white : close}
            alt="default alt text"
            width=20
            height=20
            on:click={() => (leagueSearch = undefined)}
          />

        {/if}

      </div>

      <!--
      LEAGUE LIST ➤ NO SEARCH INPUT MADE
      -->
      <div
        id="defualt-league-list"
        class:league-list-hide={leagueSearch != undefined}
      >

        <!--
        TOP 7 LEAGUES [GEO-BASED] TITLE
        -->
        <p
          class=
          "
          color-grey
          s-14
          m-b-5
          "
          style="padding: 0 20px;"
        >
          {B_LEGL_T?.translations?.top_leagues ?? ''}
        </p>

        <!--
        TOP 7 LEAGUES [GEO-BASED] ROWS
        -->
        <div
          id="popular-list-container"
          class=
          "
          m-b-20
          "
        >

          {#each (B_LEGL_D?.top_geo_leagues ?? []) as item}

            <a
              href={`/${item?.urls?.[B_LEGL_T?.lang]}`}
            >

              <div
                class=
                "
                top-league-container
                row-space-start
                "
              >

                <img
                  src={item.logo_path}
                  loading="lazy"
                  alt={item.league_name+'-image'}
                  width=20
                  height=20
                  class=
                  "
                  m-r-15
                  "
                />

                <p
                  class=
                  "
                  s-14
                  w-500
                  color-black-2
                  "
                >
                  {item.league_name ?? ''}
                </p>

              </div>

            </a>

          {/each}

        </div>

        <!--
        LIST ALL COUNTRIES TITLE
        -->
        <p
          class=
          "
          color-grey
          s-14
          m-b-5
          "
          style="padding: 0 20px;"
        >
          {B_LEGL_T?.translations?.leagues_by_country ?? ""}
        </p>

        <!--
        LIST ALL COUNTRIES ROWS
        -->
        <div
          id="countires-list-container"
        >

          {#each ([...leagueListMap.entries()] ?? []) as [countryId, countryLeagues]}

            <div
              class=
              "
              main-country-container
              "
              class:selectedCountry={selectedCountryLeagueId == countryId}
            >

              <!--
              COUNTRY ROW
              -->
              <div
                class=
                "
                country-league-container
                row-space-start
                "
                on:click={() => selectCountryLeague(countryId)}
              >

                <!--
                CHECK
                CUSTOM CONTINENT ICONS
                -->
                {#if LEAGUES_CUSTOM_ICON_IDS.includes(countryId)}

                  <div
                    class=
                    "
                    row-space-start
                    m-r-15
                    width-auto
                    "
                  >
                    {#if countryId === 147}
                      <Africa />
                    {:else if countryId === 11240938}
                      <Asia />
                    {:else if countryId === 24143344}
                      <NorthCentralAmerica />
                    {:else if countryId === 11555657}
                      <SouthAmerica />
                    {:else if countryId === 99474}
                      <World />
                    {/if}
                  </div>

                {:else}

                  <img
                    src={leagueListCountryMap.get(countryId)?.image_path ?? ''}
                    loading="lazy"
                    alt="default alt text"
                    title={(leagueListCountryMap.get(countryId)?.country_name ?? '') + '-image'}
                    width=20
                    height=20
                    class=
                    "
                    m-r-15
                    "
                  />

                {/if}

                <!--
                TARGET CONTINENT - COUNTRY NAME
                -->
                <p
                  class=
                  "
                  s-14
                  w-500
                  color-black-2
                  "
                >
                  {leagueListCountryMap.get(countryId)?.country_name ?? ''}
                </p>

              </div>

              <!--
              COUNTRY LEAGUES ROW(s)
              -->
              {#if countryId == selectedCountryLeagueId}

                {#each (countryLeagues ?? []) as league}

                  <a
                    href={`/${league?.urls?.[B_LEGL_T?.lang]}`}
                  >

                    <div
                      class=
                      "
                      country-league-sub-container
                      row-space-start
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
                        {league?.league_name ?? ''}
                      </p>

                    </div>

                  </a>

                {/each}

              {/if}

            </div>

          {/each}

        </div>

      </div>

      <!--
      LEAGUE LIST ➤ NO RESULT SHOW
      -->
      {#if if_R_0}

        <div
          id="no-results-container"
          class=
          "
          column-space-center
          "
        >
          <NoResults />

          <p
            class=
            "
            s-16
            m-t-15
            color-grey
            "
          >
            {B_LEGL_T?.translations?.no_results ?? ''}
          </p>

        </div>

      {:else if if_R_1}

        <!--
        LIST LEAGUE MATCHING SEARCH
        -->
        <p
          class=
          "
          search-title
          w-500
          color-black-2
          s-14
          m-b-5
          "
          style=
          "
          padding: 0 20px;
          "
        >
          {B_LEGL_T?.translations?.competitions_results ?? ''}
        </p>

        <!--
        LIST GRID
        -->
        <div
          id="search-list-container"
          class=
          "
          m-b-12
          "
        >

          {#each leagueSearchData?.slice(0, fullLeagueListDisplayNum) ?? [] as item}

            <a
              href={`/${item.urls?.[B_LEGL_T?.lang]}`}
            >

              <div
                class=
                "
                top-league-container-search
                row-space-start
                "
              >

                <img
                  src={item?.logo_path}
                  loading="lazy"
                  alt={item?.league_name + '-image'}
                  width=20
                  height=20
                  class=
                  "
                  m-r-15
                  "
                />

                <div>

                  <p
                    class=
                    "
                    s-14
                    color-grey
                    "
                  >
                    {leagueListCountryMap.get(item?.country_id)?.country_name ?? ''}
                  </p>

                  <p
                    class=
                    "
                    s-14
                    w-500
                    color-black-2
                    "
                  >
                    {item?.league_name ?? ''}
                  </p>

                </div>

              </div>

            </a>

          {/each}

        </div>

        <!--
        SHOW FULL LIST
        -->
        {#if leagueSearchData.length > 4}

          <p
            class=
            "
            s-14
            w-500
            color-primary
            cursor-pointer
            m-b-20
            "
            on:click={() => toggleFullLeagueList()}
            style=
            "
            padding: 0 20px;
            "
          >
            {!showFullLeagueList ? B_LEGL_T?.translations?.full_list : B_LEGL_T ?.translations?.hide}
          </p>

        {/if}

        <!--
        LIST COUNTRIES MATCHING SEARCH
        -->
        <p
          class=
          "
          search-title
          w-500
          color-black-2
          s-14
          m-b-5
          "
          style=
          "
          padding: 0 20px;
          "
        >
          {B_LEGL_T?.translations?.countries_results ?? ''}
        </p>

        <!--
        LIST GRID
        -->
        <div
          id="countires-list-container"
        >

          {#each countrySearchData?.slice(0, fullCountryListDisplayNum) ?? [] as item}

            <div
              class=
              "
              main-country-container
              "
              class:selectedCountry={selectedCountryLeagueId === item?.country_id}
            >

              <!--
              PARENT COUNTRY
              -->
              <div
                class=
                "
                country-league-container
                row-space-start
                "
                on:click={() => selectCountryLeague(item.country_id)}
              >

                <img
                  src={item.image_path}
                  loading="lazy"
                  alt="default alt text"
                  title={item.country_name + '-image'}
                  width=20
                  height=20
                  class=
                  "
                  m-r-15
                  "
                />

                <p
                  class=
                  "
                  s-14
                  w-500
                  color-black-2
                  "
                >
                  {item?.country_name ?? ''}
                </p>

              </div>

              <!--
              SUB-CATEGORY
              -->
              {#if selectedCountryLeagueId != null}

                {#each leagueListMap.get(selectedCountryLeagueId) as league}
                  <a
                    href={`/${league?.urls?.[B_LEGL_T.lang]}`}
                  >

                    <div
                      class=
                      "
                      country-league-sub-container
                      row-space-start
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
                        {league?.league_name}
                      </p>

                    </div>

                  </a>
                {/each}

              {/if}

            </div>

          {/each}

        </div>

        <!--
        SHOW FULL LIST
        -->
        {#if countrySearchData.length > 4}

          <p
            class=
            "
            s-14
            w-500
            color-primary
            cursor-pointer
            m-b-20
            "
            on:click={() => toggleFullCountryList()}
            style=
            "
            padding: 0 20px;
            "
          >
            {!showFullCountryList ? B_LEGL_T?.translations?.full_list : B_LEGL_T?.translations?.hide}
          </p>

        {/if}

      {/if}

    </div>

  </div>

{/if}

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

	#league-list
  {
    /* 📌 position */
		display: grid;
    /* 🎨 style */
		background: #ffffff;
		box-shadow: 0px 4px 16px rgb(0 0 0 / 8%);
		border-radius: 12px;
		min-width: 220px;
		width: 100%;
		max-width: 343px;
		padding-bottom: 4px;
		overflow: hidden;
		padding: 20px 0;
	}

	input#league-list-search
  {
    /* 🎨 style */
		background: #ffffff;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		border-radius: 8px;
		padding: 12px 52px 12px 52px;
		background-image: url('/assets/svg/league_list/search.svg');
		background-repeat: no-repeat;
		background-position: 20px 50%;
		background-size: 20px 20px;
		width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
		height: 44px;
		outline: none;
		font-size: 14px;
	}
	input#league-list-search:hover
  {
    /* 🎨 style */
		border: 1px solid #8c8c8c;
	}
	input#league-list-search:focus
  {
    /* 🎨 style */
		border: 1px solid #4b4b4b;
	}
	input#league-list-search[placeholder]
  {
    /* 🎨 style */
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	#close-btn-search
  {
    /* 📌 position */
		position: absolute;
		z-index: 100;
		right: 40px;
		top: 12px;
	}

	#search-container
  {
    /* 📌 position */
		position: relative;
	}

	div#search-list-container .top-league-container-search
  {
    /* 🎨 style */
		padding: 4px 20px;
	}
	div#search-list-container .top-league-container-search:hover
  {
    /* 🎨 style */
		cursor: pointer;
	}
	div#search-list-container .top-league-container-search:hover p
  {
    /* 🎨 style */
		color: #f5620f !important;
	}

	#defualt-league-list
  {
    /* 📌 position */
		display: block;
	}
	#defualt-league-list.league-list-hide
  {
    /* 📌 position */
		display: none;
	}

	div#popular-list-container .top-league-container
  {
    /* 🎨 style */
		padding: 12.5px 20px;
	}
	div#popular-list-container .top-league-container:hover
  {
    /* 🎨 style */
		cursor: pointer;
	}
	div#popular-list-container .top-league-container:hover p
  {
    /* 🎨 style */
		color: #f5620f !important;
	}

	div#popular-list-container .top-league-container img,
	div#countires-list-container .country-league-container img
  {
    /* 🎨 style */
		object-fit: cover;
	}
	div#countires-list-container .country-league-container img
  {
    /* 🎨 style */
		border-radius: 50%;
	}

	div.selectedCountry
  {
    /* 🎨 style */
		background: #f2f2f2;
		border-radius: 8px;
		position: relative;
		padding: 1px;
		overflow: hidden;
	}

	div#countires-list-container .main-country-container
  {
    /* 🎨 style */
		margin: 0 10px;
	}
	div#countires-list-container .country-league-container
  {
    /* 🎨 style */
		padding: 12px 10px;
	}
	div#countires-list-container .selectedCountry .country-league-container
  {
    /* 🎨 style */
		padding: 11px 9px;
	}
	div#countires-list-container .country-league-sub-container
  {
    /* 🎨 style */
		padding: 9px 10px 10px 10px;
		background-color: white;
	}
	div#countires-list-container .country-league-sub-container:last-child
  {
    /* 🎨 style */
		border-radius: 0 0 8px 8px;
	}
	div#countires-list-container .country-league-container:hover p,
	div#countires-list-container .country-league-sub-container:hover p
  {
    /* 🎨 style */
		color: #f5620f !important;
	}

	div#countires-list-container .main-country-container:hover
  {
    /* 🎨 style */
		cursor: pointer;
	}

	div#no-results-container
  {
    /* 🎨 style */
		padding: 28px 0;
	}

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ ⚡️ RESPONSIVNESS      ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	@media screen
  and (max-width: 1440px)
  {
		input#league-list-search
    {
      /* 🎨 style */
			padding: 12px 28px 12px 35px;
			background-position: 8px 50%;
		}

		img#close-btn-search
    {
      /* 🎨 style */
			right: 28px;
		}
	}

  /*
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  ◼️ 🌒 DARK-THEME         ◼️
  ◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️◼️
  */

	.dark-background-1 input#league-list-search
  {
    /* 🎨 style */
		background-color: #4b4b4b !important;
		border: 1px solid #616161;
		color: white;
	}
	.dark-background-1 input#league-list-search:hover
  {
    /* 🎨 style */
		border: 1px solid #737373;
	}
	.dark-background-1 input#league-list-search:focus
  {
    /* 🎨 style */
		border: 1px solid #cccccc;
		background-image: url('/assets/svg/league_list/search-white.svg');
	}

	.dark-background-1 div#search-list-container .top-league-container-search	p,
	.dark-background-1 div#popular-list-container .top-league-container p,
	.dark-background-1 div#countires-list-container	.country-league-container p,
	.dark-background-1 div#countires-list-container	.country-league-sub-container p
  {
    /* 🎨 style */
		color: white;
	}

	.dark-background-1 div.selectedCountry
  {
    /* 🎨 style */
		background: #616161 !important;
	}

	.dark-background-1 div#countires-list-container	.country-league-sub-container
  {
    /* 🎨 style */
		background-color: #4b4b4b;
	}

	.dark-background-1 p.search-title
  {
    /* 🎨 style */
		color: white;
	}

</style>
