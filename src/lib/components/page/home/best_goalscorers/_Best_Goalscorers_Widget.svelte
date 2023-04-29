<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { get } from '$lib/api/utils';
	import SeoBox from '$lib/components/SEO-Box.svelte';
	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import type {
		Cache_Single_Geo_GoalScorers_Translation_Response,
		Cache_Single_Lang_GoalScorers_Translation_Response
	} from '$lib/models/home/best_goalscorer/types';
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import { BG_W_H_STY, BG_W_H_TAG, BG_W_H_TOG, dlog } from '$lib/utils/debug';
	import { onMount } from 'svelte';
	import BestGoalscorerRow from './_Best_Goalscorer_Row.svelte';
	import BestGoalscorersWidgetContentLoader from './_Best_Goalscorers_Widget_ContentLoader.svelte';

	// [ℹ] main component variables;
	export let BEST_GOAL_SCORERS_DATA_SEO: Cache_Single_Lang_GoalScorers_Translation_Response;

	let staticViewRow: number; // [ℹ] holds the `initial` number of featured sites to be displayed
	let limitViewRow: number; // [ℹ] holds the actual, `total` limit of the list of featured sites
	let showMore: boolean = false; // [ℹ] signals to other widget values that the lsit has expanded
	let displayShowMore: boolean = false; // [ℹ] signal as to whether to display or not the `showMore` / `showLess` data container;
	let loaded: boolean = false; // [ℹ] holds boolean for data loaded;
	let refresh: boolean = false;
	let refresh_data: unknown = undefined;
	let noBestPlayers: unknown = false;

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... Intializer of the Widget Function
	 * ... Returns PROMISE - [INTERFACE - `FinalFeaturedSiteResponseDB`]
	 */
	let trueLengthOfArray: number;
	// [ℹ]
	async function widgetInit(): Promise<Cache_Single_Geo_GoalScorers_Translation_Response> {
		// [ℹ] get the USER-GEO-LOCATION;
		let userGeo =
			$userBetarenaSettings.country_bookmaker
				.toString()
				.toLowerCase();

		// [ℹ] GET RESPONSE;
		const response: Cache_Single_Geo_GoalScorers_Translation_Response =
			await get(
				'api/cache/home/best_goalscorer?geoPos=' +
					userGeo
			);

		// [ℹ] if response is null;
		if (response == undefined) {
      dlog(`${BG_W_H_TAG} ❌ no data available!`, BG_W_H_TOG, BG_W_H_STY);
			noBestPlayers = true;
			return;
		}

		loaded = true;

		// [ℹ] intercept the length of array;
		trueLengthOfArray =
			response.top_geo_goalscorer_players.length;

		// [ℹ] return the FINAL Promise Value;
		return response;
	}

	// [ℹ] change data when `$userBetarenaSettings.country_bookmaker` changes `GEO-POSITION`;
	$: refresh_data =
		$userBetarenaSettings.country_bookmaker;
	$: if (refresh_data) {
		// [ℹ] reset necessary variables;
		refresh = true;
		setTimeout(async () => {
			refresh = false;
		}, 50);
	}

	// [ℹ] show-more / show-less;
	$: if (viewportDesktop) {
		if (trueLengthOfArray > 10) {
			displayShowMore = true;
			staticViewRow = 10;
			limitViewRow = 10;
		}
	} else {
		if (trueLengthOfArray > 5) {
			displayShowMore = true;
			staticViewRow = 5;
			limitViewRow = 5;
		}
	}

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... Toggling the Show/Hide of the
	 * ... list of featured site for the website;
	 */
	function toggleFullList() {
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
</script>

<!-- ===============
    COMPONENT HTML 
==================== -->

<SeoBox>
  <!-- used, 
	{#if !loaded}
  -->
  <div>
    <h2>
      {BEST_GOAL_SCORERS_DATA_SEO.translations
        .widget_translations.best_goal_scorers}
    </h2>
    <p>
      {BEST_GOAL_SCORERS_DATA_SEO.translations
        .widget_translations.goals}
    </p>
    <p>
      {BEST_GOAL_SCORERS_DATA_SEO.translations
        .widget_translations.odds}
    </p>
    <p>
      {BEST_GOAL_SCORERS_DATA_SEO.translations
        .widget_translations.player}
    </p>
    <p>
      {BEST_GOAL_SCORERS_DATA_SEO.translations
        .widget_translations.show_more_players}
    </p>
    <!-- [ℹ] list all of the players in the DB 
    -->
    {#each BEST_GOAL_SCORERS_DATA_SEO.top_geo_goalscorer_players as WIDGET_BEST_PLAYER}
      <p>{WIDGET_BEST_PLAYER.common_name}</p>
    {/each}
  </div>
</SeoBox>

<div>
	<!-- 
  [ℹ] NO BEST PLAYERS AVAILABLE PLACEHOLDER
  -->
	{#if noBestPlayers && !loaded}
    <WidgetNoData 
      WIDGET_TITLE={BEST_GOAL_SCORERS_DATA_SEO?.translations?.widget_translations?.best_goal_scorers}}
      NO_DATA_TITLE={"No Best Players Available"}
      NO_DATA_DESC={"Sorry, at this time there is no best players available!"}
    />
	{/if}

	<!-- 
  [ℹ] BEST GOALSCORERS WIDGET DATA 
  -->
	{#if !noBestPlayers && !refresh}
		<!-- 
    [ℹ] promise is pending 
    -->
		{#await widgetInit()}
			<BestGoalscorersWidgetContentLoader />

    <!-- 
    [ℹ] promise was fulfilled 
    -->
		{:then data}

      <WidgetTitle
        WIDGET_TITLE={BEST_GOAL_SCORERS_DATA_SEO?.translations?.widget_translations?.best_goal_scorers}
        OVERRIDE_COLOR={true}
      />

			<!-- 
      [ℹ] widget-component 
      -->
			<div
				id="featured-list-container"
				class:dark-background-1={$userBetarenaSettings.theme ==
					'Dark'}
			>
				<!-- [ℹ] DESKTOP ONLY 
        -->
				{#if viewportDesktop}
					<!-- [ℹ] widget-brakdown-columns-section 
          -->
					<div
						id="widget-title-row"
						class="row-space-out"
						style="width: auto;"
					>
						<p class="w-400 small color-grey">
							{BEST_GOAL_SCORERS_DATA_SEO
								.translations.widget_translations
								.player}
						</p>
						<div class="row-space-end">
							<p
								class="w-400 small color-grey"
								style="margin-right: 54px;"
							>
								{BEST_GOAL_SCORERS_DATA_SEO
									.translations
									.widget_translations.goals}
							</p>
							<p class="w-400 small color-grey">
								{BEST_GOAL_SCORERS_DATA_SEO
									.translations
									.widget_translations.odds}
							</p>
						</div>
					</div>
				{/if}

				<!-- [ℹ] display the first 5 rows on Mobile
        -->

				{#each data.top_geo_goalscorer_players.slice(0, limitViewRow) as data, i}
					<BestGoalscorerRow
						pos={i + 1}
						{data}
						WIDGET_TRANSLATION={BEST_GOAL_SCORERS_DATA_SEO.translations}
					/>
				{/each}

				<!-- [ℹ] show-more / show-less
        -->
				{#if displayShowMore}
					<div>
						<p
							id="show-more-box"
							on:click={() => toggleFullList()}
						>
							{#if !showMore}
								{BEST_GOAL_SCORERS_DATA_SEO
									.translations
									.widget_translations
									.show_more_players}
							{:else}
								{BEST_GOAL_SCORERS_DATA_SEO
									.translations
									.widget_translations
									.show_less_players}
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

			<!-- [ℹ] promise was rejected 
    -->
		{:catch error}
			{error}
		{/await}
	{/if}
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>

	#featured-list-container {
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

	/* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
	@media only screen and (min-width: 767px) {
		#featured-list-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/* 
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#featured-list-container {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/* .............. 
	WIDGET DARK THEME 
	................. */

	.dark-background-1 p#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#widget-title-row {
		background-color: #616161 !important;
	}
</style>
