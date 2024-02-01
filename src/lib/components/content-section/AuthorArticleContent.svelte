<script lang="ts">
  export let content: string;
</script>

<div class="author-article-content-component">
  {@html content}
</div>

<style lang="scss">
  .author-article-content-component {
    font-weight: 400;

    :global(*) {
      color: inherit;
      font-size: 18px;
      line-height: 28px;
    }

    :global(a) {
      text-decoration: underline !important;
      display: inline;
    }

    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      font-weight: 800;
      font-size: 20px;
      margin: 40px 0 16px 0;
    }

    :global(h2) {
      font-size: 22px;
    }

    @media only screen and (min-width: 768px) {
      :global(*) {
        line-height: 30px;
      }

      :global(a) {
        font-weight: 500;
        color: var(--primary);
      }

      :global(h2) {
        font-size: 24px;
        line-height: 36px;
      }

      :global(h3),
      :global(h4),
      :global(h5),
      :global(h6) {
        font-size: 20px;
        line-height: 32px;
      }
    }

    @media only screen and (min-width: 1440px) {
      :global(*) {
        font-size: 20px;
        line-height: 32px;
      }

      :global(a) {
        font-weight: 500;
        color: var(--primary);
      }

      :global(h2) {
        font-size: 24px;
        line-height: 34px;
      }

      :global(h3),
      :global(h4),
      :global(h5),
      :global(h6) {
        font-size: 20px;
        line-height: 32px;
      }
    }
  }
</style>
