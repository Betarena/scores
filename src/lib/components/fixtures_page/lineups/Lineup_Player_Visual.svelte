<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

	import { userBetarenaSettings } from '$lib/store/user-settings';
  
	import type { 
    Fixture_Player
  } from "$lib/models/fixtures/lineups/types";

  import injured from './assets/injured.svg';
  import yellow_card from './assets/yellow-card.svg';
  import red_card from './assets/red-card.svg';
  import football from './assets/football.svg';
  import football_red from './assets/football-red.svg';
  import substitution from './assets/corner-up-left.svg';
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let PLAYER_INFO:                 Fixture_Player;
  export let STATUS:                      string

  let ratingColorCode:    string;

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (
    PLAYER_INFO != undefined 
    && PLAYER_INFO?.rating != undefined) {
    if (parseFloat(PLAYER_INFO.rating) >= 9) {
      ratingColorCode = "G"
    } else if (parseFloat(PLAYER_INFO.rating) >= 7) {
      ratingColorCode = "Y"
    } else {
      ratingColorCode = "T"
    }
  } else {
    ratingColorCode = undefined;
  }

</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

{#if 
  PLAYER_INFO != undefined}

  <div
    id="main-player-box"
    class="column-space-center">
    <!-- 
    [ℹ] player avatar
    [ℹ] player rating -->
    <div
      class="
        player-main-info-box
      ">
      <img 
        src={PLAYER_INFO?.player_avatar} 
        alt=""
        width=32px
        height=32px
        class="lineup-img"
      />
      <!-- 
      [ℹ] player rating -->
      {#if 
        STATUS == "FT"
        && PLAYER_INFO?.rating != undefined}
        <p 
          id='box-goals'
          class="medium w-500"
          class:rating_golden={ratingColorCode === "G"}
          class:rating_silver={ratingColorCode === "Y"}
          class:rating_bronze={ratingColorCode === "T"}>
          {PLAYER_INFO?.rating}
        </p>
      {/if}
      <!--
      [ℹ] injured-player -->
      {#if PLAYER_INFO?.events?.injured}
        <img
          src={injured} 
          alt=""
          class="injured-box"
          width=12px
          height=12px
        />
      <!--
      [ℹ] substitution-player -->
      {:else if PLAYER_INFO?.events?.substitution}
        <img 
          src={substitution} 
          alt=""
          class="substituion-box"
          width=12px
          height=12px
        />
      {/if}
      <!--
      [ℹ] redcard-player -->
      {#if PLAYER_INFO?.events?.red_card}
        <img
          src={red_card}
          alt=""
          class="yellow-card-box"
          width=14px
          height=14px
        />
      <!--
      [ℹ] yellowcard-player -->
      {:else if PLAYER_INFO?.events?.yeallow_card}
        <img
          src={yellow_card}
          alt=""
          class="yellow-card-box"
          width=14px
          height=14px
        />
        {#if PLAYER_INFO?.events?.yeallow_card > 1}
          <p>
            2
          </p>
        {/if}
      {/if}
      <!--
      [ℹ] goals-player (inc. own-goals) -->
      {#if PLAYER_INFO?.events?.goals}
        <img 
          src={football} 
          alt=""
          class="goal-box"
          width=12px
          height=12px
        />
      {/if}
    </div>
    <!-- 
    [ℹ] player name -->
    <p
      class="
        w-500
        color-black-2
        lineup-player-name
      ">
      {PLAYER_INFO?.player_name.split(' ')[1] || PLAYER_INFO?.player_name.split(' ')[0]}
      <!-- {PLAYER_INFO?.player_name.split(' ')[0] + " " + (PLAYER_INFO?.player_name.split(' ')[1] || "")} -->
      <!-- {PLAYER_INFO?.player_name} -->
      <br/>
      <span>
        {PLAYER_INFO?.number}
      </span>
    </p>
  </div>
      
{/if}

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  div#main-player-box {
    text-align: center;
    /* width: fit-content; */
  } div#main-player-box div.player-main-info-box {
    position: relative;
  } div#main-player-box div.player-main-info-box img.lineup-img {
    position: relative;
    width: 32px;
    height: 32px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
    object-fit: contain;
    border-radius: 50%;
    background-color: white;
  } div#main-player-box div.player-main-info-box p#box-goals {
    box-sizing: border-box;
    text-align: center;
    border-radius: 30px;
		padding: 0 4px;
    max-height: 16px;
    color: white;
    /* dynamic */
    position: absolute;
    bottom: 0;
    right: 80%;
    width: auto;
    font-size: 10px;
  } div#main-player-box div.player-main-info-box p#box-goals.rating_golden {
    background-color: #ffb904 !important;
  } div#main-player-box div.player-main-info-box p#box-goals.rating_silver {
    background-color: #8C8C8C !important;
  } div#main-player-box div.player-main-info-box p#box-goals.rating_bronze {
    background-color: #dbb884 !important;
  } div#main-player-box div.player-main-info-box img.yellow-card-box {
    position: absolute;
    top: 0;
    left: 80%;
  } div#main-player-box div.player-main-info-box img.goal-box {
    position: absolute;
    bottom: 0;
    left: 80%;
  } div#main-player-box div.player-main-info-box img.substituion-box {
    position: absolute;
    top: 0;
    right: 80%;
  } div#main-player-box div.player-main-info-box img.injured-box {
    position: absolute;
    top: 0;
    right: 80%;
  } div#main-player-box p.lineup-player-name {
    white-space: nowrap;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    /* max-width: 60px; */
    /* dynamic */
    font-size: 10px;
  }

  /* 
  MOBILE RESPONSIVNESS (&+) */
  @media only screen and (max-width: 425px) {
    /* EMPTY */
  }

  @media only screen and (max-width: 475px) {
    /* EMPTY */
  }

  /* 
  RESPONSIVE FOR DESKTOP ONLY (&+) [1440px] */
	@media only screen and (min-width: 1160px) and (max-width: 1240px) {
    /* EMPTY */
	}

  @media only screen and (min-width: 1240px) {
    /* EMPTY */
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

</style>