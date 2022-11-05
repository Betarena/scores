<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";

  import { userBetarenaSettings } from "$lib/store/user-settings";

	import ContentLoader from "./Content_Loader.svelte";
	// import StatisticsRow from "./Statistics_Row.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';
	import type { REDIS_CACHE_SINGLE_content_data } from "$lib/models/fixtures/content/types";

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  // export let FIXTURE_INFO:                 REDIS_CACHE_SINGLE_fixtures_page_info_response;
  export let FIXTURE_CONTENT:                 REDIS_CACHE_SINGLE_content_data[]
  // export let FIXTURE_STATISTICS_TRANSLATION:     REDIS_CACHE_SINGLE_statistics_translation

  let loaded:            boolean = false;           // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;           // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;           // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;               // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;

  let show_placeholder:  boolean = false;

  const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

  // [🐞]
  let enable_logs:       boolean = true;
  let dev_console_tag:   string = "fixtures | content [DEV]";

  // [🐞]
  $: if (dev && enable_logs) logDevGroup (`${dev_console_tag}`, `FIXTURE_CONTENT: ${FIXTURE_CONTENT}`)

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT METHODS
  // ~~~~~~~~~~~~~~~~~~~~~

  // [ℹ] MAIN
  // [ℹ] Not In Use
  async function widget_init (
  ): Promise < REDIS_CACHE_SINGLE_content_data[] > {

    // [ℹ] get response [lang] [data] [obtained from preload()]
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(3000);

    loaded = true;

    // [ℹ] data validation check
		if (
      FIXTURE_CONTENT == undefined
    ) {
      // [🐞]
      if (dev) logDevGroup (`${dev_console_tag}`, `❌ no data available!`)
      no_widget_data = true;
			return;
		}
    // [ℹ] otherwise, no data
    else {
      no_widget_data = false;
    }

    FIXTURE_CONTENT = FIXTURE_CONTENT

    return FIXTURE_CONTENT;
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // VIEWPORT CHANGES
  // ~~~~~~~~~~~~~~~~~~~~~

  let tabletView = 1000
  let mobileView = 725
  let mobileExclusive: boolean = false;
  let tabletExclusive: boolean = false;

	onMount(async () => {
		var wInit = document.documentElement.clientWidth;
		// [ℹ] TABLET - VIEW
		if (wInit >= tabletView) {
			tabletExclusive = false;
		} else {
			tabletExclusive = true;
		}
		// [ℹ] MOBILE - VIEW
		if (wInit <= mobileView) {
			mobileExclusive = true;
		} else {
			mobileExclusive = false;
		}
		window.addEventListener('resize', function () {
			var w = document.documentElement.clientWidth;
			// [ℹ] TABLET - VIEW
      if (w >= tabletView) {
				tabletExclusive = false;
			} else {
				tabletExclusive = true;
			}
			// [ℹ] MOBILE - VIEW
			if (w <= mobileView) {
				mobileExclusive = true;
			} else {
				mobileExclusive = false;
			}
		});
  });

  // ~~~~~~~~~~~~~~~~~~~~~
  // REACTIVE SVELTE METHODS
  // [! CRITICAL !]
  // ~~~~~~~~~~~~~~~~~~~~~

	$: refresh_data = $userBetarenaSettings.country_bookmaker;

  $: if (browser && refresh_data) {
    // [ℹ] reset necessary variables;
    refresh = true
    loaded = false
    no_widget_data = false
    // widget_init()
    setTimeout(async() => {
      refresh = false
    }, 100)
  }

  afterNavigate(async () => {
    widget_init()
  })

</script>

<!-- ===============
    COMPONENT HTML 
=================-->

<div
  id='widget-outer'>

  <!-- 
  [ℹ] SEO-DATA-LOADED 
  -->
  <!-- {#if !loaded} -->
    <div 
      id="seo-widget-box">
      <!-- 
      [ℹ] widget-title -->
      <!-- <h2>{FIXTURE_STATISTICS_TRANSLATION?.title}</h2> -->
    </div>
  <!-- {/if} -->

  <!-- 
  [ℹ] NO WIDGET DATA AVAILABLE PLACEHOLDER
  -->
  {#if
    no_widget_data && 
    loaded
    && show_placeholder}

    <h2
      class="s-20 m-b-10 w-500 color-black-2"
      style="margin-top: 0px;"
      class:color-white={$userBetarenaSettings.theme == 'Dark'}>
      <!-- {FIXTURE_STATISTICS_TRANSLATION?.title} -->
    </h2>

    <!-- [ℹ] no-widget-data-avaiable-placeholder container 
    -->
    <div
      id='no-widget-box'
      class='column-space-center'
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

      <!-- 
      [ℹ] no-visual-asset
      -->
      {#if $userBetarenaSettings.theme == 'Dark'}
        <img 
          src={no_visual_dark} 
          alt="no_visual_dark"
          width=32px
          height=32px
          class='m-b-16'
        />
      {:else}
        <img 
          src={no_visual} 
          alt="no_visual"
          width=32px
          height=32px
          class='m-b-16'
        />
      {/if}
      
      <!-- 
      [ℹ] container w/ text 
      -->
      <div>
        <p 
          class='s-14 m-b-8 w-500'
          class:color-white={$userBetarenaSettings.theme == 'Dark'}>
          <!-- {FIXTURE_STATISTICS_TRANSLATION?.no_info} -->
        </p>
        <p class='s-14 color-grey w-400'> 
          <!-- {FIXTURE_STATISTICS_TRANSLATION?.no_info_desc} -->
        </p>
      </div>
    </div>
  {/if}

  <!-- 
  [ℹ] MAIN WIDGET COMPONENT
  -->
  {#if
    !no_widget_data &&
    !refresh &&
    browser && 
    $userBetarenaSettings.country_bookmaker}

    <ContentLoader />

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <!-- <StatisticsLoader /> -->
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        <!-- {FIXTURE_STATISTICS_TRANSLATION?.title} -->
      </h2>

      <div
        id="content-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] no cross-platform design change
        -->

        <!-- 
        [ℹ] content list container -->
        <div>
          {#each FIXTURE_CONTENT as item}
            <div
              class="
                row-space-start
                content-row
              ">
              <!-- 
              [ℹ] featured-media -->
              <img 
                src={item?.featured_media}
                alt=""
                width=80px
                height=80px
              />
              <!-- 
              [ℹ] media-title -->
              <div>
                <p
                  class="
                    w-500
                    color-black-2
                  ">
                  {item?.title}
                </p>
                <p
                  class="
                    color-grey
                  ">
                  {item?.author}
                  |
                  {monthNames[new Date(item?.date.toString()).getMonth()]}
                  {new Date(item?.date.toString()).getDate()},
                  {new Date(item?.date.toString()).getFullYear()}
                  |
                  {new Date(item?.date.toString()).getHours()}:
                  {new Date(item?.date.toString()).getMinutes()}
                </p>
              </div>
            </div>
          {/each}
        </div>

      </div>

    <!-- 
    [ℹ] promise was rejected
    -->
    {:catch error}
      {error}
    {/await}

  {/if}

</div>

<!-- ===============
  COMPONENT STYLE
=================-->

<style>

  /* [ℹ] OTHER STYLE / CSS */

  /* EMPTY */

  /* [ℹ] SEO WIDGET DATA */
  
  #seo-widget-box {
		position: absolute;
		z-index: -100;
		top: -9999px;
		left: -9999px;
	}

  /* [ℹ] NO DATA WIDGET STYLE / CSS */

  #no-widget-box {
    padding: 20px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-align: center;
  }

  /*
    [ℹ] WIDGET MAIN STYLE / CSS 
    [ℹ] NOTE: [MOBILE-FIRST]
  */

  /* lineups-main */
  div#content-widget-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: none;
    /* override */
    padding-bottom: 20px;
  }

  /* content-row */
  div#content-widget-container div.content-row {
    padding: 20px 20px 0 20px;
  } div#content-widget-container div.content-row img {
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    /* dynamic */
    margin-right: 20px;
  }

  /* ====================
    RESPONSIVNESS [TABLET] [DESKTOP]
  ==================== */

	/* 
  TABLET RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) and (max-width: 1000px)  {

    #content-widget-container {
      min-width: 100%;
      /* max-width: 700px; */
    }
    
  }

  /* 
  TABLET && DESKTOP SHARED RESPONSIVNESS (&+) */
  @media only screen and (min-width: 726px) {
    /* EMPTY */
  }

  /* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #content-widget-container {
      min-width: 100%;
    }

  }

  /* 
  DESKTOP [L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1160px) {
    /* EMPTY */
  }

  /* ====================
    WIDGET DARK THEME
  ==================== */

  /* events table box */
  :global(div#content-widget-container.dark-background-1 div#statistics-box div.stats-row) {
    border-bottom: 1px solid #616161;
  }

</style>
