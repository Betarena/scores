<script lang="ts">
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
  export let dark: boolean = false;

  const lineHeight = "26px";
</script>

<div class="author-article-content-loader-component mobile">
  <LoaderInlineBlock
    --mobile-height={lineHeight}
    --mobile-width="100%"
    {dark}
  />
  <LoaderInlineBlock
    --mobile-height={lineHeight}
    --mobile-width="100%"
    {dark}
  />
  <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="85%" {dark} />
  <LoaderInlineBlock
    --mobile-height={lineHeight}
    --mobile-width="100%"
    {dark}
  />
  <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="85%" {dark} />
</div>

<div class="author-article-content-loader-component tablet">
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="100%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="70%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="100%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="85%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="100%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="85%" {dark}/>
    <LoaderInlineBlock --mobile-height={lineHeight} --mobile-width="45%" {dark}/>
  </div>

<style lang="scss">    
  .author-article-content-loader-component {
    @mixin show {
        display: flex;
    }
    @mixin hide {
        display: none;
    }

    @include show;
    flex-direction: column;
    gap: 16px;

    &.tablet {
        @include hide;
    }

    @media only screen and (min-width: 768px) {
        &.tablet {
            @include show;
        }
        &.mobile {
            @include hide;
        }
    }
  }
</style>
