<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // ... external modules imports;
	import { userBetarenaSettings } from '$lib/store/user-settings';
  
  import type { Single_Goalscorer, Single_Goalscorer_Translations } from "$lib/models/home/best_goalscorer/types";

  export let pos: number;
  export let data: Single_Goalscorer;
  export let WIDGET_TRANSLATION: Single_Goalscorer_Translations; // ... unecesssary

  let showExtraInfo: boolean;

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * ... onMount() function that verifies that
   * ... the `viewport` width is of tablet size
   * ... or greater;
  */
  let viewportDesktop: boolean;
  // ...
  onMount(async () => {
    var wInit = document.documentElement.clientWidth;
    if (wInit > 475) {
      viewportDesktop = true;
    } else {
      viewportDesktop = false;
    }
    window.addEventListener("resize", function () {
      var w = document.documentElement.clientWidth;
      if (w > 475) {
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

<div 
  class="best-player-row"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'} 
  in:fade>

  <!-- ... DESKTOP VERSION ... -->
  {#if viewportDesktop}
    <!-- ... first container of the row site -->
    <div 
      class="row-space-out">

        <!-- ... ℹ first container ... -->
        <div
          class='row-space-start'>
          <!-- ... Position Number ONLY ON DESKTOP VERSION ... -->
          <div
            class="pos-number-player-box">
            <p 
              class="medium w-500">
              <!-- {data.pos_num} -->
              {pos}
            </p>
          </div>

          <!-- ... ℹ player logo-img & team logo ... -->
          <div
            id="image-contaier">
            <img
              id='player-img'
              src={data.image_path}
              alt=""
            />
            <img
              id='team-img'
              src={data.logo_path}
              alt=""
            />
          </div>
          
          <!-- ... ℹ player name  & player position... -->
          <div
            style="margin-left: 16px;">
            <p 
              class="medium w-500">
              {data.common_name}
            </p>
            <p 
              class="medium w-400 color-grey">
              {WIDGET_TRANSLATION.positions_translations[data.position]}
            </p>
          </div>
        </div>
        
        <!-- ... ℹ second container ... -->
        <!-- ... ℹ goals & odds ... -->
        <div
          class="row-space-end">
          <p 
            id='box-goals'
            class="medium w-500">
            {data.goals}
          </p>
          <p 
            id='box-odds'
            class="medium w-500 w-normal" 
            style="margin-left: 20px;">
            -
          </p>
        </div>
    </div>
  <!-- ... MOBILE VERSION ... -->
  {:else}
    <div 
      class="column-space-center">

        <!-- ... ℹ first container ... -->
        <div
          class='row-space-start m-b-12'>
          <!-- ... Position Number ONLY ON DESKTOP VERSION ... -->
            <p 
              class="medium w-500" 
              style="margin-right: 20px;">
              {pos}
            </p>

          <!-- ... ℹ player logo-img & team logo ... -->
          <div
            id="image-contaier">
            <img
              id='player-img'
              src={data.image_path}
              alt=""
            />
            <img
              id='team-img'
              src={data.logo_path}
              alt=""
            />
          </div>
          
          <!-- ... ℹ player name  & player position... -->
          <div
            style="margin-left: 16px;">
            <p 
              class="medium w-500">
              {data.common_name}
            </p>
            <p 
              class="medium w-400 color-grey">
              {WIDGET_TRANSLATION.positions_translations[data.position]}
            </p>
          </div>
        </div>
        
        <!-- ... ℹ second container ... -->
        <!-- ... ℹ goals & odds ... -->
        <div
          class="row-space-out">

          <!-- ... ℹ goals ... -->
          <div
            class="row-space-out goals-mobile m-r-8">
            <p 
              class="medium w-500 w-normal color-grey">
              {WIDGET_TRANSLATION.widget_translations.goals}
            </p>
            <p 
              class="medium w-500 w-normal">
              {data.goals}
            </p>
          </div>

           <!-- ... ℹ odds [disabled] ... -->
          <div
            class="row-space-out odds-mobile">
            <p 
              style="color: #CCCCCC"
              class="medium w-500 w-normal color-grey"
              >
              {WIDGET_TRANSLATION.widget_translations.odds}
            </p>
            <p  
              style="color: #CCCCCC"
              class="medium w-500 w-normal color-grey">
              -
            </p>
          </div>

        </div>
    </div>
  {/if}

</div>

<!-- ===============
  COMPONENT STYLE
==================== -->

<style>

  .best-player-row {
    padding: 12.5px 20px;
    background-color: #ffffff;
    /* box-shadow: inset 0px 1px 0px #ebebeb; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .best-player-row #image-contaier {
    position: relative;
  }
  .best-player-row #image-contaier img#player-img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 50%;
    border: 1px solid #CCCCCC;
  }
  .best-player-row #image-contaier img#team-img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    position: absolute;
    right: -5px;
    bottom: 0;
  }
  .best-player-row div.pos-number-player-box {
    width: 8px; 
    margin-right: 32px; 
    position: relative;
  }
  .best-player-row div.pos-number-player-box p {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 50%;
    margin: auto;
    height: 21px;
  }
  .best-player-row p#box-goals {
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  }
  .best-player-row p#box-odds {
    background-color: #F2F2F2;
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    max-height: 30px;
    width: 64px;
  }

  div.goals-mobile {
    border: 1px solid #E6E6E6;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 10px 12px 10px 12px;
  }
  div.odds-mobile {
    background: #F2F2F2;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px 12px 10px 12px;
  }

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (max-width: 475px) {
    .best-player-row:first-child {
      padding-top: 24px;
    }
  }

  /* .............. 
	WIDGET DARK THEME 
	................. */

	div.dark-background-1.best-player-row {
		box-shadow: inset 0px 1px 0px #616161 !important;
    background-color: #4B4B4B !important;
	}

  .dark-background-1.best-player-row #image-contaier img#player-img {
    border: 1px solid #999999 !important;
  }

  .dark-background-1.best-player-row p#box-odds {
    background-color: #616161 !important;
  }

  .dark-background-1.best-player-row p#box-goals {
    background: #4B4B4B;
    border: 1px solid #616161;
  }

  .dark-background-1 div.goals-mobile, 
  .dark-background-1 div.odds-mobile {
    background-color: #616161 !important;
    border: 1px solid #616161;
  }

  .dark-background-1 p {
    color: #ffffff;
  }
</style>