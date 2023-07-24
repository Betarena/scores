<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import TopGoalScorersRow from './TopGoalScorers-Row.svelte';

	import type { B_TGOL_D, B_TGOL_T } from '@betarena/scores-lib/types/top-goalscorers.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let B_TGOL_T: B_TGOL_T;
	export let B_TGOL_D: B_TGOL_D;

	let staticViewRow: number;
	let limitViewRow: number;
	let showMore: boolean = false;
	let displayShowMore: boolean = false;
	let noWidgetData: unknown = false;
	let trueLengthOfArray: number = B_TGOL_D?.top_geo_goalscorer_players?.length || 0;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

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

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  // [ℹ] show-more / show-less;
	$: if (viewportDesktop)
  {
		if (trueLengthOfArray > 10)
    {
			displayShowMore = true;
			staticViewRow = 10;
			limitViewRow = 10;
		}
	} else
  {
		if (trueLengthOfArray > 5)
    {
			displayShowMore = true;
			staticViewRow = 5;
			limitViewRow = 5;
		}
	}

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

	let viewportDesktop: boolean;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		if (wInit > 767) {
			viewportDesktop = true;
		} else {
			viewportDesktop = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				if (w > 767) {
					viewportDesktop = true;
				} else {
					viewportDesktop = false;
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

<div>

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={B_TGOL_T?.widget_translations?.best_goal_scorers}}
      NO_DATA_TITLE={"No Best Players Available"}
      NO_DATA_DESC={"Sorry, at this time there is no best players available!"}
    />
	{/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={B_TGOL_T?.widget_translations?.best_goal_scorers}
    />

    <div
      id="featured-list-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      🖥️ LAPTOP
      -->
      {#if viewportDesktop}

        <div
          id="widget-title-row"
          class="row-space-out"
          style="width: auto;"
        >

          <p
            class=
            "
              w-400
              small
              color-grey
            "
          >
            {B_TGOL_T?.widget_translations?.player}
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
                small
                color-grey
              "
              style="margin-right: 54px;"
            >
              {B_TGOL_T?.widget_translations?.goals}
            </p>
            <p
              class=
              "
                w-400
                small
                color-grey
              "
            >
              {B_TGOL_T?.widget_translations?.odds}
            </p>
          </div>

        </div>
      {/if}

      <!--
      📱 MOBILE
      => First 5 Rows
      -->

      {#each B_TGOL_D?.top_geo_goalscorer_players.slice(0, limitViewRow) as data, i}
        <TopGoalScorersRow
          pos={i+1}
          {data}
          WIDGET_TRANSLATION={B_TGOL_T}
        />
      {/each}

      <!--
      SHOW MORE/LESS
      -->
      {#if displayShowMore}
        <div>
          <p
            id="show-more-box"
            on:click={() => toggleFullList()}
          >
            {#if !showMore}
              {B_TGOL_T?.widget_translations?.show_more_players}
            {:else}
              {B_TGOL_T?.widget_translations?.show_less_players}
            {/if}
          </p>
        </div>
      {:else}
        <p
          id="show-more-box"
          style="padding: 5px; box-shadow: none;"
        />
      {/if}

    </div>

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	#featured-list-container
  {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
	}

	div#widget-title-row {
		background-color: #f2f2f2;
		border-radius: 2px;
		padding: 7px 18px 7px 40px;
		margin: 20px 20px 12.5px 20px;
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
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 767px)
  {
		#featured-list-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/*
  DESKTOP RESPONSIVNESS */
	@media only screen
  and (min-width: 1024px)
  {
		#featured-list-container {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	.dark-background-1 p#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#widget-title-row {
		background-color: #616161 !important;
	}

</style>
