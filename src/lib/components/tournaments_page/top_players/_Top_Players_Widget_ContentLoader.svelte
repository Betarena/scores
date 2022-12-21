<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { onMount } from "svelte";

  import { userBetarenaSettings } from '$lib/store/user-settings';

  import PlaceholderLeftRow from "./loaders/_Placeholder_Left_Row.svelte";
  import PlaceholderRightRow from "./loaders/_Placeholder_Right_Row.svelte";
  import PlaceholderTableRow from "./loaders/_Placeholder_Table_Row.svelte";
  import PlaceholderTopTableRow from "./loaders/_Placeholder_Top_Table_Row.svelte";

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
    
    <div
      class="m-b-16">
      <PlaceholderTopTableRow />
    </div>

    <div
      class="m-b-16"
      style="width: auto;">
      <PlaceholderTableRow />
    </div>

    {#each {length: showNum} as _, i}
      <div 
        class="best-player-row row-space-out">
          <PlaceholderLeftRow />
          <PlaceholderRightRow />
      </div>
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
    padding: 20px;
    margin-top: 40px;
  }

  .best-player-row {
    padding: 10px 0px;
  }

  /* 
  MOBILE RESPONSIVNESS */
  @media only screen and (max-width: 475px) {
    .best-player-row:first-child {
      padding-top: 24px;
    }
  }

  @media only screen and (min-width: 768px) {
    #best-goalscorer-container {
      margin-top: 40px;
    }
  }

  /* ====================
    responsivness
  ==================== */

</style>
