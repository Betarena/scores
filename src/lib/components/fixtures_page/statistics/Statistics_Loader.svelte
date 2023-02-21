<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { userBetarenaSettings } from '$lib/store/user-settings';

	import LoaderCenterBlock from './loaders/Loader_Center_Block.svelte';
	import LoaderTeam from './loaders/Loader_Team.svelte';
	import LoaderTeamStat from './loaders/Loader_Team_Stat.svelte';
</script>

<!-- ===============
    COMPONENT HTML 
==================== -->

<div
	id="statistics-lineups-loader"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- 
  [ℹ] [MOBILE] [DESKTOP] [TABLET]
  -->

	<div id="loader-player-box">
		<div class="row-space-out">
			<LoaderTeam />
			<LoaderCenterBlock />
			<LoaderTeam />
		</div>
		{#each { length: 6 } as _, i}
			<div
				class="
          row-space-out
          loader-player-row
        "
			>
				<LoaderTeamStat />
				<LoaderCenterBlock />
				<LoaderTeamStat />
			</div>
		{/each}
	</div>
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	div#statistics-lineups-loader {
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		width: 100%;
		min-width: 100%;
		overflow: hidden;
		border-radius: 12px;
		/* dynamic */
		padding: 20px;
		margin-top: 40px;
	}

	/* plyaer row box */
	div#statistics-lineups-loader
		div#loader-player-box
		div.loader-player-row:first-child {
		border-top: 15px;
	}
	div#statistics-lineups-loader
		div#loader-player-box
		div.loader-player-row {
		padding: 14px 0 5px 0;
		border-bottom: 1px solid #e6e6e6;
	}
	div#statistics-lineups-loader
		div#loader-player-box
		div.loader-player-row:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1000px) {
		/* EMPTY */
	}

	/* 
  DESKTOP RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1001px) {
		/* plyaer row box */
		div#statistics-lineups-loader
			div#loader-player-box {
			width: 100%;
		}
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	div#statistics-lineups-loader.dark-background-1
		div#loader-player-box
		div.loader-player-row {
		border-bottom: 1px solid #616161;
	}
</style>
