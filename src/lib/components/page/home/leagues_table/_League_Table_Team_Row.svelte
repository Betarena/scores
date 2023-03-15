<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
// ... external modules imports;
	import { userBetarenaSettings } from '$lib/store/user-settings';

	import type { Single_Team_Object_Data } from '$lib/models/leagues_table/types';

	export let data: Single_Team_Object_Data;

	/**
	 * Description:
	 * ~~~~~~~~~~~~~~~~~~~
	 * ... ℹ onMount() function that verifies that
	 * ... ℹ the `viewport` width is of tablet size
	 * ... ℹ or greater;
	 */
	let viewportDesktop: boolean;
	// ...
	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		if (wInit > 475) {
			viewportDesktop = true;
		} else {
			viewportDesktop = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				if (w > 475) {
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

<div
	class="league-table-team-row"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
	in:fade
>
	<!-- ... DESKTOP VERSION ... -->
	{#if viewportDesktop}
		<!-- ... first container of the row site -->
		<div class="row-space-out">
			<!-- ... ℹ first container
        -->
			<div class="row-space-start">
				<!-- ... ℹ team number position 
            ONLY ON DESKTOP VERSION
          -->
				<div class="team-pos">
					<p
						class="team-pos medium w-500"
						style="background-color: {data.color_code}"
						class:border-pos={data.color_code ===
							'transparent'}
					>
						{data.position}
					</p>
				</div>
				<!-- ... ℹ team logo
          -->
				<div id="image-contaier">
					<img
						class="team-img"
						src={data.team_logo}
						alt="default alt text"
					/>
				</div>
				<!-- ... ℹ team name
          -->
				<div style="margin-left: 16px;">
					<p class="medium w-500">
						{data.team_name}
					</p>
				</div>
			</div>

			<!-- ... ℹ second container 
        -->
			<!-- ... ℹ games & points
        -->
			<div class="row-space-end">
				<p id="box-goals" class="medium w-500">
					{data.games_played}
				</p>
				<p
					id="box-goals"
					class="medium w-500"
					style="margin-left: 8px;"
				>
					{data.points}
				</p>
			</div>
		</div>
	{/if}
</div>

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>
	.league-table-team-row {
		padding: 6px 20px;
		background-color: #ffffff;
		/* box-shadow: inset 0px 1px 0px #ebebeb; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.league-table-team-row #image-contaier {
		width: 32px;
		height: 32px;
		position: relative;
	}
	.league-table-team-row
		#image-contaier
		img.team-img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}
	.league-table-team-row div.team-pos {
		width: 24px;
		height: 24px;
		margin-right: 24px;
		position: relative;
		border-radius: 50%;
		/* background-color: dodgerblue; */
	}
	.league-table-team-row div.team-pos p {
		position: absolute;
		margin: auto;
		min-width: 24px;
		text-align: center;
		border-radius: 50%;
		height: 24px;
		/* padding: 4px 8px; */
		border-radius: 30px;
		padding: 1.5px 8px;
		color: white;
	}
	.border-pos {
		color: black !important;
		border: 1px solid #e6e6e6;
	}
	.league-table-team-row p#box-goals {
		background-color: #ffffff;
		border: 1px solid #e6e6e6;
		box-sizing: border-box;
		border-radius: 4px;
		text-align: center;
		padding: 5px 0;
		max-height: 30px;
		width: 64px;
	}

	/* 
  MOBILE RESPONSIVNESS */
	@media only screen and (max-width: 475px) {
		.league-table-team-row:first-child {
			padding-top: 24px;
		}
	}

	/* .............. 
	WIDGET DARK THEME 
	................. */

	div.dark-background-1.league-table-team-row {
		/* box-shadow: inset 0px 1px 0px #616161 !important; */
		background-color: #4b4b4b !important;
	}

	.dark-background-1.league-table-team-row
		p#box-goals {
		background: #4b4b4b;
		border: 1px solid #616161;
	}

	.dark-background-1 .border-pos {
		color: white !important;
		border: 1px solid #616161 !important;
	}

	.dark-background-1 p {
		color: #ffffff;
	}
</style>
