<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';
	// ...
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import Placehoder_Row_Desktop from './loaders/desktop/_Placeholder_Row.svelte';
	import Placehoder_Row_Mobile from './loaders/mobile/_Placeholder_Row.svelte';
	import Placehoder_Row_Tablet from './loaders/tablet/_Placeholder_Row.svelte';

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

<div>
	<!-- ... widget-component ... -->
	<div
		id="seo-block-widget-container"
		class:dark-background-1={$userBetarenaSettings.theme ==
			'Dark'}
	>
		<!-- ... DESKTOP CONTENT-LOADER ... -->
		{#if !tabletExclusive}
			<Placehoder_Row_Desktop />
			<!-- ... TABLET CONTENT-LOADER ... -->
		{:else if tabletExclusive && !mobileExclusive}
			<Placehoder_Row_Tablet />
			<!-- ... MOBILE ONLY ... -->
		{:else if tabletExclusive && mobileExclusive}
			<!-- content here -->
			<Placehoder_Row_Mobile />
		{/if}
	</div>
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	#seo-block-widget-container {
		display: grid;
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		width: 100%;
		/* max-width: 383px; */
		overflow: hidden;
		padding: 20px;
		width: 100%;
		min-width: -webkit-fill-available;
	}

	/* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
	@media only screen and (min-width: 767px) {
		#seo-block-widget-container {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/* 
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#seo-block-widget-container {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}
</style>
