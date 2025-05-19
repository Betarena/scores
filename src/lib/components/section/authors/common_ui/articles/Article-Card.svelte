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

  import { timeAgo } from '$lib/utils/dates.js';
  import { fade } from 'svelte/transition';
  import defaultAvatar from '../profile-avatar.svg';
  import { readingTime } from '../helpers.js';
  import { mutateStringToPermalink } from '@betarena/scores-lib/dist/util/language.js';

  import Tag from '$lib/components/ui/Tag.svelte';
  import ExpandDataWrapper from '$lib/components/ui/wrappers/ExpandDataWrapper.svelte';
  import TranslationText from '$lib/components/misc/Translation-Text.svelte';
  import ScrollDataWrapper from '$lib/components/ui/wrappers/ScrollDataWrapper.svelte';
  import SportstackAvatar from '$lib/components/ui/SportstackAvatar.svelte';

  import type { IPageAuthorTranslationDataFinal } from '@betarena/scores-lib/types/v8/segment.authors.tags.js';
  import type { IPageAuthorArticleData, IPageAuthorAuthorData, IPageAuthorTagData } from '@betarena/scores-lib/types/v8/preload.authors.js';

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

  interface IArticle extends IPageAuthorArticleData {
    author: IPageAuthorAuthorData;
    tags_data: IPageAuthorTagData[];
  }

  export let
    /**
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
    mobile = false
  ;

  $: translations = ($page.data?.translations || {}) as IPageAuthorTranslationDataFinal;

  $: ({
    permalink,
    tags_data,
    published_date,
    data,
    seo_details,
    author,
  } = article);

  $: ({ avatar, username } = author.data || {
    username: 'unknow',
    avatar: defaultAvatar,
  });
  $: ({ images = [] } = seo_details?.opengraph || {});
  $: ({ title = "", content = "" } = data || {});
  $: date = timeAgo(published_date, translations.time_ago);
  $: timeToRead =  readingTime(content)
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

<div class="card-wrapper" class:mobile class:tablet in:fade={{ duration: 500 }}>
  <div class="card-content">
    <a href={`/a/sportstack/${mutateStringToPermalink(username)}`} class="author-wrapper">
      <SportstackAvatar src={avatar} size={ !mobile ? "md" : "sm"} />
      <div class="author-info">
        <div class="author-name">{username}</div>
        <div class="publication-date">
          {#if timeToRead}
            {timeToRead}
            <TranslationText
              key={'uknown'}
              text={translations?.readingTime?.reading_time}
              fallback={'mins'}
            />
            -
          {/if}
          {date}
        </div>
      </div>
    </a>
    <a href="/a/{permalink}">
      <div class="title">
        {title}
      </div>
    </a>
    <div class="tags-wrapper">
      {#if mobile}
        <ScrollDataWrapper showArrows={false} data={tags_data} let:item={tag}>
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
      <img src={images[0]?.url} alt={images[0].alt} srcset="" />
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
  .card-wrapper {
    display: flex;
    max-width: 100%;
    width: 824px;
    gap: 56px;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    justify-content: space-between;
    background: var(--bg-color-second);
    align-items: start;



    a {
      color: var(--text-color);
      transition: all;
      transition-duration: 0.5s;

      &:hover {
        color: var(--primary);
      }
    }

    .preview {
      border-radius: 8px;
      flex-shrink: 0;
      width: 240px;
      height: 154px;

      img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-grow: 1;
      width: 455px;
      max-width: 100%;
      height: 100%;
      min-height: 100%;

      overflow: hidden;

      .author-wrapper {
        &:hover {
          .author-name {
            color: var(--primary);
          }
        }
      }

      .tags-wrapper {
        max-width: 100%;
        justify-self: flex-end;
        --text-button-size: var(--text-size-s);
        --gradient-color-rgb: var(--bg-color-second-rgb-consts);
        margin-top: 4px;

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
        font-size: var(--font-size-text-xl, 20px);
        font-style: normal;
        font-weight: 600;
        line-height: 28px;
      }

      .author {
        &-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;

        }

         &-info {
          display: flex;
          flex-direction: column;
          color: var(--text-color-second, #ccc);

          .publication-date {
            color: var(--colors-text-text-tertiary-600, #8c8c8c);
            /* Text xs/Regular */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xs, 12px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--line-height-text-xs, 18px); /* 150% */
          }
        }

        &-name {
          color: var(--colors-ext-text-primary, #fbfbfb);

          /* Text sm/Semibold */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-sm, 14px);
          font-style: normal;
          font-weight: 600;
          line-height: var(--line-height-text-sm, 20px); /* 142.857% */
          &:hover {
            color: var(--primary);
          }
        }
      }
    }

    &.tablet {
      max-width: 100%;
      width: 100%;

      .title {
        -webkit-line-clamp: 3;
        height: 84px;
      }
    }

    &.mobile {
      flex-direction: row-reverse;
      background: var(--bg-color);
      gap: 16px;
      border-radius: 0;
      padding: 20px 16px;
      padding-right: 0px;

      .card-content {
        padding: 0;
        gap: 12px;

        .title {
          padding-right: 16px;
          -webkit-line-clamp: 3;
          height: 72px;
          font-size: var(--font-size-text-md, 16px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-md, 24px)
        }
        .author-wrapper {
          padding-right: 16px;
        }

        .author-name {
          line-height: 18px;
        }

        .tags-wrapper {
          margin-top: 0;
        }
      }

      .preview {
        width: 112px;
        height: 150px;
      }
    }
  }
</style>
