<script>
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
</script>

<div class="author-article-image-loader-component">
    <LoaderInlineBlock --mobile-width="100%" --mobile-height="100%" />
</div>

<style lang="scss">
.author-article-image-loader-component {
    width: 100%;
    aspect-ratio: 375 / 198;
}
</style>