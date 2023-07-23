<!-- ===============
	COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	// ...
	import BronzeCup_Loader from './loaders/_BronzeCup.svelte';
	import GoldCup_Loader from './loaders/_GoldCup.svelte';
	import SilverCup_Loader from './loaders/_SilverCup.svelte';
	import Placeholder_Desktop_Row from './loaders/desktop/_Placeholder_Row.svelte';
	import Placeholder_Mobile_Row from './loaders/mobile/_Placeholder_Row.svelte';
	import Placeholder_Tablet_Row from './loaders/tablet/_Placeholder_Row.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit =
			document.documentElement.clientWidth;
		// ... TABLET - VIEW
		if (wInit > 768) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// ... MOBILE - VIEW
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
				// ... TABLET - VIEW
				if (w > 768) {
					tabletExclusive = false;
				} else {
					tabletExclusive = true;
				}
				// ... MOBILE - VIEW
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
	id="live-score-container"
	class:dark-background-1={$userBetarenaSettings.theme ==
		'Dark'}
>
	<!-- ... DESKTOP CONTENT-LOADER ... -->
	{#if !tabletExclusive}
		<!-- ... rating-box-sites ... -->
		<div id="feature-rank-display">
			<!-- ... silver-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-top: 20px;"
			>
				<SilverCup_Loader />
			</div>
			<!-- ... gold-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-bottom: 20px;"
			>
				<GoldCup_Loader />
			</div>
			<!-- ... bronze-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-top: 20px;"
			>
				<BronzeCup_Loader />
			</div>
		</div>
		<!-- ... row-title-intro ... -->
		<div id="title-box" />
		<!-- ... row-data-simulated ... -->
		{#each { length: 5 } as _, i}
			<div class="featured-row">
				<Placeholder_Desktop_Row />
			</div>
		{/each}
		<!-- ... show-more-less ... -->
		<div id="show-more-box" />
		<!-- ... TABLET CONTENT-LOADER ... -->
	{:else if tabletExclusive && !mobileExclusive}
		<!-- ... rating-box-sites ... -->
		<div id="feature-rank-display">
			<!-- ... silver-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-top: 20px;"
			>
				<!-- ... cup ... -->
				<SilverCup_Loader />
			</div>
			<!-- ... gold-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-bottom: 20px;"
			>
				<GoldCup_Loader />
			</div>
			<!-- ... bronze-cup-asset ... -->
			<div
				id="featured-rank"
				style="margin-top: 20px;"
			>
				<BronzeCup_Loader />
			</div>
		</div>
		<!-- ... row-title-intro ... -->
		<div id="title-box" />
		<!-- ... row-data-simulated ... -->
		{#each { length: 5 } as _, i}
			<div class="featured-row">
				<Placeholder_Tablet_Row />
			</div>
		{/each}
		<!-- ... show-more-less ... -->
		<div id="show-more-box" />
		<!-- ... MOBILE EXCLUSIVE CONTENT-LOADER ... -->
	{:else if tabletExclusive && mobileExclusive}
		<!-- ... row-title-intro ... -->
		<div id="title-box" />
		<!-- ... row-data-simulated ... -->
		{#each { length: 5 } as _, i}
			<div class="featured-row">
				<Placeholder_Mobile_Row />
			</div>
		{/each}
		<!-- ... show-more-less ... -->
		<div id="show-more-box" />
	{/if}
</div>

<!-- ===============
  COMPONENT STYLE
==================== -->
<style>
	div#live-score-container {
		display: grid;
		background-color: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		min-width: 100%;
		width: 100%;
		max-width: 343px;
		padding-bottom: 4px;
		overflow: hidden;
	}

	div.featured-row {
		padding: 13px 20px;
		box-shadow: inset 0px 1px 0px #ebebeb;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}

	div#show-more-box {
		height: 72px;
		box-shadow: inset 0px 1px 0px #ebebeb;
	}

	div#title-box {
		height: 75px;
	}

	@media only screen and (min-width: 767px) {
		#featured-rank {
			height: 257px;
			padding: 16px 39px;
			background: #f2f2f2;
			border-radius: 12px;
			justify-items: center;
			position: relative;
		}

		#feature-rank-display {
			display: grid;
			gap: 20px;
			grid-auto-flow: column;
			grid-template-columns: repeat(3, 1fr);
			justify-content: space-between;
			padding: 20px 20px 0 20px;
		}

		/* #featured-list-container {
			width: 100%;
			max-width: 700px;
		} */
	}

	@media only screen and (min-width: 1024px) {
		#featured-rank {
			padding: 16px 8px;
		}

		#feature-rank-display {
			gap: 15px;
		}

		/* #featured-list-container {
			width: 100%;
			max-width: 560px;
		} */
	}

	/* ..............
	WIDGET DARK THEME
	................. */

	.dark-background-1 div.featured-row,
	.dark-background-1 div#show-more-box {
		box-shadow: inset 0px 1px 0px #616161 !important;
	}

	.dark-background-1 div#featured-rank {
		background-color: #616161;
	}

	/*
    MOBILE-EXCLUSIVE RESPONSIVNESS */
	@media only screen and (max-width: 475px) {
		/* ... REUIRED FOR SVELTE-CONTENT-LOADER ... */
		:global(svg) {
			width: 100% !important;
		}
	}

	@media only screen and (max-width: 768px) {
		:global(svg) {
			width: 100% !important;
		}
	}
</style>
