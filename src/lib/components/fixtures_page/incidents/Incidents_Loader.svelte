<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from '$app/environment';

	import { userBetarenaSettings } from '$lib/store/user-settings';

  import LoaderIncident from "./loaders/Loader_Incident.svelte";
	import LoaderTeamLeft from "./loaders/Loader_Team_Left.svelte";
	import LoaderTeamRight from "./loaders/Loader_Team_Right.svelte";

</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div
  id="fixture-lineups-loader"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

  <!-- 
  [ℹ] [MOBILE] [DESKTOP] [TABLET]
  -->

  <div
    id="loader-player-box">
    <div
      class="row-space-out">
      <LoaderTeamLeft />
      <LoaderTeamRight />
    </div>
    {#each {length: 5} as _,i}
      <div
        class="loader-player-row">
        <LoaderIncident />
      </div>
    {/each}
  </div>
  
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  div#fixture-lineups-loader {
    background-color: #FFFFFF;
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
  div#fixture-lineups-loader div#loader-player-box div.loader-player-row:first-child {
    border-top: 15px;
  } div#fixture-lineups-loader div#loader-player-box div.loader-player-row {
    padding: 14px 0 5px 0;
    border-bottom: 1px solid #E6E6E6;
  } div#fixture-lineups-loader div#loader-player-box div.loader-player-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {
    /* EMPTY */
  }

  /* 
  DESKTOP RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1001px)  {

    /* plyaer row box */
    div#fixture-lineups-loader div#loader-player-box {
      width: 100%;
    }
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#fixture-lineups-loader.dark-background-1 div#loader-player-box div.loader-player-row {
    border-bottom: 1px solid #616161;
  }

</style>
