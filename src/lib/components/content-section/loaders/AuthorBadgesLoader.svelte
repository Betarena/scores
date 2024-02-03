<script lang="ts">
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
  export let dark: boolean = false;

  const lineHeight = "26px";
  const borderRadius = "100px";
</script>

<div class="author-bages-loader-component mobile">
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="62px" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="93px" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="78px" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="62px" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="93px" --mobile-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --mobile-width="78px" --mobile-height={lineHeight} {dark}/>
</div>

<div class="author-bages-loader-component tablet">
  <LoaderInlineBlock --border-radius={borderRadius} --tablet-width="68px" --tablet-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --tablet-width="104px" --tablet-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --tablet-width="87px" --tablet-height={lineHeight} {dark}/>
  <LoaderInlineBlock --border-radius={borderRadius} --tablet-width="68px" --tablet-height={lineHeight} {dark}/>
</div>

<style lang="scss">
  .author-bages-loader-component {
    @mixin show {
        display: flex;
    }
    @mixin hide {
        display: none;
    }

    @include show;
    gap: 4px;
    overflow: hidden;

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
