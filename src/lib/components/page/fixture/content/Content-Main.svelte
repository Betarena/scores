<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 📌 High Order Component Overview                                                 │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ Internal Svelte Code Format :|: V.8.0                                          │
│ ➤ Status :|: 🔒 LOCKED                                                           │
│ ➤ Author(s) :|: @migbash                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ 📝 Description                                                                   │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ Scores Fixture Content Main                                                      │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">

  // #region ➤ 📦 Package Imports

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'imports' that are required        │
  // │ by 'this' .svelte file is ran.                                         │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. svelte/sveltekit imports                                            │
  // │ 2. project-internal files and logic                                    │
  // │ 3. component import(s)                                                 │
  // │ 4. assets import(s)                                                    │
  // │ 5. type(s) imports(s)                                                  │
  // ╰────────────────────────────────────────────────────────────────────────╯

	import userBetarenaSettings from '$lib/store/user-settings.js';
	import { monthNames } from '$lib/utils/dates.js';
	import { viewport_change } from '$lib/utils/platform-functions.js';

	import WidgetNoData from '$lib/components/Widget-No-Data.svelte';
	import WidgetTitle from '$lib/components/Widget-Title.svelte';
	import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { IFixtureContentDataFinal, IFixtureContentTranslationFinal } from '@betarena/scores-lib/types/v8/fixture.content.js';

  // #endregion ➤ 📦 Package Imports

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  export let
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 725, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1000, true ],
    /**
     * @description
     *  📣 Widget (main) data
     */
    FIXTURE_CONTENT: IFixtureContentDataFinal[] = [],
    /**
     * @description
     *  📣 Widget (main) translation data
     */
    FIXTURE_CONTENT_TRANSLATION: IFixtureContentTranslationFinal = {}
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'fixture⮕w⮕content⮕main'
  ;

  let
    /**
     * @description
     * 📝 TODO:
    */
    noWidgetData: any = false,
    /**
     * @description
     * 📝 TODO:
    */
    limitViewRow: number = 10,
    /**
     * @description
     * 📝 TODO:
    */
    showMore: boolean = false
  ;

  // #endregion ➤ 📌 VARIABLES

  // #region ➤ 🛠️ METHODS

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'methods' that are to be           │
  // │ and are expected to be used by 'this' .svelte file / component.        │
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. function (..)                                                       │
  // │ 2. async function (..)                                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Toggle full list of content
   * @return { void }
   */
  function toggleFullList
  (
  ): void
  {
    showMore = !showMore;
    if (limitViewRow == FIXTURE_CONTENT.length)
    {
      limitViewRow = 10;
      return;
    }
    limitViewRow = FIXTURE_CONTENT.length;
    return;
  }

  // #endregion ➤ 🛠️ METHODS

</script>

<svelte:window
  on:resize=
  {
    () =>
    {
      [
        VIEWPORT_TABLET_INIT[1],
        VIEWPORT_MOBILE_INIT[1]
      ]
      = viewport_change
        (
          VIEWPORT_TABLET_INIT[0],
          VIEWPORT_MOBILE_INIT[0]
        )
      ;
      return;
    }
  }
/>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 💠 Svelte Component HTML                                                         │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Use 'Ctrl + Space' to autocomplete global class=styles, dynamically    │
│         │ imported from './static/app.css'                                       │
│ ➤ HINT: │ access custom Betarena Scores VScode Snippets by typing emmet-like     │
│         │ abbrev.                                                                │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<div
  id="widget-outer"
>

  <!--
  ╭─────
  │ ➤ NO-WIDGET-DATA
  ╰─────
  -->
	{#if noWidgetData}
    <WidgetNoData
      WIDGET_TITLE={FIXTURE_CONTENT_TRANSLATION.news_and_views}
      NO_DATA_TITLE={FIXTURE_CONTENT_TRANSLATION.no_info}
      NO_DATA_DESC={FIXTURE_CONTENT_TRANSLATION.no_info_desc}
    />
	{/if}

  <!--
  ╭─────
  │ ➤ WIDGET-MAIN
  │ 📱 MOBILE + 💻 TABLET + 🖥️ LAPTOP
  ╰─────
  -->
	{#if !noWidgetData}

    <WidgetTitle
      WIDGET_TITLE={FIXTURE_CONTENT_TRANSLATION.news_and_views}
    />

    <div
      id="content-widget-container"
      class:dark-background-1={$userBetarenaSettings.theme == 'Dark'}
    >

      <!--
      ╭─────
      │ ➤ OPTION
      ╰─────
      -->
      <div
        class=
        "
        row-space-start
        top-tab-box
        "
      >
        <p
          class=
          "
          w-500
          "
          class:activeOpt={true}
        >
          <TranslationText
            key={`${CNAME}/top-tab-box`}
            text={FIXTURE_CONTENT_TRANSLATION.new}
          />
        </p>
      </div>

      <!--
      ╭─────
      │ ➤ CONTENT-LIST
      ╰─────
      -->
      <div
        id="content-box"
      >
        {#each FIXTURE_CONTENT.length > 0 ? FIXTURE_CONTENT.slice(0, limitViewRow) : [] as item}
          <a
            aria-label="fixture-post-link"
            href='/a/{item.permalink}'
            target="_blank"
          >
            <div
              class=
              "
              row-space-start
              content-row
              "
            >
              <!--
              ╭─────
              │ ➤ FEATURED-MEDIA
              ╰─────
              -->
              <img
                loading="lazy"
                src={item.seo_details?.opengraph.images[0]?.url}
                alt="Featured Media"
                width="80"
                height="80"
              />

              <!--
              ╭─────
              │ ➤ MEDIA TITLE + POST INFO
              ╰─────
              -->
              <div
                class="media-box">
                <h3
                  class=
                  "
                  w-500
                  color-black-2
                  post-title
                  "
                >
                  {item.data?.title}
                </h3>

                <!--
                ╭─────
                │ ➤ DATETIME 📱 MOBILE
                ╰─────
                -->
                {#if !VIEWPORT_MOBILE_INIT[1]}
                  <p
                    class=
                    "
                    color-grey
                    post-desc
                    "
                  >
                    {item.data?.content
                      .replace('<p>', '')
                      ?.replace('</p>', '')}
                  </p>
                {/if}

                <!--
                ╭─────
                │ ➤ AUTHOR + DATE
                ╰─────
                -->
                <div
                  class=
                  "
                  row-space-start
                  author-date-info
                  "
                >
                  <p
                    class=
                    "
                    color-grey
                    "
                  >
                    {item.author_id}
                  </p>

                  <div class="divider" />

                  <p
                    class=
                    "
                    color-grey
                    "
                  >
                    {FIXTURE_CONTENT_TRANSLATION.months?.[monthNames[new Date(item.published_date ?? '').getMonth()]]}
                    {new Date(item.published_date ?? '').getDate()},
                    {new Date(item.published_date ?? '').getFullYear()}
                  </p>

                  <!--
                  💻 TABLET 🖥️ LAPTOP
                   -->
                  {#if !VIEWPORT_MOBILE_INIT[1]}

                    <div class="divider" />

                    <p
                      class=
                      "
                      color-grey
                      "
                    >
                      {(new Date(item.published_date ?? '').getHours() % 12 || 12) + ':' + new Date(item.published_date ?? '').getMinutes()}
                      {#if new Date(item.published_date ?? '').getHours() > 12}
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
      ╭─────
      │ ➤ SHOW MORE / LESS
      ╰─────
      -->
      {#if FIXTURE_CONTENT && FIXTURE_CONTENT.length > 10}
        <div
          id="display-all-btn"
          class=
          "
          row-space-center
          "
        >
          <p
            class=
            "
            w-500
            color-primary
            cursor-pointer
            "
            on:click={() => {toggleFullList();}}
          >
            {#if !showMore}
              {FIXTURE_CONTENT_TRANSLATION.view_all}
            {:else}
              See Less
            {/if}
          </p>
        </div>
      {/if}
    </div>

	{/if}

</div>

<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🌊 Svelte Component CSS/SCSS                                                     │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ auto-fill/auto-complete iniside <style> for var()                      │
│         │ values by typing/CTRL+SPACE                                            │
│ ➤ HINT: │ access custom Betarena Scores CSS VScode Snippets by typing 'style...' │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<style lang="scss">

	div#content-widget-container
  {
		background: #ffffff;
		box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		padding: none;
		padding-bottom: 0;

    div.top-tab-box
    {
      padding: 20px 0 0 0;
      border-bottom: 1px solid #e6e6e6;
      margin-right: 20px;
      margin-left: 20px;
      width: -webkit-fill-available;
      margin-bottom: 20px;

      p
      {
        font-size: 14px;
        padding-bottom: 12px;

        &.activeOpt
        {
          color: #f5620f;
          border-bottom: 4px solid #f5620f;
        }
      }
    }

    div#content-box
    {
      a div.content-row
      {
        padding: 20px 0;
        border-bottom: 1px solid #e6e6e6;
        width: -webkit-fill-available;
        margin: 0 20px;
      }
      a:first-child div.content-row
      {
        border-top: 1px solid #e6e6e6;
      }
      a:last-child div.content-row
      {
        border-top: none;
      }
      div.content-row img
      {
        object-fit: cover;
        width: 80px;
        height: 80px;
        border-radius: 8px;
        /* dynamic */
        margin-right: 20px;
      }
      a div.content-row div.media-box h3.post-title
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
      a div.content-row div.media-box div.author-date-info p
      {
        padding-right: 12px;
      }
      a div.content-row div.media-box div.author-date-info div.divider
      {
        height: 14px;
        margin-right: 12px;
        width: 1px;
        background-color: #cccccc;
      }
    }

    /*
    display more box
    */
    div#display-all-btn
    {
      padding: 26px 0;
    }
	}

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
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
		div#content-widget-container div#content-box a div.content-row
    {
      img
      {
        width: 144px;
        height: 96px;
        margin-right: 20px;
      }

      div.media-box
      {
        h3.post-title
        {
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1; /* number of lines to show */
          line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-bottom: 6px;
        }

        p.post-desc
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
    }
	}

	@media only screen
  and (min-width: 1000px)
  {
		div#content-widget-container
    {
			min-width: 100%;

      div#content-box a div.content-row div.media-box h3.post-title:hover
      {
        color: #f5620f !important;
      }
    }
  }

	/*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

	div#content-widget-container.dark-background-1
  {
    div.top-tab-box,
    div#content-box a div.content-row
    {
      border-bottom: 1px solid #616161;
    }

    div#content-box a:first-child div.content-row
    {
      border-top: 1px solid #616161;
    }
  }

</style>
