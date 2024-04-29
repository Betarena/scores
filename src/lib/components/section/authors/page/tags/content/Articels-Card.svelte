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
  import { timeAgo } from "$lib/utils/dates.js";
  import type { AuthorsAuthorsDataJSONSchema } from "@betarena/scores-lib/types/v8/_HASURA-0.js";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { fade } from "svelte/transition";

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
    author: IPageAuthorAuthorData;
    tags_data: (IPageAuthorTagData | undefined)[];
  }
  export let /**
     * @augments IArticle
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
    expanded = false;

  $: ({
    permalink,
    tags_data,
    published_date,
    data: { title },
    seo_details: {
      opengraph: { images },
    },
    author: { data: authorData },
  } = article);

  $: ({ avatar, username } = (authorData ||
    {}) as AuthorsAuthorsDataJSONSchema);
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

  $: date = timeAgo(published_date);
  // #endregion ➤ 📌 VARIABLES
  /** @description
   * .recalculate tag visibility when changing width, orScrollWidth
   *  WARNING:
   */
  $: resize(tagsWidth, tagsNode, tags_data);

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

  let debounds;

  function resize(
    width: number,
    node: HTMLDivElement,
    tags_data: (IPageAuthorTagData | undefined)[]
  ) {
    if (!width || !node) return;
    const scrollWidth = node.scrollWidth;
    if (width < scrollWidth) {
      visibleTags.pop();
      visibleTags = [...visibleTags];
    } else if (width > prevWidth) {
      const lastVisible = visibleTags.at(-1);
      const i = tags_data.indexOf(lastVisible);
      visibleTags = i < 0 ? [tags_data[0]] : [...visibleTags, tags_data[i + 1]];
    }

    prevWidth = width;
    countOfNotVisibleTags = tags_data.length - visibleTags.length;
    if (debounds) clearTimeout(debounds);

    setTimeout(() => {
      debounds = null;
      if (width === tagsWidth && width < node.scrollWidth)
        resize(width, node, tags_data);
    }, 50);
  }

  function expandTags() {
    expanded = true;
    countOfNotVisibleTags = 0;
    visibleTags = [...tags_data];
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

<div class="card-wrapper" class:mobile in:fade={{ duration: 500 }}>
  <div class="card-content">
    <a href="/a/{permalink}">
      <div class="title">
        {title}
      </div>
    </a>
    <div class="author-wrapper">
      <Avatar src={avatar} />
      <div class="author-info">
        <div class="author-name">{username}</div>
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
        <a href="/a/tag/{tag?.permalink}" in:fade={{ duration: 500 }}>
          <Tag>{tag?.name}</Tag>
        </a>
      {/each}
      {#if countOfNotVisibleTags}
        <div in:fade={{ duration: 500 }}>
          <Tag on:click={expandTags}>+{countOfNotVisibleTags}</Tag>
        </div>
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
          padding: 0 24px;
          width: 100%;
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
          width: 100%;
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
        row-gap: 7px;
        --text-button-size: var(--text-size-s);

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
        height: max-content;
        font-family: Inter;
        font-size: var(--text-size-l);
        font-style: normal;
        font-weight: 600;
        line-height: 140%;
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
            font-size: var(--text-size-xs);
            font-style: normal;
            font-weight: 400;
            line-height: 120%;
          }
        }

        &-name {
          color: var(--text-color);
          font-family: Inter;
          font-size: var(--text-size-m);
          font-style: normal;
          font-weight: 500;
          line-height: 20px;
        }
      }
    }
  }
</style>
