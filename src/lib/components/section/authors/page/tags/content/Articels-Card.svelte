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
    import type { IPageAuthorArticleData, IPageAuthorAuthorData, IPageAuthorTagData } from "@betarena/scores-lib/types/v8/preload.authors.js";


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
      author?: IPageAuthorAuthorData,
      tags_data: (IPageAuthorTagData | undefined) []
    }
export let
    /**
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
$: ({permalink, tags_data, data: {title}, seo_details: {opengraph:{ images}}} = article);

// #endregion ➤ 📌 VARIABLES

const src =  "https://s3-alpha-sig.figma.com/img/c13c/1e24/1e6baeeb9f8d7582f9d06e78b4720cca?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eKvpqipX-DsYJHWoug3ZAq0~tXP9VuL6yTNi0mtpueLdhuC37jiaOKZbPWBlZRCnBgwXWxWhv5Gzk2WEbD7EY5mOzS~yMjiuJsXCXJEfx2RWY2s7ZMp8EgQ-ABjRxLf6XRvtrO7vUfcH17tR749NnVimp6aZwpeLdOgfrw74gYPBlidiMZa6cY3vIcyjM3IoBhaAZ6Uhyq9xoUP85aLcGttg1NWw2zsA4TY1cjb7qLVcKjKWxmiA-HC4Fz~gRBxNfCsfYqr16FhQbI6Jo46zP8GAd5SbEpT0kfNJUjBmUtyqBpxBM~HoUnztOxzo3A9UNNE31D7TfcgXrdenD1JgWA__"

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

<div class="card-wrapper"  class:mobile>
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
        <div class="publication-date">1 hour ago</div>
      </div>
    </div>
    <div class="tags-wrapper">
      {#each tags_data as tag}
        <a href="/a/tag/{tag?.permalink}">
          <Tag>{tag?.name}</Tag>

        </a>
      {/each}
    </div>
  </div>
  <div class="preview" class:tablet class:mobile>
      <img src={images[0]?.url} alt={images[0].alt} srcset="">
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

  .card {

    &-wrapper {
      display: flex;
      width: 100%;
      gap: 56px;
      border-radius: 12px;
      box-sizing: border-box;
      justify-content: space-between;
      background: var(--colors-gray1, #313131);

      &.mobile {
        flex-direction: column-reverse;
        background: transparent;
        align-items: center;
      }

      a {
        color: var(--colors-brand-color-white, #FFF);

        &:hover {
          color: var(--colors-brand-color-orange, #F5620F);
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
          color: var(--colors-gray4, #CCC);

          .publication-date {
            color: var(--colors-gray3, #8C8C8C);
            font-family: Roboto;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 12px; /* 100% */
          }
        }

        &-name {
          color: var(--colors-brand-color-white, #FFF);
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