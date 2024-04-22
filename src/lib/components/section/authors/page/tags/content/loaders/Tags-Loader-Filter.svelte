<script>
    import LoaderButton from "$lib/components/ui/loaders/LoaderButton.svelte";
    import LoaderLine from "$lib/components/ui/loaders/LoaderLine.svelte";

  export let mobile = false;

</script>

<div class="tags-filter-loader" class:mobile>
  <div class="filter-buttons">
    <div class="tags-buttons">
      <LoaderLine width={148} height={31} />
      <LoaderLine width={152} height={13} />
    </div>
    <div class="action-buttons">
      {#if !mobile}
        <LoaderLine width={114} height={20}/>
      {/if}
      <LoaderButton />
    </div>
  </div>
  {#if !mobile}
     <div class="filter-content">
        <LoaderLine width={625} height={16} />
        <LoaderLine width={556} height={16} />
      </div>
  {/if}

</div>


<style lang="scss">
  .tags-filter-loader {
    display: flex;
    flex-direction: column;
    gap: 23px;

    &.mobile {
      padding: 0 24px;
    }

    .filter-buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .tags-buttons {
        display: flex;
        flex-direction: column;
        gap: 13px;
      }

      .action-buttons {
        display: flex;
        gap: 24px;
        align-items: center;
      }
    }

    .filter-content {
      display: flex;
      flex-direction: column;
      gap: 6px
    }
  }
</style>