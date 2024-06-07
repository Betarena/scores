<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import userBetarenaSettings from '$lib/store/user-settings.js';
  import sessionStore  from '$lib/store/session.js';
	import type { Single_Team_Object_Data } from '$lib/models/leagues_table/types';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	export let data: Single_Team_Object_Data;

	let viewportDesktop: boolean;

  // #endregion ➤ 📌 VARIABLES

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
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
	in:fade
	class=
  "
  league-table-team-row
  "
  class:mobile={$sessionStore.viewportType === 'mobile'}
	class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
>


		<div
      class=
      "
      row-space-out
      "
    >

			<div
        class=
        "
        row-space-start
        "
      >
				<div
          class=
          "
          team-pos
          "
        >
					<p
						class=
            "
            team-pos
            medium
            w-500
            "
						class:border-pos={data.color_code === 'transparent'}
						style="background-color: {data.color_code}"
					>
						{data.position}
					</p>

				</div>

				<div
          id="image-contaier"
        >
					<img
            loading="lazy"
						class="team-img"
						src={data.team_logo}
						alt="default alt text"
					/>
				</div>

				<!--
        TEAM NAME
        -->
				<div
          class="team-name"
          style="margin-left: 16px;"
        >
					<p
            class=
            "
            medium
            w-500
            "
          >
						{data.team_name}
					</p>
				</div>

			</div>

			<!--
      SECOND CONTAINER
      -->

			<!--
      GAMES & POINTS
      -->
			<div
        class=
        "
        row-space-end
        "
      >

				<p
          id="box-goals"
          class=
          "
          medium
          w-500
          "
        >
					{data.games_played}
				</p>

				<p
					id="box-goals"
					class=
          "
          medium
          w-500
          "
					style="margin-left: 8px;"
				>
					{data.points}
				</p>

			</div>

		</div>


</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style lang="scss">

	.league-table-team-row
  {
		padding: 6px 20px;
		background-color: #ffffff;
		/* box-shadow: inset 0px 1px 0px #ebebeb; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.league-table-team-row #image-contaier
  {
		width: 32px;
		height: 32px;
		position: relative;
	}
	.league-table-team-row #image-contaier img.team-img
  {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}
	.league-table-team-row div.team-pos
  {
		width: 24px;
		height: 24px;
		margin-right: 24px;
		position: relative;
		border-radius: 50%;
	}
	.league-table-team-row div.team-pos p
  {
		position: absolute;
		margin: auto;
		min-width: 24px;
		text-align: center;
		border-radius: 50%;
		height: 24px;
		border-radius: 30px;
		padding: 1.5px 8px;
		color: white;
	}
	.border-pos
  {
		color: black !important;
		border: 1px solid #e6e6e6;
	}
	.league-table-team-row p#box-goals
  {
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
  =============
  ⚡️ RESPONSIVNESS
  =============
  */

	@media only screen
  and (max-width: 475px)
  {

		.league-table-team-row:first-child
    {
			padding-top: 24px;
		}

	}

  .mobile {
    div.team-pos {
      margin-right: 12px;
      flex-shrink: 0;
      }
    .team-name {
      margin-left: 10px !important;
    }
  }

	/*
  =============
  🌒 DARK-THEME
  =============
  */

	div.dark-background-1.league-table-team-row
  {
		background-color: #4b4b4b !important;
	}

	.dark-background-1.league-table-team-row p#box-goals
  {
		background: #4b4b4b;
		border: 1px solid #616161;
	}

	.dark-background-1 .border-pos
  {
		color: white !important;
		border: 1px solid #616161 !important;
	}

	.dark-background-1 p
  {
		color: #ffffff;
	}

</style>
