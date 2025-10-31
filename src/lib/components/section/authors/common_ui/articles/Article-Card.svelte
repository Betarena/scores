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

  import { page } from "$app/stores";

  import { timeAgo } from "$lib/utils/dates.js";
  import { mutateStringToPermalink } from "@betarena/scores-lib/dist/util/language.js";
  import { fade } from "svelte/transition";
  import { readingTime } from "../helpers.js";
  import defaultAvatar from "../profile-avatar.svg";

  import TranslationText from "$lib/components/misc/Translation-Text.svelte";
  import SportstackAvatar from "$lib/components/ui/SportstackAvatar.svelte";

  import { modalStore } from "$lib/store/modal.js";
  import { getOptimizedImageUrl } from "$lib/utils/image.js";
  import type {
    IPageAuthorArticleData,
    IPageAuthorAuthorData,
    IPageAuthorTagData,
  } from "@betarena/scores-lib/types/v8/preload.authors.js";
  import TipsModal from "./TipsModal.svelte";

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

  $: translations = ($page.data?.translations ||
    {}) as IPageAuthorTranslationDataFinal;

  $: ({ permalink, tags_data, published_date, data, seo_details, author } =
    article);

  $: ({ avatar, username } = author.data || {
    username: "unknow",
    avatar: defaultAvatar,
  });
  $: ({ images = [] } = seo_details?.opengraph || {});
  $: ({ title = "", content = "", featured_image } = data || {});
  $: date = timeAgo(published_date, translations.time_ago);
  $: timeToRead = content && readingTime(content);
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

  function sendTip() {
    modalStore.set({
      modal: true,
      component: TipsModal,
      show: true,
      props: {sportstack: author}
    })
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

<div class="card-wrapper" class:mobile class:tablet in:fade={{ duration: 500 }}>
  <div class="card-content">
    <a
      href={`/a/sportstack/${mutateStringToPermalink(username)}`}
      class="author-wrapper"
    >
      <SportstackAvatar src={avatar} size={!mobile ? "md" : "sm"} />
      <div class="author-info">
        <div class="author-name">{username}</div>
        <div class="publication-date">
          {#if timeToRead}
            {timeToRead}
            <TranslationText
              key={"uknown"}
              text={translations?.readingTime?.reading_time}
              fallback={"mins"}
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
    <!-- <div class="tags-wrapper">
      {#if mobile}
        <ScrollDataWrapper showArrows={false} data={tags_data} let:item={tag}>
          <div
            class="tag"
            data-sveltekit-preload-data="hover"
            in:fade={{ duration: 500 }}
          >
            <Badge link="/a/tag/{tag?.permalink}" size="lg" color="gray">{tag?.name}</Badge>
          </div>
        </ScrollDataWrapper>
      {:else}
        <ExpandDataWrapper data={tags_data}>
          <slot slot="item" let:item={tag}>
            <div
              class="tag"
              data-sveltekit-preload-data="hover"
              in:fade={{ duration: 500 }}
            >
              <Badge size="lg" color="gray" link="/a/tag/{tag?.permalink}">{tag?.name}</Badge>
            </div>
          </slot>
          <slot slot="count" let:count
            ><div in:fade={{ duration: 500 }}>
              <Badge size="lg" color="gray">+{count}</Badge>
            </div></slot
          >
        </ExpandDataWrapper>
      {/if}
    </div> -->
    <div class="tips-wrapper" on:click={sendTip}>
      <div class="tip-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clip-path="url(#clip0_3408_9815)">
            <path
              d="M8.00065 9.99998C5.79151 9.99998 4.00065 8.20912 4.00065 5.99998V2.29628C4.00065 2.02038 4.00065 1.88243 4.04086 1.77197C4.10826 1.58679 4.25413 1.44092 4.4393 1.37352C4.54977 1.33331 4.68772 1.33331 4.96361 1.33331H11.0377C11.3136 1.33331 11.4515 1.33331 11.562 1.37352C11.7472 1.44092 11.893 1.58679 11.9604 1.77197C12.0007 1.88243 12.0007 2.02038 12.0007 2.29628V5.99998C12.0007 8.20912 10.2098 9.99998 8.00065 9.99998ZM8.00065 9.99998V12M12.0007 2.66665H13.6673C13.9779 2.66665 14.1333 2.66665 14.2558 2.71739C14.4191 2.78506 14.5489 2.91484 14.6166 3.07819C14.6673 3.2007 14.6673 3.35602 14.6673 3.66665V3.99998C14.6673 4.61996 14.6673 4.92995 14.5992 5.18428C14.4142 5.87447 13.8751 6.41356 13.185 6.5985C12.9306 6.66665 12.6206 6.66665 12.0007 6.66665M4.00065 2.66665H2.33398C2.02336 2.66665 1.86804 2.66665 1.74553 2.71739C1.58218 2.78506 1.45239 2.91484 1.38473 3.07819C1.33398 3.2007 1.33398 3.35602 1.33398 3.66665V3.99998C1.33398 4.61996 1.33398 4.92995 1.40213 5.18428C1.58707 5.87447 2.12616 6.41356 2.81635 6.5985C3.07068 6.66665 3.38067 6.66665 4.00065 6.66665M4.96361 14.6666H11.0377C11.2013 14.6666 11.334 14.534 11.334 14.3704C11.334 13.0612 10.2727 12 8.96361 12H7.03769C5.72857 12 4.66732 13.0612 4.66732 14.3704C4.66732 14.534 4.79997 14.6666 4.96361 14.6666Z"
              stroke="currentColor"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_3408_9815">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span class="tips-count">45</span>
      </div>
      <div class="tip-amount">1 BTA</div>
    </div>
  </div>
  {#if images[0]?.url || featured_image}
    <a href="/a/{permalink}" class="preview" class:tablet class:mobile>
      <img
        src={getOptimizedImageUrl({
          strImageUrl: images[0]?.url || featured_image,
        })}
        alt={images[0]?.alt || title}
        srcset=""
      />
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
    background: var(--colors-background-bg-secondary);
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
        .tag {
          flex-shrink: 0;
        }

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
          color: var(--colors-text-text-primary-900, #fbfbfb);

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

      .tips-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-none, 0);
        color: var(--colors-text-text-tertiary-600, #8c8c8c);
        cursor: pointer;

        &:hover {
          color: var(--colors-foreground-fg-brand-primary-600, #f5620f);
        }
        .tip-info {
          display: flex;
          width: 47px;
          align-items: center;
          gap: var(--spacing-xs, 4px);

          .tips-count {
            /* Text xs/Medium */
            font-family: var(--font-family-font-family-body, Roboto);
            font-size: var(--font-size-text-xs, 12px);
            font-style: normal;
            font-weight: 500;
            line-height: var(--line-height-text-xs, 18px); /* 150% */
            transform: translateY(1px);
          }
        }
        .tip-amount {
          display: flex;
          width: 40px;
          height: 20px;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;

          background: var(--colors-background-bg-disabled, #3B3B3B);

          color: var(--colors-foreground-fg-brand-primary-600, #f5620f);
          text-align: center;

          /* Text xs/Medium */
          font-family: var(--font-family-font-family-body, Roboto);
          font-size: var(--font-size-text-xs, 12px);
          font-style: normal;
          font-weight: 500;
          line-height: var(--line-height-text-xs, 18px); /* 150% */
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
      background: var(--colors-background-bg-primary);
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
          line-height: var(--line-height-text-md, 24px);
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
