<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from '$app/environment';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import MobileLoaderMedia from "./loaders/mobile/Loader_Media.svelte";
	import MobileLoaderInfoRow from "./loaders/mobile/Loader_Info_Row.svelte";
	import MobileLoaderTabNews from "./loaders/mobile/Loader_Tab_News.svelte";
	import MobileLoaderBottomBtn from "./loaders/mobile/Loader_Bottom_Btn.svelte";

</script>

<!-- ===============
    COMPONENT HTML 
==================== -->

<div
  id="fixture-content-loader"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

  <!-- 
  [ℹ] [MOBILE]
  -->

  <div
    id="loader-content-box">
    <div
      class="
        row-space-start
        tab-news-box
      ">
      <MobileLoaderTabNews />
    </div>
    {#each {length: 12} as _,i}
      <div
        class="
          row-space-start
          row-news
        ">
        <div
          class="media-news-box">
          <MobileLoaderMedia />
        </div>
        <MobileLoaderInfoRow />
      </div>
    {/each}
    <div
      class="
        row-space-center
        box-bottom-btn
      ">
      <MobileLoaderBottomBtn />
    </div>
  </div>


  <!-- 
  [ℹ] [DESKTOP] [TABLET]
  -->
  
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  div#fixture-content-loader {
    background-color: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    width: 100%;
		min-width: 100%;
    overflow: hidden;
    border-radius: 12px;
    /* dynamic */
    padding: 0 20px;
    margin-top: 40px;
    padding-top: 0;
	}

  /* plyaer row box */
  div#fixture-content-loader div#loader-content-box div.tab-news-box {
    border-bottom: 1px solid #E6E6E6;
  } div#fixture-content-loader div#loader-content-box div.row-news:first-child {
    border-top: 15px;
  } div#fixture-content-loader div#loader-content-box div.row-news {
    padding: 16px 0 16px 0;
    border-bottom: 1px solid #E6E6E6;
  } div#fixture-content-loader div#loader-content-box div.row-news:last-child {
    border-bottom: none !important;
  } div#fixture-content-loader div#loader-content-box div.row-news div.media-news-box {
    margin-right: 16px;
  } div#fixture-content-loader div#loader-content-box div.box-bottom-btn {
    padding: 24px 0;
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
    div#fixture-content-loader div#loader-content-box {
      width: 100%;
    }
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  div#fixture-content-loader.dark-background-1 div#loader-content-box div.row-news,
  div#fixture-content-loader div#loader-content-box div.tab-news-box.tab-news-box {
    border-bottom: 1px solid #616161;
  }

</style>
