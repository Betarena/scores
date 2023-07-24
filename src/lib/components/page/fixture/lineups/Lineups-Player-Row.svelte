<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">

  // #region ➤ [MAIN] Package Imports

	import { fade } from 'svelte/transition';

	import sessionStore from '$lib/store/session.js';
	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { FIXTURE_LIVE_TIME_OPT } from "@betarena/scores-lib/dist/api/sportmonks.js";

	import substitution from './assets/corner-up-right.svg';
	import football from './assets/football.svg';
	import injured from './assets/injured.svg';
	import red_card from './assets/red-card.svg';
	import yellow_card from './assets/yellow-card.svg';

	import type { B_LIN_T, LIN_Player } from '@betarena/scores-lib/types/lineups.js';
	import type { FIXTURE_STATUS_TYPES } from '@betarena/scores-lib/types/sportmonks.js';

  // #endregion ➤ [MAIN] Package Imports

  // #region ➤ [VARIABLES]

	export let PLAYER_INFO: LIN_Player;
	export let FIXTURE_LINEUPS_TRANSLATION: B_LIN_T;
	export let STATUS: FIXTURE_STATUS_TYPES;
	export let TYPE: 'R' | 'L';

	let ratingColorCode: string;

  // #endregion ➤ [VARIABLES]

  // #region ➤ [MAIN-METHODS]

  // #endregion ➤ [MAIN-METHODS]

  // #region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  // #endregion ➤ [ONE-OFF] [METHODS] [IF]

  // #region ➤ [REACTIVIY] [METHODS]

  /**
   * @summary
   * [MAIN] [REACTIVE]
   * @description
   * listens to target "player.rating" change, assigns color-code;
  */
  $: if_R_0 =
    PLAYER_INFO != undefined
		&& PLAYER_INFO?.rating != undefined
  ;
	$: if (if_R_0)
  {
    ratingColorCode = 'T';
    if (parseFloat(PLAYER_INFO.rating) >= 7) ratingColorCode = 'Y';
		if (parseFloat(PLAYER_INFO.rating) >= 9) ratingColorCode = 'G';
	}
  else
  {
		ratingColorCode = undefined;
	}

  // #endregion ➤ [REACTIVIY] [METHODS]

  // #region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  // #endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

{#if PLAYER_INFO != undefined && FIXTURE_LINEUPS_TRANSLATION != undefined}
  <a
    href="/{PLAYER_INFO?.urls?.[$sessionStore?.serverLang]}"
    class="
      cursor-pointer
    "
  >
    <div
      class="
        player-row
        row-space-out
      "
      class:type-L={TYPE == 'L'}
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
      in:fade
    >
      {#if TYPE == 'R'}
        <!--
        [ℹ] right-container
        [ℹ] player avatar
        [ℹ] player name
        [ℹ] player visual icons
        -->
        <div
          class="
            row-space-start
          "
        >
          <!--
          [ℹ] player avatar
          -->
          <img
            src={PLAYER_INFO?.player_avatar || 'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
            alt="player avatar"
            width="40"
            height="40"
            class="lineup-img"
            on:error={
              (e) =>
                (e.target.src = 'https://cdn.sportmonks.com/images/soccer/placeholder.png')
            }
          />
          <!--
          [ℹ] player main box
          -->
          <div>
            <div
              class="
                row-space-start
                player-info-row
              "
            >
              <p
                class="
                  w-500
                  color-black-2
                  lineup-player-name
                "
              >
                {PLAYER_INFO?.number}
                {PLAYER_INFO?.player_name}
              </p>
              <!--
              [ℹ] injured-player
              -->
              {#if PLAYER_INFO?.events?.injured}
                <img
                  src={injured}
                  alt="injured icon"
                />
              {/if}
              <!--
              [ℹ] yellowcard-player
              -->
              {#if PLAYER_INFO?.events?.yeallow_card}
                <img
                  src={yellow_card}
                  alt="yellow card"
                />
                {#if PLAYER_INFO?.events?.yeallow_card > 1}
                  <p>2</p>
                {/if}
              {/if}
              <!--
              [ℹ] goals-player (inc. own-goals)
              -->
              {#if PLAYER_INFO?.events?.goals}
                <img
                  src={football}
                  alt="football icon"
                />
              {/if}
              <!--
              [ℹ] red-card-player
              -->
              {#if PLAYER_INFO?.events?.red_card}
                <img
                  src={red_card}
                  alt="red_card icon"
                />
                {#if PLAYER_INFO?.events?.red_card > 1}
                  <p>2</p>
                {/if}
              {/if}
            </div>
            <!--
            [ℹ] substitution / position[T]
            -->
            {#if PLAYER_INFO?.events?.substitution}
              <div
                class="
                  row-space-start
                "
              >
                <img
                  src={substitution}
                  alt="substitution icon"
                  width="16"
                  height="16"
                  class="m-r-5"
                />
                <p
                  class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
                >
                  {PLAYER_INFO?.events?.substitution
                    ?.minute}' Out: {PLAYER_INFO
                    ?.events?.substitution
                    ?.related_player_name}
                </p>
              </div>
            {:else if PLAYER_INFO?.position}
              <p
                class="
                  w-400
                  color-grey
                  lineup-player-name
                "
              >
                {FIXTURE_LINEUPS_TRANSLATION[PLAYER_INFO?.position.toLowerCase()]}
              </p>
            {/if}
          </div>
        </div>

        <!--
        [ℹ] left-container
        [ℹ] player rating
        -->
        <div
          class="row-space-end"
          style="width: auto;"
        >
          {#if FIXTURE_LIVE_TIME_OPT.includes(STATUS) && PLAYER_INFO?.rating != undefined && parseInt(PLAYER_INFO?.rating) != 0}
            <p
              id="box-goals"
              class="medium w-500"
              class:rating_golden={ratingColorCode === 'G'}
              class:rating_silver={ratingColorCode === 'Y'}
              class:rating_bronze={ratingColorCode === 'T'}
            >
              {PLAYER_INFO?.rating}
            </p>
          {/if}
        </div>
      {:else}
        <!--
        [ℹ] right-container
        [ℹ] player rating
        -->
        <div
          class="row-space-start"
          style="width: auto;"
        >
          {#if FIXTURE_LIVE_TIME_OPT.includes(STATUS) && PLAYER_INFO?.rating != undefined && parseInt(PLAYER_INFO?.rating) != 0}
            <p
              id="box-goals"
              class="medium w-500"
              class:rating_golden={ratingColorCode === 'G'}
              class:rating_silver={ratingColorCode === 'Y'}
              class:rating_bronze={ratingColorCode === 'T'}
            >
              {PLAYER_INFO?.rating}
            </p>
          {/if}
        </div>

        <!--
        [ℹ] left-container
        [ℹ] player avatar
        [ℹ] player name
        [ℹ] player visual icons
        -->
        <div
          class="
            row-space-end
          "
        >
          <!--
          [ℹ] player main box
          -->
          <div>
            <div
              class="
                row-space-end
                player-info-row
              "
            >
              <!--
              [ℹ] injured-player
              -->
              {#if PLAYER_INFO?.events?.injured}
                <img
                  src={injured}
                  alt="injured icon"
                />
              {/if}
              <!--
              [ℹ] yellowcard-player
              -->
              {#if PLAYER_INFO?.events?.yeallow_card}
                <img
                  src={yellow_card}
                  alt="yellow card"
                />
                {#if PLAYER_INFO?.events?.yeallow_card > 1}
                  <p>2</p>
                {/if}
              {/if}
              <!--
              [ℹ] goals-player (inc. own-goals)
              -->
              {#if PLAYER_INFO?.events?.goals}
                <img
                  src={football}
                  alt="football icon"
                />
              {/if}
              <!--
              [ℹ] red-card-player
              -->
              {#if PLAYER_INFO?.events?.red_card}
                <img
                  src={red_card}
                  alt="red_card icon"
                />
                {#if PLAYER_INFO?.events?.red_card > 1}
                  <p>2</p>
                {/if}
              {/if}
              <!--
              [ℹ] player name
              -->
              <p
                class="
                    w-500
                    color-black-2
                    lineup-player-name
                  "
              >
                {PLAYER_INFO?.number}
                {PLAYER_INFO?.player_name}
              </p>
            </div>
            <!--
            [ℹ] player positon
            -->
            {#if PLAYER_INFO?.events?.substitution}
              <div
                class="
                  row-space-end
                "
              >
                <img
                  src={substitution}
                  alt="substitution icon"
                  width="16"
                  height="16"
                  class="m-r-5"
                />
                <p
                  class="
                    w-400
                    color-grey
                    lineup-player-name
                  "
                >
                  {PLAYER_INFO?.events?.substitution
                    ?.minute}' Out: {PLAYER_INFO
                    ?.events?.substitution
                    ?.related_player_name}
                </p>
              </div>
            {:else if PLAYER_INFO?.position}
              <p
                class="
                  w-400
                  color-grey
                  lineup-player-name
                "
              >
                {FIXTURE_LINEUPS_TRANSLATION[PLAYER_INFO?.position.toLowerCase()]}
              </p>
            {/if}
          </div>
          <!--
          [ℹ] player avatar
          -->
          <img
            src={PLAYER_INFO?.player_avatar || 'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
            alt="player_avatar icon"
            width="40"
            height="40"
            class="lineup-img"
            on:error={
              (e) =>
                (e.target.src =
                  'https://cdn.sportmonks.com/images/soccer/placeholder.png')
            }
          />
        </div>
      {/if}
    </div>
  </a>
{/if}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div.player-row
  {
		padding: 8px 20px;
	}
	div.player-row img.lineup-img
  {
		object-fit: contain;
		border-radius: 50%;
		border: 1px solid #e6e6e6;
		background-color: #ffffff;
		margin-right: 16px;
	}
	div.player-row div.player-info-row p.lineup-player-name
  {
		font-size: 14px;
	}
	div.player-row div.player-info-row img
  {
		margin-left: 8px;
	}
	div.player-row p#box-goals
  {
		box-sizing: border-box;
		text-align: center;
		border-radius: 30px;
		padding: 1.5px 8px;
		max-height: 24px;
		width: auto;
		color: white;
	}
	div.player-row p#box-goals.rating_golden
  {
		background-color: #ffb904 !important;
	}
	div.player-row p#box-goals.rating_silver
  {
		background-color: #8c8c8c !important;
	}
	div.player-row p#box-goals.rating_bronze
  {
		background-color: #dbb884 !important;
	}

	/* TYPE "LEFT" (L) */
	div.player-row.type-L img.lineup-img
  {
		margin-left: 16px;
	}
	div.player-row.type-L p.lineup-player-name
  {
		text-align: end;
	}
	div.player-row div.player-info-row img
  {
		margin-right: 8px;
	}

  div.player-row:hover div.player-info-row p.lineup-player-name
  {
    color: var(--primary) !important;
	}

  /*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (max-width: 425px)
  {
		/* EMPTY */
	}

	@media only screen
  and (max-width: 475px)
  {
		/* EMPTY */
	}

	@media only screen
  and (min-width: 1160px)
  and (max-width: 1240px)
  {
		/* EMPTY */
	}

	@media only screen
  and (min-width: 1240px)
  {
		/* EMPTY */
	}

	/*
  =============
  DARK-THEME
  =============
  */

</style>
