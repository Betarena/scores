<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

	import { userBetarenaSettings } from '$lib/store/user-settings';
  
  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let TEAM_HOME_STAT: string;
  export let TEAM_AWAY_STAT: string;
  export let STAT_TRANSLATION: string;
  export let OPT: string

  let greaterClass: string

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE OTHER
  // ~~~~~~~~~~~~~~~~~~~~~

  $: if (TEAM_HOME_STAT != undefined && TEAM_AWAY_STAT != undefined) {
    if (parseFloat(TEAM_HOME_STAT) > parseFloat(TEAM_AWAY_STAT)) {
      greaterClass = "H"
    }
    if (parseFloat(TEAM_AWAY_STAT) > parseFloat(TEAM_HOME_STAT)) {
      greaterClass = "A"
    }
  }

</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

{#if 
  TEAM_HOME_STAT != undefined 
  && TEAM_AWAY_STAT != undefined 
  && STAT_TRANSLATION != undefined}

  <div
    class="
      row-space-out
      stats-row
    ">
    <p  
      class="
        w-500
        color-black-2
      "
      class:greaterClass={greaterClass == "H"}>
      {parseInt(TEAM_HOME_STAT)}
      {#if OPT == "possessiontime" || OPT == "percentage"}
      <span>
      %
      </span>
      {/if}
    </p>
    <p  
      class="
        w-400
        color-grey
        text-translate
      ">
      {STAT_TRANSLATION}
    </p>
    <p  
      class="
        w-500
        color-black-2
      "
      class:greaterClass={greaterClass == "A"}>
      {parseInt(TEAM_AWAY_STAT)}
      {#if OPT == "possessiontime" || OPT == "percentage"}
      <span>
      %
      </span>
      {/if}
    </p>
  </div>

{/if}

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  /* statistics row */
  div.stats-row {
    padding: 14px 0 4px 0;
    margin: 0 20px;
    border-bottom: 1px solid #E6E6E6;
    width: -webkit-fill-available;
    width: -moz-available;
    position: relative;
  } div.stats-row p {
    font-size: 14px;
    display: flex;
  } div.stats-row p.greaterClass {
    color: #F5620F !important;
  } div.stats-row p.text-translate {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    width: fit-content;
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