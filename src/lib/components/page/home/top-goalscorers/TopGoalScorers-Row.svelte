<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { sessionStore } from '$lib/store/session.js';
	import { userBetarenaSettings } from '$lib/store/user-settings';

	import type { B_TGOL_T, TGOL_Goalscorer } from '@betarena/scores-lib/types/top-goalscorers.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let pos: number;
	export let data: TGOL_Goalscorer;
	export let WIDGET_TRANSLATION: B_TGOL_T;

  let url: string;
	let viewportDesktop: boolean;

  $: url =
    data?.urls?.[$sessionStore?.serverLang] == undefined
      ? undefined
      : `/${data?.urls?.[$sessionStore?.serverLang]}`
  ;

  //#endregion ➤ [VARIABLES]

  //#region ➤ [METHODS]

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

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

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<a
  href={url}
  class=
  "
    cursor-pointer
  "
  class:disable-anchor={url == undefined}
  class:enabeld-anchor={url != undefined}
  style="display: block;"
>
  <div
    class="best-player-row"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    in:fade
  >
    <!--
    🖥️ LAPTOP
    -->
    {#if viewportDesktop}

      <div
        class="row-space-out">
        <div
          class="row-space-start">

          <!--
          POSITION NUMBER
          -->
          <div
            class=
            "
              pos-number-player-box
            "
          >
            <p
              class=
              "
                medium
                w-500
              "
            >
              {pos}
            </p>
          </div>

          <!--
          PLAYER LOGO + TEAM LOGO
          -->
          <div
            id="image-contaier">
            <img
              loading="lazy"
              id="player-img"
              src={data.image_path}
              alt="default alt text"
            />
            <img
              loading="lazy"
              id="team-img"
              src={data.logo_path}
              alt="default alt text"
            />
          </div>

          <!--
          PLAYER NAME + PLAYER POSITION
          -->
          <div
            style="margin-left: 16px;">
            <p
              id="featm-player-name"
              class=
              "
                medium
                w-500
              "
            >
              {data?.common_name}
            </p>
            <p
              class=
              "
                medium
                w-400
                color-grey
              "
            >
              {WIDGET_TRANSLATION?.positions_translations?.[data?.position]}
            </p>
          </div>

        </div>

        <!--
        GOALS + ODDS
        -->
        <div
          class="row-space-end">
          <p
            id="box-goals"
            class=
            "
              medium
              w-500
            "
          >
            {data.goals}
          </p>
          <p
            id="box-odds"
            class="medium w-500 w-normal"
            style="margin-left: 20px;"
          >
            -
          </p>
        </div>

      </div>

    {:else}

      <div
        class=
        "
          column-space-center
        "
      >
        <!--
        FIRST COLUMN
        -->
        <div
          class=
          "
            row-space-start
            m-b-12
          "
        >
          <p
            class="medium w-500"
            style="margin-right: 20px;"
          >
            {pos}
          </p>

          <!--
          PLAYER LOGO + TEAM LOGO
          -->
          <div id="image-contaier">
            <img
              loading="lazy"
              id="player-img"
              src={data.image_path}
              alt="default alt text"
            />
            <img
              loading="lazy"
              id="team-img"
              src={data.logo_path}
              alt="default alt text"
            />
          </div>

          <!--
          PLAYER NAME + PLAYER POSITION
          -->
          <div
            style="margin-left: 16px;">
            <p
              class=
              "
                medium
                w-500
              "
            >
              {data?.common_name}
            </p>
            <p
              class=
              "
                medium
                w-400
                color-grey
              "
            >
              {WIDGET_TRANSLATION?.positions_translations?.[data?.position]}
            </p>
          </div>

        </div>

        <!--
        GOALS + ODDS
        -->
        <div
          class="row-space-out">
          <div
            class=
            "
              row-space-out
              goals-mobile
              m-r-8
            "
          >
            <p
              class=
              "
                medium
                w-500
                w-normal
                color-grey
              "
            >
              {WIDGET_TRANSLATION?.widget_translations?.goals}
            </p>
            <p
              class=
              "
                medium
                w-500
                w-normal
              "
            >
              {data.goals}
            </p>
          </div>

          <div
            class=
            "
              row-space-out
              odds-mobile
            "
          >
            <p
              style="color: #CCCCCC"
              class=
              "
                medium
                w-500
                w-normal
                color-grey
              "
            >
              {WIDGET_TRANSLATION?.widget_translations?.odds}
            </p>
            <p
              style="color: #CCCCCC"
              class="medium w-500 w-normal color-grey"
            >
              -
            </p>
          </div>
        </div>

      </div>

    {/if}
  </div>
</a>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	.best-player-row
  {
		padding: 12.5px 20px;
		background-color: #ffffff;
		/* box-shadow: inset 0px 1px 0px #ebebeb; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.best-player-row #image-contaier
  {
		position: relative;
	}
	.best-player-row #image-contaier img#player-img
  {
		width: 40px;
		height: 40px;
		object-fit: contain;
		border-radius: 50%;
		border: 1px solid #cccccc;
	}
	.best-player-row #image-contaier img#team-img
  {
		width: 20px;
		height: 20px;
		object-fit: contain;
		position: absolute;
		right: -5px;
		bottom: 0;
	}
	.best-player-row div.pos-number-player-box
  {
		width: 8px;
		margin-right: 32px;
		position: relative;
	}
	.best-player-row div.pos-number-player-box p
  {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		right: 50%;
		margin: auto;
		height: 21px;
	}
	.best-player-row p#box-goals
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
	.best-player-row p#box-odds
  {
		background-color: #f2f2f2;
		border-radius: 4px;
		text-align: center;
		padding: 5px 0;
		max-height: 30px;
		width: 64px;
	}

  a.enabeld-anchor:hover p#featm-player-name
  {
    color: var(--primary) !important;
  }

	div.goals-mobile
  {
		border: 1px solid #e6e6e6;
		box-sizing: border-box;
		border-radius: 4px;
		padding: 10px 12px 10px 12px;
	}
	div.odds-mobile
  {
		background: #f2f2f2;
		border-radius: 4px;
		box-sizing: border-box;
		padding: 10px 12px 10px 12px;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (max-width: 475px)
  {
		.best-player-row:first-child
    {
			padding-top: 24px;
		}
	}

	/*
  =============
  DARK-THEME
  =============
  */

	div.dark-background-1.best-player-row
  {
		box-shadow: inset 0px 1px 0px #616161 !important;
		background-color: #4b4b4b !important;
	}

	.dark-background-1.best-player-row #image-contaier img#player-img
  {
		border: 1px solid #999999 !important;
	}

	.dark-background-1.best-player-row p#box-odds
  {
		background-color: #616161 !important;
	}

	.dark-background-1.best-player-row p#box-goals
  {
		background: #4b4b4b;
		border: 1px solid #616161;
	}

	.dark-background-1 div.goals-mobile,
	.dark-background-1 div.odds-mobile
  {
		background-color: #616161 !important;
		border: 1px solid #616161;
	}

	.dark-background-1 p
  {
		color: #ffffff;
	}

</style>
