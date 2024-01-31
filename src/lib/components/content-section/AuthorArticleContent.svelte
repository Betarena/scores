<script lang="ts">
  export let content: string;
</script>

<div class="author-article-content-component">
  {@html content}
</div>

<style lang="scss">
  .author-article-content-component {
    :global(*) { color: inherit; }
  }
</style>
