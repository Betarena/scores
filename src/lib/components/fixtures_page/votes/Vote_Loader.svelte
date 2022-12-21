<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">

  import { onMount } from "svelte";

	import { userBetarenaSettings } from '$lib/store/user-settings';

	import MobileLoaderVote from "./loaders/mobile/Loader_Vote.svelte";
	import TabletLoaderVote from "./loaders/tablet/Loader_Vote.svelte";

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
  <!-- 
  [ℹ] widget-component -->
  <div 
    id="fixture-votes-loader"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

    <!-- 
    [ℹ] [MOBILE]
    -->
    {#if mobileExclusive}
      <div
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <MobileLoaderVote />
          </div>
        {/each}
      </div>
    {/if}

    <!-- 
    [ℹ] [DESKTOP] [TABLET]
    -->
    {#if !mobileExclusive}
      <div
        class="
          row-space-out
        ">
        {#each {length: 3} as _,i}
          <div>
            <TabletLoaderVote />
          </div>
        {/each}
      </div>
    {/if}

  </div>
</div>


<!-- ===============
    COMPONENT STYLE
==================== -->

<style>

  #fixture-votes-loader {
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
    position: relative;
  }

  /* ====================
    responsivness
  ==================== */

	/* 
  MOBILE RESPONSIVNESS */
  @media only screen and (min-width: 767px) {

    #fixture-votes-loader {
      min-width: 100%;
      /* max-width: 700px; */
    }
  }

  /* 
  DESKTOP RESPONSIVNESS */
  @media only screen and (min-width: 1024px) {

    #fixture-votes-loader {
      min-width: 100%;
      /* max-width: 560px; */
    }
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

</style>
