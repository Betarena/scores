<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import LoaderTabNews from './loaders/Loader_Tab_News.svelte';
	import LoaderBottomBtn from './loaders/Loader_Bottom_Btn.svelte';

	import MobileLoaderMedia from './loaders/mobile/Loader_Media.svelte';
	import MobileLoaderInfoRow from './loaders/mobile/Loader_Info_Row.svelte';

	import LoaderInfoRow from './loaders/tablet/Loader_Info_Row.svelte';
	import LoaderMedia from './loaders/tablet/Loader_Media.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener(
			'resize',
			function () {
				var w =
					document.documentElement.clientWidth;
				// [ℹ] TABLET - VIEW
				if (w > 768) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// [ℹ] MOBILE - VIEW
				if (w < 475) {
					mobileExclusive = true;
				} else {
					mobileExclusive = false;
				}
			}
		);
	});
</script>

<!-- ===============
    COMPONENT HTML 
==================== -->

<div
	id="fixture-content-loader"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- 
  [ℹ] [MOBILE]
  -->
	{#if mobileExclusive}
		<div id="loader-content-box">
			<div
				class="
          row-space-start
          tab-news-box
        "
			>
				<LoaderTabNews />
			</div>
			{#each { length: 12 } as _, i}
				<div
					class="
            row-space-start
            row-news
          "
				>
					<div class="media-news-box">
						<MobileLoaderMedia />
					</div>
					<MobileLoaderInfoRow />
				</div>
			{/each}
			<div
				class="
          row-space-center
          box-bottom-btn
        "
			>
				<LoaderBottomBtn />
			</div>
		</div>
		<!-- 
  [ℹ] [DESKTOP] [TABLET]
  -->
	{:else}
		<div id="loader-content-box">
			<div
				class="
          row-space-start
          tab-news-box
        "
			>
				<LoaderTabNews />
			</div>
			{#each { length: 12 } as _, i}
				<div
					class="
            row-space-start
            row-news
          "
				>
					<div class="media-news-box">
						<LoaderMedia />
					</div>
					<LoaderInfoRow />
				</div>
			{/each}
			<div
				class="
          row-space-center
          box-bottom-btn
        "
			>
				<LoaderBottomBtn />
			</div>
		</div>
	{/if}
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	div#fixture-content-loader {
		background-color: #ffffff;
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

	/* row box */
	div#fixture-content-loader
		div#loader-content-box
		div.tab-news-box {
		border-bottom: 1px solid #e6e6e6;
	}
	div#fixture-content-loader
		div#loader-content-box
		div.row-news {
		padding: 16px 0 16px 0;
		border-bottom: 1px solid #e6e6e6;
	}
	div#fixture-content-loader
		div#loader-content-box
		div.row-news:last-child {
		border-bottom: none !important;
	}
	div#fixture-content-loader
		div#loader-content-box
		div.row-news
		div.media-news-box {
		margin-right: 16px;
	}
	div#fixture-content-loader
		div#loader-content-box
		div.box-bottom-btn {
		padding: 24px 0;
		border-top: 1px solid #e6e6e6;
		margin-right: -20px;
		margin-left: -20px;
		width: auto;
	}

	/* IMPORTANT - OVERRIDE GLOBAL SVG STYLE */
	:global(div#fixture-content-loader svg) {
		width: fit-content !important;
	}

	/* ====================
    RESPONSIVNESS
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
	@media only screen and (min-width: 726px) and (max-width: 1000px) {
		/* EMPTY */
	}

	/* 
  DESKTOP RESPONSIVNESS (&+) */
	@media only screen and (min-width: 1001px) {
		/* row box */
		div#fixture-content-loader
			div#loader-content-box {
			width: 100%;
		}
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	div#fixture-content-loader.dark-background-1
		div#loader-content-box
		div.tab-news-box.tab-news-box,
	div#fixture-content-loader.dark-background-1
		div#loader-content-box
		div.row-news {
		border-bottom: 1px solid #616161 !important;
	}

	div#fixture-content-loader.dark-background-1
		div#loader-content-box
		div.box-bottom-btn {
		border-top: 1px solid #616161 !important;
	}
</style>
