<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports
  // <-imports-go-here->

  //#region ➤ Svelte/SvelteKit Imports
  // <-imports-go-here->
	import { onMount } from 'svelte';
  //#endregion ➤ Svelte/SvelteKit Imports

  //#region ➤ Project Custom Imports
  // <-imports-go-here->
	import { viewport_change } from '$lib/utils/platform-functions';
  // 
	import { userBetarenaSettings } from '$lib/store/user-settings';
  //#endregion ➤ Project Custom Imports

  //#region ➤ [PLUGIN] Firebase Imports
  // <-imports-go-here->
  //#endregion ➤ [PLUGIN] Firebase Imports

  //#region ➤ Types Imports
  // <-imports-go-here->
	import { get } from '$lib/api/utils';
	import type { B_H_HF } from '@betarena/scores-lib/types/hasura';
	import type { B_PFIX_D, PFIX_C_League } from '@betarena/scores-lib/types/player-fixtures';
  //#endregion ➤ Types Imports

  //#region ➤ Assets Imports
  // <-imports-go-here->
  // import profile_avatar from './assets/profile-avatar.svg';
	// import { page } from '$app/stores';
  //#endregion ➤ Assets Imports

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let WIDGET_DATA: B_PFIX_D

  // let WIDGET_T_DATA: FPPT_Data = $page.data?.B_PPRO_T
  // $: WIDGET_T_DATA = $page.data?.B_PPRO_T

  let pageFixtureMap: Map <number, Map <string, B_H_HF[]>> = new Map();
  const fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(WIDGET_DATA?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
  const leagueMap: Map <string, PFIX_C_League> = new Map(Object.entries(WIDGET_DATA?.data?.leagues)) as unknown as Map <string, PFIX_C_League>;

  pageFixtureMap.set(0, fixtureMap)

  let page: number = 0;
  let limit: number = 5;
  let offset: number = 5;

  console.log(fixtureMap)
  console.log(leagueMap)

  //#endregion ➤ [VARIABLES]

  //#region ➤ [MAIN-METHODS]

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  function do_something() {}

  async function getPastFixtures() {
    page = page + 1;
    if (pageFixtureMap.has(page)) return;
    offset = offset + 5;
    const response = await get(
      `/api/hasura/player/fixtures/?player_id=296&limit=${limit}&offset=${offset}`
    ) as B_PFIX_D;
    const _fixtureMap: Map <string, B_H_HF[]> = new Map(Object.entries(response?.data?.past_fixtures)) as Map <string, B_H_HF[]>;
    pageFixtureMap.set(page, _fixtureMap)
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
      class="
        row-space-out
      ">
      <!-- 
      Previous
      -->
      <button
        class="
          btn-hollow
        "
        on:click={() => getPastFixtures()}
      >
        Previous
      </button>
      <!-- 
      Next
      -->
      <button
        class="
          btn-hollow
        "
        on:click={() => page = page - 1}
        disabled={page == 0}
      >
        Next
      </button>
    </div>

    <!-- 
    Fixtures List
    -->
    <div>
      {#each [...pageFixtureMap.entries()] as [key, page_data]}
        {#if key == page}
          <p>
            Page {key}
          </p>
          {#each [...page_data.entries()] as [key, fixtures]}
            <div
              class="
                row-space-start
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
            {#each fixtures as item}
              {item?.fixture_day}
              <p>
                {item?.home_team_name}
              </p>
              <p>
                {item?.away_team_name}
              </p>
            {/each}
          {/each}
        {/if}
      {/each}
    </div>

  </div>
</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

  /* #region ❌ [NOT WORKING] w/ regions */
  div#example {
    color: var(--dark-theme);
    /* background-color: var(); */
  } div#example > div#target {
  }
  /* #endregion ❌ [NOT WORKING] w/ regions */

  div#example {
    color: var(--dark-theme);
  } div#example > div#target {
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