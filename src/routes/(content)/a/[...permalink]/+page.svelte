<script lang="ts">
  import AuthorArticleContent from "$lib/components/content-section/AuthorArticleContent.svelte";
  import AuthorArticleDetails from "$lib/components/content-section/AuthorArticleDetails/AuthorArticleDetails.svelte";
  import AuthorBadges from "$lib/components/content-section/AuthorBadges.svelte";
  import ContentSectionRow from "$lib/components/content-section/ContentSectionRow.svelte";
  import EndGradientWrap from "$lib/components/content-section/EndGradientWrap.svelte";
  import { getDarkThemeContext } from "$lib/context/dark-theme-context";

  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  $: ({ serverParams, content } = data);

  let dark = getDarkThemeContext();
</script>

<div class="author-article-page" class:dark={$dark}>
  <ContentSectionRow>
    <h1>
      Wolverhampton Wanderers vs Burnley betting tip 2023/2024 – Picks and
      Predictions for the Premier League match on December 05th, 2023
    </h1>
  </ContentSectionRow>

  <ContentSectionRow --mobile-padding-right="0">
    <EndGradientWrap dark={$dark}>
      <AuthorBadges dark={$dark} />
    </EndGradientWrap>
  </ContentSectionRow>

  <div class="mobile-order-first">
    <ContentSectionRow>
      <AuthorArticleDetails />
    </ContentSectionRow>
  </div>
  

  <ContentSectionRow>
    <AuthorArticleContent {content} />
  </ContentSectionRow>
</div>

<style lang="scss">
  .author-article-page {
    color: var(--dark-theme);
    &.dark {
      color: var(--white);
    }
    
    display: flex;
    flex-direction: column;
    
    // mobile
    padding: 16px 0 40px 0;
    gap: 24px;
    .mobile-order-first { 
      order: -1;
    }
    // tablet and desktop
    @media only screen and (min-width: 768px) {
      padding: 48px 0;
      gap: 32px;
      .mobile-order-first {
        order: unset;
      }
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
