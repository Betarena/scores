<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  import home from './assets/home-select.svg';
  import metamask_percent_ration from './assets/metamask-percent-ration.png';
  import metamask_volume from './assets/metamask-volume.png';
  import nft_marketshare_img from './assets/nft-marketshare.png';
  import stats_row_img from './assets/total-volume.png';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

</script>

<!-- ===============
COMPONENT HTML 
=================-->

<div
  id="dashboard-widget-container">
  <!-- 
  [ℹ] widget not available
  <-contents->
  [ℹ] icon 
  [ℹ] text 
  -->
  <div
    id='background-modal-blur'>
    <div
      id="dashboard-not-available-container"
      class="text-center">
      <img 
        src={home} 
        alt=""
        width="40"
        height="40"
        class="m-b-16"
      />
      <p
        class="
          color-grey
          s-14
        ">
        Dashboard content will be available soon
      </p>
    </div>
  </div>
  <!-- 
  [ℹ] widget title
  -->
  <h2
    id="widget-title"
    class="
      w-500
      s-20
    ">
    Dashboard
  </h2>
  <!-- 
  [ℹ] dashboard stats info
  -->
  <div
    id="stats-box"
    class="dashboard-row-info">
    <img 
      src={stats_row_img}
      alt="Stats Row"
    />
  </div>
  <!-- 
  [ℹ] dashboard metamask info (#1)
  -->
  <div
    id="nft-volume-box"
    class="dashboard-row-info">
    <img 
      src={metamask_volume}
      alt="Metamask Volume"
    />
  </div>
  <!-- 
  [ℹ] dashboard metamask info (#1)
  -->
  <div
    id="nft-marketshare-box"
    class="dashboard-row-info">
    <img 
      src={nft_marketshare_img}
      alt="Metamask Volume"
    />
  </div>
  <!-- 
  [ℹ] dashboard metamask info (#2)
  -->
  <div
    id="metamask-percent-ratio"
    class="dashboard-row-info">
    <img 
      src={metamask_percent_ration}
      alt="Stats Row"
    />
  </div>
</div>

<!-- ===============
COMPONENT STYLE
=================-->

<style>

  /* layer (top) box */
  div#background-modal-blur {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4000;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  } div#dashboard-not-available-container {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    width: fit-content;
    height: fit-content;
    top: 0;
    bottom: 0;
  }

  /* (main) account widget */
  div#dashboard-widget-container {
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 20px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    max-height: 572px;
    overflow: hidden;
  }

  h2 {
    margin: 0;
  }

  /* grid control */
  div#dashboard-widget-container > h2#widget-title {
    grid-row: 1;
    grid-column: 1/2;
  } div#dashboard-widget-container > div#stats-box {
    grid-row: 2;
    grid-column: 1/2;
  } div#dashboard-widget-container > div#nft-volume-box {
    grid-row: 3;
    grid-column: 1/2;
  } div#dashboard-widget-container > div#nft-marketshare-box {
    grid-row: 4;
    grid-column: 1/2;
  } div#dashboard-widget-container > div#metamask-percent-ratio {
    grid-row: 5;
    grid-column: 1/2;
  }

  /* grid (items) control */
  div#dashboard-widget-container div.dashboard-row-info {
  } div#dashboard-widget-container div.dashboard-row-info img {
    width: 100%;
  }

  /* ====================
    RESPONSIVNESS
  ==================== */

  @media only screen and (min-width: 575px)  {
    /* grid control */
    div#dashboard-widget-container {
      grid-template-columns: 1fr 1fr;
      max-height: unset;
    } div#dashboard-widget-container > h2#widget-title {
      grid-row: unset;
      grid-column: 1/4;
    } div#dashboard-widget-container > div#stats-box {
      grid-row: unset;
      grid-column: 1/4;
    } div#dashboard-widget-container > div#nft-volume-box {
      grid-column: 1/2;
      grid-row: unset;
    } div#dashboard-widget-container > div#nft-marketshare-box {
      grid-row: unset;
      grid-column: 2/4;
    } div#dashboard-widget-container > div#metamask-percent-ratio {
      grid-row: unset;
      grid-column: 1/4;
    }
  }

</style>