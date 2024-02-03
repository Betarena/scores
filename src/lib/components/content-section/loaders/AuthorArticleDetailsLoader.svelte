<script>
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
</script>

<div class="author-article-details-loader-component mobile">
  <div class="wrapper-image-texts">
    <LoaderInlineBlock
      --mobile-width="34px"
      --mobile-height="34px"
      --border-radius="100%"
    />
    <div class="wrapper-texts">
      <LoaderInlineBlock --mobile-width="160px" --mobile-height="14px" />
      <LoaderInlineBlock --mobile-width="99px" --mobile-height="14px" />
    </div>
  </div>
  <LoaderInlineBlock --mobile-width="207px" --mobile-height="16px" />
</div>

<style lang="scss">
  .author-article-details-loader-component {
    &.mobile {
      display: flex;
      flex-direction: column;
      gap: 11px;
      .wrapper-image-texts {
        display: flex;        
        gap: 10px;
        .wrapper-texts {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }
    }
  }
</style>
