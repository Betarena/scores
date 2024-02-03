<script lang="ts">
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
  export let dark: boolean = false;
  let lineHeight = "12px";
</script>

<div class="author-artilce-content-loader-component">
  <LoaderInlineBlock --mobile-width="100%" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --mobile-width="78%" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --mobile-width="100%" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --mobile-width="78%" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --mobile-width="100%" --mobile-height={lineHeight} {dark}/>
</div>

<style lang="scss">
  .author-artilce-content-loader-component {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
