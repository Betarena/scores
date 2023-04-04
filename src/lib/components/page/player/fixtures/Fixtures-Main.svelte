<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->
	import { page } from '$app/stores';
  // 
	import { onMount } from 'svelte';
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // <-imports-go-here->
	import { platfrom_lang_ssr, viewport_change } from '$lib/utils/platform-functions';
  // 
	import { userBetarenaSettings } from '$lib/store/user-settings';
  // 
	import { get } from '$lib/api/utils';
  //#endregion ➤ Project Custom Imports

  //#region ➤ [PLUGIN] Firebase Imports
  // <-imports-go-here->
  //#endregion ➤ [PLUGIN] Firebase Imports

  //#region ➤ Types Imports
  // <-imports-go-here->
	import type { B_H_HF } from '@betarena/scores-lib/types/hasura';
	import type { B_PFIX_D, PFIX_C_Fixture, PFIX_C_League } from '@betarena/scores-lib/types/player-fixtures';
//#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // <-imports-go-here->
  // import profile_avatar from './assets/profile-avatar.svg';
  import arrow_left_hover from './assets/arrow-left-hover.svg';
  import arrow_left from './assets/arrow-left.svg';
  import arrow_right_hover from './assets/arrow-right-hover.svg';
  import arrow_right from './assets/arrow-right.svg';
//#endregion ➤ Assets Imports

  import FixturesRow from './Fixtures-Row.svelte';
  import LoaderMain from './loaders/shared/Loader-Main.svelte';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PFIX_D

  // let WIDGET_T_DATA: FPPT_Data = $view_page.data?.B_PPRO_T
  // $: WIDGET_T_DATA = $view_page.data?.B_PPRO_T

  let pageFixtureMap: Map <number, Map <string, PFIX_C_Fixture[]>> = new Map();
  const fixtureMap: Map <string, PFIX_C_Fixture[]> = new Map(Object.entries(WIDGET_DATA?.data?.past_fixtures)) as Map <string, PFIX_C_Fixture[]>;
  const leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(WIDGET_DATA?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

  pageFixtureMap.set(0, fixtureMap)

  let view_page: number = 0;
  let limit: number = 10;
  let offset: number = 10;
  let loadingPrev: boolean = false;

  let hoverBtn1: boolean = false;
  let hoverBtn2: boolean = false;

  console.log(fixtureMap)
  console.log(leagueMap)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  async function getPastFixtures() {
    view_page = view_page + 1;
    if (pageFixtureMap.has(view_page)) return;
    offset = offset + 10;
    loadingPrev = true;
    const response = await get(
      `/api/hasura/player/fixtures/?player_id=580&limit=${limit}&offset=${offset}`
    ) as B_PFIX_D;
    const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
    loadingPrev = false;
    pageFixtureMap.set(view_page, _fixtureMap)
    pageFixtureMap = pageFixtureMap
  }

  $: console.log(pageFixtureMap)

  

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

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
	// (SSR) LANG SVELTE | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

	$: server_side_language = platfrom_lang_ssr(
		$page?.route?.id,
		$page?.error,
		$page?.params?.lang
	);

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===================
SVELTE INJECTION TAGS
=================== -->

<svelte:head>
  <!-- <add> -->
</svelte:head>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<!-- 
[ℹ] example comment
-->
<div>
  <div
    class="widget-component"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
  >

    <!-- 
    Previous / Next Buttons
    -->
    <div
      id="top-row"
      class="
        row-space-out
        m-b-15
      ">
      <!-- 
      Previous
      -->
      <button
        class="
          btn-hollow
          color-black-2
          left
        "
        on:click={() => getPastFixtures()}
        on:mouseover={() => hoverBtn1 = true}
        on:mouseout={() => hoverBtn1 = false}
        disabled={loadingPrev}
      >
        <img 
          src={hoverBtn1 == true ? arrow_left_hover : arrow_left}
          alt="arrow_left"
          class="m-r-8"
        />
        Previous
      </button>
      <!-- 
      Next
      -->
      {#if !(view_page == 0)}
        <button
          class="
            btn-hollow
            color-black-2
            right
          "
          on:click={() => view_page = view_page - 1}
          on:mouseover={() => hoverBtn2 = true}
          on:mouseout={() => hoverBtn2 = false}
          disabled={view_page == 0}
        >
          Next
          <img 
            src={hoverBtn2 == true ? arrow_right_hover : arrow_right}
            alt="arrow_right"
            class="m-l-8"
          />
        </button>
      {/if}
    </div>
    
    <!-- 
    Loader (inner)
    -->
    {#if loadingPrev}
      <div
        style="padding: 0 20px;">
        <LoaderMain />
      </div>
    {/if}
    
    <!-- 
    Fixtures List
    -->
    {#if !loadingPrev}
      <div>
        {#each [...pageFixtureMap.entries()] as [key, page_data]}
          {#if key == view_page}
            <!-- [🐞] 
            <p>
              Page {key}
            </p>
            -->
            {#each [...page_data.entries()] as [key, fixtures]}
              <!-- 
              League (group)
              -->
              <a 
                href={`/${leagueMap.get(key.split('_')[0])?.urls[server_side_language]}`}>
                <div
                  class="
                    row-space-start
                    m-b-15
                    league-group-box
                  ">
                  <img 
                    src={leagueMap.get(key.split('_')[0])?.icon}
                    alt=""
                    width="24"
                    height="24"
                    class="m-r-24"
                  />
                  <p
                    class="
                      color-black-2
                      s-16
                      w-500
                    ">
                    {leagueMap.get(key.split('_')[0])?.name}
                  </p>
                </div>
              </a>
              <!-- 
              Fixtures List
              -->
              {#each fixtures as item}
                <FixturesRow 
                  fixture={item} 
                />
              {/each}
            {/each}
          {/if}
        {/each}
      </div>
    {/if}

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  div#top-row {
    padding: 0 20px;
  }

  div.league-group-box {
    padding-left: 28px;
  }

  /* o */
  button.btn-hollow.left {
    padding: 12px 16px 12px 10px ;
  }

  /* o */
  button.btn-hollow.right {
    padding: 12px 10px 12px 16px ;
  }


  /*
  =============
  RESPONSIVNESS 
  =============
  */

  @media only screen 
    and (min-width: 726px) 
    and (max-width: 1000px) {
  }

  /*
  =============
  DARK-THEME
  =============
  */

</style>