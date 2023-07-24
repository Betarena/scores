<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->
<script lang="ts">
	import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';

	import LoaderBottomBtn from './loaders/Loader_Bottom_Btn.svelte';
	import Placehoder_FAQ_Row_Desktop from './loaders/Loader_FAQ_Row.svelte';
	import Placehoder_Row_Desktop from './loaders/Loader_Row.svelte';

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
	<!--
  [ℹ] widget-component -->
	<div
		id="about-tour-widget-container-load"
		class:dark-background-1={$userBetarenaSettings.theme ==
			'Dark'}
	>
		{#each { length: 8 } as _, i}
			<div class="m-b-25">
				<Placehoder_Row_Desktop />
			</div>
		{/each}

		<div id="faq-section">
			{#each { length: 5 } as _, i}
				<div class="faq-row row-space-out">
					<Placehoder_FAQ_Row_Desktop />
					<div
						class="row-space-end"
						style="width: 100%;"
					>
						<img
							src="/assets/svg/chevron-down.svg"
							alt="Arrow down icon"
							width="20"
							height="20"
						/>
					</div>
				</div>
			{/each}
		</div>

		<!--
      [ℹ] [DESKTOP] [TABLET]
      -->
		{#if !mobileExclusive}
			<div
				class="
            row-space-center
            box-bottom-btn
          "
			>
				<LoaderBottomBtn />
			</div>
		{/if}
	</div>
</div>

<!-- ===============
    COMPONENT STYLE
==================== -->
<style>
	#about-tour-widget-container-load {
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
		margin-top: 40px;
		height: 1362px;
		position: relative;
	}

	#about-tour-widget-container-load
		div#faq-section
		div.faq-row:first-child {
		border: 1px solid #e6e6e6;
		border-radius: 12px 12px 0 0 !important;
	}
	#about-tour-widget-container-load
		div#faq-section
		div.faq-row:last-child {
		border: 1px solid #e6e6e6;
		border-radius: 0 0 12px 12px !important;
	}
	#about-tour-widget-container-load
		div#faq-section
		div.faq-row {
		border: 1px solid #e6e6e6;
		padding: 20px;
	}

	#about-tour-widget-container-load
		div.box-bottom-btn {
		padding: 24px 0;
		border-top: 1px solid #e6e6e6;
		margin-right: -20px;
		margin-left: -20px;
		width: -webkit-fill-available;
		position: absolute;
		bottom: 0;
		background-color: #ffffff;
	}

	/* ====================
    responsivness
  ==================== */

	/*
  MOBILE RESPONSIVNESS */
	@media only screen and (min-width: 767px) {
		#about-tour-widget-container-load {
			min-width: 100%;
			/* max-width: 700px; */
		}
	}

	/*
  DESKTOP RESPONSIVNESS */
	@media only screen and (min-width: 1024px) {
		#about-tour-widget-container-load {
			min-width: 100%;
			/* max-width: 560px; */
		}
	}

	/* ====================
    WIDGET DARK THEME
  ==================== */

	#about-tour-widget-container-load.dark-background-1
		div#faq-section
		div.faq-row {
		border: 1px solid #616161 !important;
	}
</style>
