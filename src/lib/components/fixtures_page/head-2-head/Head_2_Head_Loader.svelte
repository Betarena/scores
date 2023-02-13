<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import LoaderOddsBoxL from './loaders/tablet/Loader_Odds_Box_L.svelte';
	import LoaderOddsBoxR from './loaders/tablet/Loader_Odds_Box_R.svelte';
	import LoaderPastFixture from './loaders/tablet/Loader_Past_Fixture.svelte';
	import LoaderTopProgressBar from './loaders/tablet/Loader_Top_Progress_Bar.svelte';
	import LoaderTopStatsBox from './loaders/tablet/Loader_Top_Stats_Box.svelte';
	import LoaderTopWidgetTeamInfo_L from './loaders/tablet/Loader_Top_Widget_Team_Info_L.svelte';
	import LoaderTopWidgetTeamInfo_R from './loaders/tablet/Loader_Top_Widget_Team_Info_R.svelte';
	import TopWidgetText from './loaders/tablet/Loader_Top_Widget_Text.svelte';

	import MobileLoaderPastFixture from './loaders/mobile/Loader_Past_Fixture.svelte';
	import MobileLoaderProgressBarBox_L from './loaders/mobile/Loader_Progress_Bar_Box_L.svelte';
	import MobileLoaderProgressBarBox_R from './loaders/mobile/Loader_Progress_Bar_Box_R.svelte';
	import MobileLoaderTeamIcon from './loaders/mobile/Loader_Team_Icon.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		if (wInit < 768) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				if (w > 768) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				if (w < 768) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});
</script>

<!-- ===============
    COMPONENT HTML 
==================== -->

<div>
	<!-- 
  [ℹ] widget-component 
  -->
	<div
		id="h2h-fixture-loader"
		class:dark-background-1={$userBetarenaSettings.theme ==
			'Dark'}
	>
		<!-- 
    [ℹ] [MOBILE]
    -->
		{#if mobileExclusive}
			<div class="top-text-box">
				<TopWidgetText />
			</div>

			<div
				id="team-info-row"
				class="
          row-space-out
        "
			>
				<MobileLoaderTeamIcon />
				<LoaderTopStatsBox />
				<MobileLoaderTeamIcon />
			</div>

			<div class="row-space-out">
				<MobileLoaderProgressBarBox_L />
				<MobileLoaderProgressBarBox_R />
			</div>

			<!-- 
      [ℹ] fixture bet-stats info
      -->
			<div id="grid-bet-stats">
				{#each { length: 6 } as i, _}
					<div
						class="
              row-space-out
              fixture-info-box
            "
					>
						<LoaderOddsBoxL />
						<LoaderOddsBoxR />
					</div>
				{/each}
			</div>

			<!-- 
      [ℹ] fixture past-fixtures
      -->
			{#each { length: 5 } as item}
				<div
					class="
            row-space-out
            fixture-past-box
          "
				>
					<MobileLoaderPastFixture />
				</div>
			{/each}
		{/if}

		<!-- 
    [ℹ] [DESKTOP] [TABLET]
    -->
		{#if !mobileExclusive}
			<div class="top-text-box">
				<TopWidgetText />
			</div>

			<div
				id="team-info-row"
				class="row-space-out"
			>
				<LoaderTopWidgetTeamInfo_L />
				<LoaderTopStatsBox />
				<LoaderTopWidgetTeamInfo_R />
			</div>

			<div class="row-space-out">
				<LoaderTopProgressBar />
				<LoaderTopProgressBar />
			</div>

			<!-- 
      [ℹ] fixture bet-stats info
      -->
			<div id="grid-bet-stats">
				{#each { length: 6 } as i, _}
					<div
						class="
              row-space-out
              fixture-info-box
            "
					>
						<LoaderOddsBoxL />
						<LoaderOddsBoxR />
					</div>
				{/each}
			</div>

			<!-- 
      [ℹ] fixture past-fixtures
      -->
			{#each { length: 5 } as item}
				<div
					class="
            row-space-out
            fixture-past-box
          "
				>
					<LoaderPastFixture />
				</div>
			{/each}
		{/if}
	</div>
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	#h2h-fixture-loader {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
		padding: 20px;
		width: 100%;
		min-width: -webkit-fill-available;
		margin-top: 40px;
		position: relative;
	}

	div.top-text-box {
		width: 100%;
		text-align: center;
		margin-bottom: 8px;
	}

	div#team-info-row {
		margin-bottom: 15px;
	}

	/* fixture bet info */
	div#grid-bet-stats {
		margin-top: 20px;
	}
	div.fixture-info-box {
		border-bottom: 1px solid #e6e6e6;
		padding: 12px 0;
	}

	div.fixture-past-box:last-child {
		border: none !important;
	}
	div.fixture-past-box {
		border-bottom: 1px solid #e6e6e6;
		padding: 16px 0;
		justify-content: center;
	}

	:global(div#h2h-fixture-loader svg) {
		width: auto !important;
	}

	/* ====================
    responsivness
  ==================== */

	/* 
  [TABLET] && [DESKTOP] RESPONSIVNESS */
	@media only screen and (min-width: 767px) {
		#h2h-fixture-loader {
			min-width: 100%;
			/* max-width: 700px; */
		}

		div#grid-bet-stats {
			position: relative;
			display: grid;
			grid-gap: 15px;
			margin-top: 20px;
			grid-auto-flow: row;
			grid-template-columns: 1fr 1fr;
		}
		div.fixture-info-box {
			border: 1px solid #e6e6e6;
			border-radius: 8px;
			padding: 12px 20px;
		}

		div#h2h-fixture-loader.dark-background-1
			div.fixture-info-box {
			border: 1px #616161 solid;
		}

		div.fixture-past-box {
			padding: 24px 0;
			justify-content: unset;
		}

		:global(div#h2h-fixture-loader
				div.fixture-past-box
				svg) {
			width: 100% !important;
		}
	}

	/* 
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#h2h-fixture-loader {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	div#h2h-fixture-loader.dark-background-1
		div.fixture-info-box {
		border-bottom: 1px #616161 solid;
	}
	div#h2h-fixture-loader.dark-background-1
		div.fixture-past-box {
		border-bottom: 1px #616161 solid;
	}
</style>
