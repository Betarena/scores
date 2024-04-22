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
import type { IArticleData } from "@betarena/scores-lib/types/types.authors.articles.js";


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
     * @augments IArticleData
     */
    article: IArticleData
  ;

$: ({permalink, published_date, tags_key_pair, data: {content, title} = {content: "", title: ""} } = article);

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

<!-- https://s3-alpha-sig.figma.com/img/c13c/1e24/1e6baeeb9f8d7582f9d06e78b4720cca?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eKvpqipX-DsYJHWoug3ZAq0~tXP9VuL6yTNi0mtpueLdhuC37jiaOKZbPWBlZRCnBgwXWxWhv5Gzk2WEbD7EY5mOzS~yMjiuJsXCXJEfx2RWY2s7ZMp8EgQ-ABjRxLf6XRvtrO7vUfcH17tR749NnVimp6aZwpeLdOgfrw74gYPBlidiMZa6cY3vIcyjM3IoBhaAZ6Uhyq9xoUP85aLcGttg1NWw2zsA4TY1cjb7qLVcKjKWxmiA-HC4Fz~gRBxNfCsfYqr16FhQbI6Jo46zP8GAd5SbEpT0kfNJUjBmUtyqBpxBM~HoUnztOxzo3A9UNNE31D7TfcgXrdenD1JgWA__ -->

<div class="card-wrapper">
  <div class="card-content">
    <a href="/a/{permalink}">
      <div class="title">
        {title}
      </div>
      <div class="author">
        <Avatar {src} />
      </div>
    </a>
  </div>
  <div class="preview">

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
      background: var(--colors-gray1, #313131);


      a {
        color: var(--colors-brand-color-white, #FFF);

        &:hover {
          color: var(--colors-brand-color-orange, #F5620F);
        }
      }


      .preview {
        height: 200px;
        width: 360px;
        flex-shrink: 0;
        background-color: white;
      }
    }

    &-content {
      padding: 24px;
      flex-grow: 1;
      max-width: 455px;
      overflow: hidden;

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
    }


  }

</style>