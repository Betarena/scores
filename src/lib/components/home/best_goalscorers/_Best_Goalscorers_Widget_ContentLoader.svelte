<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { onMount } from "svelte";
// ...
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import Placehoder_Row_Desktop from "./loaders/desktop/_Placeholder_Row.svelte";
	import Placehoder_Row_Mobile from "./loaders/mobile/_Placeholder_Row.svelte";
	import Placehoder_Row_Tablet from "./loaders/tablet/_Placeholder_Row.svelte";
	import PlaceholderTableRow from "./loaders/_Placeholder_Table_Row.svelte";

  let showNum: number = 10;

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

  $: if (mobileExclusive) {
    showNum = 5
  } else {
    showNum = 10
  }

	let mobileExclusive: boolean = false;
	let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
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
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
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
		});
	});
</script>


<!-- ===============
    COMPONENT HTML 
==================== -->

<div>

  <!-- ... widget-component ... -->
  <div 
    id="best-goalscorer-container"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>
    
    <!-- ... DESKTOP ONLY AND TABLET... -->
    {#if !mobileExclusive}
      <!-- ... widget-brakdown-columns-section ... -->
      <div
        id='widget-title-row'
        class="row-space-out"
        style="width: auto;">
        <PlaceholderTableRow />
      </div>
    {/if}

    <!-- ... display the first 10 rows on Mobile; ... -->
    {#each {length: showNum} as _, i}
      {#if !tabletExclusive}
        <div 
          class="best-player-row">
            <Placehoder_Row_Desktop />
        </div>
        <!-- ... TABLET CONTENT-LOADER ... -->
        {:else if tabletExclusive && !mobileExclusive}
          <div 
            class="best-player-row">
              <Placehoder_Row_Tablet />
          </div>
        <!-- ... MOBILE EXCLUSIVE CONTENT-LOADER ... -->
        {:else if tabletExclusive && mobileExclusive}
          <div 
            class="best-player-row">
              <Placehoder_Row_Mobile />
          </div>
      {/if}
    {/each}
  </div>

</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>
  
  #best-goalscorer-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    overflow: hidden;
  }

  div#widget-title-row {
    margin: 20px 20px 12.5px 20px;
  }

  .best-player-row {
    padding: 12.5px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (max-width: 475px) {
    .best-player-row:first-child {
      padding-top: 24px;
    }
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

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #best-goalscorer-container {
      /* min-width: 100%; */
      max-width: max-content;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #best-goalscorer-container {
      /* min-width: 100%; */
      max-width: max-content;
      /* max-width: 560px; */
    }
  }
</style>
