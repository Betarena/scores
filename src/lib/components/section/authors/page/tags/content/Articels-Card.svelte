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
  import defaultAvatar from "./assets/profile-avatar.svg";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
    IPageAuthorTranslationDataFinal,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import { fade } from "svelte/transition";
  import ExpandDataWrapper from "$lib/components/ui/wrappers/ExpandDataWrapper.svelte";
  import ScrollDataWrapper from "$lib/components/ui/wrappers/ScrollDataWrapper.svelte";

  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  import { getOptimizedImageUrl } from "$lib/utils/image.js";

  // #region ➤ 📌 VARIABLES

  // ╭────────────────────────────────────────────────────────────────────────╮
  // │ NOTE:                                                                  │
  // │ Please add inside 'this' region the 'variables' that are to be         │
  // │ and are expected to be used by 'this' .svelte file / component.        │=
  // │ IMPORTANT                                                              │
  // │ Please, structure the imports as follows:                              │
  // │ 1. export const / let [..]                                             │
  // │ 2. const [..]                                                          │
  // │ 3. let [..]                                                            │
  // │ 4. $: [..]                                                             │
  // ╰────────────────────────────────────────────────────────────────────────╯

  interface IArticle extends IPageAuthorArticleData {
    author: IPageAuthorAuthorData;
    tags_data: IPageAuthorTagData[];
  }
  export let /**
     * @augments IArticle
     */
    article: IArticle,
    translations: IPageAuthorTranslationDataFinal,
    /**
     * @description tablet view
     */
    tablet = false,
    /**
     * @description mobile view
     */
    mobile = false;

  $: ({
    permalink,
    tags_data,
    published_date,
    data: { title },
    seo_details: {
      opengraph: { images },
    },
    author,
  } = article);

  $: ({ avatar, username } = author?.data || {
    username: "unknow",
    avatar: defaultAvatar,
  });

  $: date = timeAgo(published_date, translations?.time_ago);

  // #endregion ➤ 📌 VARIABLES
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

    <a
      href="/a/sportstack/{mutateStringToPermalink(username)}"
      class="author-wrapper"
    >
      <Avatar
        src={avatar}
      />
      <div
        class="author-info"
      >
        <a
          href="/a/sportstack/{mutateStringToPermalink(username)}"
          class="author-name">{username}
        </a>
        <div class="publication-date">{date}</div>
      </div>
    </a>

    <div class="tags-wrapper">
      {#if mobile || tablet}
        <ScrollDataWrapper data={tags_data} let:item={tag}>
          <a
            href="/a/tag/{tag?.permalink}"
            data-sveltekit-preload-data="hover"
            in:fade={{ duration: 500 }}
          >
            <Tag>{tag?.name}</Tag>
          </a>
        </ScrollDataWrapper>
      {:else}
        <ExpandDataWrapper data={tags_data}>
          <slot slot="item" let:item={tag}>
            <a
              href="/a/tag/{tag?.permalink}"
              data-sveltekit-preload-data="hover"
              in:fade={{ duration: 500 }}
            >
              <Tag>{tag?.name}</Tag>
            </a>
          </slot>
          <slot slot="count" let:count
            ><div in:fade={{ duration: 500 }}>
              <Tag>+{count}</Tag>
            </div></slot
          >
        </ExpandDataWrapper>
      {/if}
    </div>
  </div>
  {#if images[0]?.url}
    <a href="/a/{permalink}" class="preview" class:tablet class:mobile>
      <img src={getOptimizedImageUrl({ strImageUrl: images[0]?.url })} alt={images[0].alt} srcset="" />
    </a>
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
          .title {
            line-height: 24px;
          }

          .tags-wrapper {
            --gradient-color-rgb: var(--bg-color-rgb-consts);
          }

          .author-name {
            font-size: var(--text-size-m);
          }
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
        min-height: 100%;
        max-width: 360px;
        height: 200px;
        max-height: 200px;
        width: 100%;
        flex-shrink: 0;

        img {
          border-radius: 0px 12px 12px 0px;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }

        &.tablet {
          max-width: 248px;
          width: 100%;
        }

        &.mobile {
          width: 100%;
          max-width: 100%;
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
        max-width: 100%;
        --text-button-size: var(--text-size-s);
        --gradient-color-rgb: var(--bg-color-second-rgb-consts);

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
        line-height: 28px;
      }

      .author {
        &-wrapper {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          align-items: start;

          &:hover {
            .author-name {
              color: var(--primary);
            }
          }
        }

        &-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: var(--text-color-second, #ccc);

          .publication-date {
            color: var(--text-color-second-dark, #8c8c8c);
            font-family: Roboto;
            font-size: var(--text-size-xs);
            font-style: normal;
            font-weight: 400;
            line-height: 12px;
          }
        }

        &-name {
          color: var(--text-color);
          font-family: Inter;
          font-size: var(--text-size-s);
          font-style: normal;
          font-weight: 500;
          line-height: 20px;
        }
      }
    }
  }
</style>
