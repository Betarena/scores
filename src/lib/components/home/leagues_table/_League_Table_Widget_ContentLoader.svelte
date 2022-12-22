<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { onMount } from "svelte";
// ...
	import { userBetarenaSettings } from '$lib/store/user-settings';
	import PlaceholderTableRow from "./loaders/_Placeholder_Row.svelte";

  let showNum: number = 10;

	// ~~~~~~~~~~~~~~~~~~~~~
	// VIEWPORT CHANGES
	// ~~~~~~~~~~~~~~~~~~~~~

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
  <!-- ... ℹ widget-component
  -->
  <div 
    id="leagues-table-container"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>
    <!-- ... ℹ DESKTOP ONLY AND TABLET;
         ... ℹ display the first 10 rows on Mobile;
    -->
    {#each {length: showNum} as _, i}
      <div 
        class="leagues-table-row">
          <PlaceholderTableRow />
      </div>
    {/each}
  </div>
</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>
  
  #leagues-table-container {
    display: grid;
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    /* max-width: 383px; */
    overflow: hidden;
  }

  .leagues-table-row {
    padding: 12.5px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (max-width: 475px) {
    .leagues-table-row:first-child {
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

    #leagues-table-container {
      /* min-width: 100%; */
      max-width: max-content;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #leagues-table-container {
      /* min-width: 100%; */
      max-width: max-content;
      /* max-width: 560px; */
    }
  }
</style>
