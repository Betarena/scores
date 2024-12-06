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

  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  import iconArrowLeftDark from './assets/icon-arrow-left-dark.svg';
  import iconArrowLeftLight from './assets/icon-arrow-left-light.svg';
  import iconArrowRightDark from './assets/icon-arrow-right-dark.svg';
  import iconArrowRightLight from './assets/icon-arrow-right-light.svg';
  import icon_location_dark from './assets/icon-location-dark.svg';
  import icon_location from './assets/icon-location.svg';

  import sessionStore from '$lib/store/session.js';
  import userBetarenaSettings from '$lib/store/user-settings.js';
  import { monthNames, timeAgo } from '$lib/utils/dates.js';
  import { viewportChangeV2 } from '$lib/utils/device';

  import TranslationText from '$lib/components/misc/Translation-Text.svelte';

  import type { B_SAP_D2 } from '@betarena/scores-lib/types/seo-pages.js';
  import type { IPageAuhtorArticleDataFinal } from '@betarena/scores-lib/types/v8/preload.authors.js';
  import type { IPageArticleTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.articles.js';
  import { readingTime } from '../../helpers.js';
  import { userNameToUrlString } from '../../../common_ui/helpers.js';
  import SportstackAvatar from '$lib/components/ui/SportstackAvatar.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import session from '$lib/store/session.js';
  import { post } from '$lib/api/utils.js';
  import { getUserById } from '$lib/firebase/common.js';
  // import AdvertInterScroller  from './Advert-InterScroller.svelte';

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
     * @augments IPageAuhtorArticleDataFinal
     */
    widgetData: IPageAuhtorArticleDataFinal
  ;

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
     *  📣 Target `HTMLELement` for **Article Tags**.
     */
    htmlElementScrollBox: HTMLElement,
    /**
     * @description
     *  📣 **Local** component state
     */
    componentLocalState = new Set < IWidgetState >(),
    author,
    /**
     * @description
     *  📣 Logic for calculating `published days ago`.
    */
    publishDateAgo = () =>
    {
      const
        differenceInDays = Math.ceil(((new Date().getTime() - new Date(widgetData.article.published_date).getTime()) / 1000) / ( 3600 * 24 ));
      ;
      return differenceInDays;
    }
  ;

  $: ({ theme, user } = { ...$userBetarenaSettings });
  $: ({ windowWidth, viewportType } = $sessionStore);
  $: [ VIEWPORT_MOBILE_INIT[1], VIEWPORT_TABLET_INIT[1] ]
    = viewportChangeV2
    (
      windowWidth,
      VIEWPORT_MOBILE_INIT[0],
      VIEWPORT_TABLET_INIT[0],
    );
  $: widgetDataTranslation = $page.data.translationArticle as IPageArticleTranslationDataFinal | null | undefined;
  $: monthTranslation = $page.data.monthTranslations as B_SAP_D2 | null | undefined;
  $: isSubscribed =  (user?.scores_user_data?.subscriptions?.sportstacks || []).includes(widgetData.author.id);
  $: isSportstackOwner = user?.firebase_user_data?.uid === widgetData.author.uid;
  $: isAuth = !!user;
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

  async function subscribe() {
    if (!isAuth) {
      $session.currentActiveModal = "Auth_Modal";
      return;
    }
    const id = widgetData.author.id;
    userBetarenaSettings.updateData([
      [
        "user-subscriptions",
        { target: "sportstacks", id, follow: !isSubscribed },
      ],
    ]);
    await post("/api/data/author/sportstack", {
      authorId: id,
      subscribe: !isSubscribed,
    });
  }

  /**
   * @author
   *  @migbash
   * @summary
   *  🟦 HELPER
   * @description
   *  📣 Scrolls `tags` in a target `direction`.
   * @param { -1 | 1 | 0 } direction
   *  💠 **[required]** Target `direction` to _scroll_.
   * @return { void }
   */
  function scrollTags
  (
    direction: -1 | 1 | 0
  ): void
  {
    if (direction == -1)
      htmlElementScrollBox.scrollBy({ behavior: 'smooth', left: 250, top: 0 });
    else if (direction == 1)
      htmlElementScrollBox.scrollBy({ behavior: 'smooth', left: -250, top: 0 });
    ;

    // [🐞]
    // console.log('htmlElementScrollBox.scrollLeft', htmlElementScrollBox.scrollLeft);
    // console.log('htmlElementScrollBox.offsetWidth', htmlElementScrollBox.offsetWidth);
    // console.log('htmlElementScrollBox.scrollWidth', htmlElementScrollBox.scrollWidth);

    if (htmlElementScrollBox.scrollLeft == 0)
      componentLocalState.delete('PrevButtonShow');
    else
      componentLocalState.add('PrevButtonShow');
    ;

    if ((htmlElementScrollBox.scrollLeft + htmlElementScrollBox.offsetWidth + 5) > htmlElementScrollBox.scrollWidth)
      componentLocalState.delete('NextButtonShow');
    else
      componentLocalState.add('NextButtonShow');
    ;

    componentLocalState = componentLocalState;

    return;
  }



  // #endregion ➤ 🛠️ METHODS

  // #region ➤ 🔄 LIFECYCLE [SVELTE]

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'logic' that should run            │
  // │ immediately and as part of the 'lifecycle' of svelteJs,                │
  // │ as soon as 'this' .svelte file is ran.                                 │
  // ╰────────────────────────────────────────────────────────────────────────╯

  onMount
  (
    () =>
    {

      scrollTags(0);

      return;
    }
  );

  // #endregion ➤ 🔄 LIFECYCLE [SVELTE]

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
<img src="https://firebasestorage.googleapis.com/v0/b/betarena-ios.appspot.com/o/Betarena_Media%2Fads%2F0x1510ea733e1e81f9bcfcc4eabb5a2226d1a9f9ea18da9aea119ba28b8ed6be81%2FBRBet365DesktopCover1-min.png?alt=media&token=708502ce-179a-469a-8758-e9a94bb94217" class="descktop_ad" />
<!-- <AdvertInterScroller containerSelector="#content" /> -->
<div
  id="{CNAME}"
>

  <div class="article-header" class:reverse={VIEWPORT_MOBILE_INIT[1]}>
  <!--
  ╭─────
  │ > article title
  ╰─────
  -->
    <div class="article-title">
      <h1
        class=
        "
        {!VIEWPORT_MOBILE_INIT[1] ? 's-38' : 's-24'}
        w-500
        m-b-32
        color-black-2
        m-0
        "
        style=
        "
        {!VIEWPORT_MOBILE_INIT[1] ? 'line-height: 54px;' : 'line-height: 36px;'}
        "
      >
        {widgetData.article.data?.title ?? ''}
      </h1>

       <!--
    ╭─────
    │ > article author box
    ╰─────
    -->
      <a
      href="/a/user/{author?.usernamePermalink}"
      class=
      "
      row-space-start
      m-b-16
      author-link
      "
      style=
      "
      align-items: flex-start;
      "
    >

      <!--
      ╭─────
      │ > article author avatar
      ╰─────
      -->
      <img
        id='user-avatar'
        src={author?.profile_photo ?? ''}
        alt='user_avatar'
        title={author?.name ?? ''}
        loading='lazy'
        class=
        "
        m-r-12
        effect
        "
        class:animate={executeAnimation}
        style=
        "
        {VIEWPORT_MOBILE_INIT[1] ? 'width: 34px; height: 34px' : ''}
        "
      />

      <!--
      ╭─────
      │ > article author further information
      ╰─────
      -->
      <div>

        <!--
        ╭─────
        │ > article author main info
        ╰─────
        -->
        <div
          class=
          "
          row-space-start
          width-auto
          "
        >
          <!--
          ╭─────
          │ > article author name
          ╰─────
          -->
          <a
            href="/a/user/{author?.usernamePermalink}"
            class=
            "
            s-14
            w-600
            color-black-2
            m-r-8
            no-wrap

            author-name
            "
          >
            {author?.name ?? ''}
          </a>

          <!--
          ╭─────
          │ > article author badges
          ╰─────
          -->
          <!-- <div
            class=
            "
            row-space-start
            width-auto
            m-r-16
            "
            style=
            "
            max-width: 16px;
            max-height: 16px;
            "
          >
            {#each widgetData.author?.badges ?? [] as item}
              <img
                id=''
                src={item?.image ?? ''}
                alt={item?.description ?? ''}
                title={item?.description ?? ''}
                loading='lazy'
              />
            {/each}
          </div> -->

        </div>

        <!--
        ╭─────
        │ > article author extra info
        ╰─────
        -->
        <div
          class=
          "
          row-space-start
          "
        >
          <!--
          ╭─────
          │ > article author creation date
          ╰─────
          -->
          <p
            class=
            "
            s-12
            color-black-3
              dark-v1
            no-wrap
            "
          >
            <!-- {monthTranslation?.months?.[monthNames[new Date(widgetData.article?.published_date  ?? '').getMonth()]]}
            {new Date(widgetData.article?.published_date ?? '').getDate()},
            {new Date(widgetData.article?.published_date  ?? '').getFullYear()} -->
            {timeAgo(widgetData?.article?.published_date, $page.data.translations.time_ago)}
          </p>
          <p
          class=
          "
          s-12
          color-black-3
            dark-v1
          no-wrap
          "
        >
          <span
            class=
            "
            m-r-5
            m-l-5
            "
          >
          •
          </span>
          {readingTime(widgetData.article.data?.content)}
          <TranslationText
            key={'uknown'}
            text={widgetDataTranslation?.translation?.reading_time}
            fallback={'mins'}
          />
        </p>
        </div>

      </div>

    </a>
      <!--
      ╭─────
      │ > article tags
      ╰─────
      -->
      {#if widgetData.article.tags?.length}
        <div
          id="tags-box"
        >
          <!--
          ╭─────
          │ > previous (button)
          ╰─────
          -->
          {#if componentLocalState.has('PrevButtonShow')}
            <div
              id="tagScrollPrev"
              class=
              "
              tagScrollButton
              "
              on:click=
              {
                () =>
                {
                  scrollTags(1);
                  return;
                }
              }
            >
              <img
                id=''
                src={theme == 'Dark' ? iconArrowLeftDark : iconArrowLeftLight}
                alt=''
                title=''
                loading='lazy'
              />
            </div>
          {/if}

          <!--
          ╭─────
          │ > article tags (inner)
          ╰─────
          -->
          <div
            id="tags-box-scroll"
            bind:this={htmlElementScrollBox}
            on:scroll=
            {
              () =>
              {
                scrollTags(0);
                return;
              }
            }
          >
            <!-- [🐞] -->
            <!-- {#each [...widgetData.tags, ...widgetData.tags, ...widgetData.tags] as item} -->
            {#each [...(widgetData.article.tags ?? [])] as item}
              <a
                class=
                "
                tag-pill
                "
                href="/a/tag/{tagMap.get(item)?.permalink}"
              >
                <p
                  class=
                  "
                  s-14
                  w-400
                  color-black-2
                  no-wrap
                  "
                >
                  {tagMap.get(item)?.name ?? ''}
                </p>
              </a>
            {/each}
          </div>

          <!--
          ╭─────
          │ > next (button)
          ╰─────
          -->
          {#if componentLocalState.has('NextButtonShow')}
            <div
              id="tagScrollNext"
              class=
              "
              tagScrollButton
              "
              on:click=
              {
                () =>
                {
                  scrollTags(-1);
                  return;
                }
              }
            >
              <img
                id=''
                src={theme == 'Dark' ? iconArrowRightDark : iconArrowRightLight}
                alt=''
                title=''
                loading='lazy'
              />
            </div>
          {/if}
        </div>
      {/if}
      <div class="sportstack-box {viewportType}">
        <a href="/a/sportstack/{userNameToUrlString(widgetData.author?.data?.username)}" class="sportstack-info">
          <SportstackAvatar src={widgetData.author?.data?.avatar ?? ''} size={viewportType === "mobile" ? 32 : 36} radius=" var(--radius-sm, 6px)"/>
          <span>{widgetData.author.data?.username || ""}</span>
        </a>
        {#if !isSportstackOwner}
          <Button on:click={subscribe} size="sm" type="{isSubscribed ? "secondary-gray" : "primary"}">
            {#if isSubscribed}
              {$page.data.translations.subscribed || "Subscribed"}
            {:else}
              {$page.data.translations.subscribe || "Subscribe"}
            {/if}
          </Button>
        {/if}

      </div>
    </div>


  </div>
  <!--
  ╭─────
  │ > article banner
  ╰─────
    src="https://pbs.twimg.com/media/F5rQ5FPWkAASrF4.jpg:large"
  -->
  {#if widgetData.article.seo_details?.twitter_card.image && !widgetData.article.data?.content.includes("<img")}

    <img
      id='preview-banner'
      src={widgetData.article.seo_details?.twitter_card.image}
      alt={widgetData.article.seo_details?.twitter_card.image_alt}
      title={widgetData.article.data?.title}
      loading='lazy'
      class=
      "
      m-b-24
      "
    />
  {/if}
  <!--
  ╭─────
  │ > article text
  ╰─────
  -->
  <div
    id='content'
  >
    {@html widgetData.article.data?.content}
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

<style lang="scss">
 .descktop_ad {
  position: fixed;
  right: 0;
  max-height: 100%;
  // z-index: -1;
  top: 0;
  // height: fit-content;
  // width: fit-content;
 }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 📲 MOBILE-FIRST                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  div#author⮕w⮕author-content⮕main
  {
    .author-link:hover {
      .author-name {
        color: var(--primary) !important;
      }
    }
    &.reverse {
      padding-top: 12px;
    }
    .article-header.reverse {
      display: flex;
      flex-direction: column-reverse;
    }
    .article-author-info {
      margin-left: -44px;
    }
    max-width: 676px;
    div#tags-box
    {
      /* 🎨 style */
      overflow: hidden;
      padding-block: var(--spacing-xl, 16px);
      border-block: 1px solid var(--border-border-tertiary);
      position: relative;

      div#tags-box-scroll
      {
        /* 🎨 style */
        overflow-x: scroll;
        overflow-y: hidden;
        display: flex;
        gap: 10px;
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        &::-webkit-scrollbar
        {
          /* Hide scrollbar for Chrome, Safari and Opera */
          display: none;
        }

        a.tag-pill
        {
          /* 🎨 style */
          min-height: 26px;
          height: 26px;
          max-height: 26px;
          padding: 3px 12px;
          border-radius: 100px;
          background-color: var(--grey-color);
          cursor: pointer;

          &:hover
          {
            /* 🎨 style */
            background-color: var(--primary) !important;

            p
            {
              /* 🎨 style */
              color: var(--white) !important;
            }
          }
        }
      }

      div.tagScrollButton
      {
        /* 🎨 style */
        position: absolute;
        width: 50px;
        z-index: 5;
        bottom: 0;
        top: 0;
        margin: auto;
        height: inherit;
        cursor: pointer;

        &#tagScrollPrev
        {
          /* 🎨 style */
          left: -1px;
          background: linear-gradient(90deg, #FFFFFF 25.69%, rgba(255, 255, 255, 0) 100%);

          img
          {
            /* 📌 position */
            left: 5px;
          }
        }

        &#tagScrollNext
        {
          /* 🎨 style */
          right: -1px;
          text-align: right;
          background: linear-gradient(270deg, #FFFFFF 25.69%, rgba(255, 255, 255, 0) 100%);

          img
          {
            /* 📌 position */
            right: 5px;
          }
        }

        img
        {
          /* 🎨 style */
          position: absolute;
          z-index: 5;
          bottom: 0;
          top: 0;
          margin: auto;
        }
      }
    }

    img#preview-banner
    {
      /* 🎨 style */
      max-height: 352px;
      object-fit: cover;
      margin-left: -16px;
      margin-right: -16px;
      width: -webkit-fill-available;
      width: -moz-available;
    }

    img#user-avatar
    {
      /* 🎨 style */
      width: 44px;
      height: 44px;
      border-radius: 50%;

      &.effect
      {
        transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        filter: blur(40px);
        transform: scaleX(1.1) scaleY(1.1);
      }

      &.animate
      {
        filter: none;
        transform: none;
      }
    }

    .sportstack-box {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-block: var(--spacing-4xl, 32px);
      &.mobile {
        margin-block: var(--spacing-3xl, 24px);
        :global(.button) {
            font-size: var(--font-size-text-xs, 12px);
            height: 32px;

        }
      }

      .sportstack-info {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 16px;
        span {
          flex-grow: 1;
          color: var(--colors-text-text-primary-900, #313131);
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px); /* 171.429% */
        }
        &:hover {
          span {
            color: var(--primary) !important;
          }
        }

      }
    }

    div#content
    {
      // ▓ IMPORTANT
      :global
      {
        *
        {
          /* 🎨 style */
          color: var(--dark-theme);
        }

        img {
          /* 🎨 style */
          max-height: 352px;
          object-fit: cover;
          margin-left: -16px;
          margin-right: -16px;
          width: -webkit-fill-available;
          width: -moz-available;
        }

        @mixin header
        {
          /* 🎨 style */
          line-height: 32px;
          font-weight: 800;
          margin: 40px 0 16px 0;
        }

        a
        {
          /* 🎨 style */
          text-decoration: underline !important;
          color: var(--primary) !important;
          font-weight: 500;
          width: fit-content !important;
          margin: 0;
          display: initial;
        }

        p
        {
          /* 🎨 style */
          font-size: 18px;
          line-height: 28px;
          color: var(--dark-theme);
          margin-bottom: 20px;
          font-weight: 400;
        }

        h2
        {
          /* 🎨 style */
          @include header;
          font-size: 24px;
        }

        h3,
        h4,
        h5
        {
          /* 🎨 style */
          @include header;
          font-size: 20px;
        }

        section
        {
          /* 🎨 style */
          all: unset;
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ ⚡️ RESPONSIVNESS                                                              │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  @media only screen
  and (min-width: 560px)
  {
    div#author⮕w⮕author-content⮕main
    {
      img#preview-banner
      {
        /* 🎨 style */
        margin-left: 0;
        margin-right: 0;
        width: -webkit-fill-available;
      }

      div#content
      {
        // ▓ IMPORTANT
        :global
        {


          @mixin header
          {
            /* 🎨 style */
            line-height: 32px;
            font-weight: 700;
            margin: 40px 0 16px 0;
          }


          img {
            /* 🎨 style */
            margin-left: 0;
            margin-right: 0;
            width: -webkit-fill-available;
          }

          p
          {
            /* 🎨 style */
            line-height: 30px;
            font-weight: 400;
          }

          ul {
            font-size: 18px;
            font-style: normal;
            font-weight: 400;
            line-height: 32px; /* 160% */
          }
          h2
          {
            /* 🎨 style */
            @include header;
            font-size: 24px;
          }

          h3
          , h5
          {
            /* 🎨 style */
            @include header;
            font-size: 20px;
          }

          section.faq-container
          {
            /* 🎨 style */
            padding: 0;
          }
        }
      }
    }
  }

  @media only screen
  and (min-width: 1160px)
  {
    div#author⮕w⮕author-content⮕main
    {
      div#content
      {
        // ▓ IMPORTANT
        :global
        {
          @mixin header
          {
            /* 🎨 style */
            line-height: 32px;
            font-weight: 700;
            margin: 40px 0 16px 0;
          }

          p
          {
            /* 🎨 style */
            font-size: 18px;
            line-height: 32px;
            font-weight: 300;
          }

          ul {
            font-weight: 300;
            font-size: 20px
          }

          h2
          {
            /* 🎨 style */
            @include header;
            font-size: 24px;
          }

          h3
          , h5
          {
            /* 🎨 style */
            @include header;
            font-size: 20px;
          }

          section.faq-container
          {
            /* 🎨 style */
            padding: 0;
          }
        }
      }
    }
  }

  /*
  ╭──────────────────────────────────────────────────────────────────────────────╮
  │ 🌒 DARK-THEME                                                                │
  ╰──────────────────────────────────────────────────────────────────────────────╯
  */

  .dark-mode
  {
    div#author⮕w⮕author-content⮕main
    {
      div#tags-box
      {
        div#tags-box-scroll
        {
          a.tag-pill
          {
            /* 🎨 style */
            background-color: var(--dark-theme-1);
          }
        }

        div.tagScrollButton
        {
          &#tagScrollPrev
          {
            /* 🎨 style */
            background: linear-gradient(90deg, #292929 25.69%, rgba(41, 41, 41, 0) 100%);
          }

          &#tagScrollNext
          {
            background: linear-gradient(270deg, #292929 25.69%, rgba(41, 41, 41, 0) 100%);
          }
        }
      }

      div#content
      {
        // IMPORTANT
        :global
        {
          *
          {
            /* 🎨 style */
            color: var(--white);
          }
        }
      }
    }
  }

</style>
