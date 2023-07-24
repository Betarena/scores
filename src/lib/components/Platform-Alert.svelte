<!-- ===================
	COMPONENT JS - BASIC
    [TypeScript Written]
=================== -->
<script lang="ts">
	import type { Cache_Single_Lang_Header_Translation_Response } from '$lib/models/navbar/types';
	import sessionStore from '$lib/store/session.js';
	import { viewport_change } from '$lib/utils/platform-functions';
	import { onMount } from 'svelte';

	export let HEADER_TRANSLATION_DATA: Cache_Single_Lang_Header_Translation_Response;

	let show: boolean = true;

  // ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES | IMPORTANT
	// ~~~~~~~~~~~~~~~~~~~~~

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

<!-- ===================
	COMPONENT HTML
=================== -->

{#if HEADER_TRANSLATION_DATA != undefined}
	<!--
  [ℹ] identify the correct translation via IF
  -->
	{#if HEADER_TRANSLATION_DATA.scores_top_bar_messages.status && show}
		<div
      id="platform-alert-container"
      class:update-z-index={$sessionStore.livescoreShowCalendar && mobileExclusive}>
			<p
        class="
          s-12
          color-white
        ">
				{HEADER_TRANSLATION_DATA
					.scores_top_bar_messages.message}
			</p>
			<!--
      [ℹ] close-cross
      -->
			<img
				id="close-platform-alert-img"
				src="/assets/svg/alert/close.svg"
				alt="close-vector"
				width="14"
				height="14"
				on:click={() => (show = false)}
        on:keypress={(e) => { if (e.key === 'Enter') (show = false) }}
			/>
		</div>
	{/if}
{/if}

<!-- ===================
	COMPONENT STYLE
=================== -->
<style>
	#platform-alert-container {
		position: relative;
		width: 100%;
		padding: 8px 27px;
		background: #8c8c8c;
		text-align: center;
		z-index: 20000;
	}

  .update-z-index {
		z-index: unset !important;
  }

	img#close-platform-alert-img {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
