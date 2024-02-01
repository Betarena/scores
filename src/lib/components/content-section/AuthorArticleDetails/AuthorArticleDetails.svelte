<script lang="ts">
  import DetailsTemplateMobile from "./DetailsTemplateMobile.svelte";
  import DetailsTemplateTablet from "./DetailsTemplateTablet.svelte";

  let authorName = "Tiago Luchtenberg";
  let authorHref = "/";
  let date = "December 4, 2023";
  let location = "Chicago, IL";
  let readTime = "11 mins";
  let duration = "2 days ago";
</script>

<div class="author-article-details-component">
  <div class="mobile">
    <DetailsTemplateMobile
      {authorName}
      {authorHref}
      {date}
      {location}
      {readTime}
      {duration}
    />
  </div>
  <div class="tablet">
    <DetailsTemplateTablet
      {authorName}
      {authorHref}
      {date}
      {location}
      {readTime}
      {duration}
    />
  </div>
  <div class="desktop description">
    <span>
      Tiago covers lifestyle content and local news for the Chicaco area.
    </span>
  </div>
</div>

<style lang="scss">
  .author-article-details-component {
    display: flex;
    flex-direction: column;
    gap: 13px;

    .description {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
    }

    .tablet,
    .desktop {
      display: none;
    }

    @media only screen and (min-width: 768px) {
      .mobile {
        display: none;
      }
      .tablet {
        display: flex;
      }
    }

    @media only screen and (min-width: 1440px) {
      .desktop {
        display: flex;
      }
    }
  }
</style>
