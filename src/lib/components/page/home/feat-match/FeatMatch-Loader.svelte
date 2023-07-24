<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import Desktop_PlaceholderBestPlayers from './loaders/desktop/_Placeholder_BestPlayers.svelte';
	import Desktop_PlaceholderLeagueInfo from './loaders/desktop/_Placeholder_LeagueInfo.svelte';
	import Desktop_PlaceholderTvStations from './loaders/desktop/_Placeholder_TvStations.svelte';
	import Desktop_PlaceholderValueBets from './loaders/desktop/_Placeholder_ValueBets.svelte';
	import Desktop_Placeholder_VisualVote from './loaders/desktop/_Placeholder_VisualVote.svelte';

	import Tablet_PlaceholderBestPlayers from './loaders/tablet/_Placeholder_BestPlayers.svelte';
	import Tablet_PlaceholderLeagueInfo from './loaders/tablet/_Placeholder_LeagueInfo.svelte';
	import Tablet_PlaceholderTvStations from './loaders/tablet/_Placeholder_TvStations.svelte';
	import Tablet_PlaceholderValueBets from './loaders/tablet/_Placeholder_ValueBets.svelte';
	import Tablet_Placeholder_VisualVote from './loaders/tablet/_Placeholder_VisualVote.svelte';

	import Mobile_PlaceholderBestPlayers from './loaders/mobile/_Placeholder_BestPlayers.svelte';
	import Mobile_PlaceholderLeagueInfo from './loaders/mobile/_Placeholder_LeagueInfo.svelte';
	import Mobile_PlaceholderTvStations from './loaders/mobile/_Placeholder_TvStations.svelte';
	import Mobile_PlaceholderValueBets from './loaders/mobile/_Placeholder_ValueBets.svelte';
	import Mobile_Placeholder_VisualVote from './loaders/mobile/_Placeholder_VisualVote.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				// TABLET - VIEW
				if (w > 768) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// MOBILE - VIEW
				if (w < 475) {
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

<div
	id="live-score-container"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- ... DESKTOP CONTENT-LOADER ... -->
	{#if !tabletExclusive}
		<!-- ... LEAGUE-GAME-TITLE ... -->
		<div id="fixture-league-title">
			<Desktop_PlaceholderLeagueInfo />
		</div>

		<!-- ... MATCH-VOTING-VISUAL-BOX ... -->
		<div id="fixture-visual-box">
			<Desktop_Placeholder_VisualVote />
		</div>

		<!-- ... TV-STATIONS PLACEHOLDER ... -->
		<div id="live-stream-box">
			<Desktop_PlaceholderTvStations />
		</div>

		<!-- ... BEST-PLAYERS PLACEHOLDER ... -->
		<div id="best-players-box-out">
			<!-- ... TEAM - 1 ... -->
			<div class="best-players-box">
				<Desktop_PlaceholderBestPlayers />
			</div>
			<!-- ... TEAM - 2 ... -->
			<div class="best-players-box">
				<Desktop_PlaceholderBestPlayers />
			</div>
		</div>

		<!-- ... VALUE-BETS PLACEHOLDER LOADER ... -->
		<div id="value-bets">
			<Desktop_PlaceholderValueBets />
		</div>

		<!-- ... TABLET CONTENT-LOADER ... -->
	{:else if tabletExclusive && !mobileExclusive}
		<!-- ... LEAGUE-GAME-TITLE ... -->
		<div id="fixture-league-title">
			<Tablet_PlaceholderLeagueInfo />
		</div>

		<!-- ... MATCH-VOTING-VISUAL-BOX ... -->
		<div id="fixture-visual-box">
			<Tablet_Placeholder_VisualVote />
		</div>

		<!-- ... TV-STATIONS PLACEHOLDER ... -->
		<div id="live-stream-box">
			<Tablet_PlaceholderTvStations />
		</div>

		<!-- ... BEST-PLAYERS PLACEHOLDER ... -->
		<div id="best-players-box-out">
			<!-- ... TEAM - 1 ... -->
			<div class="best-players-box">
				<Tablet_PlaceholderBestPlayers />
			</div>
			<!-- ... TEAM - 2 ... -->
			<div class="best-players-box">
				<Tablet_PlaceholderBestPlayers />
			</div>
		</div>

		<!-- ... VALUE-BETS PLACEHOLDER LOADER ... -->
		<div id="value-bets">
			<Tablet_PlaceholderValueBets />
		</div>

		<!-- ... MOBILE EXCLUSIVE CONTENT-LOADER ... -->
	{:else if tabletExclusive && mobileExclusive}
		<!-- ... LEAGUE-GAME-TITLE ... -->
		<div id="fixture-league-title">
			<Mobile_PlaceholderLeagueInfo />
		</div>

		<!-- ... MATCH-VOTING-VISUAL-BOX ... -->
		<div id="fixture-visual-box">
			<Mobile_Placeholder_VisualVote />
		</div>

		<!-- ... TV-STATIONS PLACEHOLDER ... -->
		<div id="live-stream-box">
			<Mobile_PlaceholderTvStations />
		</div>

		<!-- ... BEST-PLAYERS PLACEHOLDER ... -->
		<div id="best-players-box-out">
			<!-- ... TEAM - 1 ... -->
			<div class="best-players-box">
				<Mobile_PlaceholderBestPlayers />
			</div>
			<!-- ... TEAM - 2 ... -->
			<div class="best-players-box">
				<Mobile_PlaceholderBestPlayers />
			</div>
		</div>

		<!-- ... VALUE-BETS PLACEHOLDER LOADER ... -->
		<div id="value-bets">
			<Mobile_PlaceholderValueBets />
		</div>
	{/if}
</div>

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>
	div#live-score-container {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		min-width: 100%;
		width: 100%;
		max-width: 343px;
		padding-bottom: 4px;
		overflow: hidden;
	}

	div#fixture-league-title {
		padding: 10px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
		height: 44px;
	}

	div#fixture-visual-box {
		padding: 25px 20px 20px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
		height: 305px;
		position: relative;
	}

	div#live-stream-box {
		padding: 52px 20px 20px 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
		width: inherit;
		height: 160px;
	}

	div.best-players-box {
		padding: 20px;
		box-shadow: inset 0px -1px 0px #ebebeb;
		height: 216px;
	}

	div#value-bets {
		padding: 61px 20px 27px 20px;
		height: 215px;
	}

	/*
    MOBILE-EXCLUSIVE RESPONSIVNESS */
	@media only screen and (max-width: 475px) {
		/* ... REUIRED FOR SVELTE-CONTENT-LOADER ... */
		:global(svg) {
			width: 100% !important;
		}

		div#value-bets {
			height: 302px;
		}

		div#live-stream-box {
			height: 112px;
		}
	}

	@media only screen and (max-width: 768px) {
		:global(svg) {
			width: 100% !important;
		}
	}

	@media only screen and (min-width: 768px) {
		#live-score-container {
			margin-top: 40px;
		}
	}

	/* WIDGET DARK THEME */
	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}
</style>
