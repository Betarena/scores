<script lang="ts">
  import AuthorArticleContent from "$lib/components/content-section/AuthorArticleContent.svelte";
  import AuthorArticleDetails from "$lib/components/content-section/AuthorArticleDetails/AuthorArticleDetails.svelte";
  import AuthorArticleTags from "$lib/components/content-section/AuthorArticleTags.svelte";
  import { getDarkThemeContext } from "$lib/context/dark-theme-context";

  import { getDeviceTypeContext } from "$lib/context/device-type-context";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  $: ({ serverParams, content } = data);

  let isDark = getDarkThemeContext();
</script>

<div class="author-article-page" class:dark={$isDark}>
  <h1>
    Wolverhampton Wanderers vs Burnley betting tip 2023/2024 – Picks and
    Predictions for the Premier League match on December 05th, 2023
  </h1>
  <AuthorArticleTags dark={$isDark} />
  <AuthorArticleDetails />
  <AuthorArticleContent {content} />
</div>


<style lang="scss">
  .author-article-page{
    color: var(--dark-theme);
    &.dark {
      color: var(--white);
    }
    display: flex;
    flex-direction: column;

    // mobile
    gap: 24px;
    // tablet and desktop
    @media only screen and (min-width: 768px) {
      gap: 32px;
    }

    h1 {
      color: inherit;
      margin: 0;
      font-weight: 600;

      // mobile
      font-size: 24px;
      line-height: 36px;
      // tablet
      @media only screen and (min-width: 768px) {

        font-size: 36px;
        line-height: 54px;
      }
      // desktop
      @media only screen and (min-width: 1440px) {
        font-size: 38px;
        line-height: 54px;
      }
    }    
  }
  
</style>