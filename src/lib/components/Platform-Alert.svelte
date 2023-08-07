<!-- ===============
### COMPONENT JS (w/ TS)
### NOTE:
### access custom Betarena Scores JS VScode Snippets by typing 'script...'
================= -->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import sessionStore from '$lib/store/session.js';
	import { viewport_change } from '$lib/utils/platform-functions';

	import type { B_NAV_T } from '@betarena/scores-lib/types/navbar.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

	let
    // ◼️ IMPORTANT
    B_NAV_T: B_NAV_T = $page.data?.HEADER_TRANSLATION_DATA,
    // ◼️ IMPORTANT
    /** */
    show: boolean = true
  ;

  $: B_NAV_T = $page.data?.HEADER_TRANSLATION_DATA;

  // #endregion ➤ 📌 VARIABLES

	const TABLET_VIEW = 1160;
	const MOBILE_VIEW = 560;
	let mobileExclusive, tabletExclusive: boolean = false;

	onMount(async () => {
		[tabletExclusive, mobileExclusive] =
			viewport_change(TABLET_VIEW, MOBILE_VIEW);
		window.addEventListener(
			'resize',
			function () {
				[tabletExclusive, mobileExclusive] =
					viewport_change(
						TABLET_VIEW,
						MOBILE_VIEW
					);
			}
		);
	});

</script>

<!-- ===============
### COMPONENT HTML
### NOTE:
### use 'CTRL+SPACE' to autocomplete global class="" styles
### NOTE:
### access custom Betarena Scores VScode Snippets by typing emmet-like abbrev.
================= -->

{#if B_NAV_T?.scores_top_bar_messages?.status && show}

  <div
    id="platform-alert-container"
    class:update-z-index={$sessionStore.livescoreShowCalendar && mobileExclusive}>

    <p
      class=
      "
      s-12
      color-white
      "
    >
      {B_NAV_T?.scores_top_bar_messages?.message}
    </p>

    <!--
    CLOSE ICON
    -->
    <img
      id="close-platform-alert-img"
      src="/assets/svg/alert/close.svg"
      alt="close-vector"
      width=14
      height=14
      on:click={() => (show = false)}
      on:keypress={(e) => { if (e.key === 'Enter') (show = false) }}
    />

  </div>

{/if}

<!-- ===============
### COMPONENT STYLE
### NOTE:
### auto-fill/auto-complete iniside <style> for var() values by typing/CTRL+SPACE
### NOTE:
### access custom Betarena Scores CSS VScode Snippets by typing 'style...'
================= -->

<style>

	#platform-alert-container
  {
    /* 📌 position */
		position: relative;
		z-index: 20000;
    /* 🎨 style */
		width: 100%;
		padding: 8px 27px;
		background: #8c8c8c;
		text-align: center;
	}

  .update-z-index
  {
    /* 📌 position */
		z-index: unset !important;
  }

	img#close-platform-alert-img
  {
    /* 📌 position */
		position: absolute;
		top: 50%;
		right: 16px;
    /* 🎨 style */
		transform: translate(-50%, -50%);
	}

</style>
