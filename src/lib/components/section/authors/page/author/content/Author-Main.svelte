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
│ Scores Authors Article Main                                                      │
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

<script lang='ts'>
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

  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte';


  import sessionStore from '$lib/store/session.js';
  import { timeAgo } from '$lib/utils/dates.js';
  import { viewportChangeV2 } from '$lib/utils/device';
  import { readingTime } from '../../helpers.js';
  import { getUserById } from '$lib/firebase/common.js';
  import { getOptimizedImageUrl } from '$lib/utils/image.js';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import type { IPageArticleTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.articles.js';
  import AvatarLabel from '$lib/components/ui/AvatarLabel.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import ListSportsTackItem from '$lib/components/ui/composed/sportstack_list/ListSportsTackItem.svelte';
  import ScrollDataWrapper from "$lib/components/ui/wrappers/ScrollDataWrapper.svelte";
  import LoaderImage  from "$lib/components/ui/loaders/LoaderImage.svelte";
  import userSettings from "$lib/store/user-settings.js";

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

  export let /**
     * @augments IPageAuhtorArticleDataFinal
     */
    widgetData: IPageAuhtorArticleDataFinal;

  /**
   * @description
   *  📣 Component interface.
   */
  type IWidgetState =
    | 'PrevButtonShow'
    | 'NextButtonShow'
  ;

  const
    /**
     * @description
     *  📣 `this` component **main** `id` and `data-testid` prefix.
     */ // eslint-disable-next-line no-unused-vars
    CNAME: string = 'author⮕w⮕author-content⮕main',
    /**
     * @description
     *  📣 threshold start + state for 📱 MOBILE
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_MOBILE_INIT: [ number, boolean ] = [ 575, true ],
    /**
     * @description
     *  📣 threshold start + state for 💻 TABLET
     */ // eslint-disable-next-line no-unused-vars
    VIEWPORT_TABLET_INIT: [ number, boolean ] = [ 1160, true ]
  ;


  let
    /**
     * @description
     *  📣 Target data `map`.
     */
    tagMap = new Map(widgetData.mapTag),
    /**
     * @description
     *  📣 Wether to execute animation.
     */
    executeAnimation = false,
    /**
     * @description
     *  📣 Target `HTMLELement` for **Content*.
     */
    contentContainer: HTMLElement,
    author;

  $: ({ windowWidth, viewportType } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
  $: widgetDataTranslation = $page.data.translationArticle as IPageArticleTranslationDataFinal | null | undefined;
  $: ({author: sportstack} = widgetData);
  $: getAuthor(sportstack?.uid);
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


  async function getAuthor(id: string) {
    executeAnimation = false;
    const [user] = await getUserById([id]);
    author = user;
    setTimeout(() => {
      executeAnimation = true;
    }, 100);
  }

  $: if (widgetData.article.data?.content && contentContainer) {
    tick().then(loadTweets);
  }

  async function loadTweets() {
    if (!window.twttr?.widgets?.createTweet) {
      setTimeout(loadTweets, 200);
      return;
    }

    const blocks = Array.from(
      contentContainer.querySelectorAll("blockquote.twitter-tweet")
    ) as HTMLQuoteElement[];

    for (const block of blocks) {
      const a = block.querySelector<HTMLAnchorElement>("a[href]");
      if (!a) continue;

      const match = a.href.match(/status\/(\d+)/);
      if (!match) continue;
      const tweetId = match[1];

      block.innerHTML = "";
      const loaderWrapper = document.createElement("div");
      loaderWrapper.style.cssText = `
          width: 100%; height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
      `;
      block.appendChild(loaderWrapper);

      const loaderComponent = new LoaderImage({
        target: loaderWrapper,
        props: {
          width: "70%",
          height: "100%",
          borderRadius: 12,
        },
      });

      try {
        await window.twttr.widgets.createTweet(tweetId, block, {
          conversation: "none",
          align: "center",
          theme: $userSettings.theme === 'Dark' ? 'dark' : 'light',
        });
      } catch (err) {
        console.error("Ошибка рендера твита", err);
      } finally {
        loaderComponent.$destroy();
        loaderWrapper.remove();
      }
    }
  }
  // #endregion ➤ 🛠️ METHODS
</script>

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

<div id={CNAME} data-betarena-zone-id='4' class={viewportType}>
  <div class='article-header'>
    <!--
    ╭─────
    │ > article title
    ╰─────
    -->
    <div class='article-title'>
      <h1 class='title'>
        {widgetData.article.data?.title ?? ''}
      </h1>

      <a href='/a/user/{author?.usernamePermalink}' class="user-box" class:animate={executeAnimation}>
        <AvatarLabel
          size='lg'
          avatar={author?.profile_photo ?? ''}
          name={author?.name ?? author?.username ?? ''}
        >
          <div slot='label'>
            {timeAgo(
              widgetData?.article?.published_date,
              $page.data.translations.time_ago
            )}
            •
            {readingTime(widgetData.article.data?.content)}
            <TranslationText
              key={'uknown'}
              text={widgetDataTranslation?.translation?.reading_time}
              fallback={'mins'}
            />
          </div>
        </AvatarLabel>
      </a>

      {#if widgetData.article.tags?.length}
        <div class="tags-wrapper">
          <ScrollDataWrapper data={Array.from(tagMap)} let:item>
            <Badge size="lg" color="gray" link="/a/tag/{item[1].permalink}"
              >{item[1].name}</Badge
            >
          </ScrollDataWrapper>
        </div>
      {/if}
    </div>
  </div>

  <div class='sportstack-box'>
    <ListSportsTackItem
      translations={$page.data.translations}
      includePermalink={true}
      user={widgetData.author}
      size='lg'
      action_button={true}
    />
  </div>

  <!--
  ╭─────
  │ > article text
  ╰─────
  -->
  <div id='content' data-betarena-zone-id='2,3' bind:this={contentContainer}>
    {@html widgetData.article.data?.content.replaceAll(
      /<img[^>]+src='([^'>]+)'/g,
      (match, src) => {
        return match.replace(
          src,
          getOptimizedImageUrl({
            strImageUrl: src,
            intQuality: 90,
            intWidth: 1500,
          })
        );
      }
    )}
  </div>
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

<style lang='scss'>
  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#author⮕w⮕author-content⮕main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    max-width: var(--width-xl, 768px);
    margin: auto;
    gap: var(--spacing-7xl, 64px);

    .article-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4xl, 32px);

      .article-title {
        display: flex;
        max-width: var(--width-xl, 768px);
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-3xl, 24px);
        align-self: stretch;
        .title {
          margin: 0;
          color: var(--colors-text-text-primary-900, #fff);
          text-align: center;

          /* Display lg/Semibold */
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-lg, 48px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-display-lg, 60px); /* 125% */
          letter-spacing: -0.96px;
        }
      }
      .user-box {

        :global(.avatar-wrapper) {
            transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            filter: blur(40px);
            transform: scaleX(1.1) scaleY(1.1);

        }

        &.animate {
          :global(.avatar-wrapper) {
              filter: none;
              transform: none;

          }
        }
      }
      .tags-wrapper {
        max-width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
        :global(.badge) {
          flex-shrink: 0;
        }
      }
    }
    .sportstack-box {
      width: 100%;
      display: flex;
      justify-content: space-between;

      :global(.list-item) {
        padding: 0;
        border: none;
        width: 100%;
      }
    }

    #content {
      // ▓ IMPORTANT
      :global {
        color: var(--colors-text-text-primary-900, #fff);

        &:first-child {
          margin-top: 0;
          * {
            margin-top: 0 !important;
          }
        }

        img {
          /* 🎨 style */
          object-fit: cover;
          max-width: 100%;
          width: 100%;
          margin-bottom: 48px !important;
          border-radius: var(--radius-xl, 12px);
          margin-top: 48px !important;
        }
        a img {
          margin: 0 !important;
        }

        @mixin header {
          /* 🎨 style */
          margin: 32px 0 16px 0;
          font-style: normal;
          font-weight: 600;
        }

        a {
          /* 🎨 style */
          color: var(--primary) !important;
          font-weight: 500;
          width: fit-content !important;
          margin: 0;
          display: initial;
        }

        blockquote:not(.twitter-tweet) {
          margin: 0;
          border-left: 2px solid var(--colors-foreground-fg-brand-primary-500);
          font-style: italic;
          padding-left: var(--spacing-2xl, 20px);
          font-family: var(--font-family-font-family-display, Roboto);
          font-size: var(--font-size-display-xs, 24px);
          font-style: italic;
          font-weight: 500;
          line-height: var(--line-height-display-xs, 32px);
          position: relative;
          padding-bottom: var(--spacing-4xl, 32px);
          margin-bottom: 48px;

          p {
            font-style: italic;
            font-family: var(--font-family-font-family-display, Roboto);
            font-size: var(--font-size-display-xs, 24px);
            font-style: italic;
            font-weight: 500;
            line-height: var(--line-height-display-xs, 32px);
          }

          &:before {
            font-family: Arial;
            content: '\201C';
            color: var(--colors-text-text-primary-900, #fff);
            font-size: 1em;
            position: absolute;
            left: 6px;
            top: 0px;
          }
          &:after {
            content: '';
          }
        }

        h2 {
          /* 🎨 style */
          @include header;

          /* Display sm/Semibold */
          font-size: var(--font-size-display-sm, 30px);
          line-height: var(--line-height-display-sm, 38px); /* 126.667% */
        }

        h3,
        h4,
        h5 {
          /* 🎨 style */
          @include header;

          /* Display xs/Semibold */
          font-size: var(--font-size-display-xs, 24px);
          line-height: var(--line-height-display-xs, 32px); /* 133.333% */
        }
        p {
          color: var(--colors-text-text-primary-900, #fff);

          /* Text xl/Regular */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-lg, 18px);
          font-style: normal;
          font-weight: 400;
          line-height: var(--line-height-text-lg, 28px); /* 155.556% */
          margin: 1em 0;

          section {
            /* 🎨 style */
            all: unset;
          }
        }
      }
    }

    //   /*
    // ╭──────────────────────────────────────────────────────────────────────────────╮
    // │ ⚡️ RESPONSIVNESS                                                              │
    // ╰──────────────────────────────────────────────────────────────────────────────╯
    // */

    &.tablet,
    &.mobile {
      max-width: 100%;

      .article-header {
        .article-title {
          max-width: 100%;
        }
      }
      #content {
        :global {
          @mixin header {
            /* 🎨 style */
            margin: 40px 0 20px 0;
          }
        }
      }
    }

    &.mobile {
      gap: var(--spacing-6xl, 48px);
      .article-header {
        .article-title {
          .title {
            font-size: var(--font-size-display-md, 36px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-display-md, 44px); /* 122.222% */
            letter-spacing: -0.72px;
          }
        }
      }
      #content {
        :global {
          @mixin header {
            /* 🎨 style */
            margin: 40px 0 20px 0;
          }

          &:first-child {
            margin-top: 0;
            * {
              margin-top: 0 !important;
            }
          }

          img {
            margin-bottom: 40px !important;
            margin-top: 40px !important;
          }

          a img {
            margin: 0 !important;
          }

          blockquote {
            padding-left: var(--spacing-xl, 16px);

            /* Text md/Regular */
            font-size: var(--font-size-text-xl, 20px);
            font-style: italic;
            font-weight: 500;
            line-height: var(--line-height-text-xl, 30px); /* 150% */
            margin-bottom: 40px;

            p {
              font-size: var(--font-size-text-xl, 20px);
              font-style: italic;
              font-weight: 500;
              line-height: var(--line-height-text-xl, 30px); /* 150% */
            }
          }

          @mixin header {
            /* 🎨 style */
            margin: 26px 0 10px 0;
          }

          h2 {
            font-size: var(--font-size-display-xs, 24px);
            line-height: var(--line-height-display-xs, 32px); /* 133.333% */
          }
          h3,
          h4,
          h5 {
            /* Text xl/Semibold */
            font-size: var(--font-size-text-xl, 20px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--line-height-text-xl, 30px); /* 150% */
          }
          p {
            /* Text md/Regular */
            font-size: var(--font-size-text-md, 16px);
            line-height: var(--line-height-text-md, 24px); /* 150% */
          }
        }
      }
    }
  }
</style>
