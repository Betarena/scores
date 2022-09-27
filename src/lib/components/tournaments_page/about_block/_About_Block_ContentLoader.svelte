<!-- ===============
	  COMPONENT JS (w/ TS)
==================== -->

<script lang="ts">
  // ... svelte-imports;
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { dev } from '$app/environment';
  // ...
	import { userBetarenaSettings } from '$lib/store/user-settings';

  import Placehoder_Row_Desktop from "./loaders/desktop/_Placeholder_Row.svelte";
  import Placehoder_FAQ_Row_Desktop from "./loaders/desktop/_Placeholder_FAQ_Row.svelte";

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
    id="about-tour-widget-container-load"
    class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      {#each {length: 8} as _,i}
        <div
          class="m-b-25">
          <Placehoder_Row_Desktop />
        </div>
      {/each}

      <div
        id="faq-section">
        {#each {length: 5} as _,i}
          <div
            class="faq-row row-space-out">
            <Placehoder_FAQ_Row_Desktop />
            <div
              class="row-space-end"
              style="width: 100%;">
              <img 
                src="/assets/svg/chevron-down.svg"
                alt=""
                width=20px
                height=20px
              />
            </div>
          </div>
        {/each}
      </div>

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
  }

  #about-tour-widget-container-load div#faq-section div.faq-row:first-child {
    border: 1px solid #E6E6E6;
    border-radius: 12px 12px 0 0 !important;
  }
  #about-tour-widget-container-load div#faq-section div.faq-row:last-child {
    border: 1px solid #E6E6E6;
    border-radius: 0 0 12px 12px !important;
  }
  #about-tour-widget-container-load div#faq-section div.faq-row {
    border: 1px solid #E6E6E6;
    padding: 20px;
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

  #about-tour-widget-container-load.dark-background-1 div#faq-section div.faq-row {
    border: 1px solid #616161 !important;
  }

</style>
