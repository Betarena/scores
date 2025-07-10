<!-- ===============
COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

	import { page } from '$app/stores';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import metamask_percent_ration_dark from './assets/dashboard/metamask-percent-ration-dark.png';
	import metamask_percent_ration from './assets/dashboard/metamask-percent-ration.png';
	import metamask_volume_dark from './assets/dashboard/metamask-volume-dark.png';
	import metamask_volume from './assets/dashboard/metamask-volume.png';
	import nft_marketshare_img_dark from './assets/dashboard/nft-marketshare-dark.png';
	import nft_marketshare_img from './assets/dashboard/nft-marketshare.png';
	import stats_row_img_dark from './assets/dashboard/total-volume-dark.png';
	import stats_row_img from './assets/dashboard/total-volume.png';
	import home from './assets/menu-opt/home-select.svg';

  import type { IProfileTrs } from '@betarena/scores-lib/types/types.profile.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  $: profileTrs = $page.data.RESPONSE_PROFILE_DATA as IProfileTrs;

  // #endregion ➤ 📌 VARIABLES

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### HINT: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="dashboard-widget-container"
  class:dark={$userBetarenaSettings.theme == 'Dark'}
>
	<!--
  [ℹ] widget not available
  <-contents->
  [ℹ] icon
  [ℹ] text
  -->
	<div id="background-modal-blur">
		<div
			id="dashboard-not-available-container"
			class="text-center"
		>
			<img
				src={home}
				alt="default alt text"
				width="40"
				height="40"
				class="m-b-16"
			/>
			<p
				class="
          color-grey
          s-14
        "
			>
				{profileTrs.dashboard_title || 'Dashboard content will be available soon'}
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
    "
	>
    {profileTrs.dashboard || 'Dashboard content will be available soon'}
	</h2>
	<!--
  [ℹ] dashboard stats info
  -->
	<div
    id="stats-box"
    class="dashboard-row-info">
		<img
			src={$userBetarenaSettings.theme == 'Dark' ? stats_row_img_dark : stats_row_img}
      alt="Stats Row"
    />
	</div>
	<!--
  [ℹ] dashboard metamask info (#1)
  -->
	<div
		id="nft-volume-box"
		class="dashboard-row-info"
	>
		<img
			src={$userBetarenaSettings.theme == 'Dark' ? metamask_volume_dark : metamask_volume}
			alt="Metamask Volume"
		/>
	</div>
	<!--
  [ℹ] dashboard metamask info (#1)
  -->
	<div
		id="nft-marketshare-box"
		class="dashboard-row-info"
	>
		<img
			src={$userBetarenaSettings.theme == 'Dark' ? nft_marketshare_img_dark : nft_marketshare_img}
			alt="Metamask Volume"
		/>
	</div>
	<!--
  [ℹ] dashboard metamask info (#2)
  -->
	<div
		id="metamask-percent-ratio"
		class="dashboard-row-info"
	>
		<img
			src={$userBetarenaSettings.theme == 'Dark' ? metamask_percent_ration_dark : metamask_percent_ration}
			alt="Stats Row"
		/>
	</div>
</div>

<!-- ===============
### COMPONENT STYLE
### NOTE:
### HINT: auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/*
  layer (top) box
  */

	div#background-modal-blur
  {
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
	}
	div#dashboard-not-available-container
  {
		position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		top: 0;
		bottom: 0;
	}

	/*
  (main) account widget
  */
	div#dashboard-widget-container
  {
		position: relative;
		background: #ffffff;
		/* box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08); */
		border-radius: 12px;
		padding: 20px;
		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
		max-height: 572px;
		overflow: hidden;
	}

	h2
  {
		margin: 0;
	}

	/*
  grid control
  */
	div#dashboard-widget-container > h2#widget-title
  {
		grid-row: 1;
		grid-column: 1/2;
	}
	div#dashboard-widget-container > div#stats-box
  {
		grid-row: 2;
		grid-column: 1/2;
	}
	div#dashboard-widget-container > div#nft-volume-box
  {
		grid-row: 3;
		grid-column: 1/2;
	}
	div#dashboard-widget-container > div#nft-marketshare-box
  {
		grid-row: 4;
		grid-column: 1/2;
	}
	div#dashboard-widget-container > div#metamask-percent-ratio
  {
		grid-row: 5;
		grid-column: 1/2;
	}

	/*
  grid (items) control
  */
	div#dashboard-widget-container div.dashboard-row-info	img
  {
		width: 100%;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 575px)
  {
		/* grid control */
		div#dashboard-widget-container
    {
			grid-template-columns: 1fr 1fr;
			max-height: unset;
		}
		div#dashboard-widget-container > h2#widget-title
    {
			grid-row: unset;
			grid-column: 1/4;
		}
		div#dashboard-widget-container > div#stats-box
    {
			grid-row: unset;
			grid-column: 1/4;
		}
		div#dashboard-widget-container > div#nft-volume-box
    {
			grid-column: 1/2;
			grid-row: unset;
		}
		div#dashboard-widget-container > div#nft-marketshare-box
    {
			grid-row: unset;
			grid-column: 2/4;
		}
		div#dashboard-widget-container > div#metamask-percent-ratio
    {
			grid-row: unset;
			grid-column: 1/4;
		}
	}

  /*
  =============
  DARK-THEME
  =============
  */

  div#dashboard-widget-container.dark
  {
		box-shadow: inset 0px 1px 0px var(--dark-theme-1-shade) !important;
		background-color: var(--dark-theme-1) !important;
	}

  div#dashboard-widget-container.dark div#background-modal-blur
  {
    background-color: rgba(35, 35, 35, 0.685) ;
   backdrop-filter: blur(4px);
  }

</style>
