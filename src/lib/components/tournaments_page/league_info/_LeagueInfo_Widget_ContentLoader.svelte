<!-- [ℹ]============
	COMPONENT JS (w/ TS)
=================-->
<script lang="ts">
	// ... svelte-imports;
	import { onMount } from 'svelte';

	import { userBetarenaSettings } from '$lib/store/user-settings';

  import PlaceholderLeft from "./loaders/desktop/_Placeholder_Left.svelte";
  import PlaceholderRight from "./loaders/desktop/_Placeholder_Right.svelte";

  import PlaceholderLeft_T from "./loaders/tablet/_Placeholder_Left.svelte";
  import PlaceholderRight_T from "./loaders/tablet/_Placeholder_Right.svelte";

  import PlaceholderLeftMiddleRow from './loaders/tablet/_Placeholder_Left_Middle_Row.svelte';
  import PlaceholderLeftTopRow from './loaders/tablet/_Placeholder_Left_Top_Row.svelte';
  import PlaceholderRightTopRow from './loaders/tablet/_Placeholder_Right_Top_Row.svelte';
  import PlaceholderRightMiddleRow from './loaders/tablet/_Placeholder_Right_Middle_Row.svelte';
  import PlaceholderLeftBottomRow from './loaders/tablet/_Placeholder_Left_Bottom_Row.svelte';

  import PlaceholderWholeM from './loaders/mobile/_Placeholder_Whole_M.svelte';

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// TABLET - VIEW
		if (wInit > 1160) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// MOBILE - VIEW
		if (wInit < 475) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// TABLET - VIEW
			if (w > 1160) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// MOBILE - VIEW
			if (w < 475) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
	});

</script>

<!-- ============
  COMPONENT HTML 
=================-->

<div 
  id="leagues-table-container-loader"
  class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

	<!-- [ℹ] DESKTOP CONTENT-LOADER
  -->
	{#if !tabletExclusive}

    <div
      class="row-space-out-top">
      <PlaceholderLeft />
      <PlaceholderRight />
		</div>

  <!-- [ℹ] TABLET CONTENT-LOADER 
  -->
	{:else if tabletExclusive && !mobileExclusive}

  <!-- <div
    class="row-space-out-top">
    <PlaceholderLeft_T />
    <PlaceholderRight_T />
  </div> -->

  <div
    class="row-space-out-top m-b-25">
    <div
      class="m-r-5">
      <PlaceholderLeftTopRow />
    </div>
    <PlaceholderRightTopRow />
  </div>

  <div
    class="row-space-out">
    <div
      class="m-r-24">
      <PlaceholderLeftMiddleRow />
    </div>
    <PlaceholderRightMiddleRow />
  </div>

  <div
    class="row-space-start">
    <PlaceholderLeftBottomRow />
  </div>
		
  <!-- [ℹ] MOBILE EXCLUSIVE CONTENT-LOADER 
  -->
	{:else if tabletExclusive && mobileExclusive}

    <PlaceholderWholeM />

  {/if}
</div>

<!-- ============
  COMPONENT STYLE
=================-->
<style>

	#leagues-table-container-loader {
		min-width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
	}

	/* 
    MOBILE-EXCLUSIVE RESPONSIVNESS */
	@media only screen and (max-width: 475px) {
		/* ... REUIRED FOR SVELTE-CONTENT-LOADER ... */
		:global(svg) {
			/* width: 100% !important; */
		}

	}

	@media only screen and (max-width: 768px) {
		:global(svg) {
			/* width: 100% !important; */
		}
	}

	/* WIDGET DARK THEME */
	.dark-background-1 #fixture-league-title,
	.dark-background-1 #fixture-visual-box,
	.dark-background-1 .best-players-box,
	.dark-background-1 #live-stream-box {
		box-shadow: inset 0px -1px 0px #616161 !important;
	}
</style>
