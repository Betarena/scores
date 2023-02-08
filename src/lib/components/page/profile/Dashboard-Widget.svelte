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
      id="dashboard-not-available-container">
      <img 
        src={home} 
        alt=""
      />
      <p
        class="
          color-grey
        ">
        Dashboard content will be available soon
      </p>
    </div>
  </div>
  <!-- 
  [ℹ] widget title
  -->
  <h2
    class="
      w-500
      s-20
      m-b-24  
    ">
    Dashboard
  </h2>
  <!-- 
  [ℹ] dashboard stats info
  -->
  <div
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
    class="
      row-space-out
      dashboard-row-info
    ">
    <img 
      src={metamask_volume}
      alt="Metamask Volume"
      style="
        width: -webkit-fill-available;
        max-width: 50%;
      "
    />
    <img 
      src={nft_marketshare_img}
      alt="Metamask Volume"
      style="
        width: -webkit-fill-available;
        max-width: 50%;
      "
    />
  </div>
  <!-- 
  [ℹ] dashboard metamask info (#2)
  -->
  <div
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
  /* account widget */
  div#dashboard-widget-container {
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 20px;
    overflow: hidden;
  } div#dashboard-widget-container div.dashboard-row-info {
    padding: 20px 0;
  } div#dashboard-widget-container div.dashboard-row-info img {
    width: -webkit-fill-available;
  }
</style>