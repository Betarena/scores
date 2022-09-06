<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

	import { userBetarenaSettings } from '$lib/store/user-settings';
  
  import type { Standing_Team_Total_Away_Home } from "$lib/models/tournaments/standings/types";
import { session } from "$app/stores";

  export let TEAM_DATA:         Standing_Team_Total_Away_Home;
  export let TABLEMOBILEVIEW:   number = undefined;
  export let currentSeason:     number = undefined;

  $: currentSeason = currentSeason

  let recent_form;
  $ : recent_form = 
    TEAM_DATA.rf == null 
      ? ['', '', '', '', '']
      : Array.from(TEAM_DATA.rf);

  let position
  let points
  let gavg
  let cavg
  let ycavg
  let ov15
  let ov25
  let winP

  $: team_name = TEAM_DATA.team_name == null || TEAM_DATA.team_name == undefined ? '-' : TEAM_DATA.team_name;
  $: position = TEAM_DATA.position == null || TEAM_DATA.position == undefined ? '-' : TEAM_DATA.position;
  $: points = TEAM_DATA.points == null || TEAM_DATA.points == undefined ? '-' : TEAM_DATA.points;
  $: games_played = TEAM_DATA.games_played == null || TEAM_DATA.games_played == undefined ? '-' : TEAM_DATA.games_played;
  $: gavg = TEAM_DATA.gavg == null || TEAM_DATA.gavg == undefined ? '-' : parseFloat(TEAM_DATA.gavg.toString()).toFixed(2);
  $: cavg = TEAM_DATA.cavg == null || TEAM_DATA.cavg == undefined ? '-' : parseFloat(TEAM_DATA.cavg.toString()).toFixed(2);
  $: ycavg = TEAM_DATA.ycavg == null || TEAM_DATA.ycavg == undefined ? '-' : parseFloat(TEAM_DATA.ycavg.toString()).toFixed(2);
  $: ov15 = TEAM_DATA.ov15 == null || TEAM_DATA.ov15 == undefined ? '-' : parseFloat(TEAM_DATA.ov15.toString()).toFixed(0) + '%';
  $: ov25 = TEAM_DATA.ov25 == null || TEAM_DATA.ov25 == undefined ? '-' : parseFloat(TEAM_DATA.ov25.toString()).toFixed(0) + '%';
  $: winP = TEAM_DATA.winP == null || TEAM_DATA.winP == undefined ? '-' : parseFloat(TEAM_DATA.winP.toString()).toFixed(0) + '%';

  let viewportDesktop: boolean;
  let viewportTablet: boolean;

  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 820) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 820) {
        viewportDesktop = true;
      } else {
        viewportDesktop = false;
      }
    });
  });

</script>

<!-- ===============
  COMPONENT HTML 
==================== -->

<!-- [STASHED] 
<div 
  class="league-table-team-row"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
  in:fade>

  <!-- [ℹ] DESKTOP VERSION 
  - ->
  {#if viewportDesktop}

    <!-- [ℹ] first container
    - ->
    <div
      class='row-space-out'>

      <!-- [ℹ] team main details box left
      - ->
      <div
        class="row-space-start">

        <!-- [ℹ] team number position 
        - ->
        <div
          class="team-pos">
          <p 
            class="team-pos medium w-500"
            style="background-color: black">
            {TEAM_DATA.position}
          </p>
        </div>

        <!-- [ℹ] team logo
        - ->
        <div
          id="image-contaier">
          <img
            class='team-img'
            src={TEAM_DATA.team_logo}
            alt=""
          />
        </div>

        <!-- [ℹ] team name
        - ->
        <div
          style="margin-left: 16px;">
          <p 
            class="medium w-500 no-wrap">
            {TEAM_DATA.team_name}
          </p>
        </div>
      
      </div>


      <!-- [ℹ] team main further info box right
      - ->
      <div
        class="row-space-out">

        <p 
          class="medium w-500">
          {TEAM_DATA.points}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.games_played}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.won}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.draw}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.lost}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.gs}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.ga}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.gavg}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.cavg}
        </p>
        
        <p 
          class="medium w-500">
          {TEAM_DATA.ov15}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.ov25}
        </p>

        <p 
          class="medium w-500">
          {TEAM_DATA.winP}
        </p>
        
        <div
          class="row-space-end"
          style="width: auto;">
          {#each recent_form as form}
            <div
              class="recent-form-dot m-r-5"
              class:win={form == "W"}
              class:draw={form == "D"}
              class:lost={form == "L"}
            />
          {/each}
        </div>
      </div>


    </div>

  {/if}

</div>
-->

<!-- [ℹ] ALTERNAITVE ROW APPROACH V.2
-->

{#if viewportDesktop}

  <tr
    class="league-table-team-row"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
    in:fade>

    <!-- [ℹ] team main details box left
    -->
    <td>
      <div
        class="row-space-start">

        <!-- [ℹ] team number position 
        -->
        <div
          class="team-pos">
          <p 
            class="team-pos s-12 w-500"
            style="background-color: {TEAM_DATA.color_code}"
            class:border-pos={TEAM_DATA.color_code === 'transparent'}
            >
            {position}
          </p>
        </div>

        <!-- [ℹ] team logo
        -->
        <div
          id="image-contaier">
          <img
            class='team-img'
            src={TEAM_DATA.team_logo}
            alt=""
          />
        </div>

        <!-- [ℹ] team name
        -->
        <div
          style="margin-left: 16px;"
          class="team-name">
          <p 
            class="s-12 w-500 no-wrap">
            {team_name}
          </p>
        </div>
        
      </div>
    </td>

    <!-- [ℹ] team main further info box right
    -->
    <td>
      <p 
        class="s-12 w-500">
        {points}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {games_played}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500"
        style="color: #59C65D;">
        {TEAM_DATA.won}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {TEAM_DATA.draw}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500"
        style="color: #FF3C3C;">
        {TEAM_DATA.lost}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {TEAM_DATA.gs}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {TEAM_DATA.ga}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {gavg}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {ycavg}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {cavg}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {ov15}
      </p>
    </td>

    <td>
      <p 
        class="s-12 w-500 color-grey">
        {ov25}
      </p>
    </td>

    {#if $session.selectedSeasonID && currentSeason != undefined}
      {#if $session.selectedSeasonID === currentSeason}
        <td>
          <p 
            class="s-12 w-500 color-grey">
            {winP}
          </p>
        </td>
      {/if}
    {/if}

    <td>
      <div
        class="row-space-end"
        style="width: auto;">
        {#each recent_form as form}
          <div
            class="recent-form-dot m-r-5"
            class:win={form == "W"}
            class:draw={form == "D"}
            class:lost={form == "L"}
          />
        {/each}
      </div>
    </td>

  </tr>

{:else}

  {#if TABLEMOBILEVIEW != undefined}

    <tr
      class="league-table-team-row"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
      in:fade>

      <!-- [ℹ] team main details box left
      -->
      <td>
        <div
          class="row-space-start">

          <!-- [ℹ] team number position 
          -->
          <div
            class="team-pos">
            <p 
              class="team-pos s-12 w-500"
              style="background-color: {TEAM_DATA.color_code}"
              class:border-pos={TEAM_DATA.color_code === 'transparent'}
              >
              {position}
            </p>
          </div>

          <!-- [ℹ] team name
          -->
          <div
            style="margin-left: 10px;">
            <p 
              class="s-12 w-500">
              {team_name}
            </p>
          </div>
          
        </div>
      </td>

      <!-- [ℹ] team main further info box right
      -->

      <!-- [ℹ] tabler view 1
      -->
      {#if TABLEMOBILEVIEW == 1}

        <td>
          <p 
            class="s-12 w-500">
            {points}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {games_played}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500"
            style="color: #59C65D;">
            {TEAM_DATA.won}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {TEAM_DATA.draw}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500"
            style="color: #FF3C3C;">
            {TEAM_DATA.lost}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {TEAM_DATA.gs}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {TEAM_DATA.ga}
          </p>
        </td>

      {/if}

      <!-- [ℹ] tabler view 2
      -->
      {#if TABLEMOBILEVIEW == 2}
        <td>
          <p 
            class="s-12 w-500 color-grey">
            {gavg}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {ycavg}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {cavg}
          </p>
        </td>

        <td>
          <p 
            class="s-12 w-500 color-grey">
            {ov15}
          </p>
        </td>
      {/if}

      <!-- [ℹ] tabler view 3
      -->
      {#if TABLEMOBILEVIEW == 3}
        <td>
          <p 
            class="s-12 w-500 color-grey">
            {ov25}
          </p>
        </td>

        {#if $session.selectedSeasonID && currentSeason != undefined}
          {#if $session.selectedSeasonID === currentSeason}
            <td>
              <p 
                class="s-12 w-500 color-grey">
                {winP}
              </p>
            </td>
          {/if}
        {/if}

        <td>
          <div
            class="row-space-end"
            style="width: auto;">
            {#each recent_form as form}
              <div
                class="recent-form-dot m-r-5"
                class:win={form == "W"}
                class:draw={form == "D"}
                class:lost={form == "L"}
              />
            {/each}
          </div>
        </td>
      {/if}

    </tr>

  {/if}

{/if}


<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  .league-table-team-row {
    padding: 6px 20px;
    background-color: #ffffff;
    /* box-shadow: inset 0px 1px 0px #ebebeb; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: space-between; */
    /* position: relative; */
  } .league-table-team-row #image-contaier {
    width: 24px;
    height: 24px;
    position: relative;
  } .league-table-team-row #image-contaier img.team-img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  } .league-table-team-row div.team-pos {
    width: 20px; 
    height: 20px; 
    margin-right: 16px; 
    position: relative;
    border-radius: 50%;
    /* background-color: dodgerblue; */
  } .league-table-team-row div.team-pos p {
    position: absolute;
    margin: auto;
    min-width: 20px;
    text-align: center;
    border-radius: 50%;
    height: 20px;
    /* padding: 4px 8px; */
    border-radius: 30px;
    padding: 0.5px 7px;
    color: white;
  }

  /* new - table approach */
  tr td {
    padding-top: 16px !important;
		padding-bottom: 0px;
    padding: 0px 5px;
  } tr td p {
    /* width: fit-content; */
  } tr td:not(:first-child) {
    text-align: center;
  } tr td:first-child {
    padding-left: 20px;
  } tr td:last-child {
    padding-right: 20px;
  } 
  
  
  .border-pos {
    color: black !important;
    border: 1px solid #E6E6E6;
  }

  div.recent-form-dot {
    border-radius: 50%;
    height: 12px;
    width: 12px;
  } div.recent-form-dot.draw {
    background-color: #8C8C8C;
  } div.recent-form-dot.win {
    background-color: #59C65D;
  } div.recent-form-dot.lost {
    background-color: #FF3C3C;
  } div.recent-form-dot:last-child {
    margin-right: 0;
  }

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (max-width: 475px) {

    .league-table-team-row div.team-pos {
      margin-right: 10px; 
    }

    tr td p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 85px;
    }

    tr td:last-child {
      text-align: end;
    } 

  }

  @media only screen and (min-width: 475px) and (max-width: 1000px) {
    
    /* p.s-12 {
      font-size: 12px !important;
    } */

    div.team-name p {
      white-space: normal;
    }

  } 

  @media only screen and (min-width: 821px) {

    tr td:first-child {
      padding-left: 0;
    } tr td:last-child {
      padding-right: 0;
    }

  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

  .dark-background-1 div.recent-form-dot.lost {
    background: #FF5959;
  } .dark-background-1 div.recent-form-dot.draw {
    background: #A8A8A8;
  }

  .dark-background-1 .border-pos {
    color: white !important;
    border: 1px solid #616161 !important;
  }

  .dark-background-1 p {
    color: #ffffff;
  }
</style>