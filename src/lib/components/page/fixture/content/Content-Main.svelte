<!-- ===============
	  COMPONENT JS (w/ TS)
=================-->

<script lang="ts">

  //#region ➤ [MAIN] Package Imports

  import { onMount } from 'svelte';

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { monthNames } from '$lib/utils/dates.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';

	import type { B_CONT_D, B_CONT_T } from '@betarena/scores-lib/types/content.js';

  //#endregion ➤ [MAIN] Package Imports

  //#region ➤ [VARIABLES]

	export let FIXTURE_CONTENT: B_CONT_D[];
	export let FIXTURE_CONTENT_TRANSLATION: B_CONT_T;

  const MOBILE_VIEW = 725;
	const TABLET_VIEW = 1000;

	let mobileExclusive = false;
  let tabletExclusive = false;

	let noWidgetData: any = false;
	let limitViewRow: number = 10;
	let showMore: boolean = false;

  //#region ➤ [METHODS]

	function toggle_full_list
  (
  )
  {
		showMore = !showMore;
		// [ℹ] check if "limitViewRow" matches "trueLengthOfArray",
		if (limitViewRow == FIXTURE_CONTENT.length)
    {
			// [ℹ] if so, revert back original rows,
			limitViewRow = 10;
			return;
		}
		// [ℹ] otherwise, expand list to full length,
		limitViewRow = FIXTURE_CONTENT.length;
	}

  // VIEWPORT CHANGES | IMPORTANT
  function resizeAction
  (
  )
  {
    [
      tabletExclusive,
      mobileExclusive
    ] =	viewport_change
    (
      TABLET_VIEW,
      MOBILE_VIEW
    );
  }

  /**
   * @summary
   * [MAIN]
   * @description
   * ➨ document (visibility-change) event listener;
   * @returns
   * void
   */
  function addEventListeners
  (
  )
  {
    // NOTE: (on-resize)
    window.addEventListener
    (
			'resize',
			function ()
      {
				resizeAction();
			}
		);
  }

  //#endregion ➤ [METHODS]

  //#region ➤ [ONE-OFF] [METHODS] [HELPER] [IF]

  //#endregion ➤ [ONE-OFF] [METHODS] [IF]

  //#region ➤ [REACTIVIY] [METHODS]

  //#endregion ➤ [REACTIVIY] [METHODS]

  //#region ➤ SvelteJS/SvelteKit [LIFECYCLE]

  /**
   * @summary
   * [MAIN] [LIFECYCLE]
   * @description
   * ➨ kickstart resize-action;
   * ➨ kickstart (bundle) event-listeners;
  */
  onMount
  (
    async() =>
    {
      resizeAction();
      addEventListeners();
    }
  );

  //#endregion ➤ SvelteJS/SvelteKit [LIFECYCLE]

</script>

<!-- ===============
COMPONENT HTML
NOTE: [HINT] use (CTRL+SPACE) to select a (class) (id) style
=================-->

<div
  id="widget-outer">

	<!--
  NO WIDGET DATA PLACEHOLDER
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={FIXTURE_CONTENT_TRANSLATION?.news_and_views}
      NO_DATA_TITLE={FIXTURE_CONTENT_TRANSLATION?.no_info}
      NO_DATA_DESC={FIXTURE_CONTENT_TRANSLATION?.no_info_desc}
    />
	{/if}

	<!--
  MAIN WIDGET COMPONENT
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_CONTENT_TRANSLATION?.news_and_views}
    />

    <!--
    📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
    -->

    <div
      id="content-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      OPTION
      -->
      <div
        class="
          row-space-start
          top-tab-box
        "
      >
        <p
          class="
            w-500
          "
          class:activeOpt={true}
        >
          {FIXTURE_CONTENT_TRANSLATION?.new}
        </p>
      </div>

      <!--
      CONTENT LIST
      -->
      <div
        id="content-box"
      >
        {#each FIXTURE_CONTENT?.length > 0 ? FIXTURE_CONTENT?.slice(0, limitViewRow) : [] as item}
          <a
            aria-label="fixture-post-link"
            href={item?.link}
            target="_blank"
          >
            <div
              class="
                row-space-start
                content-row
              "
            >
              <!--
              FEATURED MEDIA
              -->
              <img
                loading="lazy"
                src={item?.featured_media}
                alt="Featured Media"
                width="80"
                height="80"
              />

              <!--
              MEDIA TITLE + POST INFO
              -->
              <div
                class="media-box">
                <h3
                  class="
                    w-500
                    color-black-2
                    post-title
                  "
                >
                  {@html item?.title}
                </h3>

                <!--
                DATETIME 📱 MOBILE
                -->
                {#if !mobileExclusive}
                  <p
                    class="
                      color-grey
                      post-desc
                    "
                  >
                    {item?.excerpt
                      ?.replace('<p>', '')
                      ?.replace('</p>', '')}
                  </p>
                {/if}

                <!--
                AUTHOR + DATE
                -->
                <div
                  class="
                    row-space-start
                    author-date-info
                  "
                >
                  <p
                    class="
                      color-grey
                    "
                  >
                    {item?.author}
                  </p>

                  <div
                    class="divider"
                  />

                  <p
                    class="
                      color-grey
                    "
                  >
                    {FIXTURE_CONTENT_TRANSLATION?.months[monthNames[new Date(item?.date).getMonth()]]}
                    {new Date(item?.date.toString()).getDate()},
                    {new Date(item?.date.toString()).getFullYear()}
                  </p>

                  <!--
                  💻 TABLET 🖥️ LAPTOP
                   -->
                  {#if !mobileExclusive}

                    <div
                      class="divider"
                    />

                    <p
                      class="
                        color-grey
                      "
                    >
                      {(new Date(item?.date.toString()).getHours() % 12 || 12) + ':' + new Date(item?.date.toString()).getMinutes()}
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
      SHOW MORE / LESS
      -->
      {#if FIXTURE_CONTENT && FIXTURE_CONTENT.length > 10}
        <div
          id="display-all-btn"
          class="
            row-space-center"
        >
          <p
            class="
              w-500
              color-primary
              cursor-pointer
            "
            on:click={() => toggle_full_list()}
          >
            {#if !showMore}
              {FIXTURE_CONTENT_TRANSLATION?.view_all}
            {:else}
              See Less
            {/if}
          </p>
        </div>
      {/if}
    </div>

	{/if}

</div>

<!-- ===============
COMPONENT STYLE
NOTE: [HINT] auto-fill/auto-complete iniside <style> for var() values by typing/(CTRL+SPACE)
=================-->

<style>

	/* lineups-main */
	div#content-widget-container
  {
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

	/*
  top tab box
  */
	div#content-widget-container div.top-tab-box
  {
		padding: 20px 0 0 0;
		border-bottom: 1px solid #e6e6e6;
		margin-right: 20px;
		margin-left: 20px;
		width: -webkit-fill-available;
		margin-bottom: 20px;
	}
	div#content-widget-container div.top-tab-box p
  {
		font-size: 14px;
		padding-bottom: 12px;
	}
	div#content-widget-container div.top-tab-box p.activeOpt
  {
		color: #f5620f;
		border-bottom: 4px solid #f5620f;
	}

	/*
  content-row
  */
	div#content-widget-container div#content-box a div.content-row
  {
		padding: 20px 0;
		border-bottom: 1px solid #e6e6e6;
		width: -webkit-fill-available;
		margin: 0 20px;
	}
	div#content-widget-container div#content-box a:first-child div.content-row
  {
		border-top: 1px solid #e6e6e6;
	}
	div#content-widget-container div#content-box a:last-child div.content-row
  {
		border-top: none;
	}
	div#content-widget-container div#content-box div.content-row img
  {
		object-fit: cover;
		width: 80px;
		height: 80px;
		border-radius: 8px;
		/* dynamic */
		margin-right: 20px;
	}
	div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title
  {
		margin-top: 0;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3; /* number of lines to show */
		line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	div#content-widget-container div#content-box a div.content-row div.media-box div.author-date-info p
  {
		padding-right: 12px;
	}
	div#content-widget-container div#content-box a div.content-row div.media-box div.author-date-info div.divider
  {
		height: 14px;
		margin-right: 12px;
		width: 1px;
		background-color: #cccccc;
	}

	/*
  display more box
  */
	div#display-all-btn
  {
		padding: 26px 0;
	}

	/*
  =============
  RESPONSIVNESS
  =============
  */

	@media only screen
  and (min-width: 726px)
  and (max-width: 1000px)
  {
		#content-widget-container
    {
			min-width: 100%;
		}
	}

	@media only screen
  and (min-width: 726px)
  {
		/*
    content-row
    */
		div#content-widget-container div#content-box a div.content-row img
    {
			width: 144px;
			height: 96px;
			margin-right: 20px;
		}
		div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title
    {
			font-size: 18px;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 1; /* number of lines to show */
			line-clamp: 1;
			-webkit-box-orient: vertical;
			margin-bottom: 6px;
		}
		div#content-widget-container div#content-box a div.content-row div.media-box p.post-desc
    {
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

	@media only screen
  and (min-width: 1000px)
  {
		#content-widget-container {
			min-width: 100%;
		}

		/*
    content-row
    */
		div#content-widget-container div#content-box a div.content-row div.media-box h3.post-title:hover
    {
			color: #f5620f !important;
		}
	}

	@media only screen
  and (min-width: 1160px)
  {
		/* EMPTY */
	}

	/*
  =============
  DARK-THEME
  =============
  */

	/*
  events table box
  */
	div#content-widget-container.dark-background-1 div.top-tab-box,
	div#content-widget-container.dark-background-1 div#content-box a div.content-row
  {
		border-bottom: 1px solid #616161;
	}
	div#content-widget-container.dark-background-1 div#content-box a:first-child div.content-row
  {
		border-top: 1px solid #616161;
	}

</style>
