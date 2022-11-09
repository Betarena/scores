<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { browser, dev } from '$app/environment';
  import { afterNavigate } from "$app/navigation";
  import { logDevGroup, log_info_group } from "$lib/utils/debug";

  import { userBetarenaSettings } from "$lib/store/user-settings";

	import type { REDIS_CACHE_SINGLE_content_data, REDIS_CACHE_SINGLE_content_translation } from "$lib/models/fixtures/content/types";

	import ContentLoader from "./Content_Loader.svelte";

	import no_visual from './assets/no_visual.svg';
	import no_visual_dark from './assets/no_visual_dark.svg';

  // ~~~~~~~~~~~~~~~~~~~~~
  //  COMPONENT VARIABLES
  // ~~~~~~~~~~~~~~~~~~~~~

  export let FIXTURE_CONTENT:                REDIS_CACHE_SINGLE_content_data[]
  export let FIXTURE_CONTENT_TRANSLATION:    REDIS_CACHE_SINGLE_content_translation

  let loaded:            boolean = false;  // [ℹ] NOTE: [DEFAULT] holds boolean for data loaded;
  let refresh:           boolean = false;  // [ℹ] NOTE: [DEFAULT] refresh value speed of the WIDGET;
	let refresh_data:      any = undefined;  // [ℹ] NOTE: [DEFAULT] refresh-data value speed;
  let no_widget_data:    any = false;      // [ℹ] NOTE: [DEFAULT] identifies the no_widget_data boolean;

  let limitViewRow:      number = 10;      // [ℹ] holds the actual, `total` limit of the list of rows allowed
  let showMore:          boolean = false;  // [ℹ] signals to other widget values that the lsit has expanded

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

  function toggle_full_list() {
    showMore = !showMore;
    // [ℹ] check if "limitViewRow" matches "trueLengthOfArray",
    if (limitViewRow == FIXTURE_CONTENT.length) {
      // [ℹ] if so, revert back original rows,
      limitViewRow = 10;
      return;
    }
    // [ℹ] otherwise, expand list to full length,
    limitViewRow = FIXTURE_CONTENT.length;
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
      <h2>{FIXTURE_CONTENT_TRANSLATION?.news_and_views}</h2>
      <!-- 
      [ℹ] widget-contents list -->
      {#each FIXTURE_CONTENT as item}
        <a href={item.link}>{item.link}</a>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        {/each}
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
      {FIXTURE_CONTENT_TRANSLATION?.news_and_views}
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
          {FIXTURE_CONTENT_TRANSLATION?.no_info}
        </p>
        <p class='s-14 color-grey w-400'> 
          {FIXTURE_CONTENT_TRANSLATION?.no_info_desc}
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

    <!-- <ContentLoader /> -->

    <!-- 
    [ℹ] promise is pending 
    -->
    {#await widget_init()}
      <ContentLoader />
    <!-- 
    [ℹ] promise was fulfilled
    -->
    {:then data}

      <h2
        class="s-20 m-b-10 w-500 color-black-2"
        style="margin-top: 0px;"
        class:color-white={$userBetarenaSettings.theme == 'Dark'}>
        {FIXTURE_CONTENT_TRANSLATION?.news_and_views}
      </h2>

      <div
        id="content-widget-container"
        class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}>

        <!-- 
        [ℹ] [MOBILE] [TABLET] [DESKTOP]
        [ℹ] (minimal) cross-platform design change
        -->

        <!-- 
        [ℹ] option [default NEW] -->
        <div
          class="
            row-space-start
            top-tab-box
          ">
          <p
            class="
              w-500
            "
            class:activeOpt={true}>
            {FIXTURE_CONTENT_TRANSLATION?.new}
          </p>
        </div>

        <!-- 
        [ℹ] content list container -->
        <div
          id="content-box">
          {#each FIXTURE_CONTENT.slice(0, limitViewRow) as item}
            <a 
              aria-label="fixture-post-link"
              href={item?.link}
              target="_blank">
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
                [ℹ] media-title + post-info -->
                <div
                  class="media-box">
                  <h3
                    class="
                      w-500
                      color-black-2
                      post-title
                    ">
                    {item?.title}
                  </h3>
                  <!-- 
                  [ℹ] show time on tablet/desktop -->
                  {#if !mobileExclusive}
                    <p
                      class="
                        color-grey
                        post-desc
                      ">
                      {item?.excerpt.replace("<p>", "").replace("</p>", "")}
                    </p>
                  {/if}
                  <!-- 
                  [ℹ] author
                  [ℹ] date -->
                  <div
                    class="
                      row-space-start
                      author-date-info
                    ">
                    <p
                      class="
                        color-grey
                      ">
                      {item?.author}
                    </p>
                    <div class="divider" />
                    <p
                      class="
                        color-grey
                      ">
                      {FIXTURE_CONTENT_TRANSLATION?.months[monthNames[new Date(item?.date).getMonth()]]}
                      {new Date(item?.date.toString()).getDate()},
                      {new Date(item?.date.toString()).getFullYear()}
                    </p>
                    {#if !mobileExclusive}
                      <div class="divider" />
                      <p
                        class="
                          color-grey
                        ">
                        {((new Date(item?.date.toString()).getHours() % 12) || 12)
                        + ":" 
                        + new Date(item?.date.toString()).getMinutes()}
                        {#if new Date(item?.date.toString()).getHours() > 12}
                          pm
                        {:else}
                          am
                        {/if}
                      </p>
                    {/if}
                  </div>
                </div>
              </div>
            </a>
          {/each}
        </div>

        <!-- 
        [ℹ] show more -->
        {#if FIXTURE_CONTENT 
          && FIXTURE_CONTENT.length > 10}
          <div
            id="display-all-btn"
            class="
              row-space-center">
            <p
              class="
                w-500
                color-primary
                cursor-pointer
              "
              on:click={() => toggle_full_list()}>
              {#if !showMore}
                {FIXTURE_CONTENT_TRANSLATION?.view_all}
              {:else}
                See Less
              {/if}
            </p>
          </div>
        {/if}

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
    padding-bottom: 0;
  }

  /* top tab box */
  div#content-widget-container div.top-tab-box {
    padding: 20px 0 0 0;
    border-bottom: 1px solid #E6E6E6;
    margin-right: 20px;
    margin-left: 20px;
    width: -webkit-fill-available;
    margin-bottom: 20px;
  } div#content-widget-container div.top-tab-box p {
    font-size: 14px;
    padding-bottom: 12px;
  } div#content-widget-container div.top-tab-box p.activeOpt {
    color: #F5620F;
    border-bottom: 4px solid #F5620F;
  }

  /* content-row */
  div#content-widget-container div#content-box a div.content-row {
    padding: 20px 0;
    border-bottom: 1px solid #E6E6E6;
    width: -webkit-fill-available;
    margin: 0 20px;
  } div#content-widget-container div#content-box a:first-child div.content-row {
    border-top: 1px solid #E6E6E6;
  } div#content-widget-container div#content-box a:last-child div.content-row {
    border-top: none;
  } div#content-widget-container div#content-box div.content-row img {
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    /* dynamic */
    margin-right: 20px;
  } div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title {
    margin-top: 0;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
            line-clamp: 3;
    -webkit-box-orient: vertical;
  } div#content-widget-container div#content-box a div.content-row div.media-box div.author-date-info p {
    padding-right: 12px;
  } div#content-widget-container div#content-box a div.content-row div.media-box div.author-date-info div.divider {
    height: 14px;
    margin-right: 12px;
    width: 1px;
    background-color: #CCCCCC;
  }

  /* display more box */
  div#display-all-btn {
    padding: 26px 0;
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
    /* content-row */
    div#content-widget-container div#content-box a div.content-row img {
      width: 144px;
      height: 96px;
      margin-right: 20px;
    } div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title {
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1; /* number of lines to show */
              line-clamp: 1;
      -webkit-box-orient: vertical;
      margin-bottom: 6px;
    } div#content-widget-container div#content-box a div.content-row div.media-box p.post-desc {
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
              line-clamp: 1;
      -webkit-box-orient: vertical;
      margin-bottom: 12px;
    }
  }

  /* 
  DESKTOP [M-L] RESPONSIVNESS (&+) */
  @media only screen and (min-width: 1000px) {

    #content-widget-container {
      min-width: 100%;
    }

    /* content-row */
    div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title:hover {
      color: #F5620F !important;
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
  div#content-widget-container.dark-background-1 div.top-tab-box,
  div#content-widget-container.dark-background-1 div#content-box a div.content-row {
    border-bottom: 1px solid #616161;
  } div#content-widget-container.dark-background-1 div#content-box a:first-child div.content-row {
    border-top: 1px solid #616161;
  }

</style>
