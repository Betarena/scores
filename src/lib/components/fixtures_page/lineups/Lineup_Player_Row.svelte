<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

	import { userBetarenaSettings } from '$lib/store/user-settings';
  
	import type { 
    Fixture_Player, 
    REDIS_CACHE_SINGLE_lineups_translation 
  } from "$lib/models/fixtures/lineups/types";

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let PLAYER_INFO:                 Fixture_Player;
  export let FIXTURE_LINEUPS_TRANSLATION: REDIS_CACHE_SINGLE_lineups_translation;

  let ratingColorCode:    string;

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (PLAYER_INFO != undefined && PLAYER_INFO?.stats?.rating != undefined) {
    if (parseInt(PLAYER_INFO.stats.rating) > 7.99) {
      ratingColorCode = "G"
    } else if (parseInt(PLAYER_INFO.stats.rating) > 6.99) {
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
  PLAYER_INFO != undefined 
  && FIXTURE_LINEUPS_TRANSLATION != undefined}
  <div 
    class="
      player-row
      row-space-out
    "
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
    in:fade>

      <!-- 
      [ℹ] right-container
      [ℹ] player avatar
      [ℹ] player name -->
      <div
        class="
          row-space-start
        ">
        <img 
          src={PLAYER_INFO?.player_avatar} 
          alt=""
          width=40px
          height=40px
          class="lineup-img"
        />
        <p
          class="
            w-500
            color-black
            lineup-player-name
          ">
          {PLAYER_INFO?.number} {PLAYER_INFO?.player_name}
          <br/>
          <span
            class="
              w-400
              color-grey
            ">
            {FIXTURE_LINEUPS_TRANSLATION[PLAYER_INFO?.position.toLowerCase()]}
          </span>
        </p>
      </div>

      <!-- 
      [ℹ] left-container
      [ℹ] player rating-->
      <div
        class="row-space-end"
        style="width: auto;">
        <p 
          id='box-goals'
          class="medium w-500"
          class:rating_green={ratingColorCode === "G"}
          class:rating_yellow={ratingColorCode === "Y"}
          class:rating_grey={ratingColorCode === "T"}>
          {PLAYER_INFO?.stats?.rating}
        </p>
      </div>
      
  </div>
{/if}

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  div.player-row {
    padding: 8px 20px;
  } div.player-row img.lineup-img {
    object-fit: contain;
    border-radius: 50%;
    border: 1px solid #E6E6E6;
    /* dynamic */
    margin-right: 16px;
  } div.player-row p.lineup-player-name {
    /* dynamic */
    font-size: 14px;
  } div.player-row p#box-goals {
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  } div.player-row p#box-goals.rating_green {
    background-color: #59C65D !important;
    color: #ffffff;
    border: 1px solid transparent;
  } div.player-row p#box-goals.rating_yellow {
    background-color: #FFB904 !important;
    color: #ffffff;
    border: 1px solid transparent;
  } div.player-row p#box-goals.rating_grey {
    background-color: #F2F2F2 !important;
    color: #8C8C8C;
    border: 1px solid transparent;
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