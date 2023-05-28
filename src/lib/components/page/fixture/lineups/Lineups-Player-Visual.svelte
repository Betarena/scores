<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

	import substitution from './assets/corner-up-left.svg';
	import football from './assets/football.svg';
	import injured from './assets/injured.svg';
	import red_card from './assets/red-card.svg';
	import yellow_card from './assets/yellow-card.svg';
  
	import type { LIN_Player } from '@betarena/scores-lib/types/lineups.js';

	// ~~~~~~~~~~~~~~~~~~~~~
	//  COMPONENT VARIABLES
	// ~~~~~~~~~~~~~~~~~~~~~

	export let PLAYER_INFO: LIN_Player;
	export let STATUS: string;

	let ratingColorCode: string;
  let playerName: string =
    PLAYER_INFO?.player_name
    ?.split
    (
      ' '
    )
    [
      PLAYER_INFO?.player_name
      ?.split
      (
        ' '
      )
      ?.length - 1
    ] 
    || PLAYER_INFO?.player_name
      ?.split
      (
        ' '
      )[0]
  ;

	// ~~~~~~~~~~~~~~~~~~~~~
	// REACTIVE SVELTE OTHER
	// ~~~~~~~~~~~~~~~~~~~~~

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
  
</script>

<!-- ===============
COMPONENT HTML 
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

{#if PLAYER_INFO != undefined}
  <a
    href="/{PLAYER_INFO?.urls?.['en']}"
    class="
      cursor-pointer
    "
  >
    <div
      id="main-player-box"
      class="column-space-center"
    >
      <!-- 
      player avatar
      player rating 
      -->
      <div
        class="
          player-main-info-box
        "
      >
        <img
          loading="lazy"
          src={PLAYER_INFO?.player_avatar || 'https://cdn.sportmonks.com/images/soccer/placeholder.png'}
          alt="default alt text"
          width="32"
          height="32"
          class="lineup-img"
          on:error={(e) =>
            (e.target.src =
              'https://cdn.sportmonks.com/images/soccer/placeholder.png')}
        />

        <!-- 
        player rating 
        -->
        {#if ['FT', 'FT_PEN', 'LIVE'].includes(STATUS) && PLAYER_INFO?.rating != undefined}
          <p
            id="box-goals"
            class="
              medium 
              w-500
            "
            class:rating_golden={ratingColorCode === 'G'}
            class:rating_silver={ratingColorCode === 'Y'}
            class:rating_bronze={ratingColorCode === 'T'}
          >
            {PLAYER_INFO?.rating}
          </p>
        {/if}

        <!--
        injured-player 
        -->
        {#if PLAYER_INFO?.events?.injured}
          <img
            src={injured}
            alt="default alt text"
            class="injured-box"
            width="12px"
            height="12px"
          />
        <!--
        [ℹ] substitution-player 
        -->
        {:else if PLAYER_INFO?.events?.substitution}
          <img
            src={substitution}
            alt="default alt text"
            class="substituion-box"
            width="12px"
            height="12px"
          />
        {/if}
        <!--
        [ℹ] redcard-player 
        -->
        {#if PLAYER_INFO?.events?.red_card}
          <img
            src={red_card}
            alt="default alt text"
            class="yellow-card-box"
            width="14px"
            height="14px"
          />
          <!--
        [ℹ] yellowcard-player 
        -->
        {:else if PLAYER_INFO?.events?.yeallow_card}
          <img
            src={yellow_card}
            alt="default alt text"
            class="yellow-card-box"
            width="14px"
            height="14px"
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
            alt="default alt text"
            class="goal-box"
            width="12px"
            height="12px"
          />
        {/if}
      </div>

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
        {playerName}
        <br />
        <span>
          {PLAYER_INFO?.number}
        </span>
      </p>
    </div>
  </a>
{/if}

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	div#main-player-box 
  {
		text-align: center;
		/* width: fit-content; */
	}
	div#main-player-box div.player-main-info-box 
  {
		position: relative;
	}
	div#main-player-box	div.player-main-info-box img.lineup-img 
  {
		position: relative;
		width: 32px;
		height: 32px;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
		object-fit: contain;
		border-radius: 50%;
		background-color: white;
	}
	div#main-player-box	div.player-main-info-box p#box-goals 
  {
		box-sizing: border-box;
		text-align: center;
		border-radius: 30px;
		padding: 0 4px;
		max-height: 16px;
		color: white;
		/* p */
		position: absolute;
		bottom: 0;
		right: 80%;
		width: auto;
		font-size: 10px;
	}
	div#main-player-box	div.player-main-info-box p#box-goals.rating_golden 
  {
		background-color: #ffb904 !important;
	}
	div#main-player-box	div.player-main-info-box p#box-goals.rating_silver 
  {
		background-color: #8c8c8c !important;
	}
	div#main-player-box	div.player-main-info-box p#box-goals.rating_bronze 
  {
		background-color: #dbb884 !important;
	}
	div#main-player-box	div.player-main-info-box img.yellow-card-box 
  {
		position: absolute;
		top: 0;
		left: 80%;
	}
	div#main-player-box	div.player-main-info-box img.goal-box 
  {
		position: absolute;
		bottom: 0;
		left: 80%;
	}
	div#main-player-box	div.player-main-info-box img.substituion-box 
  {
		position: absolute;
		top: 0;
		right: 80%;
	}
	div#main-player-box	div.player-main-info-box img.injured-box 
  {
		position: absolute;
		top: 0;
		right: 80%;
	}
	div#main-player-box p.lineup-player-name 
  {
		white-space: nowrap;
		/* overflow: hidden; */
		/* text-overflow: ellipsis; */
		/* max-width: 60px; */
		/* dynamic */
		font-size: 10px;
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

	/* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
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
