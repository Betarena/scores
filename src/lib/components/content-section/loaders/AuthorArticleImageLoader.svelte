<script lang="ts">
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
  export let dark: boolean = false;
</script>

<div class="author-article-image-loader-component">
    <LoaderInlineBlock --mobile-width="100%" --mobile-height="100%" {dark}/>
</div>

<style lang="scss">
.author-article-image-loader-component {
    width: 100%;
    aspect-ratio: 375 / 198;
}
</style>