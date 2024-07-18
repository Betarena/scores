<script>
    import ShareIcon from "./assets/share-icon.svelte";


    import Button from "./Button.svelte";

</script>
<Button type="secondary" id="share-button" classname="share-button" style="width: 40px; height: 40px; padding: 0">
  <ShareIcon />
</Button>

<style lang="scss">
  :global(.share-button#share-button) {
    padding: 0;
    width: 40px;
    height: 40px;

    &:hover {
      --text-color: #fff
    }

  }
</style>