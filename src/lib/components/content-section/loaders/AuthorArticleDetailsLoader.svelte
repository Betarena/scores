<script lang="ts">
  import LoaderInlineBlock from "$lib/components/shared/loaders/LoaderInlineBlock.svelte";
  export let dark: boolean = false;
</script>

<div class="author-article-details-loader-component mobile">
  <div class="wrapper-image-texts">
    <LoaderInlineBlock
      --mobile-width="34px"
      --mobile-height="34px"
      --border-radius="100%"
      {dark}
    />
    <div class="wrapper-texts">
      <LoaderInlineBlock --mobile-width="160px" --mobile-height="14px" {dark} />
      <LoaderInlineBlock --mobile-width="99px" --mobile-height="14px" {dark} />
    </div>
  </div>
  <LoaderInlineBlock --mobile-width="207px" --mobile-height="16px" {dark} />
</div>

<div class="author-article-details-loader-component tablet-desktop">
  <LoaderInlineBlock
    --mobile-width="44px"
    --mobile-height="44px"
    --border-radius="100%"
    {dark}
  />
  <div class="wrapper-texts">
    <div class="common-texts">
      <div class="inline-texts">
        <LoaderInlineBlock
          --mobile-width="168px"
          --mobile-height="12px"
          {dark}
        />
        <LoaderInlineBlock
          --mobile-width="99px"
          --mobile-height="12px"
          {dark}
        />
      </div>
      <LoaderInlineBlock --mobile-width="121px" --mobile-height="12px" {dark} />
    </div>
    <div class="desktop-texts">
      <LoaderInlineBlock --mobile-width="168px" --mobile-height="12px" {dark} />
      <LoaderInlineBlock --mobile-width="100px" --mobile-height="12px" {dark} />
    </div>
  </div>
</div>

<style lang="scss">
  .author-article-details-loader-component {
    @mixin show {
      display: flex;
    }
    @mixin hide {
      display: none;
    }

    &.mobile {
      @include show;
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

    &.tablet-desktop {
      @include hide;
      gap: 9px;
      .wrapper-texts {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 11px;
        .common-texts {
          display: flex;
          flex-direction: column;
          gap: 6px;
          .inline-texts {
            display: flex;
            gap: 12px;
          }
        }
        .desktop-texts {
          @include hide;
          flex-direction: column;
          gap: 4px;
        }
      }
    }

    @media only screen and (min-width: 768px) {
      &.tablet-desktop {
        @include show;
      }
      &.mobile {
        @include hide;
      }
    }

    @media only screen and (min-width: 1440px) {
      &.tablet-desktop {
        .wrapper-texts {
          .desktop-texts {
            @include show;
          }
        }
      }
    }
  }
</style>
