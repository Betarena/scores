<!--
╭──────────────────────────────────────────────────────────────────────────────────╮
│ 🟦 Svelte Component JS/TS                                                        │
┣──────────────────────────────────────────────────────────────────────────────────┫
│ ➤ HINT: │ Access snippets for '<script> [..] </script>' those found in           │
│         │ '.vscode/snippets.code-snippets' via intellisense using 'doc'          │
╰──────────────────────────────────────────────────────────────────────────────────╯
-->

<script lang="ts">
  import Avatar from "$lib/components/ui/Avatar.svelte";
  import Tag from "$lib/components/ui/Tag.svelte";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { tick } from "svelte";

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

  interface IArticle extends IPageAuthorArticleData {
    author?: IPageAuthorAuthorData;
    tags_data: (IPageAuthorTagData | undefined)[];
  }
  export let /**
     * @augments IArticIArticleleData
     */
    article: IArticle,
    /**
     * @description tablet view
     */
    tablet = false,
    /**
     * @description mobile view
     */
    mobile = false;
  let /**
     * @description variables to controll tags visability
     */
    tagsWidth,
    tagsNode,
    prevWidth = 0,
    countOfNotVisibleTags = 0,
    tagsScrollWidth,
    expanded = false;
  $: ({
    permalink,
    tags_data,
    published_date,
    data: { title },
    seo_details: {
      opengraph: { images },
    },
  } = article);
  /**
   * @summary
   * 🔥 REACTIVITY
   *
   * WARNING:
   * can go out of control
   *
   * @description
   * .variables to control tag visibility
   *
   * WARNING:
   * triggered by changes in:
   * - `visibleTags` - **tags_data**
   */
  $: visibleTags = [...tags_data];

  $: date = dateToString(published_date || "");
  // #endregion ➤ 📌 VARIABLES
  /** @description
   * .recalculate tag visibility when changing width, orScrollWidth
   *  WARNING:
   */
  $: resize(tagsWidth, tagsNode);

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

  function resize(width: number, node: HTMLDivElement) {
    if (!width || !node) return;
    const scrollWidth = node.scrollWidth;
    if (width < scrollWidth) {
      visibleTags.pop();
      visibleTags = [...visibleTags];
    } else if (width > prevWidth) {
      visibleTags = [...tags_data];
    }

    prevWidth = width;
    countOfNotVisibleTags = tags_data.length - visibleTags.length;
    tick().then(() => {
      if (width < node.scrollWidth) resize(width, node);
    });
  }

  function dateToString(d: string | Date) {
    if (!d) return "";
    const date = new Date(d);
    const day = formatDateNumber(date.getDate());
    const month = formatDateNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = formatDateNumber(date.getHours());
    const minutes = formatDateNumber(date.getMinutes());
    return `${day}.${month}.${year} ${hour}:${minutes}`;
  }

  function formatDateNumber(number) {
    return number < 10 ? `0${number}` : number;
  }

  function expandTags() {
    expanded = true;
    countOfNotVisibleTags = 0;
    visibleTags = [...tags_data];
  }

  // #endregion ➤ 🛠️ METHODS
  const src =
    "https://s3-alpha-sig.figma.com/img/c13c/1e24/1e6baeeb9f8d7582f9d06e78b4720cca?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eKvpqipX-DsYJHWoug3ZAq0~tXP9VuL6yTNi0mtpueLdhuC37jiaOKZbPWBlZRCnBgwXWxWhv5Gzk2WEbD7EY5mOzS~yMjiuJsXCXJEfx2RWY2s7ZMp8EgQ-ABjRxLf6XRvtrO7vUfcH17tR749NnVimp6aZwpeLdOgfrw74gYPBlidiMZa6cY3vIcyjM3IoBhaAZ6Uhyq9xoUP85aLcGttg1NWw2zsA4TY1cjb7qLVcKjKWxmiA-HC4Fz~gRBxNfCsfYqr16FhQbI6Jo46zP8GAd5SbEpT0kfNJUjBmUtyqBpxBM~HoUnztOxzo3A9UNNE31D7TfcgXrdenD1JgWA__";
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

<div class="card-wrapper" class:mobile>
  <div class="card-content">
    <a href="/a/{permalink}">
      <div class="title">
        {title}
      </div>
    </a>
    <div class="author-wrapper">
      <Avatar {src} />
      <div class="author-info">
        <div class="author-name">Rodrigo Santorino</div>
        <div class="publication-date">{date}</div>
      </div>
    </div>
    <div
      class="tags-wrapper"
      class:expanded
      bind:clientWidth={tagsWidth}
      bind:this={tagsNode}
    >
      {#each visibleTags as tag}
        <a href="/a/tag/{tag?.permalink}">
          <Tag>{tag?.name}</Tag>
        </a>
      {/each}
      {#if countOfNotVisibleTags}
        <Tag on:click={expandTags}>+{countOfNotVisibleTags}</Tag>
      {/if}
    </div>
  </div>
  <a href="/a/{permalink}" class="preview" class:tablet class:mobile>
    <img src={images[0]?.url} alt={images[0].alt} srcset="" />
  </a>
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
  .card {
    &-wrapper {
      display: flex;
      width: 100%;
      gap: 56px;
      border-radius: 12px;
      box-sizing: border-box;
      justify-content: space-between;
      background: var(--bg-color-second);

      &.mobile {
        flex-direction: column-reverse;
        background: transparent;
        align-items: center;
        gap: 16px;

        .card-content {
          padding: 0;
        }

        .preview {
          border-radius: 0;

          img {
            border-radius: 0%;
          }
        }
      }

      a {
        color: var(--text-color);
        transition: all;
        transition-duration: 0.5s;

        &:hover {
          color: var(--primary);
        }
      }

      .preview {
        min-height: 100%;
        width: 360px;
        flex-shrink: 0;

        img {
          border-radius: 0px 12px 12px 0px;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &.tablet {
          width: 248px;
        }

        &.mobile {
          width: 375px;
        }
      }
    }

    &-content {
      padding: 24px;
      flex-grow: 1;
      width: 455px;
      max-width: 100%;
      overflow: hidden;

      .tags-wrapper {
        margin-top: 20px;
        display: flex;
        gap: 4px;
        max-width: 100%;
        overflow: hidden;

        &.expanded {
          flex-wrap: wrap;
        }
      }

      .title {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        height: 56px;
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 28px; /* 140% */
      }

      .author {
        &-wrapper {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          align-items: start;
        }

        &-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-color-second, #ccc);

          .publication-date {
            color: var(--text-color-second, #8c8c8c);
            font-family: Roboto;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 12px; /* 100% */
          }
        }

        &-name {
          color: var(--text-color);
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 20px;
        }
      }
    }
  }
</style>
