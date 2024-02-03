<script lang="ts">
  import AuthorArticleHeading from "$lib/components/content-section/AuthorArticleHeading.svelte";
  import AuthorArticleHeadingLoader from "$lib/components/content-section/loaders/AuthorArticleHeadingLoader.svelte";

  import AuthorArticleDetails from "$lib/components/content-section/AuthorArticleDetails/AuthorArticleDetails.svelte";
  import AuthorArticleDetailsLoader from "$lib/components/content-section/loaders/AuthorArticleDetailsLoader.svelte";

  import AuthorBadges from "$lib/components/content-section/AuthorBadges.svelte";
  import AuthorBadgesLoader from "$lib/components/content-section/loaders/AuthorBadgesLoader.svelte";

  import AuthorArticleImageLoader from "$lib/components/content-section/loaders/AuthorArticleImageLoader.svelte";

  import AuthorArticleContent from "$lib/components/content-section/AuthorArticleContent.svelte";
  import AuthorArticleContentLoader from "$lib/components/content-section/loaders/AuthorArticleContentLoader.svelte";

  import ContentSectionRow from "$lib/components/content-section/ContentSectionRow.svelte";
  import SideGradientWrap from "$lib/components/content-section/SideGradientWrap.svelte";

  import { getDarkThemeContext } from "$lib/context/dark-theme-context";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  $: ({ serverParams, content } = data);

  const heading =
    "Wolverhampton Wanderers vs Burnley betting tip 2023/2024 – Picks and Predictions for the Premier League match on December 05th, 2023";
  let dark = getDarkThemeContext();
  let loading = true;
</script>

<div class="author-article-page" class:dark={$dark}>
  <ContentSectionRow>
    {#if loading}
      <AuthorArticleHeadingLoader dark={$dark} />
    {:else}
      <AuthorArticleHeading {heading} />
    {/if}
  </ContentSectionRow>

  <ContentSectionRow --mobile-padding-right="0">
    <SideGradientWrap dark={$dark}>
      {#if loading}
        <AuthorBadgesLoader dark={$dark} />
      {:else}
        <AuthorBadges dark={$dark} />
      {/if}
    </SideGradientWrap>
  </ContentSectionRow>

  <div class="mobile-order-first">
    <ContentSectionRow>
      {#if loading}
        <AuthorArticleDetailsLoader />
      {:else}
        <AuthorArticleDetails />
      {/if}
    </ContentSectionRow>
  </div>

  <ContentSectionRow --mobile-padding-right="0" --mobile-padding-left="0">
    <AuthorArticleImageLoader />
  </ContentSectionRow>
  

  <ContentSectionRow>
    {#if loading}
      <AuthorArticleContentLoader />
    {:else}
      <AuthorArticleContent {content} />
    {/if}
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
  }
</style>
